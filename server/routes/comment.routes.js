import { Router } from 'express';
import { updateComment, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { updateCommentSchema } from '../validations/project.schema.js';

const router = Router();

router.use(protect);

// Comments accessed by ID (not nested under tasks)
router.patch('/:id', validate(updateCommentSchema), updateComment);
router.delete('/:id', deleteComment);

export default router;
