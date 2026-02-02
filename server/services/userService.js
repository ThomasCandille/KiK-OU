const supabase = require('../config/database');

const TABLE_NAME = 'kikeou_db';

const userService = {
    async getAllLocations() {
        console.log('Fetching all locations from database...');
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('user, location');
        
        if (error) {
            console.error('Database error in getAllLocations:', error);
            throw error;
        }
        
        console.log('Raw data from database:', data);
        
        const locations = {};
        data.forEach(row => locations[row.user] = row.location);
        console.log('Processed locations:', locations);
        return locations;
    },

    async updateLocation(username, location) {
        console.log(`Updating location for ${username} to ${location} in table ${TABLE_NAME}`);
        
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ location })
            .eq('user', username)
            .select(); // Add select to return the updated row
        
        if (error) {
            console.error('Database error in updateLocation:', error);
            console.error('Error details:', error.message, error.details, error.hint);
            throw error;
        }
        
        console.log('Update successful, returned data:', data);
        return true;
    }
};

module.exports = userService;