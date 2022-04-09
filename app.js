const express = require('express');
const socketIo = require('socket.io');
const app = express();

const PORT = process.env.PORT ? process.env.PORT : 5000;

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});

const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('join', ({friendEmail, email}) => {
        let room;
        if (friendEmail > email)
            room = friendEmail + email;
        else
           room = email + friendEmail;
        socket.join(room);
    });

    socket.on('message', message => {
        let room;
        const {friendEmail, email} = message;
        if (friendEmail > email)
            room = friendEmail + email;
        else
            room = email + friendEmail;
        io.to(room).emit('message', message);
    });
});