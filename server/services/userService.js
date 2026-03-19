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

    async getLocation(username) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('location')
            .eq('user', username)
            .single();
        
        if (error) throw error;
        return data ? data.location : null;
    },

    async updateLocation(username, location) {
        const { error } = await supabase
            .from(TABLE_NAME)
            .update({ location })
            .eq('user', username);
        
        if (error) throw error;
        return true;
    },

    async getAxes() {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('axe')
            .not('axe', 'is', null);
        
        if (error) throw error;
        
        return [...new Set(data.map(row => row.axe))];
    },

    async getUsersFromAxe(axe) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('user')
            .eq('axe', axe);
        
        if (error) throw error;
        
        return data.map(row => row.user);
    }
};

module.exports = userService;