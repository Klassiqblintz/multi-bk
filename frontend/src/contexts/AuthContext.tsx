import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  signUp as localSignUp,
  signIn as localSignIn,
  generateOtp,
  verifyOtp,
  resetPassword,
  getSession,
  setSession,
  clearSession,
  isLoggedIn,
} from '../lib/local-auth'

interface AuthContextType {
  user: string | null
  email: string | null
  fullName: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => void
  forgotPassword: (email: string) => string
  verifyPasswordReset: (email: string, code: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (session) {
      setEmail(session.email)
      setFullName(session.fullName)
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    const user = localSignIn(email, password)
    if (!user) {
      throw new Error('Invalid email or password')
    }
    setSession(user.email, user.fullName)
    setEmail(user.email)
    setFullName(user.fullName)
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const result = localSignUp(email, password, fullName)
    setSession(result.user.email, result.user.fullName)
    setEmail(result.user.email)
    setFullName(result.user.fullName)
  }

  const signOut = () => {
    clearSession()
    setEmail(null)
    setFullName(null)
  }

  const forgotPassword = (email: string): string => {
    const code = generateOtp(email)
    return code
  }

  const verifyPasswordReset = async (email: string, code: string, newPassword: string) => {
    if (!verifyOtp(email, code)) {
      throw new Error('Invalid or expired code')
    }
    resetPassword(email, newPassword)
  }

  return (
    <AuthContext.Provider value={{
      user: email,
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
