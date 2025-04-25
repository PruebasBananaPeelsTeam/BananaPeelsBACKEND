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
      return next(createError(400, 'You cannot chat with yourself about your own advert'));
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
``
