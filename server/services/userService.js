import supabase from '../config/database.js';

const TABLE_NAME = 'kikeou_db';

export async function getAllLocations() {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('user, location');

    if (error) throw error;

    const locations = {};
    data.forEach(row => {
        locations[row.user] = row.location;
    });
    return locations;
}

export async function getLocation(username) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('location')
        .eq('user', username)
        .single();

    if (error) throw error;
    return data ? data.location : null;
}

export async function updateLocation(username, location) {
    const { error } = await supabase
        .from(TABLE_NAME)
        .update({ location })
        .eq('user', username);

    if (error) throw error;
    return true;
}

export async function getAxes() {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('axe')
        .not('axe', 'is', null);

    if (error) throw error;

    return [...new Set(data.map(row => row.axe))];
}

export async function getUsersFromAxe(axe) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('user')
        .eq('axe', axe);

    if (error) throw error;

    return data.map(row => row.user);
}

export async function getRole(username) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('role')
            .eq('user', username)
            .single();

        if (error) {
            // If no row found or other query error, return null instead of throwing
            console.warn(`Could not fetch role for user ${username}:`, error.message);
            return null;
        }
        return data && data.role ? data.role : null;
    } catch (e) {
        console.warn(`Error fetching role for user ${username}:`, e.message);
        return null;
    }
}

export default {
    getAllLocations,
    getLocation,
    updateLocation,
    getAxes,
    getUsersFromAxe,
    getRole
};