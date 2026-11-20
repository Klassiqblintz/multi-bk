import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Home,
  LayoutGrid,
  Layers,
  BarChart3,
  Search,
  ChevronRight,
  ChevronDown,
  LogIn,
  LogOut,
  ArrowLeft,
} from 'lucide-react'
import { BANK_TEMPLATES, type BankTemplate } from '../lib/bankTemplates'

interface CountryGroup {
  country: string
  countryCode: string
  flag: string
  templates: BankTemplate[]
  expanded: boolean
}

const COUNTRY_FLAGS: Record<string, string> = {
  'Germany': '🇩🇪', 'Australia': '🇦🇺', 'USA': '🇺🇸',
  'France': '🇫🇷', 'Italy': '🇮🇹', 'UK': '🇬🇧',
  'Canada': '🇨🇦', 'Japan': '🇯🇵',
}

const COUNTRY_ORDER = ['Germany', 'Australia', 'USA', 'France', 'Italy', 'UK', 'Canada', 'Japan']

const BANK_COLORS: Record<string, string> = {
  'D': '#2563EB', 'C': '#EAB308', 'S': '#DC2626', 'I': '#F97316', 'W': '#059669',
  'A': '#EF4444', 'N': '#EAB308', 'M': '#2563EB', 'B': '#059669',
  'P': '#7C3AED', 'R': '#7C3AED', 'U': '#7C3AED', 'K': '#06B6D4',
  'L': '#06B6D4', 'H': '#06B6D4', 'J': '#06B6D4', 'G': '#06B6D4', 'E': '#06B6D4',
  'F': '#06B6D4', 'O': '#06B6D4',
  'X': '#7C3AED', 'Y': '#7C3AED', 'Z': '#7C3AED',
}

function getBankColor(initial: string): string {
  return BANK_COLORS[initial.toUpperCase()] || '#2563EB'
}

export default function LandingPage() {
  const { userId, signOut } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string | null>(null)
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({})
  const [showAccounts, setShowAccounts] = useState(true)

  // Group templates by country
  const countries = useMemo((): CountryGroup[] => {
    const groups: CountryGroup[] = []
    for (const country of COUNTRY_ORDER) {
      const templates = BANK_TEMPLATES.filter(t => t.country === country)
      if (templates.length > 0) {
        groups.push({
          country,
          countryCode: templates[0].countryCode,
          flag: COUNTRY_FLAGS[country] || '🌍',
          templates,
          expanded: true,
        })
      }
    }
    return groups
  }, [])

  const filteredCountries = useMemo(() => {
    if (!selectedCountryFilter) return countries
    return countries.filter(c => c.country === selectedCountryFilter)
  }, [countries, selectedCountryFilter])

  const filteredGroups = useMemo(() => {
    return filteredCountries.map(c => ({
      ...c,
      templates: c.templates.filter(t =>
        !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.country.toLowerCase().includes(search.toLowerCase())
      ),
    })).filter(c => c.templates.length > 0)
  }, [filteredCountries, search])

  const toggleCountry = (country: string) => {
    setExpandedCountries(prev => ({ ...prev, [country]: !prev[country] }))
  }

  const handleTemplateSelect = (template: BankTemplate) => {
    if (userId) {
      navigate('/accounts', { state: { selectedTemplate: template } })
    } else {
      navigate('/login', { state: { selectedTemplate: template } })
    }
  }

  const handleSignIn = () => {
    navigate('/login', { state: { selectedTemplate: null } })
  }

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1528] to-[#0a0f1e] text-white">
      {/* LAYOUT */}
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <div className="w-80 flex-shrink-0 border-r border-white/5">
          {/* HEADER */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-lg font-bold text-white">MB</span>
              </div>
              <div>
                <div className="text-lg font-bold tracking-tight">MultiBank</div>
                <div className="text-[11px] text-white/40 font-medium">Global Banking Suite</div>
              </div>
              <Link to="/" className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition">
                <ArrowLeft className="w-4 h-4 text-white/40" />
              </Link>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="p-3 space-y-0.5">
            <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-sm font-medium">
              <Home className="w-5 h-5" />
              Home
            </a>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 text-sm font-medium">
              <LayoutGrid className="w-5 h-5" />
              Templates
              <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
            </div>
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-sm font-medium">
              <Layers className="w-5 h-5" />
              Admin Panel
            </Link>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-sm font-medium">
              <BarChart3 className="w-5 h-5" />
              Analytics
            </div>
          </nav>

          {/* TEMPLATES SECTION */}
          <div className="px-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-white/30">TEMPLATES</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/40">Show Accounts</span>
                <button
                  onClick={() => setShowAccounts(!showAccounts)}
                  className={`w-8 h-4 rounded-full transition-all ${showAccounts ? 'bg-blue-500' : 'bg-white/10'}`}
                >
                  <div className={`w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${showAccounts ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            {/* SEARCH */}
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search banks, e.g. Deutsche Bank..."
                className="w-full pl-7 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:bg-white/10 transition"
              />
            </div>

            {/* COUNTRY FILTERS */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                onClick={() => setSelectedCountryFilter(null)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  !selectedCountryFilter
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/50'
                }`}
              >
                All
              </button>
              {countries.map(c => (
                <button
                  key={c.country}
                  onClick={() => setSelectedCountryFilter(selectedCountryFilter === c.country ? null : c.country)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    selectedCountryFilter === c.country
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/50'
                  }`}
                >
                  <span className="text-xs">{c.flag}</span>
                  {c.country}
                </button>
              ))}
            </div>

            {/* COUNTRY GROUPS */}
            <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
              {filteredGroups.map(group => {
                const isExpanded = expandedCountries[group.country] ?? true
                const color = getBankColor(group.country.charAt(0))

                return (
                  <div key={group.country}>
                    {/* COUNTRY HEADER */}
                    <button
                      onClick={() => toggleCountry(group.country)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-white/[0.06] to-white/[0.02] rounded-xl hover:from-white/[0.08] hover:to-white/[0.04] transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{group.flag}</span>
                        <span className="text-sm font-semibold text-white/80">{group.country}</span>
                        <span className="text-[10px] text-white/25 font-medium">({group.templates.length})</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-white/20 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {/* BANK LIST */}
                    {isExpanded && (
                      <div className="mt-1 space-y-0.5 px-1">
                        {group.templates.map(template => {
                          const initial = template.name.charAt(0).toUpperCase()
                          const bankColor = getBankColor(initial)

                          return (
                            <button
                              key={template.id}
                              onClick={() => handleTemplateSelect(template)}
                              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition text-left"
                            >
                              <div
                                className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                                style={{ backgroundColor: bankColor }}
                              >
                                {initial}
                              </div>
                              <span className="text-sm text-white/70 font-medium">{template.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-white/15 ml-auto" />
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* BOTTOM - SIGN IN */}
          <div className="p-3 mt-auto border-t border-white/10">
            {userId ? (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-sm font-medium"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-sm font-medium"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* MAIN CONTENT - BLURRED BG */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}
