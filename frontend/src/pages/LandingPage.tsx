import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Search,
  ChevronRight,
  ChevronDown,
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
  const { userId } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string | null>(null)
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({})

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1528] to-[#0a0f1e] text-white">
      {/* HEADER */}
      <div className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">MB</span>
            </div>
            <div>
              <div className="text-base font-bold">MultiBank</div>
              <div className="text-[10px] text-white/35 font-medium">Global Banking Suite</div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TITLE & SEARCH */}
        <div className="mb-5">
          <h1 className="text-xl font-bold mb-1">Browse Bank Templates</h1>
          <p className="text-sm text-white/40 mb-4">Choose a bank template to create your fake account</p>

          {/* SEARCH */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search banks, e.g. Deutsche Bank..."
              className="w-full pl-7 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:bg-white/10 transition"
            />
          </div>

          {/* COUNTRY FILTERS */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCountryFilter(null)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                !selectedCountryFilter
                  ? 'bg-blue-600 text-white'
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/50'
                }`}
              >
                <span className="text-xs">{c.flag}</span>
                {c.country}
              </button>
            ))}
          </div>
        </div>

        {/* COUNTRY GROUPS */}
        <div className="space-y-1.5">
          {filteredGroups.map(group => {
            const isExpanded = expandedCountries[group.country] ?? true

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
    </div>
  )
}
