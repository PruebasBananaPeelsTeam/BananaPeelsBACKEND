import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getOrCreateChat } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:advertId', authMiddleware, getOrCreateChat);

export default router;
