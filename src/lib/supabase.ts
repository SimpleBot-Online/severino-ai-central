import { createClient } from '@supabase/supabase-js';
import { DATABASE } from '@/config';

// Initialize Supabase client
const supabaseUrl = DATABASE.SUPABASE.URL;
const supabaseKey = DATABASE.SUPABASE.KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
