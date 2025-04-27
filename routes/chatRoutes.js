import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getOrCreateChat, getMessages, postMessage, getMyChats  } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:advertId', authMiddleware, getOrCreateChat);

// Obtener mensajes de un chat
router.get('/:chatId/messages', authMiddleware, getMessages);

// Enviar un mensaje en un chat
router.post('/:chatId/message', authMiddleware, postMessage);

// obtener un chat por participantes
router.get('/myChats', authMiddleware, getMyChats);

export default router;
