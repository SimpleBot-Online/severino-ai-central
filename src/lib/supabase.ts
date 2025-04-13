import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://xjiztflszodhvwkomqhf.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
