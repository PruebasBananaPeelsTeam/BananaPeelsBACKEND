export const chatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('🟢 Usuario conectado al chat:', socket.id);

        // Unirse a un chat específico
        socket.on('joinChat', (chatId) => {
            console.log(`Socket ${socket.id} join to the chat: ${chatId}`);
            socket.join(chatId); // el socket se une a la sala con el id del chat
        });

        // Recibir y reenviar mensajes en tiempo real
        socket.on('sendMessage', ({ chatId, message }) => {
            console.log(`New message in chat ${chatId}:`, message);

            // Enviar mensaje a todos los sockets conectados al room (excepto al emisor)
            socket.to(chatId).emit('newMessage', message);
        });

        // Cuando se desconecta
        socket.on('disconnect', () => {
            console.log('🔴 User disconnected:', socket.id);
        });
    });
};
