const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const port = process.env.PORT || 3001;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
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



server.listen(port, () => {
    console.log('RUNNING ON PORT' + port);
});