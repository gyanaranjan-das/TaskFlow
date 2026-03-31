import Project from '../models/Project.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Check if user is a member of the project with the required role
 * @param {...string} requiredRoles - Allowed project roles (owner, admin, member, viewer)
 * @returns {Function} Express middleware
 */
const roleCheck = (...requiredRoles) => {
  return asyncHandler(async (req, res, next) => {
    const projectId = req.params.projectId || req.body.project;

    if (!projectId) {
      throw new AppError('Project ID is required.', 400);
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new AppError('Project not found.', 404);
    }

    // Check if user is the owner
    if (project.owner.toString() === req.user.id) {
      req.project = project;
      req.projectRole = 'owner';
      return next();
    }

    // Check if user is a member with the required role
    const member = project.members.find(
      (m) => m.user.toString() === req.user.id
    );

    if (!member) {
      throw new AppError('You are not a member of this project.', 403);
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(member.role)) {
      throw new AppError(
        `This action requires one of the following roles: ${requiredRoles.join(', ')}.`,
        403
      );
    }

    req.project = project;
    req.projectRole = member.role;
    next();
  });
};

export default roleCheck;
