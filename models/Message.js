import mongoose from 'mongoose'

// Este modelo representa un mensaje dentro de una conversación (chat).
// Cada mensaje pertenece a un chat concreto (chatId), tiene un emisor (sender) y un texto.

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // para `createdAt` (orden por tiempo)
})
// TTL index para eliminar mensajes automáticamente después de 7 días
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

const Message = mongoose.model('Message', messageSchema)
export default Message
