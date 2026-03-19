import { Router } from 'express';
import { getAllLocations, getLocation, updateLocation, getAxes, getUsersFromAxe } from '../services/userService';

const router = Router();

router.get('/locations', async (req, res) => {
    try {
        const locations = await getAllLocations();
        res.json(locations);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});

router.get('/locations/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const location = await getLocation(username);
        
        if (location) {
            res.json({ user: username, location });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch location' });
    }
});

router.post('/locations/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { location } = req.body;
        
        if (!location) {
            return res.status(400).json({ error: 'Location is required' });
        }
        
        await updateLocation(username, location);
        
        if (req.io) {
            req.io.emit('statusUpdated', { user: username, location });
        }
        
        res.json({ message: 'Location updated successfully' });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to update location' });
    }
});

router.get('/axes', async (req, res) => {
    try {
        const axes = await getAxes();
        res.json(axes);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch axes' });
    }
});

router.get('/users/:axe', async (req, res) => {
    try {
        const { axe } = req.params;
        const users = await getUsersFromAxe(axe);
        res.json(users);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

export default router;