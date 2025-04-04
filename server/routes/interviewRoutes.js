import express from 'express';
import { 
  getInterviews,
  generateQuestions,
  evaluateResponse,
  saveInterview
} from '../controllers/interviewController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Define all routes under /interviews base path
router.get('/interviews', authMiddleware, getInterviews);
router.post('/interviews/generate', authMiddleware, generateQuestions);
router.post('/interviews/evaluate', authMiddleware, evaluateResponse);
router.post('/interviews', authMiddleware, saveInterview);

export default router;