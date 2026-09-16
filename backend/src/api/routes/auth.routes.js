import { Router } from 'express';
import { asyncHandler } from '../../shared/http/async-handler.js';
import { validateBody } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { signupSchema, loginSchema } from '../schemas/auth.schemas.js';
import { signup, login, logout, me } from '../controllers/auth.controller.js';

const router = Router();
router.post('/signup', validateBody(signupSchema), asyncHandler(signup));
router.post('/login', validateBody(loginSchema), asyncHandler(login));
router.post('/logout', logout);
router.get('/me', authenticate, asyncHandler(me));

export default router;
