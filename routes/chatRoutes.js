import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getOrCreateChat, getMessages, postMessage  } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:advertId', authMiddleware, getOrCreateChat);

// Obtener mensajes de un chat
router.get('/:chatId/messages', authMiddleware, getMessages);

// Enviar un mensaje en un chat
router.post('/:chatId/message', authMiddleware, postMessage);

export default router;
