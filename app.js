const express = require('express');
const socketio = require('socket.io');
const app = express();

const PORT = process.env.PORT ? process.env.PORT : 5000;

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});

const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('join', ({room}) => {
        socket.join(room);
    });

    socket.on('sendLines', ({room, lines}) => {
        io.to(room).emit('sendLines', lines);
    });
});