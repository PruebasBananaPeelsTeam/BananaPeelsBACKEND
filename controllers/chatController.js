import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Advert from '../models/Advert.js';
import createError from 'http-errors';

/**
 * GET or CREATE chat between two authenticated users for a specific advert
 */
export async function getOrCreateChat(req, res, next) {
    try {
        const { advertId } = req.params;
        const userId = req.user._id;

        const advert = await Advert.findById(advertId);
        if (!advert) {
            return next(createError(404, 'Advert not found'));
        }

        if (advert.ownerId.equals(userId)) {
            return next(
                createError(
                    400,
                    'You cannot chat with yourself about your own advert',
                ),
            );
        }

        // Buscar si ya existe un chat con este anuncio y los dos participantes
        const existingChat = await Chat.findOne({
            advertId,
            participants: { $all: [userId, advert.ownerId] },
        });

        if (existingChat) {
            return res.json({ success: true, chat: existingChat });
        }

        // Si no existe, creamos un nuevo chat
        const newChat = new Chat({
            advertId,
            participants: [userId, advert.ownerId],
        });

        await newChat.save();
        return res.status(201).json({ success: true, chat: newChat });
    } catch (error) {
        next(error);
    }
}

const findChatById = async (chatId) => {
    const chat = await Chat.findById(chatId);
    if (!chat) {
        throw createError(404, 'Chat not found');
    }
    return chat;
};

/**
 * GET messages of a chat (sorted by time)
 */
export async function getMessages(req, res, next) {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        const chat = await findChatById(chatId);

        // Busca todos los mensajes del chat ordenados por fecha de creación y añade el nombre de usuario del remitente
        if (!chat.participants.includes(userId)) {
            return res
                .status(403)
                .json({ error: 'Forbidden: not a participant of this chat' });
        }

        // Marcar como leídos los mensajes no leídos por este usuario
        await Message.updateMany(
            {
                chatId,
                sender: { $ne: userId },
                readBy: { $ne: userId },
            },
            {
                $addToSet: { readBy: userId },
            },
        );

        const messages = await Message.find({ chatId })
            .sort({ createdAt: 1 })
            .populate('sender', 'username');

        res.json({ success: true, messages });
    } catch (error) {
        next(error);
    }
}

/**
 * POST a new message to a chat
 */
export async function postMessage(req, res, next) {
    try {
        const { chatId } = req.params;
        const { text } = req.body;
        const sender = req.user._id;

        const chat = await findChatById(chatId);

        if (!chat.participants.includes(sender)) {
            return res
                .status(403)
                .json({ error: 'Forbidden: not a participant of this chat' });
        }

        if (!text || typeof text !== 'string' || !text.trim()) {
            return res.status(400).json({ error: 'Message text is required' });
        }

        const newMessage = new Message({
            chatId,
            sender,
            text: text.trim(),
        });

        await newMessage.save();
        
        // Emitimos al otro participante que hay un nuevo mensaje
        const recipientId = chat.participants.find(
            (participant) => participant.toString() !== sender.toString(),
        );

        // Asegúrate de tener acceso a `req.io` desde aquí
        if (req.io) {
            console.log('✅ req.io está disponible en postMessage')
            req.io.to(recipientId.toString()).emit('newMessage', {
                chatId: chat._id,
                message: newMessage,
            });
        }

        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        next(error);
    }
}

// Busca todos los Chat donde el usuario logueado (req.user._id) sea uno de los participants
export async function getMyChats(req, res, next) {
    try {
        const userId = req.user._id;

        const chats = await Chat.find({
            participants: userId,
        })
            .populate('advertId', 'name') // para mostrar el nombre del anuncio
            .populate('participants', 'username')
            .sort({ updatedAt: -1 }); // ordenados por último actualizado

        res.json({ success: true, chats });
    } catch (error) {
        next(error);
    }
}

export async function checkChatByAdvert(req, res, next) {
    try {
        const { advertId } = req.params;
        const userId = req.user._id;

        const existingChat = await Chat.findOne({
            advertId,
            participants: userId,
        });

        if (existingChat) {
            return res.json({ success: true, chat: existingChat });
        } else {
            return res.json({ success: false });
        }
    } catch (error) {
        next(error);
    }
}

export async function getUnreadStatus(req, res, next) {
    try {
        const userId = req.user._id;

        // Buscar si hay al menos un mensaje que no ha sido leído por el usuario y que no ha sido enviado por él
        const hasUnread = await Message.exists({
            sender: { $ne: userId },
            readBy: { $ne: userId },
        });
        console.log('🧠 Checking unread for user:', userId);
        res.json({ success: true, hasUnreadMessages: !!hasUnread });
    } catch (error) {
        next(error);
    }
}
