const express = require('express');
const userService = require('../services/userService');

const router = express.Router();

router.get('/locations', async (req, res) => {
    try {
        const locations = await userService.getAllLocations();
        res.json(locations);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});

router.post('/locations/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { location } = req.body;
        
        if (!location) {
            return res.status(400).json({ error: 'Location is required' });
        }
        
        await userService.updateLocation(username, location);
        
        if (req.io) {
            req.io.emit('statusUpdated', { user: username, location });
        }
        
        res.json({ message: 'Location updated successfully' });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to update location' });
    }
});

module.exports = router;