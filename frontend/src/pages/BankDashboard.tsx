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
} from 'lucide-react'
import { getTemplate } from '../lib/bankTemplates'
import BankDashboardLayout from '../components/BankDashboardLayout'
import { useAuth } from '../contexts/AuthContext'
import {
  getAccounts,
  createAccount as createAccountOnSupabase,
  updateAccountBalance,
  getTransactions,
  createTransaction as createTransactionOnSupabase,
  getSavingsGoals,
  createSavingsGoal as createSavingsGoalOnSupabase,
  BankAccount,
  Transaction as SupaTransaction,
  SavingsGoal,
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
  return txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export default function BankDashboard() {
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
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

  // Load account from Supabase or localStorage
  const loadAccount = useCallback(async () => {
    if (!user || !accountId) return
    setLoading(true)
    try {
      // Try to load from Supabase first
      const [acc, txns, goals] = await Promise.all([
        getAccountById(accountId),
        getTransactions(accountId, { type: txnFilter, search: txnSearch }),
        getSavingsGoals(accountId),
      ])

      if (acc) {
        setAccount({
          id: acc.id,
          templateId: acc.template_id,
          templateName: acc.template_name,
          accountHolder: acc.account_holder,
          balance: acc.balance,
          currency: acc.currency,
          symbol: acc.symbol,
          primaryColor: acc.primary_color,
          secondaryColor: acc.secondary_color,
          logoUrl: '',
          country: acc.country,
          countryCode: acc.country_code,
          status: acc.status as any,
          createdAt: acc.created_at,
          layout: 'modern',
          features: [],
          tagline: '',
          accountTypes: [],
          layoutType: 'modern',
          headerStyle: 'colored',
          balanceStyle: 'prominent',
          txnStyle: 'list',
          cardLayout: 'single',
          accentColor: acc.secondary_color || acc.primary_color,
          borderRadius: 'md',
          showGreeting: true,
          showQuickActions: true,
          showSavingsGoals: true,
        })
      } else {
        // Fall back to localStorage
        const stored = localStorage.getItem('multiBank_currentAccount')
        if (stored) {
          const localAcc = JSON.parse(stored)
          if (localAcc.id === accountId) {
            const template = getTemplate(localAcc.templateId)
            setAccount({
              ...localAcc,
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
          }
        }
      }
    } catch (err) {
      console.error('Error loading account:', err)
    } finally {
      setLoading(false)
    }
  }, [user, accountId, txnFilter, txnSearch])

  useEffect(() => {
    loadAccount()
  }, [loadAccount])

  const handleTransfer = async () => {
    if (!transferForm.amount || !transferForm.recipient || !account) return
    const amount = parseFloat(transferForm.amount)
    if (amount > account.balance) return

    // Update balance
    const newBalance = account.balance - amount
    await updateAccountBalance(account.id, newBalance)
    setAccount(prev => prev ? { ...prev, balance: newBalance } : null)
    setTransferSuccess(true)
    setTransferForm({ recipient: '', amount: '', notes: '' })
    setTimeout(() => setTransferSuccess(false), 3000)
  }

  const handleAddFunds = async () => {
    if (!account || !addAmount) return
    const amount = parseFloat(addAmount)
    if (!amount || amount <= 0) return
    const newBalance = account.balance + amount
    await updateAccountBalance(account.id, newBalance)
    setAccount(prev => prev ? { ...prev, balance: newBalance } : null)
    setShowAddFunds(false)
    setAddAmount('')
  }

  const handleLogout = () => {
    signOut()
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
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-2xl"
                     style={{ backgroundColor: account.primaryColor }}>
                  {account.templateName.charAt(0)}
                </div>
                <h1 className="text-xl font-bold text-gray-900">{account.templateName}</h1>
                <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Username or Email</label>
                  <input type="text" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="Enter your email or username" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                  <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="Enter your password" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-1.5 text-gray-500">
                    <input type="checkbox" className="rounded" /> Remember me
                  </label>
                  <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                </div>
                <button type="submit" className="w-full py-2.5 text-white font-medium rounded-lg transition-all" style={{ backgroundColor: account.primaryColor }}>
                  Sign In
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  Don't have an account? <a href="/create" className="text-blue-600 hover:underline">Create one</a>
                </p>
              </div>
            </div>
            <div className="text-center mt-4">
              <button onClick={() => setIsLoggedIn(true)} className="text-xs text-white/60 hover:text-white/80">
                Demo: Click to auto-login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Get transactions and savings goals from Supabase or generate fake data
  const [transactions, setTransactions] = useState<any[]>([])
  const [savingsGoalsData, setSavingsGoalsData] = useState<any[]>([])

  useEffect(() => {
    const loadAllData = async () => {
      if (!account) return
      try {
        const txns = await getTransactions(account.id, { type: txnFilter, search: txnSearch })
        setTransactions(txns)

        const goals = await getSavingsGoals(account.id)
        if (goals.length > 0) {
          setSavingsGoalsData(goals)
        } else {
          // Generate fake goals
          setSavingsGoalsData([
            { name: 'Emergency Fund', target: 50000, current: account.balance * 0.3, color: '#10B981' },
            { name: 'Vacation Fund', target: 20000, current: 8500, color: '#3B82F6' },
            { name: 'New Car', target: 100000, current: 35000, color: '#8B5CF6' },
          ])
        }
      } catch (err) {
        // Fall back to fake data
        setTransactions(generateFakeTransactions(account.balance, account.symbol))
        setSavingsGoalsData([
          { name: 'Emergency Fund', target: 50000, current: account.balance * 0.3, color: '#10B981' },
          { name: 'Vacation Fund', target: 20000, current: 8500, color: '#3B82F6' },
          { name: 'New Car', target: 100000, current: 35000, color: '#8B5CF6' },
        ])
      }
    }
    loadAllData()
  }, [account, txnFilter, txnSearch])

  // Spending categories
  const spendingCategories = useMemo(() => {
    const txns = (transactions || []).filter(t => t.type === 'debit')
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
  }, [transactions])

  // Initialize account type from template
  useEffect(() => {
    if (account && account.accountTypes && account.accountTypes.length > 0 && !accountType) {
      setAccountType(account.accountTypes[0])
    }
  }, [account, accountType])

  // Filtered transactions
  const filteredTxns = useMemo(() => {
    return (transactions || []).filter(t => {
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

async function getAccountById(accountId: string): Promise<BankAccount | null> {
  const { createClient } = await import('@supabase/supabase-js')
  const { supabase } = await import('../lib/supabase')
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', accountId)
    .single()
  if (error || !data) return null
  return data as BankAccount
}
