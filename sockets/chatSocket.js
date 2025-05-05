import Message from '../models/Message.js'


export const chatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('🟢 Usuario conectado al chat:', socket.id);

        // Identificar el socket con el userId del usuario logueado
        socket.on('identify', (userId) => {
            console.log(
                `🧠 Socket ${socket.id} identificado como user ${userId}`,
            );
            socket.join(userId);
        });

        // Unirse a un chat específico
        socket.on('joinChat', (chatId) => {
            console.log(`Socket ${socket.id} join to the chat: ${chatId}`);
            socket.join(chatId); // el socket se une a la sala con el id del chat
        });

        // Escuchar evento para marcar mensajes como leídos
        socket.on('markAsRead', async ({ chatId, userId }) => {
            try {
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

                console.log(
                    `✅ Mensajes marcados como leídos para el usuario ${userId} en chat ${chatId}`,
                );

                socket.emit('messagesRead', { chatId });
            } catch (error) {
                console.error(
                    '❌ Error al marcar mensajes como leídos:',
                    error.message,
                );
            }
        });

        // Cuando se desconecta
        socket.on('disconnect', () => {
            console.log('🔴 User disconnected:', socket.id);
        });
    });
};
