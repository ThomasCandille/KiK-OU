const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

// Environment configuration
const port = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    ['http://localhost:3000'];

// CORS configuration
app.use(cors({
    origin: NODE_ENV === 'production' ? allowedOrigins : '*',
    credentials: true
}));

// Basic security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: NODE_ENV === 'production' ? allowedOrigins : '*',
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket connection handling with error handling
io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id} at ${new Date().toISOString()}`);

    socket.on('statusUpdate', (data) => {
        try {
            // Validate data
            if (!data || !data.user || !data.location) {
                console.error('Invalid status update data:', data);
                return;
            }

            console.log(`Status update - User: ${data.user}, Location: ${data.location}`);
            socket.broadcast.emit('statusUpdated', data);
        } catch (error) {
            console.error('Error handling status update:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port} in ${NODE_ENV} mode`);
});