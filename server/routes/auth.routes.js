import { Router } from 'express';
import {
  register, login, logout, refreshAccessToken,
  verifyEmail, forgotPassword, resetPassword, getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validations/auth.schema.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', protect, logout);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);
router.get('/me', protect, getMe);

export default router;
