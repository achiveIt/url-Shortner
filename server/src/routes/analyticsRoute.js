import express from 'express';
import { getAnalyticsForUser } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/', getAnalyticsForUser);

export default router;