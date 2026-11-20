import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Search,
  Eye,
  Plus,
  Trash2,
  Loader2,
  Check,
  AlertCircle,
  Download,
  Filter,
  MoreHorizontal,
  Lock,
  LogOut,
} from 'lucide-react'

const ADMIN_PASSWORD = '0425'
const ADMIN_SESSION_KEY = 'multiBank_adminSession'

const COUNTRY_ICONS: Record<string, string> = {
  'DE': '🇩🇪', 'AU': '🇦🇺', 'US': '🇺🇸',
  'FR': '🇫🇷', 'IT': '🇮🇹', 'GB': '🇬🇧', 'CA': '🇨🇦',
  'JP': '🇯🇵',
}

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
}

function getAccounts(): AccountData[] {
  try {
    const stored = localStorage.getItem('multiBank_accounts')
    if (stored) return JSON.parse(stored)
    return []
  } catch {
    return []
  }
}

function saveAccounts(accounts: AccountData[]) {
  localStorage.setItem('multiBank_accounts', JSON.stringify(accounts))
}

function isAdminLoggedIn(): boolean {
  const session = localStorage.getItem(ADMIN_SESSION_KEY)
  return session === 'true'
}

function setAdminLoggedIn(loggedIn: boolean) {
  localStorage.setItem(ADMIN_SESSION_KEY, loggedIn ? 'true' : 'false')
}

export default function AdminPanel() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<AccountData[]>([])
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [addAmount, setAddAmount] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (isAdminLoggedIn()) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    if (password === ADMIN_PASSWORD) {
      setAdminLoggedIn(true)
      setIsAuthenticated(true)
      setPassword('')
    } else {
      setLoginError('Incorrect password')
    }
  }

  const handleLogout = () => {
    setAdminLoggedIn(false)
    setIsAuthenticated(false)
    setAccounts([])
    navigate('/')
  }

  const loadAccounts = useCallback(() => {
    const data = getAccounts()
    setAccounts(data)
  }, [])

  const filtered = accounts.filter(acc =>
    !search ||
    (acc.templateName || '').toLowerCase().includes(search.toLowerCase()) ||
    (acc.accountHolder || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
  const totalAccounts = accounts.length

  const handleAddFunds = () => {
    const amount = parseFloat(addAmount)
    if (!amount || amount <= 0) return
    if (!selectedAccount) return

    const updated = accounts.map(acc => {
      if (acc.id === selectedAccount) {
        return { ...acc, balance: acc.balance + amount }
      }
      return acc
    })
    saveAccounts(updated)
    setAccounts(updated)
    setToast({ message: `Successfully added ${addAmount} to account`, type: 'success' })
    setTimeout(() => {
      setToast(null)
      setShowAddModal(false)
      setAddAmount('')
    }, 2000)
  }

  const handleDelete = (accountId: string) => {
    if (!window.confirm('Delete this account?')) return
    const updated = accounts.filter(acc => acc.id !== accountId)
    saveAccounts(updated)
    setAccounts(updated)
  }

  const handleCreateAccount = () => {
    const newAcc: AccountData = {
      id: 'acc_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
      templateId: 'chase',
      templateName: 'Chase',
      accountHolder: 'John Doe',
      balance: 50000,
      currency: 'USD',
      symbol: '$',
      primaryColor: '#2563EB',
      secondaryColor: '#1D4ED8',
      logoUrl: '',
      country: 'USA',
      countryCode: 'US',
      layout: 'modern',
      features: ['dashboard', 'transactions', 'cards', 'statements', 'settings'],
      tagline: 'Banking made simple.',
      createdAt: new Date().toISOString(),
      status: 'active',
    }
    const updated = [...accounts, newAcc]
    saveAccounts(updated)
    setAccounts(updated)
    setShowAddModal(false)
    setToast({ message: 'Account created successfully', type: 'success' })
    setTimeout(() => setToast(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  // NOT AUTHENTICATED - SHOW LOGIN FORM
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        {/* Left - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-800 to-black flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">MultiBank</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">Admin Panel</h1>
            <p className="text-lg opacity-70">Manage all fake bank accounts</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 opacity-60">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Password protected</span>
            </div>
          </div>
        </div>

        {/* Right - Login */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gray-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Admin Access</h1>
                <p className="text-sm text-gray-400 mt-1">Enter password to continue</p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Enter admin password"
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white font-medium py-2.5 rounded-lg hover:bg-gray-900 transition-all text-base"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // AUTHENTICATED - SHOW PANEL
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TOAST */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </div>
        )}

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all bank accounts</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="w-3.5 h-3.5" /> Create Account
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Accounts', value: totalAccounts.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Balance', value: `$${(totalBalance / 1000).toFixed(1)}k`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Active Today', value: '12', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Templates', value: '40+', icon: Building2, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search accounts by name or holder..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-100">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-100">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        {/* ACCOUNTS TABLE */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">BANK</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">HOLDER</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">BALANCE</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">STATUS</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">CREATED</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map(acc => (
                    <tr key={acc.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center text-sm">
                            {COUNTRY_ICONS[acc.countryCode] || '🏦'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{acc.templateName}</div>
                            <div className="text-xs text-gray-400 font-mono">{acc.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="text-sm text-gray-900">{acc.accountHolder}</div>
                        <div className="text-xs text-gray-400">{acc.currency} ({acc.symbol})</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="text-sm font-bold text-gray-900">
                          {acc.symbol}{acc.balance?.toLocaleString() ?? '0'}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          acc.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {acc.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="text-xs text-gray-400">
                          {acc.createdAt ? new Date(acc.createdAt).toLocaleDateString() : '-'}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <a href={`/dashboard/${acc.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="View">
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => { setSelectedAccount(acc.id); setShowAddModal(true) }}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition"
                            title="Add Funds"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(acc.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      <Building2 className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
                      <div className="text-sm">No accounts yet</div>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="text-sm text-blue-600 hover:underline mt-1"
                      >
                        Create your first account
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD FUNDS MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Add Funds</h3>
                <button onClick={() => { setShowAddModal(false); setAddAmount('') }} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Select Account</label>
                  <select
                    value={selectedAccount || ''}
                    onChange={e => setSelectedAccount(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">Select an account...</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.templateName} - {acc.accountHolder}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Amount</label>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={e => setAddAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="1000"
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    {[100, 500, 1000, 5000, 10000].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setAddAmount(amt.toString())}
                        className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-xs rounded text-gray-500"
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes (optional)</label>
                  <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="Reason for funding" />
                </div>
                <button
                  onClick={handleAddFunds}
                  disabled={!selectedAccount || !addAmount}
                  className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add Funds
                  </div>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAccount}
                    className="flex-1 bg-green-600 text-white font-medium py-2.5 rounded-lg hover:bg-green-700 transition text-center"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
