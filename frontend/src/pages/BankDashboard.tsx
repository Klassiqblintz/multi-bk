import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowRightLeft,
  Target,
  CreditCard,
  FileText,
  Bell,
  Settings,
  LogOut,
  Search,
  Plus,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  Download,
  Share2,
  Eye,
  EyeOff,
  Send,
  Check,
  AlertCircle,
  Home,
  User,
  Phone,
  MapPin,
  Lock,
  Shield,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BarChart3,
  Filter,
  X,
  CheckCircle,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  KeyRound,
  Mail,
} from 'lucide-react'
import { getTemplate } from '../lib/bankTemplates'
import BankDashboardLayout from '../components/BankDashboardLayout'
import { useAuth } from '../contexts/AuthContext'
import { generateOtp, verifyOtp } from '../lib/local-auth'
import {
  getAccount as supabaseGetAccount,
  updateAccountBalance as supabaseUpdateBalance,
  getTransactions as supabaseGetTransactions,
  createTransaction as supabaseCreateTransaction,
  getSavingsGoals as supabaseGetSavingsGoals,
  createSavingsGoal as supabaseCreateSavingsGoal,
  deleteAccount as supabaseDeleteAccount,
  deleteTransaction as supabaseDeleteTransaction,
  deleteSavingsGoal as supabaseDeleteSavingsGoal,
  getAccounts as supabaseGetAccounts,
} from '../lib/supabase-api'

interface AccountData {
  id: string
  templateId: string
  templateName: string
  accountHolder: string
  balance: number
  currency: string
  symbol: string
  primaryColor: string
  secondaryColor: string
  logoUrl: string
  country: string
  countryCode: string
  layout: string
  features: string[]
  tagline: string
  createdAt: string
  status: string
  layoutType?: string
  headerStyle?: string
  balanceStyle?: string
  txnStyle?: string
  cardLayout?: string
  accentColor?: string
  borderRadius?: string
  showGreeting?: boolean
  showQuickActions?: boolean
  showSavingsGoals?: boolean
  accountTypes?: string[]
}

