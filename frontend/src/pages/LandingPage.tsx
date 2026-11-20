import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Building2,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  ChevronRight,
  Star,
  Users,
  Smartphone,
  Lock,
  PieChart,
  LogIn,
  UserPlus,
  X,
  Mail,
  KeyRound,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  UserPlus as UserPlusIcon,
} from 'lucide-react'

const FEATURES = [
  { icon: Globe, title: '30+ Bank Templates', desc: 'From 8+ countries with authentic branding' },
  { icon: Zap, title: 'Instant Setup', desc: 'Create a working bank account in seconds' },
  { icon: Shield, title: 'Full Dashboard', desc: 'Transactions, transfers, cards & more' },
  { icon: Smartphone, title: 'Mobile Friendly', desc: 'Looks perfect on any device' },
  { icon: Lock, title: 'Secure Login', desc: '6-digit OTP verification' },
  { icon: PieChart, title: 'Admin Panel', desc: 'Manage and fund accounts from anywhere' },
]

type AuthModalView = 'login' | 'register' | 'forgot' | 'resetPassword' | 'resetComplete'

export default function LandingPage() {
  const { userId: user, email, fullName, signIn, signUp, forgotPassword, verifyPasswordReset } = useAuth()
  const navigate = useNavigate()

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authView, setAuthView] = useState<AuthModalView>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [regSuccess, setRegSuccess] = useState(false)

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  // Register form
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPass, setRegConfirmPass] = useState('')
  const [regError, setRegError] = useState('')

  // Forgot / OTP forms
  const [forgotEmail, setForgotEmail] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [enteredOtp, setEnteredOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [showOtpReveal, setShowOtpReveal] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  // Open auth modal
  const openAuth = (view: AuthModalView = 'login') => {
    setAuthView(view)
    setShowAuthModal(true)
    setError('')
    setRegSuccess(false)
    setOtpError('')
    setOtpSuccess(false)
    setGeneratedOtp('')
  }

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) return
    setError('')
    setLoading(true)
    try {
      await signIn(loginEmail, loginPassword)
      setShowAuthModal(false)
      navigate('/templates')
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  // Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regName || !regEmail || !regPassword) return
    if (regPassword !== regConfirmPass) {
      setRegError('Passwords do not match')
      return
    }
    setRegError('')
    setRegSuccess(false)
    setLoading(true)
    try {
      await signUp(regEmail, regPassword, regName)
      setRegSuccess(true)
      setTimeout(() => {
        setAuthView('resetComplete')
        setRegSuccess(false)
      }, 1500)
    } catch (err: any) {
      setRegError(err.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  // Forgot password - generate OTP
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpError('')
    setOtpSuccess(false)
    if (!forgotEmail) return
    try {
      const otp = await forgotPassword(forgotEmail)
      setGeneratedOtp(otp)
      setOtpSuccess(true)
      setAuthView('resetPassword')
    } catch (err: any) {
      setOtpError(err.message || 'Failed to generate OTP')
    }
  }

  // Verify OTP and reset password
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setOtpError('')
    if (!enteredOtp || enteredOtp.length !== 6) {
      setOtpError('Enter all 6 digits')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setOtpError('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setOtpError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      verifyPasswordReset(forgotEmail, enteredOtp, newPassword)
      setAuthView('resetComplete')
      setEnteredOtp('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err: any) {
      setOtpError(err.message || 'Invalid code or password reset failed')
    } finally {
      setLoading(false)
    }
  }

  const formatOtp = (val: string) => val.replace(/\D/g, '').slice(0, 6)

  const renderInput = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    type: string = 'text',
    placeholder: string = '',
    icon: React.ReactNode,
    required?: boolean,
    showToggle?: boolean,
  ) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        {icon}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full pl-9 ${showToggle ? 'pr-10' : 'pr-4'} py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
          placeholder={placeholder}
          required={required}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => {
              if (label === 'Password' || label === 'New Password') {
                setShowPass(!showPass)
              } else {
                setShowConfirmPass(!showConfirmPass)
              }
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {(label === 'Password' || label === 'New Password')
              ? (showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />)
              : (showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />)}
          </button>
        )}
      </div>
    </div>
  )

  // SHOW AUTH MODAL
  if (showAuthModal) {
    return (
      <>
        {/* BACKDROP */}
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowAuthModal(false)} />
        {/* MODAL */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {authView === 'login' && 'Sign In'}
                  {authView === 'register' && 'Create Account'}
                  {authView === 'forgot' && 'Reset Password'}
                  {authView === 'resetPassword' && 'Verify Code'}
                  {authView === 'resetComplete' && 'Reset Complete'}
                </h2>
                <p className="text-xs text-gray-400">
                  {authView === 'login' && 'Access your multi-banking dashboard'}
                  {authView === 'register' && 'Join MultiBank today'}
                  {authView === 'forgot' && 'Enter your email for a code'}
                  {authView === 'resetPassword' && 'Enter the 6-digit code'}
                  {authView === 'resetComplete' && 'You can now sign in'}
                </p>
              </div>
              <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* LOGIN VIEW */}
              {authView === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">{error}</span>
                    </div>
                  )}
                  {renderInput('Email', loginEmail, setLoginEmail, 'email', 'your@email.com', <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />, true)}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="••••••••"
                        required
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
                  <button
                    type="submit"
                    disabled={loading || !loginEmail || !loginPassword}
                    className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-all text-base flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                  </button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { setAuthView('forgot'); setError(''); setOtpError(''); }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="text-center pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Don't have an account?{' '}
                      <button type="button" onClick={() => { setAuthView('register'); setRegError(''); }} className="text-blue-600 hover:underline">
                        Create one
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* REGISTER VIEW */}
              {authView === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  {regError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">{regError}</span>
                    </div>
                  )}
                  {renderInput('Full Name', regName, setRegName, 'text', 'John Doe', <UserPlusIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />)}
                  {renderInput('Email', regEmail, setRegEmail, 'email', 'your@email.com', <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />)}
                  {renderInput('Password', regPassword, setRegPassword, 'password', 'Min 6 characters', <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />, undefined, true)}
                  {renderInput('Confirm Password', regConfirmPass, setRegConfirmPass, 'password', 'Min 6 characters', <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />, undefined, true)}
                  <button
                    type="submit"
                    disabled={loading || !regName || !regEmail || !regPassword}
                    className="w-full bg-green-600 text-white font-medium py-2.5 rounded-lg hover:bg-green-700 transition-all text-base flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                  </button>
                  <div className="text-center pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Already have an account?{' '}
                      <button type="button" onClick={() => { setAuthView('login'); setRegError(''); }} className="text-blue-600 hover:underline">
                        Sign in
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* FORGOT PASSWORD - ENTER EMAIL */}
              {authView === 'forgot' && (
                <div className="space-y-4">
                  {otpError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">{otpError}</span>
                    </div>
                  )}
                  {otpSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">Code generated! Copy it below.</span>
                    </div>
                  )}
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    {renderInput('Email Address', forgotEmail, setForgotEmail, 'email', 'your@email.com', <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />, true)}
                    <button
                      type="submit"
                      disabled={loading || !forgotEmail}
                      className="w-full bg-amber-500 text-white font-medium py-2.5 rounded-lg hover:bg-amber-600 transition-all text-base flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate 6-Digit Code'}
                    </button>
                  </form>
                  {otpSuccess && generatedOtp && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500 mb-1.5 text-center">Your 6-digit verification code</div>
                      <div className="flex justify-center gap-2">
                        {generatedOtp.split('').map((digit, i) => (
                          <div key={i} className="w-10 h-12 bg-white border-2 border-blue-200 rounded-lg flex items-center justify-center text-xl font-bold text-blue-600">
                            {digit}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowOtpReveal(!showOtpReveal)}
                        className="mt-2 text-xs text-gray-400 hover:text-gray-600 w-full text-center"
                      >
                        {showOtpReveal ? 'Hide code' : 'Tap to reveal'}
                      </button>
                      <p className="text-xs text-gray-400 text-center mt-2">Valid for 5 minutes</p>
                    </div>
                  )}
                  <div className="text-center pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => { setAuthView('login'); setOtpError(''); setOtpSuccess(false); setGeneratedOtp(''); setEnteredOtp(''); }}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      ← Back to sign in
                    </button>
                  </div>
                </div>
              )}

              {/* VERIFY OTP & RESET PASSWORD */}
              {authView === 'resetPassword' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {otpError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">{otpError}</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">6-Digit Code</label>
                    <input
                      type="text"
                      value={enteredOtp}
                      onChange={e => setEnteredOtp(formatOtp(e.target.value))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      placeholder="000000"
                      maxLength={6}
                      autoFocus
                    />
                  </div>
                  {renderInput('New Password', newPassword, setNewPassword, 'password', 'Min 6 characters', <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />, undefined, true)}
                  {renderInput('Confirm New Password', confirmNewPassword, setConfirmNewPassword, 'password', 'Min 6 characters', <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />, undefined, true)}
                  <button
                    type="submit"
                    disabled={loading || enteredOtp.length !== 6 || !newPassword}
                    className="w-full bg-purple-600 text-white font-medium py-2.5 rounded-lg hover:bg-purple-700 transition-all text-base flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
                  </button>
                </form>
              )}

              {/* RESET COMPLETE */}
              {authView === 'resetComplete' && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Password Reset!</h3>
                  <p className="text-sm text-gray-400 mb-6">Your password has been updated successfully</p>
                  <Link
                    to="/login"
                    className="inline-block w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-all text-base"
                    onClick={() => setShowAuthModal(false)}
                  >
                    Sign In with New Password
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  // SHOW LANDING PAGE
  return (
    <div className="min-h-screen bg-white">
      {/* NAV BAR */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">MultiBank</span>
          </Link>
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <button
                  onClick={() => openAuth('login')}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-3 py-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Register
                </button>
              </>
            ) : (
              <Link to="/templates" className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg">
                Get Started →
              </Link>
            )}
          </div>
        </div>
      </nav>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-medium mb-6">
                <Zap className="w-3.5 h-3.5" />
                30+ Bank Templates — 8 Countries
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Create Your
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Fake Bank </span>
                Account Instantly
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Choose from 30+ realistic bank templates from Germany, Australia, USA, France, Italy, UK & Canada. Customize, set your balance, and get a fully functional banking dashboard.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/templates" className="bg-blue-600 text-white px-7 py-3 rounded-lg hover:bg-blue-700 transition-all text-base flex items-center gap-2 font-medium">
                  Browse Templates <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/admin" className="bg-gray-100 text-gray-700 px-7 py-3 rounded-lg hover:bg-gray-200 transition-all text-base font-medium">
                  Admin Panel
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>2,800+ accounts created</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>4.9/5 rating</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <div className="flex-1 ml-2 bg-white rounded px-3 py-1 text-xs text-gray-400 font-mono">
                    your-bank-secure.com/dashboard
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Deutsche Bank</div>
                      <div className="text-xs text-gray-400">Personal Account</div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 mb-3">
                    <div className="text-xs text-blue-600 mb-1">Available Balance</div>
                    <div className="text-2xl font-bold text-blue-700">€47,832.50</div>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-400">Transfers</div>
                      <div className="text-xs font-bold text-gray-700">Send</div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-400">Cards</div>
                      <div className="text-xs font-bold text-gray-700">Manage</div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-400">Statements</div>
                      <div className="text-xs font-bold text-gray-700">View</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Incoming</span>
                      <span className="font-mono text-gray-900">+€2,450.00</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Outgoing</span>
                      <span className="font-mono text-gray-900">-€380.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-400/20 rounded-full blur-xl" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-500">A complete fake banking experience</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(feature => (
              <div key={feature.title} className="group p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-all duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-lg text-gray-500">Three simple steps to your fake bank account</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose a Template', desc: 'Browse our 30+ authentic bank templates from around the world' },
              { step: '02', title: 'Customize Your Account', desc: 'Set your name, balance, currency and make it yours' },
              { step: '03', title: 'Go Live', desc: 'Your fully functional fake bank is ready to use' },
            ].map(item => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-blue-100 mb-2">0{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">MultiBank</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">Templates</a>
              <a href="#" className="hover:text-white transition">Features</a>
              <a href="/admin" className="hover:text-white transition">Admin</a>
              <a href="#" className="hover:text-white transition">About</a>
            </div>
            <div className="text-sm text-gray-400">
              © 2026 MultiBank. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
