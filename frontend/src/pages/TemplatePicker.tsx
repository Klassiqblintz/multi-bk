import { useNavigate } from 'react-router-dom'
import { ArrowLeft, LayoutGrid, Search, ChevronRight } from 'lucide-react'
import { BANK_TEMPLATES, getCountries } from '../lib/bankTemplates'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const COUNTRIES = getCountries()
const COUNTRY_ICONS: Record<string, string> = {
  'Germany': '🇩🇪', 'Australia': '🇦🇺', 'USA': '🇺🇸',
  'France': '🇫🇷', 'Italy': '🇮🇹', 'UK': '🇬🇧',
  'Canada': '🇨🇦', 'Japan': '🇯🇵',
}

export default function TemplatePicker() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.336 4A9.968 9.968 0 0012 2c-4.97 0-9.969 4.03-9.969 9.998 0 4.97 4.03 9.999 9.999 10 4.97 0 9.999-4.03 9.999-9.999" />
          </svg>
        </div>
      </div>
    )
  }

  if (!user) return null

  const filtered = BANK_TEMPLATES.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.country.toLowerCase().includes(search.toLowerCase())
    const matchCountry = !selectedCountry || t.country === selectedCountry
    return matchSearch && matchCountry
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-6">
          <a href="/" className="text-gray-400 hover:text-gray-600 inline-flex items-center gap-1.5 text-sm mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </a>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Browse Bank Templates</h1>
          <p className="text-sm text-gray-500">Choose a bank template to create your account</p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search banks by name or country..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCountry(null)}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition ${
                !selectedCountry ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              All Countries
            </button>
            {COUNTRIES.map(country => (
              <button
                key={country}
                onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition ${
                  selectedCountry === country
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <span>{COUNTRY_ICONS[country] || '🌍'}</span>
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* TEMPLATE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(template => (
            <a
              key={template.id}
              href={`/create?template=${template.id}`}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div
                className="h-24 flex items-center justify-center px-4 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${template.primaryColor}15, ${template.secondaryColor || template.primaryColor}25)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                <div className="relative flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: template.primaryColor }}
                  >
                    {template.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{template.name}</div>
                    <div className="text-xs text-gray-400">{COUNTRY_ICONS[template.country] || ''} {template.country} · {template.currency}</div>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400 italic mb-2">{template.tagline}</p>
                <div className="text-xs font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1.5">
                  Create Account <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No templates found</h3>
            <p className="text-sm text-gray-500">Try a different search term or country filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