function generateFakeTransactions(balance: number, symbol: string): any[] {
  const merchants = [
    'Amazon', 'Apple Store', 'Google Play', 'Netflix', 'Spotify',
    'Uber Eats', 'DoorDash', 'Walmart', 'Target', 'Best Buy',
    'Whole Foods', 'Starbucks', 'Nike', 'Adidas', 'Zara',
    'H&M', 'Sephora', 'Delta Airlines', 'Hotel Booking', 'Airbnb',
  ]
  const statuses = ['completed', 'pending', 'completed', 'completed', 'completed']
  const txns: any[] = []
  const now = new Date()
  for (let i = 0; i < 20; i++) {
    const date = new Date(now.getTime() - i * 86400000 * (1 + Math.random() * 3))
    const isCredit = Math.random() > 0.75
    txns.push({
      id: 'txn_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
      type: isCredit ? 'credit' : 'debit',
      amount: isCredit
        ? (Math.random() * 5000 + 100).toFixed(2)
        : (Math.random() * 300 + 5).toFixed(2),
      description: isCredit ? 'Direct Deposit' : merchants[Math.floor(Math.random() * merchants.length)],
      date: date.toISOString().split('T')[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      counterparty: isCredit ? 'Employer' : merchants[Math.floor(Math.random() * merchants.length)],
    })
  }
  return txns.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export default function BankDashboard() {
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()
  const [account, setAccount] = useState<AccountData | null>(null)
  const [activeTab, setActiveTab] = useState<'home' | 'transfer' | 'cards' | 'statements' | 'settings'>('home')
  const [showBalance, setShowBalance] = useState(true)
  const [transferForm, setTransferForm] = useState({ recipient: '', amount: '', notes: '' })
  const [transferSuccess, setTransferSuccess] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [addAmount, setAddAmount] = useState('')
  const [txnFilter, setTxnFilter] = useState<'all' | 'credit' | 'debit'>('all')
  const [txnSearch, setTxnSearch] = useState('')
  const [showSavingsGoals, setShowSavingsGoals] = useState(false)
  const [cardFrozen, setCardFrozen] = useState(false)
  const [cardPin, setCardPin] = useState('4242')
  const [showCardMenu, setShowCardMenu] = useState<string | null>(null)
  const [accountType, setAccountType] = useState('')
  const [loading, setLoading] = useState(true)

  const currentTab = useMemo(() => {
    const hash = location.hash.replace('#', '')
    const validTabs = ['home', 'transfer', 'cards', 'statements', 'settings']
    return (validTabs.includes(hash as any) ? hash : 'home') as typeof activeTab
  }, [location.hash])

  const loadAccount = useCallback(async () => {
    if (!accountId) {
      setLoading(false)
      return
    }
    try {
      const supAcc = await supabaseGetAccount(accountId)
      if (supAcc) {
        const template = getTemplate(supAcc.template_id)
        setAccount({
          id: supAcc.id,
          templateId: supAcc.template_id,
          templateName: supAcc.template_name,
          accountHolder: supAcc.account_holder,
          balance: supAcc.balance,
          currency: supAcc.currency,
          symbol: supAcc.symbol,
          primaryColor: supAcc.primary_color,
          secondaryColor: supAcc.secondary_color,
          logoUrl: supAcc.logo_url ?? '',
          country: supAcc.country,
          countryCode: supAcc.country_code,
          layout: template?.layout || 'modern',
          features: template?.features || [],
          tagline: template?.tagline || 'Secure Online Banking',
          createdAt: supAcc.created_at || '',
          status: supAcc.status || 'active',
          layoutType: template?.layoutType || 'modern',
          headerStyle: template?.headerStyle || 'colored',
          balanceStyle: template?.balanceStyle || 'prominent',
          txnStyle: template?.txnStyle || 'list',
          cardLayout: template?.cardLayout || 'single',
          accentColor: template?.accentColor || template?.secondaryColor,
          borderRadius: template?.borderRadius || 'md',
          showGreeting: template?.showGreeting ?? true,
          showQuickActions: template?.showQuickActions ?? true,
          showSavingsGoals: template?.showSavingsGoals ?? true,
          accountTypes: template?.accountTypes || [],
        })
      } else {
        setAccount(null)
      }
    } catch (e) {
      console.error('Failed to load account:', e)
      setAccount(null)
    }
    setLoading(false)
  }, [accountId])

  useEffect(() => {
    loadAccount()
  }, [loadAccount])

  const handleTransfer = async () => {
    if (!transferForm.amount || !transferForm.recipient || !account) return
    const amount = parseFloat(transferForm.amount)
    if (amount > account.balance) return

    const success = await supabaseUpdateBalance(account.id, account.balance - amount)
    if (success) {
      setAccount(prev => prev ? { ...prev, balance: prev.balance - amount } : null)
      setTransferSuccess(true)
      setTransferForm({ recipient: '', amount: '', notes: '' })
      setTimeout(() => setTransferSuccess(false), 3000)
    }
  }

  const handleAddFunds = async () => {
    if (!account || !addAmount) return
    const amount = parseFloat(addAmount)
    if (!amount || amount <= 0) return
    const newBalance = account.balance + amount
    const success = await supabaseUpdateBalance(account.id, newBalance)
    if (success) {
      setAccount(prev => prev ? { ...prev, balance: newBalance } : null)
      setShowAddFunds(false)
      setAddAmount('')
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-gray-900 mb-1">Account not found</h2>
          <p className="text-sm text-gray-500 mb-4">The account may have been deleted</p>
          <Link to="/templates" className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse Templates
          </Link>
        </div>
      </div>
    )
  }

  // LOGIN PAGE (demo)
  const [showPassword, setShowPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [enteredOtp, setEnteredOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPass, setConfirmNewPass] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [passwordResetDone, setPasswordResetDone] = useState(false)

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setOtpError('')
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setOtpError('Enter a valid email address')
      return
    }
    const otp = generateOtp(forgotEmail)
    setGeneratedOtp(otp)
    setShowOtp(true)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setOtpError('')
    if (enteredOtp.length !== 6) {
      setOtpError('Enter all 6 digits')
      return
    }
    if (newPassword !== confirmNewPass) {
      setOtpError('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setOtpError('Password must be at least 6 characters')
      return
    }
    const valid = verifyOtp(forgotEmail, enteredOtp)
    if (!valid) {
      setOtpError('Invalid or expired code')
      return
    }
    // Store new password for this account in localStorage (simple approach)
    const accountUsers: Record<string, string> = JSON.parse(localStorage.getItem('multiBank_accountUsers') || '{}')
    accountUsers[forgotEmail] = newPassword
    localStorage.setItem('multiBank_accountUsers', JSON.stringify(accountUsers))
    setPasswordResetDone(true)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: account.primaryColor }}>
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black/40 to-transparent flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold">{account.templateName.charAt(0)}</span>
              </div>
              <span className="text-xl font-bold">{account.templateName}</span>
            </div>
            <p className="text-lg opacity-80">{account.tagline || 'Secure Online Banking'}</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 opacity-60">
              <Lock className="w-4 h-4" />
              <span className="text-sm">256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2 opacity-60">
              <Shield className="w-4 h-4" />
              <span className="text-sm">FDIC Insured</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {!showOtp ? (
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-6">
                  <div
                    className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-2xl"
                    style={{ backgroundColor: account.primaryColor }}
                  >
                    {account.templateName.charAt(0)}
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">{account.templateName}</h1>
                  <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Username or Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="Enter your email or username"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPass}
                        onChange={e => setLoginPass(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 text-gray-500">
                      <input type="checkbox" className="rounded" /> Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() => { setForgotEmail(''); setOtpError(''); setShowOtp(true); }}
                      className="text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 text-white font-medium rounded-lg transition-all"
                    style={{ backgroundColor: account.primaryColor }}
                  >
                    Sign In
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-400">
                    Don't have an account? <a href="/create" className="text-blue-600 hover:underline">Create one</a>
                  </p>
                </div>
              </div>
            ) : !passwordResetDone ? (
              <div className="bg-white rounded-2xl shadow-2xl p-8">
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
                {showOtp && generatedOtp && (
                  <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="text-xs text-amber-700 mb-1.5 text-center">Your 6-digit verification code</div>
                    <div className="flex justify-center gap-2">
                      {generatedOtp.split('').map((digit, i) => (
                        <div key={i} className="w-10 h-12 bg-white border-2 border-amber-300 rounded-lg flex items-center justify-center text-xl font-bold text-amber-600">
                          {digit}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-2">Valid for 5 minutes</p>
                  </div>
                )}
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  {showOtp && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">6-Digit Code</label>
                        <input
                          type="text"
                          value={enteredOtp}
                          onChange={e => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          placeholder="000000"
                          maxLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            placeholder="Min 6 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Confirm New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showConfirmPass ? 'text' : 'password'}
                            value={confirmNewPass}
                            onChange={e => setConfirmNewPass(e.target.value)}
                            className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            placeholder="Min 6 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-amber-500 text-white font-medium py-2.5 rounded-lg hover:bg-amber-600 transition-all text-base"
                      >
                        Reset Password
                      </button>
                    </div>
                  )}
                  {!showOtp && (
                    <button
                      type="submit"
                      className="w-full bg-amber-500 text-white font-medium py-2.5 rounded-lg hover:bg-amber-600 transition-all text-base"
                    >
                      Generate 6-Digit Code
                    </button>
                  )}
                </form>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => { setShowOtp(false); setOtpError(''); setGeneratedOtp(''); setEnteredOtp(''); setNewPassword(''); setConfirmNewPass(''); }}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    ← Back to sign in
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">Password Reset!</h1>
                <p className="text-sm text-gray-400 mb-6">Your password has been updated successfully</p>
                <button
                  onClick={() => { setPasswordResetDone(false); setIsLoggedIn(true); setLoginEmail(''); setLoginPass(''); }}
                  className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-all text-base"
                >
                  Sign In with New Password
                </button>
              </div>
            )}
            {!showOtp && !passwordResetDone && (
              <div className="text-center mt-4">
                <button onClick={() => setIsLoggedIn(true)} className="text-xs text-white/60 hover:text-white/80">
                  Demo: Click to auto-login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Get transactions from Supabase or generate fake data as fallback
  const [transactions, setTransactions] = useState<any[]>([])
  const [savingsGoalsData, setSavingsGoalsData] = useState<any[]>([])

  useEffect(() => {
    if (!account) return
    const load = async () => {
      try {
        const supTxns = await supabaseGetTransactions(account.id)
        if (supTxns.length > 0) {
          setTransactions(supTxns)
          return
        }
      } catch { /* fall through to fake data */ }

      // Generate fake data for demo / no Supabase
      const fakeTxns = generateFakeTransactions(account.balance, account.symbol)
      setTransactions(fakeTxns)
    }
    load()
  }, [account])

  useEffect(() => {
    if (!account) return
    const load = async () => {
      try {
        const supGoals = await supabaseGetSavingsGoals(account.id)
        if (supGoals.length > 0) {
          setSavingsGoalsData(supGoals)
          return
        }
      } catch { /* fall through to fake data */ }

      setSavingsGoalsData([
        { name: 'Emergency Fund', target: 50000, current: account.balance * 0.3, color: '#10B981' },
        { name: 'Vacation Fund', target: 20000, current: 8500, color: '#3B82F6' },
        { name: 'New Car', target: 100000, current: 35000, color: '#8B5CF6' },
      ])
    }
    load()
  }, [account])

  // Spending categories
  const spendingCategories = useMemo(() => {
    const txns = (transactions || []).filter((t: any) => t.type === 'debit')
    const categories: Record<string, number> = {}
    txns.forEach((t: any) => {
      const cat = t.description || 'Other'
      categories[cat] = (categories[cat] || 0) + parseFloat(t.amount)
    })
    const max = Math.max(...Object.values(categories), 1)
    return Object.entries(categories)
      .map(([name, amount]) => ({ name, amount, width: (amount / max) * 100 })
      )
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8)
  }, [transactions])

  // Initialize account type from template
  useEffect(() => {
    if (account && account.accountTypes && account.accountTypes.length > 0 && !accountType) {
      setAccountType(account.accountTypes[0])
    }
  }, [account, accountType])

  // Filtered transactions
  const filteredTxns = useMemo(() => {
    return (transactions || []).filter((t: any) => {
      const matchType = txnFilter === 'all' || t.type === txnFilter
      const matchSearch = !txnSearch || (t.description || '').toLowerCase().includes(txnSearch.toLowerCase()) || (t.counterparty || '').toLowerCase().includes(txnSearch.toLowerCase())
      return matchType && matchSearch
    })
  }, [transactions, txnFilter, txnSearch])

  const savingsGoals = useMemo(() => savingsGoalsData, [savingsGoalsData])

  if (!account) return null

  return (
    <BankDashboardLayout
      account={account}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      showBalance={showBalance}
      setShowBalance={setShowBalance}
      showAddFunds={showAddFunds}
      setShowAddFunds={setShowAddFunds}
      addAmount={addAmount}
      setAddAmount={setAddAmount}
      handleAddFunds={handleAddFunds}
      handleTransfer={handleTransfer}
      transferForm={transferForm}
      setTransferForm={setTransferForm}
      transferSuccess={transferSuccess}
      cardFrozen={cardFrozen}
      setCardFrozen={setCardFrozen}
      cardPin={cardPin}
      setCardPin={setCardPin}
      showCardMenu={showCardMenu}
      setShowCardMenu={setShowCardMenu}
      txnFilter={txnFilter}
      setTxnFilter={setTxnFilter}
      txnSearch={txnSearch}
      setTxnSearch={setTxnSearch}
      filteredTxns={filteredTxns}
      spendingCategories={spendingCategories}
      savingsGoals={savingsGoals}
      showSavingsGoals={showSavingsGoals}
      setShowSavingsGoals={setShowSavingsGoals}
      accountType={accountType}
      setAccountType={setAccountType}
      onLogout={handleLogout}
    />
  )
}
