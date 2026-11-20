import { Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  ChevronRight,
  Star,
  Users,
  Smartphone,
  Lock,
  PieChart,
} from 'lucide-react'

const FEATURES = [
  { icon: Globe, title: '30+ Bank Templates', desc: 'From 8+ countries with authentic branding' },
  { icon: Zap, title: 'Instant Setup', desc: 'Create a working bank account in seconds' },
  { icon: Shield, title: 'Full Dashboard', desc: 'Transactions, transfers, cards & more' },
  { icon: Smartphone, title: 'Mobile Friendly', desc: 'Looks perfect on any device' },
  { icon: Lock, title: 'Secure Login', desc: 'Per-account authentication system' },
  { icon: PieChart, title: 'Admin Panel', desc: 'Manage and fund accounts from anywhere' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-medium mb-6">
                <Zap className="w-3.5 h-3.5" />
                30+ Bank Templates — 8 Countries
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Create Your
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Fake Bank </span>
                Account Instantly
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Choose from 30+ realistic bank templates from Germany, Australia, USA, France, Italy, UK & Canada. Customize, set your balance, and get a fully functional banking dashboard.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/templates" className="bank-btn-primary text-base px-7 py-3 flex items-center gap-2">
                  Browse Templates <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/admin" className="bank-btn-secondary text-base px-7 py-3">
                  Admin Panel
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>2,800+ accounts created</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>4.9/5 rating</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <div className="flex-1 ml-2 bg-white rounded px-3 py-1 text-xs text-gray-400 font-mono">
                    your-bank-secure.com/dashboard
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Deutsche Bank</div>
                      <div className="text-xs text-gray-400">Personal Account</div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 mb-3">
                    <div className="text-xs text-blue-600 mb-1">Available Balance</div>
                    <div className="text-2xl font-bold text-blue-700">€47,832.50</div>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-400">Transfers</div>
                      <div className="text-xs font-bold text-gray-700">Send</div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-400">Cards</div>
                      <div className="text-xs font-bold text-gray-700">Manage</div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-400">Statements</div>
                      <div className="text-xs font-bold text-gray-700">View</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Incoming</span>
                      <span className="font-mono text-gray-900">+€2,450.00</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Outgoing</span>
                      <span className="font-mono text-gray-900">-€380.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-400/20 rounded-full blur-xl" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-500">A complete fake banking experience</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(feature => (
              <div key={feature.title} className="group p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-all duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-lg text-gray-500">Three simple steps to your fake bank account</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose a Template', desc: 'Browse our 30+ authentic bank templates from around the world' },
              { step: '02', title: 'Customize Your Account', desc: 'Set your name, balance, currency and make it yours' },
              { step: '03', title: 'Go Live', desc: 'Your fully functional fake bank is ready to use' },
            ].map(item => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-blue-100 mb-2">0{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">MultiBank</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">Templates</a>
              <a href="#" className="hover:text-white transition">Features</a>
              <a href="/admin" className="hover:text-white transition">Admin</a>
              <a href="#" className="hover:text-white transition">About</a>
            </div>
            <div className="text-sm text-gray-400">
              © 2026 MultiBank. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
