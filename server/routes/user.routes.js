import { Router } from 'express';
import {
  getProfile, updateProfile, uploadAvatar,
  changePassword, searchUsers,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { updateProfileSchema, changePasswordSchema } from '../validations/auth.schema.js';
import { uploadAvatar as uploadAvatarMiddleware } from '../middleware/upload.js';

const router = Router();

router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', validate(updateProfileSchema), updateProfile);
router.post('/avatar', uploadAvatarMiddleware, uploadAvatar);
router.patch('/password', validate(changePasswordSchema), changePassword);
router.get('/search', searchUsers);

export default router;
