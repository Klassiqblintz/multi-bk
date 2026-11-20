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
  CheckCircle2,
  KeyRound,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

type LoginView = 'login' | 'register' | 'forgot' | 'resetPassword' | 'resetComplete'

export default function BankLogin() {
  const { signIn, signUp, forgotPassword, verifyPasswordReset } = useAuth()
  const navigate = useNavigate()

  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Register state
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPass, setRegConfirmPass] = useState('')
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState(false)

  // Forgot password / OTP state
  const [forgotEmail, setForgotEmail] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [enteredOtp, setEnteredOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [showOtpReveal, setShowOtpReveal] = useState(false)

  const [view, setView] = useState<LoginView>('login')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/templates')
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

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
      setError('')
      setTimeout(() => {
        setView('login')
        setRegSuccess(false)
        setRegName('')
        setRegEmail('')
        setRegPassword('')
        setRegConfirmPass('')
      }, 2000)
    } catch (err: any) {
      setRegError(err.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setOtpError('')
    setOtpSuccess(false)
    if (!forgotEmail) return
    try {
      const otp = forgotPassword(forgotEmail)
      setGeneratedOtp(otp)
      setOtpSuccess(true)
    } catch (err: any) {
      setOtpError(err.message || 'Failed to generate OTP')
    }
  }

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
    try {
      verifyPasswordReset(forgotEmail, enteredOtp, newPassword)
      setView('resetComplete')
      setEnteredOtp('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err: any) {
      setOtpError(err.message || 'Invalid code or password reset failed')
    }
  }

  const formatOtp = (val: string) => {
    return val.replace(/\D/g, '').slice(0, 6)
  }

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
          className={`w-full px-3 py-2.5 ${showToggle ? 'pr-10' : ''} bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
          placeholder={placeholder}
          required={required}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  )

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
          <h1 className="text-3xl font-bold mb-3">
            {view === 'login' && 'Welcome Back'}
            {view === 'register' && 'Create Account'}
            {view === 'forgot' && 'Reset Password'}
            {view === 'resetPassword' && 'Verify Code'}
            {view === 'resetComplete' && 'Password Reset!'}
          </h1>
          <p className="text-lg opacity-70">
            {view === 'login' && 'Sign in to your multi-banking dashboard'}
            {view === 'register' && 'Join MultiBank today'}
            {view === 'forgot' && 'Enter your email to receive a 6-digit code'}
            {view === 'resetPassword' && 'Enter the code and your new password'}
            {view === 'resetComplete' && 'You can now sign in with your new password'}
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 opacity-60">
            <Lock className="w-4 h-4" />
            <span className="text-sm">All accounts encrypted</span>
          </div>
          <div className="flex items-center gap-2 opacity-60">
            <KeyRound className="w-4 h-4" />
            <span className="text-sm">6-digit OTP verification</span>
          </div>
        </div>
      </div>

      {/* Right - Forms */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* LOGIN */}
          {view === 'login' && (
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
                {renderInput('Email', email, setEmail, 'email', 'your@email.com', <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />, undefined, undefined)}
                {renderInput('Password', password, setPassword, showPass ? 'text' : 'password', '••••••••', <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />, true, true)}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-1.5 text-gray-500">
                    <input type="checkbox" className="rounded" /> Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-all text-base flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setView('register'); setError(''); }}
                    className="text-blue-600 hover:underline"
                  >
                    Create one
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* REGISTER */}
          {view === 'register' && (
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
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Account created! Redirecting to sign in...</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {renderInput('Full Name', regName, setRegName, 'text', 'John Doe', <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />, undefined, undefined)}
                {renderInput('Email', regEmail, setRegEmail, 'email', 'your@email.com', <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />, undefined, undefined)}
                {renderInput('Password', regPassword, setRegPassword, 'password', 'Min 6 characters', <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />, undefined, true)}
                {renderInput('Confirm Password', regConfirmPass, setRegConfirmPass, 'password', 'Min 6 characters', <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />, undefined, true)}
                <button
                  type="submit"
                  disabled={loading || !regName || !regEmail || !regPassword}
                  className="w-full bg-green-600 text-white font-medium py-2.5 rounded-lg hover:bg-green-700 transition-all text-base flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => { setView('login'); setRegError(''); setRegSuccess(false); }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  ← Back to sign in
                </button>
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD - ENTER EMAIL */}
          {view === 'forgot' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-amber-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Reset Password</h1>
                <p className="text-sm text-gray-400 mt-1">Enter your email for a 6-digit code</p>
              </div>

              {otpError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">{otpError}</span>
                </div>
              )}

              {otpSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Code generated! Copy it below.</span>
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                {renderInput('Email Address', forgotEmail, setForgotEmail, 'email', 'your@email.com', <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />, undefined, undefined)}
                <button
                  type="submit"
                  disabled={loading || !forgotEmail}
                  className="w-full bg-amber-500 text-white font-medium py-2.5 rounded-lg hover:bg-amber-600 transition-all text-base flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate 6-Digit Code'}
                </button>
              </form>

              {otpSuccess && generatedOtp && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1.5 text-center">Your 6-digit verification code</div>
                  <div className="flex justify-center gap-2">
                    {generatedOtp.split('').map((digit, i) => (
                      <div
                        key={i}
                        className="w-10 h-12 bg-white border-2 border-blue-200 rounded-lg flex items-center justify-center text-xl font-bold text-blue-600"
                      >
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

              <div className="mt-4 text-center">
                <button
                  onClick={() => { setView('login'); setOtpError(''); setOtpSuccess(false); setGeneratedOtp(''); setEnteredOtp(''); }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  ← Back to sign in
                </button>
              </div>
            </div>
          )}

          {/* VERIFY OTP & RESET PASSWORD */}
          {view === 'resetPassword' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-purple-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Verify & Reset</h1>
                <p className="text-sm text-gray-400 mt-1">Enter the code and new password</p>
              </div>

              {otpError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">{otpError}</span>
                </div>
              )}

              {otpSuccess && !generatedOtp && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Code verified!</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
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

              <div className="mt-4 text-center">
                <button
                  onClick={() => { setView('forgot'); setOtpError(''); setOtpSuccess(false); setEnteredOtp(''); setNewPassword(''); setConfirmNewPassword(''); }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  ← Back to email input
                </button>
              </div>
            </div>
          )}

          {/* PASSWORD RESET COMPLETE */}
          {view === 'resetComplete' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Password Reset!</h1>
              <p className="text-sm text-gray-400 mb-6">Your password has been updated successfully</p>
              <Link
                to="/login"
                className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-all text-base block"
              >
                Sign In with New Password
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
