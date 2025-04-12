import express from 'express';
import { getQRCode } from '../controllers/qrController.js';

const router = express.Router();

router.get('/:shortCode', getQRCode);

export default router;