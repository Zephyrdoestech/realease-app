import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ⚠️ REPLACE THESE WITH YOUR ACTUAL SUPABASE KEYS
const supabaseUrl = 'https://ibfhlbfuctzmrzreuwnx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZmhsYmZ1Y3R6bXJ6cmV1d254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MDk3NDgsImV4cCI6MjA4MzQ4NTc0OH0.nQHIntbN0nA2dL0MT1J33ikXUYmweLfdaXIbAa-wbZo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});