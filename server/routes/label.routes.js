import { Router } from 'express';
import { getLabels, createLabel, updateLabel, deleteLabel } from '../controllers/labelController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createLabelSchema, updateLabelSchema } from '../validations/project.schema.js';

const router = Router();

router.use(protect);

router.get('/', getLabels);
router.post('/', validate(createLabelSchema), createLabel);
router.patch('/:id', validate(updateLabelSchema), updateLabel);
router.delete('/:id', deleteLabel);

export default router;
