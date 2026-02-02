const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🔧 Database Configuration:');
console.log('Supabase URL:', supabaseUrl ? 'Set ✓' : 'Missing ✗');
console.log('Supabase Key:', supabaseKey ? 'Set ✓' : 'Missing ✗');

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration. Please check your .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;