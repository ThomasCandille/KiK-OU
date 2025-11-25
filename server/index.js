const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    console.log('New user connected: ' + socket.id);

    socket.on('statusUpdate', (data) => {
        console.log(data.user);
        console.log(data.location);

        socket.broadcast.emit('statusUpdated', data);
    });
});



server.listen(3001, () => {
    console.log('RUNNING ON PORT 3001');
});