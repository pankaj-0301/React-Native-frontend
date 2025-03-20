import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Replace these with your environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xhkzhhbjqvevngswirur.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhoa3poaGJqcXZldm5nc3dpcnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDEzNjgsImV4cCI6MjA1NzY3NzM2OH0.lztvDv8VUHotHTayQJhUr2VVOOKuTqMZ9kWemeDz4PQ';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
