import { getAllLocations, updateLocation, getAxes, getUsersFromAxe } from '../services/userService.js';

const setupSocketHandlers = (io) => {
    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.id}`);

        try {
            const locations = await getAllLocations();
            const axes = await getAxes();
            socket.emit('initialState', { locations, axes });
        } catch (error) {
            console.error('Socket connection error:', error);
            socket.emit('error', { message: 'Failed to load initial data' });
        }

        socket.on('statusUpdate', async (data) => {
            try {
                if (!data?.user || !data?.location) {
                    socket.emit('error', { message: 'Invalid data' });
                    return;
                }

                console.log(`Status update: ${data.user} -> ${data.location}`);
                
                await updateLocation(data.user, data.location);
                io.emit('statusUpdated', data);
                
            } catch (error) {
                console.error('Status update error:', error);
                socket.emit('error', { message: 'Failed to update status' });
            }
        });

        socket.on('axeChange', async (axe) => {
            try {
                console.log(`Axe change requested: ${axe}`);
                const users = await getUsersFromAxe(axe);
                console.log(`Users from axe ${axe}:`, users);
                socket.emit('usersFromAxe', { users });
            } catch (error) {
                console.error('Axe change error:', error);
                socket.emit('error', { message: 'Failed to load users for selected axe' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

export default setupSocketHandlers;