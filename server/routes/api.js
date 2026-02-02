const express = require('express');
const userService = require('../services/userService');

const router = express.Router();

// Test endpoint to check database connection
router.get('/test', async (req, res) => {
    try {
        console.log('🧪 API Test endpoint called');
        
        // Check table structure first
        await userService.checkTableStructure();
        
        const locations = await userService.getAllLocations();
        res.json({ 
            success: true, 
            message: 'Database connection working',
            tableName: 'kikeou_db',
            data: locations,
            dataCount: Object.keys(locations).length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Database test failed:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            code: error.code || 'Unknown',
            details: error.details || 'No additional details',
            tableName: 'kikeou_db'
        });
    }
});

// Manual test update endpoint
router.post('/test-update', async (req, res) => {
    try {
        const { user, location } = req.body;
        console.log(`🧪 Testing manual update: ${user} -> ${location}`);
        
        const result = await userService.updateLocation(user, location);
        res.json({
            success: true,
            message: 'Update successful',
            user,
            location,
            result
        });
    } catch (error) {
        console.error('❌ Manual update test failed:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            code: error.code || 'Unknown'
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