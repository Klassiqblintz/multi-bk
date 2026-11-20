import { createClient, type AuthChangeEvent, type Session } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://czmuqusdjymeofxpjrut.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bXVxdXNkanltZW9meHBqcnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxODUxMTUsImV4cCI6MjExMDc2MTExNX0.JInz9ChAE39h9MKWfMdEG0_FORnKMux2cpzW_W_fFOo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback)
}
