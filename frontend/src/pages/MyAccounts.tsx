import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  ArrowRight,
  Plus,
  Globe,
  DollarSign,
  User,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Clock,
  Lock,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getAccounts as supabaseGetAccounts, createAccount as supabaseCreateAccount } from '../lib/supabase-api'
import { BANK_TEMPLATES, getTemplate, type BankTemplate } from '../lib/bankTemplates'

const COUNTRY_ICONS: Record<string, string> = {
  'Germany': '🇩🇪', 'Australia': '🇦🇺', 'USA': '🇺🇸',
  'France': '🇫🇷', 'Italy': '🇮🇹', 'UK': '🇬🇧', 'Canada': '🇨🇦',
  'JP': '🇯🇵',
}

interface MappedAccount {
  id: string
  templateId: string
  templateName: string
  accountHolder: string
  balance: number
  currency: string
  symbol: string
  primaryColor: string
  secondaryColor: string
  country: string
  countryCode: string
  status: string
  createdAt: string
}

export default function MyAccounts() {
  const { userId, fullName, email } = useAuth()
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState<MappedAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const countries = useMemo(() => {
    const countrySet = new Set<string>()
    BANK_TEMPLATES.forEach(t => countrySet.add(t.country))
    return Array.from(countrySet).sort()
  }, [])

  const filteredCountries = selectedCountry
    ? countries.filter(c => c === selectedCountry)
    : countries

  useEffect(() => {
    const load = async () => {
      if (!userId) {
        setLoading(false)
        return
      }
      try {
        const data = await supabaseGetAccounts(userId)
        const mapped = data.map((a: any) => ({
          id: a.id,
          templateId: a.template_id,
          templateName: a.template_name,
          accountHolder: a.account_holder,
          balance: a.balance,
          currency: a.currency,
          symbol: a.symbol,
          primaryColor: a.primary_color,
          secondaryColor: a.secondary_color,
          country: a.country,
          countryCode: a.country_code,
          status: a.status || 'active',
          createdAt: a.created_at || '',
        }))
        setAccounts(mapped)
      } catch (e: any) {
        setError(e.message || 'Failed to load accounts')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  const sorted = useMemo(() => {
    const filtered = accounts.filter(a => {
      const matchSearch = !search || a.templateName.toLowerCase().includes(search.toLowerCase()) || a.accountHolder.toLowerCase().includes(search.toLowerCase())
      const matchCountry = !selectedCountry || a.country === selectedCountry
      return matchSearch && matchCountry
    })
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [accounts, search, selectedCountry])

  const handleCreateAccount = async (template: BankTemplate) => {
    if (!userId) return
    setShowCreateModal(false)
    navigate(`/create?template=${template.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  // NOT LOGGED IN
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Lock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-1">Sign in to view your accounts</h2>
          <p className="text-sm text-gray-500 mb-6">You need to be signed in to see your bank accounts</p>
          <Link to="/login" className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Accounts</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {accounts.length} account{accounts.length !== 1 ? 's' : ''} · {fullName || email || 'User'}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">New Account</span><span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      {accounts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                <div className="text-[10px] sm:text-xs text-gray-500">Accounts</div>
              </div>
              <div className="text-lg sm:text-xl font-bold text-blue-600">{accounts.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                <div className="text-[10px] sm:text-xs text-gray-500">Total Balance</div>
              </div>
              <div className="text-lg sm:text-xl font-bold text-green-600">
                {accounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
                <div className="text-[10px] sm:text-xs text-gray-500">Countries</div>
              </div>
              <div className="text-lg sm:text-xl font-bold text-purple-600">
                {new Set(accounts.map(a => a.country)).size}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH & FILTER */}
      {accounts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="bg-white rounded-xl border border-gray-100 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex-1 min-w-48 relative">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by bank name or holder..."
                  className="w-full pl-3 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex items-center gap-1 overflow-x-auto">
                <button
                  onClick={() => setSelectedCountry(null)}
                  className={`px-2 py-1.5 rounded text-[10px] font-medium transition whitespace-nowrap ${
                    !selectedCountry ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {filteredCountries.map(country => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
                    className={`px-2 py-1.5 rounded text-[10px] font-medium transition whitespace-nowrap ${
                      selectedCountry === country ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {(COUNTRY_ICONS[country] || '🌍')} {country}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACCOUNT CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {sorted.length === 0 ? (
          // EMPTY STATE
          <div className="text-center py-16">
            <Building2 className="w-14 h-14 text-gray-200 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No accounts yet</h3>
            <p className="text-sm text-gray-400 mb-6">Create your first fake bank account</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" /> Create Account
            </button>
          </div>
        ) : (
          // ACCOUNT LIST
          <div className="space-y-2">
            {sorted.map(acc => {
              const template = getTemplate(acc.templateId)
              return (
                <Link
                  key={acc.id}
                  to={`/dashboard/${acc.id}`}
                  className="block bg-white rounded-xl border border-gray-100 p-3 sm:p-4 hover:border-gray-200 hover:shadow-sm transition-all group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    {/* Bank logo */}
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0"
                      style={{ backgroundColor: acc.primaryColor }}
                    >
                      {acc.templateName.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{acc.templateName}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-400">{acc.countryCode}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          acc.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {acc.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {acc.accountHolder} · {acc.currency} ({acc.symbol})
                      </div>
                    </div>

                    {/* Balance + arrow */}
                    <div className="text-right flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {acc.symbol}{acc.balance.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-gray-400">Balance</div>
                      </div>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition">
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 group-hover:text-blue-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* COUNTRY-BASED TEMPLATE CATALOG */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Browse Bank Templates</h2>
          <Link to="/templates" className="text-xs text-blue-600 hover:underline">
            All templates →
          </Link>
        </div>
        <div className="space-y-6">
          {filteredCountries.map(country => {
            const countryTemplates = BANK_TEMPLATES.filter(t => t.country === country)
            if (countryTemplates.length === 0) return null
            return (
              <div key={country}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-base">{COUNTRY_ICONS[country] || '🌍'}</span>
                  <span className="text-sm font-semibold text-gray-600">{country}</span>
                  <span className="text-[10px] text-gray-400">({countryTemplates.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {countryTemplates.map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => handleCreateAccount(tpl)}
                      className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ backgroundColor: tpl.primaryColor }}
                      >
                        {tpl.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 truncate">{tpl.name}</div>
                        <div className="text-[10px] text-gray-400">{tpl.currency}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}