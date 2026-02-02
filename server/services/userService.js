const supabase = require('../config/database');

const TABLE_NAME = 'kikeou_db';

const userService = {
    async getAllLocations() {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('user, location');
        
        if (error) throw error;
        
        const locations = {};
        data.forEach(row => locations[row.user] = row.location);
        return locations;
    },

    async updateLocation(username, location) {
        const { error } = await supabase
            .from(TABLE_NAME)
            .update({ location })
            .eq('user', username);
        
        if (error) throw error;
        return true;
    }
};

module.exports = userService;