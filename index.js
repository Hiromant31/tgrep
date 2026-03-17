const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let chatHistories = {};

app.use(express.static(path.join(__dirname, 'client/dist')));

io.on('connection', (socket) => {
    console.log('Пользователь подключился');

    socket.on('get my rooms', (userName) => {
        if (!userName) return;
        const myRooms = Object.keys(chatHistories).filter(roomName => 
            chatHistories[roomName].members && chatHistories[roomName].members.includes(userName)
        );
        socket.emit('rooms list', myRooms);
    });

    // ИСПРАВЛЕНО: Добавлена деструктуризация с защитой
    socket.on('join room', (data) => {
        const roomName = data?.roomName;
        const userName = data?.userName;

        // Если данных нет, просто выходим, чтобы сервер не упал на split()
        if (!roomName || !userName) {
            console.log('Предупреждение: попытка входа с пустыми данными', data);
            return;
        }

        socket.join(roomName);
        console.log(`Пользователь ${userName} запрашивает комнату ${roomName}`);
        
        if (!chatHistories[roomName]) {
            // Безопасно разбиваем строку
            const participants = roomName.includes('_') ? roomName.split('_') : [userName]; 
            
            chatHistories[roomName] = { 
                messages: [], 
                members: participants 
            };
            console.log(`Создан новый чат: ${roomName}`);
            io.emit('rooms updated');
        }
        
        socket.emit('chat history', chatHistories[roomName].messages || []);
    });

    socket.on('chat message', (data) => {
        const roomName = data?.roomName;
        if (!roomName || !chatHistories[roomName]) return;

        const { roomName: _, ...msgData } = data;
        const msgWithTime = { 
            ...msgData, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };

        chatHistories[roomName].messages.push(msgWithTime);
        
        if (chatHistories[roomName].messages.length > 100) {
            chatHistories[roomName].messages.shift();
        }
        
        io.to(roomName).emit('chat message', msgWithTime);
    });

    socket.on('disconnect', () => console.log('Пользователь отключился'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server is live on port ${PORT}`));
