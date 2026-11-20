import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Search,
  Eye,
  Plus,
  Minus,
  Trash2,
  Settings,
  BarChart3,
  Check,
  AlertCircle,
  Download,
  Filter,
  MoreHorizontal,
} from 'lucide-react'

interface AdminAccount {
  id: string
  name: string
  holder: string
  balance: number
  currency: string
  symbol: string
  country: string
  status: string
  createdAt: string
}

const ALL_ACCOUNTS = JSON.parse(localStorage.getItem('multiBank_accounts') || '[]') as any[]

const DUMMY_ACCOUNTS: AdminAccount[] = [
  { id: 'acc_abc123', name: 'Deutsche Bank', holder: 'Max Mustermann', balance: 47832.50, currency: 'EUR', symbol: '€', country: 'DE', status: 'active', createdAt: '2024-11-15' },
  { id: 'acc_def456', name: 'Chase', holder: 'John Smith', balance: 125430.00, currency: 'USD', symbol: '$', country: 'US', status: 'active', createdAt: '2024-11-14' },
  { id: 'acc_ghi789', name: 'BNP Paribas', holder: 'Marie Dupont', balance: 8920.75, currency: 'EUR', symbol: '€', country: 'FR', status: 'active', createdAt: '2024-11-13' },
  { id: 'acc_jkl012', name: 'Commonwealth Bank', holder: 'Emma Wilson', balance: 32100.00, currency: 'AUD', symbol: '$', country: 'AU', status: 'active', createdAt: '2024-11-12' },
  { id: 'acc_mno345', name: 'HSBC', holder: 'James Brown', balance: 15680.00, currency: 'GBP', symbol: '£', country: 'GB', status: 'active', createdAt: '2024-11-11' },
  { id: 'acc_pqr678', name: 'UniCredit', holder: 'Marco Rossi', balance: 4320.00, currency: 'EUR', symbol: '€', country: 'IT', status: 'active', createdAt: '2024-11-10' },
  { id: 'acc_stu901', name: 'Bank of America', holder: 'Sarah Jones', balance: 67500.00, currency: 'USD', symbol: '$', country: 'US', status: 'active', createdAt: '2024-11-09' },
  { id: 'acc_vwx234', name: 'Barclays', holder: 'Oliver Taylor', balance: 9870.00, currency: 'GBP', symbol: '£', country: 'GB', status: 'active', createdAt: '2024-11-08' },
]

const allAccounts = ALL_ACCOUNTS.length > 0 ? ALL_ACCOUNTS : DUMMY_ACCOUNTS

const COUNTRY_ICONS: Record<string, string> = {
  'DE': '🇩🇪', 'AU': '🇦🇺', 'US': '🇺🇸',
  'FR': '🇫🇷', 'IT': '🇮🇹', 'GB': '🇬🇧', 'CA': '🇨🇦',
}

export default function AdminPanel() {
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [addAmount, setAddAmount] = useState('')
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const filtered = allAccounts.filter(acc =>
    !search || (acc.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (acc.holder || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalBalance = allAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
  const totalAccounts = allAccounts.length

  const handleAddFunds = (accountId: string) => {
    const amount = parseFloat(addAmount)
    if (amount && amount > 0) {
      setSelectedAccount(accountId)
      setToast({ message: `Successfully added ${addAmount} to account`, type: 'success' })
      setTimeout(() => setToast(null), 3000)
      setAddAmount('')
    }
  }

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

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Accounts', value: totalAccounts.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Balance', value: `${DUMMY_ACCOUNTS[0].symbol}${(totalBalance / 1000).toFixed(1)}k`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Active Today', value: '12', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Templates', value: '30+', icon: Building2, color: 'text-orange-600', bg: 'bg-orange-50' },
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

        {/* SEARCH & FILTER */}
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
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="w-3.5 h-3.5" /> Add Account
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
                {filtered.map(acc => (
                  <tr key={acc.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center text-sm">
                          {COUNTRY_ICONS[acc.country] || '🏦'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{acc.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{acc.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-sm text-gray-900">{acc.holder}</div>
                      <div className="text-xs text-gray-400">{acc.currency} ({acc.symbol})</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-sm font-bold text-gray-900">
                        {acc.symbol}{acc.balance.toLocaleString()}
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
                      <div className="text-xs text-gray-400">{acc.createdAt}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition"
                          title="Add Funds"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Account</label>
                  <select className="bank-input">
                    {DUMMY_ACCOUNTS.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name} - {acc.holder}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">€</span>
                    <input
                      type="number"
                      value={addAmount}
                      onChange={e => setAddAmount(e.target.value)}
                      className="bank-input flex-1"
                      placeholder="1000"
                    />
                  </div>
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
                  <input type="text" className="bank-input" placeholder="Reason for funding" />
                </div>
                <button
                  onClick={() => handleAddFunds(selectedAccount || 'all')}
                  className="w-full bank-btn-primary flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Funds
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
