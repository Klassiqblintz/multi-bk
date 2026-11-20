import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowRightLeft,
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
} from 'lucide-react'
import { BANK_TEMPLATES, getTemplate } from '../lib/bankTemplates'

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
  createdAt: string
  status: string
  tagline: string
}

// Generate fake transactions
function generateTransactions(_account: AccountData) {
  const merchants = [
    'Amazon', 'Apple Store', 'Google Play', 'Netflix', 'Spotify',
    'Uber Eats', 'DoorDash', 'Walmart', 'Target', 'Best Buy',
    'Whole Foods', 'Starbucks', 'Nike', 'Adidas', 'Zara',
    'H&M', 'Sephora', 'Delta Airlines', 'Hotel Booking', 'Airbnb',
  ]
  const types: ('credit' | 'debit')[] = ['debit', 'credit']
  const statuses = ['completed', 'pending', 'completed', 'completed', 'completed']
  const txns: any[] = []

  const now = new Date()
  for (let i = 0; i < 20; i++) {
    const date = new Date(now.getTime() - i * 86400000 * (1 + Math.random() * 3))
    const isCredit = Math.random() > 0.75
    txns.push({
      id: 'txn_' + Math.random().toString(36).substr(2, 9),
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
  return txns.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export default function BankDashboard() {
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const [account, setAccount] = useState<AccountData | null>(null)
  const [activeTab, setActiveTab] = useState<'home' | 'transfer' | 'cards' | 'statements' | 'settings'>('home')
  const [showBalance, setShowBalance] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [transactions] = useState(() => [])
  const [transferForm, setTransferForm] = useState({ recipient: '', amount: '', notes: '' })
  const [transferSuccess, setTransferSuccess] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [addAmount, setAddAmount] = useState('')

  useEffect(() => {
    // Try to load from localStorage or use template defaults
    const stored = localStorage.getItem('multiBank_currentAccount')
    if (stored) {
      const acc = JSON.parse(stored)
      if (acc.id === accountId) {
        setAccount(acc)
      } else {
        // Load by templateId
        const template = getTemplate(acc.templateId)
        if (template) {
          setAccount({ ...acc, balance: 50000, symbol: template.symbol, currency: template.currency })
        }
      }
    } else {
      // Default template
      const template = getTemplate('deutsche-bank')
      if (template) {
        setAccount({
          id: accountId || 'acc_default',
          templateId: template.id,
          templateName: template.name,
          accountHolder: 'John Doe',
          balance: 50000,
          currency: template.currency,
          symbol: template.symbol,
          primaryColor: template.primaryColor,
          secondaryColor: template.secondaryColor,
          logoUrl: template.logoUrl,
          country: template.country,
          countryCode: template.countryCode,
          layout: template.layout,
          features: template.features,
          tagline: template.tagline,
          createdAt: new Date().toISOString(),
          status: 'active' as const,
        })
      }
    }
  }, [accountId])

  const displayedBalance = showBalance ? account!.balance : null

  const handleTransfer = () => {
    if (!transferForm.amount || !transferForm.recipient) return
    const amount = parseFloat(transferForm.amount)
    if (amount > account!.balance) return
    setAccount(prev => prev ? { ...prev, balance: prev.balance - amount } : null)
    setTransferSuccess(true)
    setTransferForm({ recipient: '', amount: '', notes: '' })
    setTimeout(() => setTransferSuccess(false), 3000)
  }

  const handleAddFunds = () => {
    const amount = parseFloat(addAmount)
    if (!amount || amount <= 0) return
    setAccount(prev => prev ? { ...prev, balance: prev.balance + amount } : null)
    setShowAddFunds(false)
    setAddAmount('')
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginEmail && loginPass) {
      setIsLoggedIn(true)
    }
  }

  if (!account) return null

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: account.primaryColor }}>
        {/* Left - Branding */}
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

        {/* Right - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-2xl"
                     style={{ backgroundColor: account.primaryColor }}>
                  {account.templateName.charAt(0)}
                </div>
                <h1 className="text-xl font-bold text-gray-900">{account.templateName}</h1>
                <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Username or Email</label>
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="bank-input"
                    placeholder="Enter your email or username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    className="bank-input"
                    placeholder="Enter your password"
                  />
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
                  Don't have an account? <a href="/create" className="text-blue-600 hover:underline">Create one</a>
                </p>
              </div>

              {/* Quick actions */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                <div className="text-center p-2">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg mx-auto mb-1.5 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-400">Mobile</div>
                </div>
                <div className="text-center p-2">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg mx-auto mb-1.5 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-400">2FA</div>
                </div>
                <div className="text-center p-2">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg mx-auto mb-1.5 flex items-center justify-center">
                    <Download className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-400">Statements</div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <button onClick={() => {
                // Auto-login for demo
                setIsLoggedIn(true)
              }} className="text-xs text-white/60 hover:text-white/80">
                Demo: Click to auto-login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // MAIN DASHBOARD
  const txns = generateTransactions(account)

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'transfer' as const, label: 'Transfer', icon: ArrowRightLeft },
    { id: 'cards' as const, label: 'Cards', icon: CreditCard },
    { id: 'statements' as const, label: 'Statements', icon: FileText },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ]

  const countryFlag: Record<string, string> = {
    'DE': '🇩🇪', 'AU': '🇦🇺', 'US': '🇺🇸',
    'FR': '🇫🇷', 'IT': '🇮🇹', 'GB': '🇬🇧', 'CA': '🇨🇦',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAV */}
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: account.primaryColor, borderColor: `${account.primaryColor}20` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white/80">
                <MenuIcon />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {account.templateName.charAt(0)}
                </div>
                <span className="text-sm font-semibold text-white hidden sm:block">{account.templateName}</span>
              </div>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full pl-9 pr-4 py-1.5 bg-white/10 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20"
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-white/70 hover:text-white transition relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
              </button>
              <button className="p-1.5 text-white/70 hover:text-white transition">
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowAddFunds(!showAddFunds)}
                className="p-1.5 text-white/70 hover:text-white transition"
                title="Add funds (admin)"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="p-1.5 text-white/70 hover:text-white transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ADD FUNDS BAR (Admin) */}
        {showAddFunds && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm font-medium text-green-800">Add Funds:</span>
              <span className="text-sm text-green-600">{account.symbol}</span>
              <input
                type="number"
                value={addAmount}
                onChange={e => setAddAmount(e.target.value)}
                placeholder="Amount"
                className="w-28 px-2 py-1.5 bg-white border border-green-200 rounded text-sm text-green-800 focus:outline-none focus:border-green-400"
              />
              <button
                onClick={handleAddFunds}
                className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700"
              >
                Add Funds
              </button>
              <button onClick={() => setShowAddFunds(false)} className="text-green-400 hover:text-green-600">
                <XIcon />
              </button>
            </div>
            <div className="text-xs text-green-500">
              Current: {account.symbol}{account.balance.toLocaleString()}
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-100 max-w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Balance card */}
            <div
              className="rounded-2xl p-6 text-white relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${account.primaryColor}, ${account.secondaryColor || account.primaryColor})` }
              }
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-white/60 mb-1">{account.templateName}</div>
                    <div className="text-xs text-white/40">Personal Account</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{countryFlag[account.countryCode] || ''} {account.country}</span>
                    <button onClick={() => setShowBalance(!showBalance)} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition">
                      {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-white/60 mb-1">Available Balance</div>
                  <div className="text-3xl sm:text-4xl font-bold">
                    {account.symbol}{showBalance ? account.balance.toLocaleString() : '••••••'}
                    {showBalance && '.00'}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-white/15 rounded-lg text-sm font-medium hover:bg-white/25 transition">
                    <ArrowRightLeft className="w-4 h-4" /> Transfer
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-white/15 rounded-lg text-sm font-medium hover:bg-white/25 transition">
                    <CreditCard className="w-4 h-4" /> Cards
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-white/15 rounded-lg text-sm font-medium hover:bg-white/25 transition">
                    <FileText className="w-4 h-4" /> Statements
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-white/15 rounded-lg text-sm font-medium hover:bg-white/25 transition">
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Income', value: '+24,500.00', color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Expenses', value: '-3,280.50', color: 'text-red-500', bg: 'bg-red-50' },
                { label: 'Savings', value: '€18,219.50', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Cards', value: '2 Active', color: 'text-gray-700', bg: 'bg-gray-100' },
              ].map(stat => (
                <div key={stat.label} className={`${stat.bg} rounded-xl p-3`}>
                  <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                  <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Account info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Account Holder</span>
                    <span className="font-medium">{account.accountHolder}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Account Number</span>
                    <span className="font-mono font-medium">•••• {account.id.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">IBAN</span>
                    <span className="font-mono font-medium">{account.countryCode}12 3456 7890 1234 5678 90</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">SWIFT</span>
                    <span className="font-mono font-medium">{account.countryCode}10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Currency</span>
                    <span className="font-medium">{account.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-500 font-medium">Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Transactions</h3>
                <div className="space-y-2">
                  {txns.slice(0, 5).map(txn => (
                    <div key={txn.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          txn.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          {txn.type === 'credit' ? (
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{txn.description}</div>
                          <div className="text-xs text-gray-400">{txn.date}</div>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${
                        txn.type === 'credit' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {txn.type === 'credit' ? '+' : '-'}{account.symbol}{txn.amount}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-sm text-blue-600 hover:underline font-medium">
                  View All Transactions →
                </button>
              </div>
            </div>

            {/* Full transaction history */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Transaction History</h3>
                <button className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>
              <div className="space-y-1">
                {txns.map(txn => (
                  <div key={txn.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        txn.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {txn.type === 'credit' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{txn.description}</div>
                        <div className="text-xs text-gray-400">{txn.date} · {txn.status}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        txn.type === 'credit' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {txn.type === 'credit' ? '+' : '-'}{account.symbol}{txn.amount}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {account.countryCode}12 3456 7890 1234 5678 90
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRANSFER */}
        {activeTab === 'transfer' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Transfer Money</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={transferForm.recipient}
                    onChange={e => setTransferForm({...transferForm, recipient: e.target.value})}
                    className="bank-input"
                    placeholder="Full name of recipient"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Account / IBAN</label>
                  <input
                    type="text"
                    className="bank-input"
                    placeholder="DE12 3456 7890 1234 5678 90"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Amount ({account.symbol})</label>
                  <input
                    type="number"
                    value={transferForm.amount}
                    onChange={e => setTransferForm({...transferForm, amount: e.target.value})}
                    className="bank-input"
                    placeholder="0.00"
                  />
                  <div className="text-xs text-gray-400 mt-1">Available: {account.symbol}{account.balance.toLocaleString()}.00</div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
                  <input
                    type="text"
                    value={transferForm.notes}
                    onChange={e => setTransferForm({...transferForm, notes: e.target.value})}
                    className="bank-input"
                    placeholder="Payment reference"
                  />
                </div>

                {transferSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-700 font-medium">Transfer completed successfully!</span>
                  </div>
                )}

                <button
                  onClick={handleTransfer}
                  disabled={!transferForm.amount || !transferForm.recipient}
                  className="w-full bank-btn-primary py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> Send Transfer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CARDS */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Your Cards</h2>
              <button className="bank-btn-secondary flex items-center gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            </div>

            {/* Credit card */}
            <div className="w-full max-w-md">
              <div
                className="rounded-2xl p-6 text-white relative overflow-hidden aspect-[1.586/1] flex flex-col justify-between"
                style={{ background: `linear-gradient(135deg, ${account.primaryColor}, ${account.secondaryColor || account.primaryColor})` }
                }
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{account.templateName}</div>
                  <div className="text-xs text-white/60">Debit Card</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-yellow-300/80 rounded" />
                </div>
                <div>
                  <div className="text-lg font-mono tracking-wider">
                    •••• •••• •••• {Math.random().toString().slice(2, 6)}
                  </div>
                  <div className="flex justify-between mt-1">
                    <div className="text-xs text-white/50">
                      VALID THRU<br/>12/28
                    </div>
                    <div className="text-xs text-white/50">
                      {account.accountHolder.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="text-xs text-white/40">VISA</div>
                </div>
              </div>
            </div>

            {/* Card details */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 max-w-md">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Card Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Card Number</span>
                  <span className="font-mono font-medium">•••• •••• •••• 4242</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Expiry</span>
                  <span className="font-medium">12/28</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">CVV</span>
                  <span className="font-medium">•••</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-500 font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Daily Limit</span>
                  <span className="font-medium">{account.symbol}10,000</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATEMENTS */}
        {activeTab === 'statements' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Statements</h2>
            {['November 2024', 'October 2024', 'September 2024', 'August 2024'].map(month => (
              <div key={month} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{month}</div>
                  <div className="text-xs text-gray-400">PDF · 2.4 MB</div>
                </div>
                <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Settings</h2>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                  <input type="text" defaultValue={account.accountHolder} className="bank-input" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input type="email" defaultValue="user@example.com" className="bank-input" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                  <input type="tel" defaultValue="+1 234 567 890" className="bank-input" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Security</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
                  <input type="password" className="bank-input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                  <input type="password" className="bank-input" placeholder="••••••••" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bank-btn-primary">Save Changes</button>
              <button className="flex-1 bank-btn-danger">Delete Account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MenuIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
