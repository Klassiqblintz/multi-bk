import { useState, useRef, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  LayoutGrid,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Plus,
  LogOut,
  User,
  Menu,
  ArrowRightLeft,
  CreditCard,
  FileText,
  Settings,
  Home as HomeIcon,
  User as UserIcon,
} from 'lucide-react'
import { BANK_TEMPLATES, getCountries, getTemplate, type BankTemplate } from '../lib/bankTemplates'

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
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
  createdAt: string
  status: string
  tagline: string
}

const COUNTRIES = getCountries()

const COUNTRY_ICONS: Record<string, string> = {
  'Germany': '🇩🇪',
  'Australia': '🇦🇺',
  'USA': '🇺🇸',
  'France': '🇫🇷',
  'Italy': '🇮🇹',
  'UK': '🇬🇧',
  'Canada': '🇨🇦',
  'Japan': '🇯🇵',
}

// Dashboard sidebar items per bank template
const DASHBOARD_SIDEBAR_ITEMS = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'transfers', label: 'Transfers', icon: ArrowRightLeft },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'statements', label: 'Statements', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function getAccount(): AccountData | null {
  try {
    const stored = localStorage.getItem('multiBank_currentAccount')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export default function Sidebar({ collapsed: collapsedProp, onToggle }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(!!collapsedProp)
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showAccounts, setShowAccounts] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const isDashboard = location.pathname.startsWith('/dashboard/')
  const isCreating = location.pathname.startsWith('/create')
  const isAdmin = location.pathname === '/admin'
  const isTemplates = location.pathname === '/templates'
  const isLanding = location.pathname === '/'

  // On dashboard, extract account from URL or localStorage
  const account = useMemo(() => {
    if (!isDashboard) return null
    // Try to find account by matching stored accounts
    let acc: AccountData | null = null
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('multiBank_') && key !== 'multiBank_currentAccount') {
        try {
          const parsed = JSON.parse(localStorage.getItem(key) || '') as AccountData
          if (parsed.id && location.pathname.includes(parsed.id)) {
            acc = parsed
            break
          }
        } catch {}
      }
    }
    // Fallback to current account or default template
    return acc || getAccount()
  }, [isDashboard, location.pathname])

  // On dashboard, extract active tab from URL
  const activeTab = useMemo(() => {
    if (!isDashboard) return 'home'
    const hash = location.hash.replace('#', '')
    return DASHBOARD_SIDEBAR_ITEMS.find(i => i.id === hash) ? hash : 'home'
  }, [isDashboard, location.hash])

  useEffect(() => {
    setCollapsed(!!collapsedProp)
  }, [collapsedProp])

  useEffect(() => {
    if (!mobileOpen) return
    const handleClick = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [mobileOpen])

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleNav = (path: string, hash?: string) => {
    const url = hash ? `${path}#${hash}` : path
    navigate(url)
    setMobileOpen(false)
  }

  // FILTERED TEMPLATES
  const filtered = BANK_TEMPLATES.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.country.toLowerCase().includes(search.toLowerCase())
    const matchCountry = !selectedCountry || t.country === selectedCountry
    return matchSearch && matchCountry
  })

  // ACCOUNTS
  const accounts = useMemo(() => {
    const items: AccountData[] = []
    const stored = localStorage.getItem('multiBank_currentAccount')
    if (stored) {
      try { items.push(JSON.parse(stored)) } catch {}
    }
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('multiBank_') && key !== 'multiBank_currentAccount') {
        try {
          const acc = JSON.parse(localStorage.getItem(key) || '') as AccountData
          if (acc.id && !items.find(a => a.id === acc.id)) {
            items.push(acc)
          }
        } catch {}
      }
    }
    return items
  }, [])

  // ============ DASHBOARD SIDEBAR ============
  if (isDashboard && account) {
    const bankTemplate = getTemplate(account.templateId)
    const sidebarItems = bankTemplate?.sidebarItems || DASHBOARD_SIDEBAR_ITEMS.map(i => i.label)

    return (
      <>
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile hamburger */}
        {!collapsed && (
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden fixed top-4 left-4 z-30 w-9 h-9 flex items-center justify-center rounded shadow-lg"
            style={{ backgroundColor: account.primaryColor, color: 'white' }}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* DASHBOARD SIDEBAR */}
        <aside
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 flex flex-col ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } ${collapsed ? 'w-[56px]' : 'w-64 lg:w-72'}'}`}
        >
          {/* Header with bank branding */}
          <div
            className={`flex items-center p-3 border-b text-white ${collapsed ? 'justify-center' : 'justify-between'}`}
            style={{ backgroundColor: account.primaryColor, borderColor: `${account.primaryColor}30` }}
          >
            {!collapsed && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="w-7 h-7 rounded flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  {account.templateName.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight">{account.templateName}</div>
                  <div className="text-[10px] opacity-60">{account.countryCode}</div>
                </div>
              </div>
            )}
            {collapsed && (
              <div
                className="w-7 h-7 rounded flex items-center justify-center text-white font-bold text-xs"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                {account.templateName.charAt(0)}
              </div>
            )}
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileOpen(false)
                } else {
                  setCollapsed(!collapsed)
                }
              }}
              className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition rounded hover:bg-white/10"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Account summary */}
          {!collapsed && (
            <div className="px-3 py-2.5 border-b" style={{ borderColor: `${account.primaryColor}20`, backgroundColor: `${account.primaryColor}08` }}>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Available Balance</div>
              <div className="text-lg font-bold" style={{ color: account.primaryColor }}>
                {account.symbol}{account.balance.toLocaleString()}.00
              </div>
              <div className="text-[10px] text-gray-400">{account.currency} · {account.accountHolder}</div>
            </div>
          )}

          {/* Collapsed: show balance as icon */}
          {collapsed && (
            <div className="py-1.5 border-b text-center" style={{ borderColor: `${account.primaryColor}20`, backgroundColor: `${account.primaryColor}08` }}>
              <div className="text-[9px] font-bold" style={{ color: account.primaryColor }}>
                {account.symbol}{(account.balance / 1000).toFixed(0)}k
              </div>
            </div>
          )}

          {/* SIDEBAR ITEMS */}
          <nav className="flex-1 overflow-y-auto py-2">
            <div className="px-1">
              {DASHBOARD_SIDEBAR_ITEMS.map(item => {
                const isActive = activeTab === item.id
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(location.pathname, item.id)}
                    className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 ${
                      isActive
                        ? 'text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor: isActive ? account.primaryColor : 'transparent',
                    }}
                  >
                    <Icon className="w-4.5 h-4.5 w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                )
              })}
            </div>
          </nav>

          {/* BOTTOM: Quick actions */}
          {!collapsed && (
            <div className="p-2 border-t" style={{ borderColor: `${account.primaryColor}20` }}>
              {/* Back to MultiBank */}
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition"
              >
                <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center text-[8px] font-bold text-white">MB</div>
                <span>Back to MultiBank</span>
              </button>
              {/* Logout */}
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </aside>
      </>
    )
  }

  // ============ NORMAL SIDEBAR (for non-dashboard pages) ============
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      {!collapsed && (
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 w-9 h-9 bg-white rounded-lg shadow-lg flex items-center justify-center"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-50 transition-all duration-300 flex flex-col ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-[48px]' : 'w-72 lg:w-80'}`}
      >
        {/* HEADER / BRANDING */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-3 border-b border-gray-700`}>
          {!collapsed && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold">MB</span>
              </div>
              <span className="font-bold text-lg">MultiBank</span>
            </div>
          )}
          {collapsed && (
            <div className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-xs font-bold">MB</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileOpen(false)
                } else {
                  setCollapsed(!collapsed)
                }
              }}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white transition rounded hover:bg-gray-700"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        {!collapsed && (
          <div className="p-2 mt-2">
            {[
              { path: '/', label: 'Home', icon: Home },
              { path: '/templates', label: 'Templates', icon: LayoutGrid },
              { path: '/admin', label: 'Admin Panel', icon: BarChart3 },
            ].map(item => {
              const isActive =
                item.path === '/' ? isLanding : location.pathname === item.path
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* COLLAPSED NAV (icons only) */}
        {collapsed && (
          <div className="flex flex-col items-center gap-1 p-2 mt-2">
            {[
              { path: '/', label: 'Home', icon: Home },
              { path: '/templates', label: 'Templates', icon: LayoutGrid },
              { path: '/admin', label: 'Admin Panel', icon: BarChart3 },
            ].map(item => {
              const isActive =
                item.path === '/' ? isLanding : location.pathname === item.path
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  title={item.label}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              )
            })}
          </div>
        )}

        {/* TEMPLATES (only when NOT collapsed and not on dashboard) */}
        {!collapsed && !isDashboard && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Section header */}
            <div className="px-3 pt-4 pb-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Templates</span>
                <button
                  onClick={() => setShowAccounts(!showAccounts)}
                  className="text-xs text-gray-400 hover:text-white transition"
                >
                  {showAccounts ? 'Hide' : 'Show'} Accounts
                </button>
              </div>
            </div>

            {/* SEARCH */}
            <div className="px-3 pb-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search banks..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-6 py-1.5 bg-gray-800 border border-gray-600 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-3.5 h-3.5 text-gray-500 hover:text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* COUNTRY FILTERS */}
            <div className="px-3 pb-1">
              <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
                <button
                  onClick={() => setSelectedCountry(null)}
                  className={`px-1.5 py-1 rounded text-[10px] font-medium transition ${
                    !selectedCountry
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  All
                </button>
                {COUNTRIES.map(country => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
                    className={`px-1.5 py-1 rounded text-[10px font-medium transition ${
                      selectedCountry === country
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {COUNTRY_ICONS[country] || '🌍'} {country}
                  </button>
                ))}
              </div>
            </div>

            {/* TEMPLATES LIST */}
            <div className="flex-1 overflow-y-auto px-3 pb-2">
              <div className="space-y-0.5">
                {selectedCountry ? (
                  filtered.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleNav(`/create?template=${template.id}`)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs hover:bg-gray-700 transition ${
                        isCreating && location.search.includes(template.id) ? 'bg-gray-700 text-white' : 'text-gray-300'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: template.primaryColor }}
                      >
                        {template.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{template.name}</div>
                        <div className="text-[10px] text-gray-500">{template.currency}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  // Show grouped by country
                  COUNTRIES.map(country => {
                    const countryTemplates = filtered.filter(t => t.country === country)
                    if (countryTemplates.length === 0) return null
                    return (
                      <div key={country}>
                        <div className="flex items-center gap-1.5 py-1.5 text-xs font-semibold text-gray-400">
                          <span>{COUNTRY_ICONS[country] || '🌍'}</span>
                          <span>{country}</span>
                          <span className="text-[10px] text-gray-500">({countryTemplates.length})</span>
                        </div>
                        {countryTemplates.map(template => (
                          <button
                            key={template.id}
                            onClick={() => handleNav(`/create?template=${template.id}`)}
                            className={`w-full flex items-center gap-2 pl-6 pr-2 py-1.5 rounded text-left text-xs hover:bg-gray-700 transition ${
                              isCreating && location.search.includes(template.id) ? 'bg-gray-700 text-white' : 'text-gray-300'
                            }`}
                          >
                            <div
                              className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold"
                              style={{ backgroundColor: template.primaryColor }}
                            >
                              {template.name.charAt(0)}
                            </div>
                            <span className="truncate text-xs">{template.name}</span>
                          </button>
                        ))}
                      </div>
                    )
                  })
                )}
              </div>

              {filtered.length === 0 && (
                <div className="py-4 text-center text-gray-500 text-xs">
                  No templates found
                </div>
              )}
            </div>

            {/* YOUR ACCOUNTS (collapsible section) */}
            {showAccounts && (
              <div className="border-t border-gray-700 px-3 py-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Accounts</span>
                  <button
                    onClick={() => handleNav('/create')}
                    className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> New
                  </button>
                </div>
                <div className="space-y-0.5 max-h-48 overflow-y-auto">
                  {accounts.length === 0 ? (
                    <div className="text-center py-3 text-gray-500 text-xs">
                      No accounts yet
                    </div>
                  ) : (
                    accounts.map(acc => (
                      <button
                        key={acc.id}
                        onClick={() => handleNav(`/dashboard/${acc.id}`)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs hover:bg-gray-700 transition"
                      >
                        <div
                          className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold"
                          style={{ backgroundColor: acc.primaryColor }}
                        >
                          {acc.templateName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate text-gray-200">{acc.templateName}</div>
                          <div className="text-[10px] text-gray-500">
                            {acc.currency} {acc.balance.toLocaleString()}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* COLLAPSED: show account count badge */}
        {collapsed && !isDashboard && accounts.length > 0 && (
          <div className="mt-auto p-2">
            <button
              onClick={() => setShowAccounts(true)}
              title="Your Accounts"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition relative"
            >
              <UserIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[8px] flex items-center justify-center font-bold">
                {accounts.length}
              </span>
            </button>
          </div>
        )}

        {/* BOTTOM: Logout / Profile */}
        {!collapsed && !isDashboard && (
          <div className="p-2 border-t border-gray-700">
            <button
              onClick={() => handleNav('/login')}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
