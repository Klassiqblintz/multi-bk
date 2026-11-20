import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X, ChevronRight, ArrowLeft } from 'lucide-react'
import { BANK_TEMPLATES, getCountries, type BankTemplate } from '../lib/bankTemplates'

const COUNTRIES = getCountries()
const COUNTRY_ICONS: Record<string, string> = {
  'Germany': '🇩🇪', 'Australia': '🇦🇺', 'USA': '🇺🇸',
  'France': '🇫🇷', 'Italy': '🇮🇹', 'UK': '🇬🇧',
  'Canada': '🇨🇦', 'Japan': '🇯🇵',
}

export default function TemplatePicker() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const filtered = BANK_TEMPLATES.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.country.toLowerCase().includes(search.toLowerCase())
    const matchCountry = !selectedCountry || t.country === selectedCountry
    return matchSearch && matchCountry
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Choose a Bank Template</h1>
                <p className="text-sm text-gray-500">Select a template or search to find your perfect bank</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search banks by name or country..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Country filters */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCountry(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                !selectedCountry ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Countries
            </button>
            {COUNTRIES.map(country => (
              <button
                key={country}
                onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  selectedCountry === country
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{COUNTRY_ICONS[country] || '🌍'}</span>
                {country}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* TEMPLATE GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">{filtered.length} templates found</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(template => (
            <div
              key={template.id}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              {/* Template header with bank colors */}
              <div
                className="h-32 flex items-center justify-center px-4 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${template.primaryColor}15, ${template.secondaryColor || template.primaryColor}25)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                <div className="relative flex items-center gap-3">
                  <img
                    src={template.logoUrl}
                    alt={template.name}
                    className="w-14 h-14 object-contain rounded-lg bg-white/80 p-1.5"
                    onError={(e) => {
                      const hex = template.primaryColor.replace('#', '')
                      ;(e.target as HTMLImageElement).src = `https://via.placeholder.com/56x56/${hex}/FFFFFF?${encodeURIComponent(template.name.charAt(0))}`
                    }}
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-900">{template.name}</div>
                    <div className="text-xs text-gray-400">{COUNTRY_ICONS[template.country] || ''} {template.country} · {template.currency} ({template.symbol})</div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-400 italic mb-2.5">{template.tagline}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {template.features.map(f => (
                    <span key={f} className="px-1.5 py-0.5 bg-gray-50 text-gray-400 text-xs rounded">{f}</span>
                  ))}
                </div>
                <button
                  onClick={() => navigate(`/create?template=${template.id}`)}
                  className="w-full bank-btn-primary flex items-center justify-center gap-1.5 group-hover:gap-2 transition-all"
                >
                  Create Account <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No templates found</h3>
            <p className="text-sm text-gray-500">Try a different search term or country filter</p>
          </div>
        )}
      </main>
    </div>
  )
}
