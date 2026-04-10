import { getAllLocations, updateLocation, getAxes, getUsersFromAxe, getRole } from '../services/userService.js';

const darkenedAxes = new Set();

const setupSocketHandlers = (io) => {
    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.id}`);

        try {
            const locations = await getAllLocations();
            const axes = await getAxes();
            socket.emit('initialState', { locations, axes, darkenedAxes: [...darkenedAxes] });
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
                const roles = await Promise.all(users.map(async (user) => {
                    const role = await getRole(user);
                    return { user, role };
                }));

                console.log(`Users from axe ${axe}:`, users);
                socket.emit('usersFromAxe', { users, roles });
            } catch (error) {
                console.error('Axe change error:', error);
                socket.emit('error', { message: 'Failed to load users for selected axe' });
            }
        });

        socket.on('darkenAxe', (axe) => {
            if (!axe || typeof axe !== 'string') {
                socket.emit('error', { message: 'Invalid axe to darken' });
                return;
            }

            darkenedAxes.has(axe) ? darkenedAxes.delete(axe) : darkenedAxes.add(axe);

            io.emit('darkenedAxesUpdated', { darkenedAxes: [...darkenedAxes] });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

export default setupSocketHandlers;