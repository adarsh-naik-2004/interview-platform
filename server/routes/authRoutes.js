import express from 'express';
import { register, login, checkAuth } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check', authMiddleware, checkAuth);

export default router;