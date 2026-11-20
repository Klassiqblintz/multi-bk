import { useState, useEffect, useMemo, useCallback } from 'react'
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
} from 'lucide-react'
import { BANK_TEMPLATES, getTemplate } from '../lib/bankTemplates'
import BankDashboardLayout from '../components/BankDashboardLayout'

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
  const [transferForm, setTransferForm] = useState({ recipient: '', amount: '', notes: '' })
  const [transferSuccess, setTransferSuccess] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [addAmount, setAddAmount] = useState('')
  const [txnFilter, setTxnFilter] = useState<'all' | 'credit' | 'debit'>('all')
  const [txnSearch, setTxnSearch] = useState('')
  const [showSavingsGoals, setShowSavingsGoals] = useState(false)
  const [cardFrozen, setCardFrozen] = useState(false)
  const [cardPin, setCardPin] = useState('4242')
  const [showCardMenu, setShowCardMenu] = useState<string | null>(null)
  const [accountType, setAccountType] = useState('')
  const [savingsGoalsState, setSavingsGoalsState] = useState(0)

  const location = useLocation()

  // Derive active tab from URL hash or default
  const currentTab = useMemo(() => {
    const hash = location.hash.replace('#', '')
    const validTabs = ['home', 'transfer', 'cards', 'statements', 'settings']
    return (validTabs.includes(hash as any) ? hash : 'home') as typeof activeTab
  }, [location.hash])

  // Filtered transactions
  const filteredTxns = useMemo(() => {
    if (!account) return []
    const allTxns = generateTransactions(account)
    return allTxns.filter(t => {
      const matchType = txnFilter === 'all' || t.type === txnFilter
      const matchSearch = !txnSearch || t.description.toLowerCase().includes(txnSearch.toLowerCase()) || (t.counterparty || '').toLowerCase().includes(txnSearch.toLowerCase())
      return matchType && matchSearch
    })
  }, [account, txnFilter, txnSearch])

  // Spending categories
  const spendingCategories = useMemo(() => {
    if (!account) return []
    const txns = generateTransactions(account).filter(t => t.type === 'debit')
    const categories: Record<string, number> = {}
    txns.forEach(t => {
      const cat = t.description || 'Other'
      categories[cat] = (categories[cat] || 0) + parseFloat(t.amount)
    })
    const max = Math.max(...Object.values(categories), 1)
    return Object.entries(categories)
      .map(([name, amount]) => ({ name, amount, width: (amount / max) * 100 })
      )
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8)
  }, [account])

  // Savings goals
  const savingsGoals = useMemo(() => {
    const goals = [
      { name: 'Emergency Fund', target: 50000, current: account ? account.balance * 0.3 : 15000, color: '#10B981' },
      { name: 'Vacation Fund', target: 20000, current: 8500, color: '#3B82F6' },
      { name: 'New Car', target: 100000, current: 35000, color: '#8B5CF6' },
    ]
    return goals
  }, [account])

  // Initialize account type from template
  useEffect(() => {
    if (account && account.accountTypes && account.accountTypes.length > 0 && !accountType) {
      setAccountType(account.accountTypes[0])
    }
  }, [account, accountType])

  useEffect(() => {
    // Try to load from localStorage or use template defaults
    const stored = localStorage.getItem('multiBank_currentAccount')
    if (stored) {
      const acc = JSON.parse(stored)
      if (acc.id === accountId) {
        const template = getTemplate(acc.templateId)
        setAccount({
          ...acc,
          templateName: template?.name || acc.templateName,
          symbol: template?.symbol || acc.symbol,
          currency: template?.currency || acc.currency,
          primaryColor: template?.primaryColor || acc.primaryColor,
          secondaryColor: template?.secondaryColor || acc.secondaryColor,
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
        // Load by templateId
        const template = getTemplate(acc.templateId)
        if (template) {
          setAccount({
            ...acc,
            templateName: template.name,
            symbol: template.symbol,
            currency: template.currency,
            primaryColor: template.primaryColor,
            secondaryColor: template.secondaryColor,
            layoutType: template.layoutType || 'modern',
            headerStyle: template.headerStyle || 'colored',
            balanceStyle: template.balanceStyle || 'prominent',
            txnStyle: template.txnStyle || 'list',
            cardLayout: template.cardLayout || 'single',
            accentColor: template.accentColor || template.secondaryColor,
            borderRadius: template.borderRadius || 'md',
            showGreeting: template.showGreeting ?? true,
            showQuickActions: template.showQuickActions ?? true,
            showSavingsGoals: template.showSavingsGoals ?? true,
            accountTypes: template.accountTypes || [],
            balance: 50000,
          })
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
          layoutType: template.layoutType || 'modern',
          headerStyle: template.headerStyle || 'colored',
          balanceStyle: template.balanceStyle || 'prominent',
          txnStyle: template.txnStyle || 'list',
          cardLayout: template.cardLayout || 'single',
          accentColor: template.accentColor || template.secondaryColor,
          borderRadius: template.borderRadius || 'md',
          showGreeting: template.showGreeting ?? true,
          showQuickActions: template.showQuickActions ?? true,
          showSavingsGoals: template.showSavingsGoals ?? true,
          accountTypes: template.accountTypes || [],
        })
      }
    }
  }, [accountId])

  const handleTransfer = () => {
    if (!transferForm.amount || !transferForm.recipient) return
    const amount = parseFloat(transferForm.amount)
    if (amount > (account?.balance || 0)) return
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

  const handleLogout = () => {
    setIsLoggedIn(false)
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

  // MAIN DASHBOARD - use BankDashboardLayout component
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

function XIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
