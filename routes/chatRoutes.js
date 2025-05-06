import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import {
    getOrCreateChat,
    getMessages,
    postMessage,
    getMyChats,
    checkChatByAdvert,
    getUnreadChats,
} from '../controllers/chatController.js';

const router = express.Router();

//rutas fijas
// obtener un chat por participantes
router.get('/myChats', authMiddleware, getMyChats);

router.get('/unread', authMiddleware, getUnreadChats);

//rutas dinamicas
router.get('/:advertId', authMiddleware, getOrCreateChat);
// Obtener mensajes de un chat
router.get('/:chatId/messages', authMiddleware, getMessages);
// Enviar un mensaje en un chat
router.post('/:chatId/message', authMiddleware, postMessage);

router.get('/advert/:advertId/check', authMiddleware, checkChatByAdvert);
export default router;
