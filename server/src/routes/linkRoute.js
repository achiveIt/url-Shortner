import express from 'express';
import { createShortLink, getAllLinks } from '../controllers/linkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createShortLink);

router.get('/', getAllLinks);

export default router;