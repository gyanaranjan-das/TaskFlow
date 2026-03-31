import { Router } from 'express';
import {
  getProjects, getProject, createProject, updateProject, deleteProject,
  inviteMember, changeMemberRole, removeMember,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  createProjectSchema, updateProjectSchema,
  inviteMemberSchema, changeMemberRoleSchema,
} from '../validations/project.schema.js';

const router = Router();

router.use(protect);

router.get('/', getProjects);
router.post('/', validate(createProjectSchema), createProject);
router.get('/:id', getProject);
router.patch('/:id', validate(updateProjectSchema), updateProject);
router.delete('/:id', deleteProject);

// Members
router.post('/:id/members', validate(inviteMemberSchema), inviteMember);
router.patch('/:id/members/:userId', validate(changeMemberRoleSchema), changeMemberRole);
router.delete('/:id/members/:userId', removeMember);

export default router;
