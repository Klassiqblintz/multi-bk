import { Link } from 'react-router-dom'
import { Building2, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useState } from 'react'

export default function BankLogin() {
  const [showPass, setShowPass] = useState(false)

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

      {/* Right - Login */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Sign in to MultiBank</h1>
              <p className="text-sm text-gray-400 mt-1">Access your fake bank accounts</p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email or Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
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
                    className="bank-input pl-9 pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
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
              <button type="submit" className="w-full bank-btn-primary text-base py-2.5">
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Don't have an account? <Link to="/templates" className="text-blue-600 hover:underline">Browse templates</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
