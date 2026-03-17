const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Раздаем статические файлы (наш фронтенд)
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Пользователь подключился');

    // Слушаем входящие сообщения
    socket.on('chat message', (msg) => {
        // Рассылаем сообщение всем подключенным пользователям
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Мессенджер запущен на порту ${PORT}`);
});
