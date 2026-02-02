const supabase = require('../config/database');

const TABLE_NAME = 'kikeou_db';

console.log(`🗄️ Using table: ${TABLE_NAME}`);

const userService = {
    async getAllLocations() {
        console.log('📊 Fetching all locations from database...');
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('user, location');
            
            if (error) {
                console.error('❌ Database error in getAllLocations:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                throw error;
            }
            
            console.log('✅ Raw data from database:', data);
            
            const locations = {};
            data.forEach(row => locations[row.user] = row.location);
            console.log('📍 Processed locations:', locations);
            return locations;
        } catch (err) {
            console.error('💥 Exception in getAllLocations:', err);
            throw err;
        }
    },

    async updateLocation(username, location) {
        console.log(`🔄 Updating location for "${username}" to "${location}" in table "${TABLE_NAME}"`);
        
        try {
            // First, let's check if the user exists
            const { data: existingUser, error: checkError } = await supabase
                .from(TABLE_NAME)
                .select('user, location')
                .eq('user', username)
                .single();
            
            if (checkError) {
                console.error('❌ Error checking existing user:', checkError);
                if (checkError.code === 'PGRST116') {
                    console.error(`🚫 User "${username}" not found in database`);
                }
            } else {
                console.log(`👤 Found existing user: ${existingUser.user} with location: ${existingUser.location}`);
            }
            
            // Now try to update
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .update({ location })
                .eq('user', username)
                .select();
            
            if (error) {
                console.error('❌ Database error in updateLocation:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                console.error('Error details:', error.details);
                console.error('Error hint:', error.hint);
                throw error;
            }
            
            console.log('✅ Update successful, returned data:', data);
            console.log(`📝 Successfully updated ${data.length} row(s)`);
            
            return true;
        } catch (err) {
            console.error('💥 Exception in updateLocation:', err);
            throw err;
        }
    },

    // Add a method to check table structure
    async checkTableStructure() {
        console.log('🔍 Checking table structure...');
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .limit(1);
            
            if (error) {
                console.error('❌ Table structure check failed:', error);
                return false;
            }
            
            if (data && data.length > 0) {
                console.log('📋 Table columns found:', Object.keys(data[0]));
                console.log('📄 Sample row:', data[0]);
            } else {
                console.log('⚠️ Table exists but is empty');
            }
            return true;
        } catch (err) {
            console.error('💥 Exception checking table structure:', err);
            return false;
        }
    }
};

module.exports = userService;