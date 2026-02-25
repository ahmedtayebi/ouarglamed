// PATH: server/src/lib/supabase.js
const { createClient } = require('@supabase/supabase-js'); // ADDED: converted import to require for CommonJS
const dotenv = require('dotenv'); // ADDED: load dotenv for standalone functionality
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase; // ADDED: export default explicitly as module.exports
