import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  supabase,
  signIn as supabaseSignIn,
  signUp as supabaseSignUp,
  signOut as supabaseSignOut,
  getCurrentUser,
  onAuthStateChange,
} from '../lib/supabase'

interface AuthContextType {
  userId: string | null
  email: string | null
  fullName: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  forgotPassword: (email: string) => Promise<string>
  verifyPasswordReset: (email: string, code: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simple 6-digit OTP store (no external service needed)
const OTP_EXPIRY = 5 * 60 * 1000 // 5 minutes
const OTS_STORAGE_KEY = 'multiBank_otps'

function getOtps(): Array<{ email: string; code: string; expiresAt: number; used: boolean }> {
  try {
    return JSON.parse(localStorage.getItem(OTS_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveOtps(otps: Array<{ email: string; code: string; expiresAt: number; used: boolean }>) {
  localStorage.setItem(OTS_STORAGE_KEY, JSON.stringify(otps))
}

function generateOtp(email: string): string {
  const now = Date.now()
  const valid = getOtps().filter(o => o.expiresAt > now && !o.used)
  // Reuse existing OTP if within 60s window
  const existing = valid.find(o => o.email.toLowerCase() === email.toLowerCase())
  if (existing && existing.expiresAt > now + 60000) {
    return existing.code
  }
  const code = String(Math.floor(100000 + Math.random() * 900000))
  saveOtps([...valid, { email: email.toLowerCase(), code, expiresAt: now + OTP_EXPIRY, used: false }])
  return code
}

function verifyOtp(email: string, code: string): boolean {
  const now = Date.now()
  const all = getOtps()
  const otp = all.find(o =>
    o.email.toLowerCase() === email.toLowerCase() &&
    o.code === code &&
    !o.used &&
    o.expiresAt > now
  )
  if (!otp) return false
  otp.used = true
  saveOtps(all.map(o => o === otp ? otp : o))
  return true
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          setUserId(user.id)
          setEmail(user.email ?? null)
          // Fetch profile for full name
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()
          setFullName(profile?.full_name ?? user.email ?? null)
        }
      } catch {
        // No session
      } finally {
        setLoading(false)
      }
    }
    checkSession()

    // Listen for auth state changes
    const unsub = onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id)
        setEmail(session.user.email ?? null)
      } else {
        setUserId(null)
        setEmail(null)
        setFullName(null)
      }
    })

    return () => unsub?.data.subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseSignIn(email, password)
    if (error) throw new Error(error.message || 'Invalid email or password')
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabaseSignUp(email, password, fullName)
    if (error) throw new Error(error.message || 'Sign up failed')
  }

  const signOut = async () => {
    await supabaseSignOut()
    setUserId(null)
    setEmail(null)
    setFullName(null)
  }

  const forgotPassword = async (email: string) => {
    // Reset password flow: generate OTP stored in localStorage
    // We use Supabase's reset flow with a simple OTP
    const code = generateOtp(email)
    // Store the email temporarily for password reset
    localStorage.setItem('multiBank_resetEmail', email.toLowerCase())
    return code
  }

  const verifyPasswordReset = async (email: string, code: string, newPassword: string) => {
    const storedEmail = localStorage.getItem('multiBank_resetEmail')
    if (!storedEmail || email.toLowerCase() !== storedEmail.toLowerCase()) {
      throw new Error('Email mismatch')
    }
    if (!verifyOtp(email, code)) {
      throw new Error('Invalid or expired code')
    }
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Not logged in. Please sign in first.')
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw new Error(error.message || 'Password update failed')
    localStorage.removeItem('multiBank_resetEmail')
  }

  return (
    <AuthContext.Provider value={{
      userId,
      email,
      fullName,
      loading,
      signIn,
      signUp,
      signOut,
      forgotPassword,
      verifyPasswordReset,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
