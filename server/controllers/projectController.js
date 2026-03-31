import Project from '../models/Project.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all projects for current user
 * @route   GET /api/projects
 * @access  Private
 */
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [
      { owner: req.user.id },
      { 'members.user': req.user.id },
    ],
    isArchived: req.query.archived === 'true' ? true : false,
  })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .sort('-updatedAt')
    .lean();

  // Add task counts
  const projectsWithCounts = await Promise.all(
    projects.map(async (project) => {
      const taskCounts = await Task.aggregate([
        { $match: { project: project._id, deletedAt: null } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);
      const counts = {};
      taskCounts.forEach((c) => { counts[c._id] = c.count; });
      return { ...project, taskCounts: counts };
    })
  );

  res.status(200).json({
    success: true,
    data: projectsWithCounts,
  });
});

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Private
 */
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .lean();

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  // Check access
  const isMember =
    project.owner._id.toString() === req.user.id ||
    project.members.some((m) => m.user._id.toString() === req.user.id);

  if (!isMember) {
    throw new AppError('You do not have access to this project.', 403);
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

/**
 * @desc    Create project
 * @route   POST /api/projects
 * @access  Private
 */
export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    ...req.body,
    owner: req.user.id,
    members: [{ user: req.user.id, role: 'owner' }],
  });

  const populated = await Project.findById(project._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .lean();

  res.status(201).json({
    success: true,
    data: populated,
    message: 'Project created successfully.',
  });
});

/**
 * @desc    Update project
 * @route   PATCH /api/projects/:id
 * @access  Private (owner/admin)
 */
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  // Check permission (owner or admin)
  const isOwner = project.owner.toString() === req.user.id;
  const isAdmin = project.members.some(
    (m) => m.user.toString() === req.user.id && m.role === 'admin'
  );

  if (!isOwner && !isAdmin) {
    throw new AppError('Only the owner or admin can update this project.', 403);
  }

  Object.keys(req.body).forEach((key) => {
    project[key] = req.body[key];
  });

  await project.save();

  const populated = await Project.findById(project._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .lean();

  res.status(200).json({
    success: true,
    data: populated,
    message: 'Project updated successfully.',
  });
});

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (owner only)
 */
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  if (project.owner.toString() !== req.user.id) {
    throw new AppError('Only the project owner can delete this project.', 403);
  }

  // Soft delete all tasks in this project
  await Task.updateMany(
    { project: project._id, deletedAt: null },
    { deletedAt: new Date() }
  );

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project and associated tasks deleted.',
  });
});

/**
 * @desc    Invite member to project by email
 * @route   POST /api/projects/:id/members
 * @access  Private (owner/admin)
 */
export const inviteMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  // Check permission
  const isOwner = project.owner.toString() === req.user.id;
  const isAdmin = project.members.some(
    (m) => m.user.toString() === req.user.id && m.role === 'admin'
  );

  if (!isOwner && !isAdmin) {
    throw new AppError('Only the owner or admin can invite members.', 403);
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('No user found with that email.', 404);
  }

  // Check if already a member
  const existing = project.members.find(
    (m) => m.user.toString() === user._id.toString()
  );
  if (existing) {
    throw new AppError('User is already a member of this project.', 409);
  }

  project.members.push({ user: user._id, role: role || 'member' });
  await project.save();

  const populated = await Project.findById(project._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .lean();

  res.status(200).json({
    success: true,
    data: populated,
    message: `${user.name} has been added to the project.`,
  });
});

/**
 * @desc    Change member role
 * @route   PATCH /api/projects/:id/members/:userId
 * @access  Private (owner only)
 */
export const changeMemberRole = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  if (project.owner.toString() !== req.user.id) {
    throw new AppError('Only the project owner can change roles.', 403);
  }

  const member = project.members.find(
    (m) => m.user.toString() === req.params.userId
  );

  if (!member) {
    throw new AppError('Member not found in this project.', 404);
  }

  if (member.role === 'owner') {
    throw new AppError('Cannot change the owner role.', 400);
  }

  member.role = req.body.role;
  await project.save();

  res.status(200).json({
    success: true,
    message: 'Member role updated.',
  });
});

/**
 * @desc    Remove member from project
 * @route   DELETE /api/projects/:id/members/:userId
 * @access  Private (owner/admin or self)
 */
export const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  const isOwner = project.owner.toString() === req.user.id;
  const isSelf = req.params.userId === req.user.id;

  if (!isOwner && !isSelf) {
    throw new AppError('You do not have permission to remove this member.', 403);
  }

  if (req.params.userId === project.owner.toString()) {
    throw new AppError('Cannot remove the project owner.', 400);
  }

  project.members = project.members.filter(
    (m) => m.user.toString() !== req.params.userId
  );
  await project.save();

  res.status(200).json({
    success: true,
    message: 'Member removed from project.',
  });
});
