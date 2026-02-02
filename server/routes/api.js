const express = require('express');
const userService = require('../services/userService');

const router = express.Router();

// Test endpoint to check database connection
router.get('/test', async (req, res) => {
    try {
        console.log('Testing database connection...');
        const locations = await userService.getAllLocations();
        res.json({ 
            success: true, 
            message: 'Database connection working',
            data: locations,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Database test failed:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            details: error.details || 'No additional details'
        });
    }
});

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
        
        // Emit socket event if io is available
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