import mongoose from 'mongoose'

// Este modelo representa una conversación privada entre dos usuarios sobre un anuncio específico.
// Cada Chat está asociado a un único anuncio (advertId) y guarda los participantes (dos miembros autenticados).

const chatSchema = new mongoose.Schema({
  advertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advert',
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
}, {
  timestamps: true, // createdAt y updatedAt
})

const Chat = mongoose.model('Chat', chatSchema)
export default Chat
