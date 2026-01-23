import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database.types'

const supabaseUrl = 'https://wcsidrumxgajdfckhhef.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjc2lkcnVteGdhamRmY2toaGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5ODk4NjcsImV4cCI6MjA4NDU2NTg2N30.8gei6utBY2DmeXpX2bZAktKT9zvgK_kUv0lpyKJjjCM'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})