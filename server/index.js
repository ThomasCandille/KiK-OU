import 'dotenv/config';
import express, { json } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import apiRoutes from './routes/api.js';
import setupSocketHandlers from './handlers/socketHandlers.js';

const app = express();
const server = createServer(app);

const port = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'];

app.use(cors({
    origin: NODE_ENV === 'production' ? allowedOrigins : '*',
    credentials: true
}));
app.use(json());

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

const io = new Server(server, {
    cors: {
        origin: NODE_ENV === 'production' ? allowedOrigins : '*',
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api', apiRoutes);

setupSocketHandlers(io);

process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    server.close(() => process.exit(0));
});

server.listen(port, () => {
    console.log(`Server running on port ${port} in ${NODE_ENV} mode`);
});