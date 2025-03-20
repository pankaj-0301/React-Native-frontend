import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Replace these with your environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY';

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
