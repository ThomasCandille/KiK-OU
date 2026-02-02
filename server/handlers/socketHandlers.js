const userService = require('../services/userService');

const setupSocketHandlers = (io) => {
    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.id}`);

        try {
            // Send current locations to new client
            const locations = await userService.getAllLocations();
            socket.emit('initialState', locations);
        } catch (error) {
            console.error('Socket connection error:', error);
            socket.emit('error', { message: 'Failed to load initial data' });
        }

        // Handle status updates
        socket.on('statusUpdate', async (data) => {
            try {
                if (!data?.user || !data?.location) {
                    socket.emit('error', { message: 'Invalid data' });
                    return;
                }

                console.log(`Status update: ${data.user} -> ${data.location}`);
                
                await userService.updateLocation(data.user, data.location);
                
                // Broadcast to all clients
                io.emit('statusUpdated', data);
            } catch (error) {
                console.error('Status update error:', error);
                socket.emit('error', { message: 'Failed to update status' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = setupSocketHandlers;