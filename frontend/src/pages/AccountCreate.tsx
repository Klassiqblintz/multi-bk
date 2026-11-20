import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, Eye, EyeOff, Check, AlertCircle } from 'lucide-react'
import { BANK_TEMPLATES, getTemplate, type BankTemplate } from '../lib/bankTemplates'
import { createAccount as supabaseCreateAccount } from '../lib/supabase-api'
import { useAuth } from '../contexts/AuthContext'

export default function AccountCreate() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { userId } = useAuth()
  const templateId = searchParams.get('template')
  const template = templateId ? getTemplate(templateId) : null
  const [name, setName] = useState(template?.name || '')
  const [holderName, setHolderName] = useState('')
  const [balance, setBalance] = useState('50000')
  const [showBalance, setShowBalance] = useState(false)
  const [customColors, setCustomColors] = useState({
    primary: template?.primaryColor || '#2563EB',
    secondary: template?.secondaryColor || '#1D4ED8',
  })
  const [customName, setCustomName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createdAccount, setCreatedAccount] = useState<{ id: string; templateName: string; balance: number } | null>(null)
  const [error, setError] = useState('')

  // Redirect if no template or not logged in
  useEffect(() => {
    if (!template) {
      navigate('/templates')
    }
  }, [template, navigate])

  if (!template || !userId) {
    return null
  }

  const formatBalance = (val: string) => {
    const num = val.replace(/\D/g, '')
    if (!num) return ''
    return parseInt(num).toLocaleString()
  }

  const handleBalanceChange = (val: string) => {
    const clean = val.replace(/[^\d]/g, '')
    setBalance(clean)
  }

  const handleChangeColor = (field: 'primary' | 'secondary', val: string) => {
    if (val.startsWith('#') && val.length === 7) {
      setCustomColors(prev => ({ ...prev, [field]: val }) as any)
    }
  }

  const handleCreate = useCallback(async () => {
    if (!holderName || !balance) return
    setSubmitting(true)
    setError('')

    try {
      const accountName = customName || template.name
      const newAcc = await supabaseCreateAccount(userId, {
        id: template.id,
        name: template.name,
        currency: template.currency,
        symbol: template.symbol,
        primaryColor: customColors.primary,
        secondaryColor: customColors.secondary,
      }, customName || holderName || template.name)

      if (newAcc) {
        setCreatedAccount({
          id: newAcc.id,
          templateName: accountName,
          balance: newAcc.balance,
        })
        setSubmitting(false)
      } else {
        setError('Failed to create account. Please try again.')
        setSubmitting(false)
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
      setSubmitting(false)
    }
  }, [userId, template, customName, holderName, balance, customColors])

  if (createdAccount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Account Created!</h2>
          <p className="text-sm text-gray-500 mb-6">Your fake bank account is ready</p>
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">
                  {template.countryCode === 'DE' ? '🇩🇪' :
                   template.countryCode === 'AU' ? '🇦🇺' :
                   template.countryCode === 'US' ? '🇺🇸' :
                   template.countryCode === 'FR' ? '🇫🇷' :
                   template.countryCode === 'IT' ? '🇮🇹' :
                   template.countryCode === 'GB' ? '🇬🇧' :
                   template.countryCode === 'CA' ? '🇨🇦' :
                   template.countryCode === 'JP' ? '🇯🇵' : '🏦'}
                </span>
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">{createdAccount.templateName}</div>
                <div className="text-xs text-gray-400">{holderName}</div>
              </div>
            </div>
            <div className="text-center py-2">
              <div className="text-xs text-gray-400">Balance</div>
              <div className="text-2xl font-bold text-green-600">
                {template.symbol}{createdAccount.balance.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/templates" className="flex-1 bg-gray-100 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition text-center">
              Browse More
            </Link>
            <Link to={`/dashboard/${createdAccount.id}`} className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition text-center">
              Open Dashboard →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/templates" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Create Your Bank Account</h1>
              <p className="text-sm text-gray-500">Customize your {template.name} account</p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* FORM */}
          <div className="space-y-6">
            {/* Template info */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Selected Template</h2>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: template.primaryColor }}
                >
                  {template.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{template.name}</div>
                  <div className="text-xs text-gray-400">{template.country} · {template.currency} ({template.symbol})</div>
                </div>
              </div>
            </div>

            {/* Account name */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Account Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Account / Bank Name</label>
                  <input
                    type="text"
                    value={customName || ''}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder={template.name}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={holderName}
                    onChange={e => setHolderName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Balance */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Initial Balance</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Starting Balance ({template.symbol})</label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{template.symbol}</span>
                    <input
                      type="text"
                      value={showBalance ? balance : '•'.repeat(Math.max(balance.length, 3))}
                      onChange={e => handleBalanceChange(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="50000"
                      required
                    />
                    <button onClick={() => setShowBalance(!showBalance)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded">
                      {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {[1000, 5000, 10000, 50000, 100000, 500000].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setBalance(amount.toString())}
                        className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-xs rounded text-gray-500 transition"
                      >
                        {template.symbol}{(amount / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Custom Colors (Optional)</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors.primary}
                      onChange={e => handleChangeColor('primary', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-gray-400 font-mono">{customColors.primary}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors.secondary}
                      onChange={e => handleChangeColor('secondary', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-gray-400 font-mono">{customColors.secondary}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleCreate}
              disabled={!holderName || !balance || submitting}
              className="w-full py-3 text-base text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              style={{ backgroundColor: template.primaryColor }}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>Create Account <Check className="w-4 h-4" /></>
              )}
            </button>
          </div>

          {/* PREVIEW CARD */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-3 text-center">Live Preview</h2>
            <div
              className="rounded-xl overflow-hidden shadow-2xl border border-gray-100"
              style={{ backgroundColor: template.bgColor }}
            >
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: template.primaryColor }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/20 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {(customName || template.name).charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-white">{customName || template.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-white/20 rounded-full" />
                  <div className="w-6 h-6 bg-white/20 rounded-full" />
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="mb-3">
                  <div className="text-xs text-gray-400 mb-1">Account Holder</div>
                  <div className="text-sm font-medium text-gray-900">{holderName || 'Your Name'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <div className="text-xs text-gray-400 mb-1">Available Balance</div>
                  <div className="text-2xl font-bold" style={{ color: template.primaryColor }}>
                    {template.symbol}{parseInt(balance || '0').toLocaleString()}.00
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {template.currency} · {template.country} Account
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {['Transfer', 'Cards', 'History'].map(item => (
                    <div key={item} className="bg-gray-50 rounded-lg p-1.5 text-center">
                      <div className="text-xs font-medium text-gray-500">{item}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {[
                    { desc: 'Salary Payment', amount: `+${template.symbol}3,200.00`, color: 'text-green-600' },
                    { desc: 'Online Shopping', amount: `-${template.symbol}89.99`, color: 'text-red-500' },
                    { desc: 'ATM Withdrawal', amount: `-${template.symbol}200.00`, color: 'text-red-500' },
                  ].map(txn => (
                    <div key={txn.desc} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{txn.desc}</span>
                      <span className={`font-mono font-medium ${txn.color}`}>{txn.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
