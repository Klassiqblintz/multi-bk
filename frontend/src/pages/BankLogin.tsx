import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Building2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  UserPlus,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function BankLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState(false)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/templates')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regName || !regEmail || !regPassword) return
    setRegError('')
    setRegSuccess(false)
    setLoading(true)
    try {
      await signUp(regEmail, regPassword, regName)
      setRegSuccess(true)
      setError('')
    } catch (err: any) {
      setRegError(err.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold">MultiBank</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-3">Welcome Back</h1>
          <p className="text-lg opacity-70">Sign in to your multi-banking dashboard</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 opacity-60">
            <Lock className="w-4 h-4" />
            <span className="text-sm">All accounts encrypted</span>
          </div>
          <div className="flex items-center gap-2 opacity-60">
            <Mail className="w-4 h-4" />
            <span className="text-sm">2FA protected</span>
          </div>
        </div>
      </div>

      {/* Right - Login/Register */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {!showRegister ? (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-blue-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Sign in to MultiBank</h1>
                <p className="text-sm text-gray-400 mt-1">Access your fake bank accounts</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="bank-input pl-9"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="bank-input pl-9 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-1.5 text-gray-500">
                    <input type="checkbox" className="rounded" /> Remember me
                  </label>
                  <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                </div>
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full bank-btn-primary text-base py-2.5 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setShowRegister(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Create one
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-green-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Create Account</h1>
                <p className="text-sm text-gray-400 mt-1">Join MultiBank today</p>
              </div>

              {regError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <span className="text-sm text-green-600">Account created! Check your email to verify.</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="bank-input"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="bank-input pl-9"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="bank-input"
                    placeholder="Min 6 characters"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !regName || !regEmail || !regPassword}
                  className="w-full bank-btn-primary text-base py-2.5 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShowRegister(false)
                    setRegError('')
                    setRegSuccess(false)
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  ← Back to sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
