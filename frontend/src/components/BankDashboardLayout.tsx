import {
  ArrowRightLeft,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Send,
  Check,
  PiggyBank,
  Filter,
  X,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Star,
  Users,
  Activity,
  Clock,
  AlertCircle,
} from 'lucide-react'

interface BankDashboardLayoutProps {
  account: any
  activeTab: string
  setActiveTab: (tab: 'home' | 'transfer' | 'cards' | 'statements' | 'settings') => void
  showBalance: boolean
  setShowBalance: (v: boolean) => void
  showAddFunds: boolean
  setShowAddFunds: (v: boolean) => void
  addAmount: string
  setAddAmount: (v: string) => void
  handleAddFunds: () => void
  handleTransfer: () => void
  transferForm: any
  setTransferForm: (v: any) => void
  transferSuccess: boolean
  transferToSelf: boolean
  setTransferToSelf: (v: boolean) => void
  targetAccountId: string
  setTargetAccountId: (v: string) => void
  otherAccounts: any[]
  cardFrozen: boolean
  setCardFrozen: (v: boolean) => void
  cardPin: string
  setCardPin: (v: string) => void
  showCardMenu: string | null
  setShowCardMenu: (v: string | null) => void
  txnFilter: 'all' | 'credit' | 'debit'
  setTxnFilter: (v: 'all' | 'credit' | 'debit') => void
  txnSearch: string
  setTxnSearch: (v: string) => void
  filteredTxns: any[]
  spendingCategories: any[]
  savingsGoals: any[]
  showSavingsGoals: boolean
  setShowSavingsGoals: (v: boolean) => void
  accountType: string
  setAccountType: (v: string) => void
  onLogout: () => void
  selectedTxn: any
  setSelectedTxn: (v: any) => void
  showTxnDetails: boolean
  setShowTxnDetails: (v: boolean) => void
  exportCsv: () => void
}

export default function BankDashboardLayout({
  account,
  activeTab,
  setActiveTab,
  showBalance,
  setShowBalance,
  showAddFunds,
  setShowAddFunds,
  addAmount,
  setAddAmount,
  handleAddFunds,
  handleTransfer,
  transferForm,
  setTransferForm,
  transferSuccess,
  transferToSelf,
  setTransferToSelf,
  targetAccountId,
  setTargetAccountId,
  otherAccounts,
  cardFrozen,
  setCardFrozen,
  cardPin,
  setCardPin,
  showCardMenu,
  setShowCardMenu,
  txnFilter,
  setTxnFilter,
  txnSearch,
  setTxnSearch,
  filteredTxns,
  spendingCategories,
  savingsGoals,
  showSavingsGoals,
  setShowSavingsGoals,
  accountType,
  setAccountType,
  onLogout,
  selectedTxn,
  setSelectedTxn,
  showTxnDetails,
  setShowTxnDetails,
  exportCsv,
}: BankDashboardLayoutProps) {
  const headerStyle = account.headerStyle || 'colored'
  const balanceStyle = account.balanceStyle || 'prominent'
  const txnStyle = account.txnStyle || 'list'
  const cardLayout = account.cardLayout || 'single'
  const accentColor = account.accentColor || account.primaryColor
  const borderRadius = account.borderRadius || 'md'
  const showQuickActions = account.showQuickActions !== false
  const showSavingsGoalsOption = account.showSavingsGoals !== false
  const layoutType = account.layoutType || 'modern'

  // Dynamic text colors based on header style
  const isDarkHeader = headerStyle === 'colored' || headerStyle === 'gradient'
  const textColor = isDarkHeader ? 'white' : 'gray-900'
  const subTextColor = isDarkHeader ? 'white/60' : 'gray-500'

  // Header background
  const headerBg = headerStyle === 'colored'
    ? `linear-gradient(135deg, ${account.primaryColor}, ${account.secondaryColor || account.primaryColor})`
    : headerStyle === 'gradient'
      ? `linear-gradient(135deg, ${account.primaryColor}10, ${account.secondaryColor || account.primaryColor}20)`
      : headerStyle === 'minimal'
        ? '#FFFFFF'
        : account.primaryColor

  // Border radius classes
  const radiusMap: Record<string, string> = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  }
  const radiusClass = radiusMap[borderRadius] || 'rounded-lg'

  // Header height and style variations
  const isMinimal = layoutType === 'minimal'
  const isClassic = layoutType === 'classic'
  const isModern = layoutType === 'modern'

  // Transaction amount formatting based on currency
  const formatAmount = (amount: string) => {
    const num = parseFloat(amount)
    if (account.currency === 'JPY') return num.toLocaleString()
    return `${num < 0 ? '-' : ''}${Math.abs(num).toLocaleString()}`
  }

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (account.countryCode === 'JP') {
      if (hour < 12) return `${account.accountHolder}さん、おはようございます`
      if (hour < 18) return `${account.accountHolder}さん、こんにちは`
      return `${account.accountHolder}さん、こんばんは`
    }
    if (['DE', 'FR', 'IT'].includes(account.countryCode)) {
      if (hour < 12) return `Guten Tag, ${account.accountHolder}`
      if (hour < 18) return `Guten Tag, ${account.accountHolder}`
      return `Guten Abend, ${account.accountHolder}`
    }
    if (hour < 12) return `Good morning, ${account.accountHolder}`
    if (hour < 18) return `Good afternoon, ${account.accountHolder}`
    return `Good evening, ${account.accountHolder}`
  }

  const greeting = getGreeting()

  // Currency-specific label styles
  const currencyLabel: Record<string, string> = {
    EUR: 'EUR',
    USD: 'USD',
    GBP: 'GBP',
    AUD: 'AUD',
    CAD: 'CAD',
    JPY: 'JPY',
  }

  // Transaction list rendering based on txnStyle
  const renderTransaction = (txn: any, index: number) => {
    const isCredit = txn.type === 'credit'
    const amountStr = formatAmount(txn.amount)

    if (txnStyle === 'compact') {
      // Compact: minimal info, just the essentials
      return (
        <button
          key={txn.id}
          onClick={() => { setSelectedTxn(txn); setShowTxnDetails(true) }}
          className={`w-full flex items-center justify-between py-1.5 cursor-pointer ${
            index < filteredTxns.length - 1 ? 'border-b border-gray-50' : ''
          } hover:bg-gray-50 -mx-2 px-2 rounded`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${
              isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
            }`}>
              {isCredit ? '↑' : '↓'}
            </div>
            <div>
              <div className="text-xs font-medium text-gray-700">{txn.description}</div>
              <div className="text-[10px] text-gray-400">{txn.date}</div>
            </div>
          </div>
          <span className={`text-xs font-bold ${
            isCredit ? 'text-green-600' : 'text-red-500'
          }`}>
            {isCredit ? '+' : '-'}{account.symbol}{amountStr}
          </span>
        </button>
      )
    }

    if (txnStyle === 'detailed') {
      // Detailed: full info with category and status
      return (
        <button
          key={txn.id}
          onClick={() => { setSelectedTxn(txn); setShowTxnDetails(true) }}
          className={`w-full text-left py-3 border-b border-gray-100 last:border-0 cursor-pointer -mx-2 px-2 rounded hover:bg-gray-50 transition ${
            txn.status === 'pending' ? 'bg-yellow-50/50' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isCredit ? 'bg-green-50' : 'bg-red-50'
              }`}>
                {isCredit ? (
                  <ArrowUpRight className="w-5 h-5 text-green-500" />
                ) : (
                  <ArrowDownLeft className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900">{txn.description}</div>
                <div className="text-xs text-gray-400 mt-1">{txn.date} · {txn.status}</div>
                <div className="text-[10px] text-gray-300 mt-1">
                  {txn.counterparty || 'Unknown'} · Ref #{txn.id?.slice(-6) || ''}
                </div>
              </div>
            </div>
            <div className="text-right ml-2">
              <div className={`text-base font-bold ${
                isCredit ? 'text-green-600' : 'text-red-500'
              }`}>
                {isCredit ? '+' : '-'}{account.symbol}{amountStr}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                {currencyLabel[account.currency] || ''}
              </div>
            </div>
          </div>
        </button>
      )
    }

    // Default list style
    return (
      <button
        key={txn.id}
        onClick={() => { setSelectedTxn(txn); setShowTxnDetails(true) }}
        className="w-full flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 cursor-pointer -mx-2 px-2 rounded hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            isCredit ? 'bg-green-50' : 'bg-red-50'
          }`}>
            {isCredit ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownLeft className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{txn.description}</div>
            <div className="text-xs text-gray-400">{txn.date} · {txn.status}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-bold ${
            isCredit ? 'text-green-600' : 'text-red-500'
          }`}>
            {isCredit ? '+' : '-'}{account.symbol}{amountStr}
          </div>
          <div className="text-[10px] text-gray-400">{currencyLabel[account.currency] || ''}</div>
        </div>
      </button>
    )
  }

  return (
    <div className="min-h-screen" style={{
      backgroundColor: headerStyle === 'minimal' || isMinimal ? '#F9FAFB' : headerStyle === 'gradient' ? `${account.primaryColor}05` : '#F3F4F6',
    }}>
      {/* HEADER - varies by bank template */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: headerBg,
          borderColor: isDarkHeader ? `${account.primaryColor}30` : '#E5E7EB',
        }}
      >
        <div className={`flex items-center justify-between px-4 sm:px-6 h-14 ${
          isMinimal ? 'border-b border-gray-100' : ''
        }`} style={{
          backgroundColor: headerStyle === 'minimal' ? '#FFFFFF' : undefined,
        }}>
          {/* Left section - bank branding */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{
                backgroundColor: headerStyle === 'minimal' ? accentColor + '20' : isDarkHeader ? 'rgba(255,255,255,0.2)' : accentColor,
                color: headerStyle === 'minimal' ? accentColor : undefined,
              }}
            >
              {account.templateName.charAt(0)}
            </div>
            <span className={`text-sm font-semibold ${textColor}`}>{account.templateName}</span>
            {!isMinimal && (
              <span className="text-xs text-white/50 hidden sm:inline">|</span>
            )}
            <span className={`text-xs ${subTextColor} hidden sm:inline`}>{account.accountHolder}</span>
          </div>

          {/* Right - action buttons */}
          <div className="flex items-center gap-1">
            <button onClick={() => setShowBalance(!showBalance)} className={`p-1.5 rounded transition ${
              isDarkHeader ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`} title="Toggle balance">
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button onClick={() => setShowAddFunds(!showAddFunds)} className={`p-1.5 rounded transition ${
              isDarkHeader ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`} title="Add funds">
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={onLogout} className={`p-1.5 rounded transition ${
              isDarkHeader ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`} title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Greeting - only for modern/classic layouts */}
        {showQuickActions && !isMinimal && (
          <div className="mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{greeting}</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome to your {account.templateName} dashboard</p>
          </div>
        )}

        {/* TABS */}
        <div className={`flex gap-1 mb-6 ${
          isMinimal ? 'bg-transparent p-0 border-none' : 'bg-white rounded-xl p-1 border border-gray-100'
        } max-w-fit`}>
          {[
            { id: 'home' as const, label: 'Home', icon: '🏠' },
            { id: 'transfer' as const, label: 'Transfer', icon: '↗️' },
            { id: 'cards' as const, label: 'Cards', icon: '💳' },
            { id: 'statements' as const, label: 'Statements', icon: '📄' },
            { id: 'settings' as const, label: 'Settings', icon: '⚙️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all ${
                isMinimal
                  ? activeTab === tab.id
                    ? 'text-white rounded'
                    : 'text-gray-400 hover:text-gray-600'
                  : activeTab === tab.id
                    ? `${radiusClass} bg-gray-100 text-gray-900`
                    : 'text-gray-400 hover:text-gray-600'
              }`}
              style={activeTab === tab.id && !isMinimal ? { backgroundColor: '#F3F4F6' } : activeTab === tab.id && isMinimal ? { backgroundColor: account.primaryColor, color: 'white', borderRadius: borderRadius === 'xl' ? '0.75rem' : undefined } : undefined}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ADD FUNDS */}
        {showAddFunds && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm font-medium text-green-800">Add Funds:</span>
              <span className="text-sm text-green-600">{account.symbol}</span>
              <input
                type="number"
                value={addAmount}
                onChange={e => setAddAmount(e.target.value)}
                placeholder="Amount"
                className="w-28 px-2 py-1.5 bg-white border border-green-200 rounded text-sm text-green-800 focus:outline-none focus:border-green-400"
              />
              <button onClick={handleAddFunds} className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700">
                Add Funds
              </button>
              <button onClick={() => setShowAddFunds(false)} className="text-green-400 hover:text-green-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-green-500">
              Current: {account.symbol}{account.balance.toLocaleString()}
            </div>
          </div>
        )}

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* BALANCE CARD - varies per bank */}
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: borderRadius === 'xl' ? '1rem' : borderRadius === 'lg' ? '0.75rem' : borderRadius === 'md' ? '0.5rem' : borderRadius === 'sm' ? '0.125rem' : '0rem',
              }}
            >
              <div
                className={`p-6 sm:p-8 text-white relative overflow-hidden ${
                  balanceStyle === 'prominent' ? 'min-h-[200px]' :
                  balanceStyle === 'compact' ? 'min-h-[100px]' : 'min-h-[160px]'
                }`}
                style={{
                  background: headerStyle === 'minimal'
                    ? `linear-gradient(135deg, ${account.primaryColor}08, ${accentColor}15)`
                    : headerStyle === 'gradient'
                      ? `linear-gradient(135deg, ${account.primaryColor}, ${account.secondaryColor || account.primaryColor})`
                      : `linear-gradient(135deg, ${account.primaryColor}, ${account.secondaryColor || account.primaryColor})`,
                }}
              >
                {/* Decorative circles */}
                {headerStyle !== 'minimal' && (
                  <>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                  </>
                )}

                <div className="relative">
                  {/* Bank name header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm opacity-60 font-medium">{account.templateName}</div>
                      <div className="text-xs opacity-40">Personal Account</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="text-xs text-white/40">{currencyLabel[account.currency] || ''}</div>
                      <button onClick={() => setShowBalance(!showBalance)} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition">
                        {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Balance - varies by balanceStyle */}
                  {balanceStyle === 'prominent' && (
                    <div className="mb-6">
                      <div className="text-sm opacity-60 mb-2">Available Balance</div>
                      <div className="text-4xl sm:text-5xl font-bold tracking-tight">
                        {account.symbol}{showBalance ? account.balance.toLocaleString() : '••••••'}
                        {showBalance && '.00'}
                      </div>
                    </div>
                  )}

                  {balanceStyle === 'compact' && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-4 h-4 opacity-60" />
                        <span className="text-xs opacity-60">Balance</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {account.symbol}{showBalance ? account.balance.toLocaleString() : '••••'}
                        {showBalance && '.00'}
                      </div>
                    </div>
                  )}

                  {balanceStyle === 'detailed' && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider opacity-40 mb-1">Available</div>
                          <div className="text-xl font-bold">
                            {account.symbol}{showBalance ? account.balance.toLocaleString() : '••••••'}
                            {showBalance && '.00'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider opacity-40 mb-1">Income (30d)</div>
                          <div className="text-lg font-bold text-green-300">+24,500</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider opacity-40 mb-1">Spent (30d)</div>
                          <div className="text-lg font-bold text-red-300">3,280</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider opacity-40 mb-1">Savings</div>
                          <div className="text-lg font-bold text-yellow-300">18,219</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick actions - varies per bank config */}
                  {showQuickActions && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button onClick={() => setActiveTab('transfer')} className="flex items-center gap-1.5 px-4 py-2 bg-white/15 rounded-lg text-sm font-medium hover:bg-white/25 transition">
                        <ArrowRightLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Transfer</span>
                      </button>
                      <button onClick={() => setActiveTab('cards')} className="flex items-center gap-1.5 px-4 py-2 bg-white/15 rounded-lg text-sm font-medium hover:bg-white/25 transition">
                        <CreditCard className="w-4 h-4" />
                        <span className="hidden sm:inline">Cards</span>
                      </button>
                      <button onClick={() => setActiveTab('statements')} className="flex items-center gap-1.5 px-4 py-2 bg-white/15 rounded-lg text-sm font-medium hover:bg-white/25 transition">
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">Statements</span>
                      </button>
                      <button onClick={() => setActiveTab('settings')} className="flex items-center gap-1.5 px-4 py-2 bg-white/15 rounded-lg text-sm font-medium hover:bg-white/25 transition">
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Settings</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${
              isMinimal ? 'gap-2' : 'gap-3'
            }`}>
              <div className={`${isMinimal ? 'p-2' : 'p-3'} bg-white rounded-xl border border-gray-100`}>
                <div className={`flex items-center gap-1.5 mb-1.5`}>
                  <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                  <div className="text-xs text-gray-500">Income</div>
                </div>
                <div className="text-sm font-bold text-green-600">+{account.symbol}24,500</div>
              </div>
              <div className={`${isMinimal ? 'p-2' : 'p-3'} bg-white rounded-xl border border-gray-100`}>
                <div className={`flex items-center gap-1.5 mb-1.5`}>
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                  <div className="text-xs text-gray-500">Expenses</div>
                </div>
                <div className="text-sm font-bold text-red-500">-{account.symbol}3,280</div>
              </div>
              <div className={`${isMinimal ? 'p-2' : 'p-3'} bg-white rounded-xl border border-gray-100`}>
                <div className={`flex items-center gap-1.5 mb-1.5`}>
                  <PiggyBank className="w-3.5 h-3.5 text-blue-500" />
                  <div className="text-xs text-gray-500">Savings</div>
                </div>
                <div className="text-sm font-bold text-blue-600">{account.symbol}18,219</div>
              </div>
              <div className={`${isMinimal ? 'p-2' : 'p-3'} bg-white rounded-xl border border-gray-100`}>
                <div className={`flex items-center gap-1.5 mb-1.5`}>
                  <CreditCard className="w-3.5 h-3.5 text-purple-500" />
                  <div className="text-xs text-gray-500">Cards</div>
                </div>
                <div className="text-sm font-bold text-gray-700">2 Active</div>
              </div>
            </div>

            {/* ACCOUNT INFO + SAVINGS GOALS */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Account Details */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Account Holder</span>
                    <span className="font-medium">{account.accountHolder}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Account Number</span>
                    <span className="font-mono font-medium">•••• {account.id.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">IBAN / Account</span>
                    <span className="font-mono font-medium text-xs">{account.countryCode}12 3456 7890 1234 5678 90</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">SWIFT / BIC</span>
                    <span className="font-mono font-medium text-xs">{account.countryCode}DE10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Currency</span>
                    <span className="font-medium">{account.currency} ({account.symbol})</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-500 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Savings Goals (if enabled for this bank) */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <PiggyBank className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-semibold text-gray-900">Savings Goals</h3>
                  </div>
                  <button onClick={() => setShowSavingsGoals(!showSavingsGoals)} className="text-xs text-blue-600 hover:underline">
                    {showSavingsGoals ? 'Hide' : 'Show'}
                  </button>
                </div>
                {showSavingsGoals && savingsGoals.length > 0 && (
                  <div className="space-y-3">
                    {savingsGoals.map((goal: any) => (
                      <div key={goal.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <PiggyBank className="w-3.5 h-3.5 text-gray-400" />
                            <div className="text-xs font-medium text-gray-700">{goal.name}</div>
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {Math.round((goal.current / goal.target) * 100)}%
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%`, backgroundColor: goal.color }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                          <span>{account.symbol}{goal.current.toLocaleString()}</span>
                          <span>{account.symbol}{goal.target.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-2 text-xs font-medium text-blue-600 hover:text-blue-700 border border-dashed border-blue-200 rounded-lg hover:bg-blue-50 transition">
                      + Add Savings Goal
                    </button>
                  </div>
                )}
                {showSavingsGoals && savingsGoals.length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    <PiggyBank className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
                    <div className="text-xs">No savings goals yet</div>
                    <button className="text-xs text-blue-600 hover:underline mt-1">Create one</button>
                  </div>
                )}
              </div>
            </div>

            {/* TRANSACTIONS - layout varies per txnStyle config */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Transaction History</h3>
                <button
                  onClick={exportCsv}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>

              {/* FILTERS */}
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1 sm:flex-none">
                  <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={txnSearch}
                    onChange={e => setTxnSearch(e.target.value)}
                    className="w-full sm:w-48 pl-7 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-1">
                  {(['all', 'credit', 'debit'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setTxnFilter(filter)}
                      className={`px-2.5 py-1.5 rounded text-xs font-medium transition ${
                        txnFilter === filter
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {filter === 'all' ? 'All' : filter === 'credit' ? 'Income' : 'Expense'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction list */}
              {filteredTxns.length > 0 ? (
                <div className="space-y-0">
                  {filteredTxns.map((txn: any, index: number) => renderTransaction(txn, index))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Activity className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
                  <div className="text-sm">No transactions found</div>
                  <div className="text-xs mt-1">Try adjusting your filters</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TRANSFER TAB */}
        {activeTab === 'transfer' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-gray-900">Transfer Money</h3>
                <button
                  onClick={() => setTransferToSelf(!transferToSelf)}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition ${
                    transferToSelf
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {transferToSelf ? 'Send to anyone' : 'Transfer to my account'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                {transferToSelf ? 'Send money between your own accounts' : 'Send money to anyone, anywhere'}
              </p>
              <div className="space-y-4">
                {transferToSelf ? (
                  // TRANSFER TO MY ACCOUNT
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">From</label>
                    <div className="px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700 font-medium">
                      {account.templateName} · {account.symbol}{account.balance.toLocaleString()}.00
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Recipient Name</label>
                    <input
                      type="text"
                      value={transferForm.recipient}
                      onChange={e => setTransferForm({...transferForm, recipient: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Full name of recipient"
                    />
                  </div>
                )}
                {transferToSelf ? (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">To (Select Account)</label>
                    <select
                      value={targetAccountId}
                      onChange={e => setTargetAccountId(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="">Select a destination account...</option>
                      {otherAccounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.templateName} ({acc.accountHolder}) · {acc.symbol}{acc.balance.toLocaleString()}.00
                        </option>
                      ))}
                    </select>
                    {otherAccounts.length === 0 && (
                      <p className="text-xs text-gray-400 mt-1">Create more accounts to enable transfers between them</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Account / IBAN</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder={account.countryCode === 'JP' ? '0000 0000 0000' : `${account.countryCode}12 3456 7890 1234 5678 90`}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Amount ({account.symbol})</label>
                  <input
                    type="number"
                    value={transferForm.amount}
                    onChange={e => setTransferForm({...transferForm, amount: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="0.00"
                  />
                  <div className="text-xs text-gray-400 mt-1">Available: {account.symbol}{account.balance.toLocaleString()}.00</div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes (optional)</label>
                  <input
                    type="text"
                    value={transferForm.notes}
                    onChange={e => setTransferForm({...transferForm, notes: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Payment reference"
                  />
                </div>

                {transferSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-700 font-medium">Transfer completed successfully!</span>
                  </div>
                )}

                <button
                  onClick={handleTransfer}
                  disabled={!transferForm.amount || (transferToSelf ? !targetAccountId : !transferForm.recipient)}
                  className="w-full text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: account.primaryColor }}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Send className="w-4 h-4" /> {transferToSelf ? 'Transfer Now' : 'Send Transfer'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CARDS TAB */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Your Cards</h2>
                <p className="text-xs text-gray-500 mt-1">Manage your debit and credit cards</p>
              </div>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-medium hover:bg-gray-100">
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            </div>

            {/* CARD - varies by cardLayout config */}
            {cardLayout === 'multiple' ? (
              <>
                {/* Multiple cards view */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Primary Card', number: '•••• •••• •••• 4242', type: 'Visa' },
                    { name: 'Credit Card', number: '•••• •••• •••• 8888', type: 'Mastercard' },
                    ...(account.accountTypes && account.accountTypes.length > 0 ? [{ name: 'Savings Card', number: '•••• •••• •••• 1234', type: account.templateName }] : []),
                  ].map((card, idx) => (
                    <div
                      key={idx}
                      className="text-white relative overflow-hidden"
                      style={{
                        borderRadius: borderRadius === 'xl' ? '1rem' : borderRadius === 'lg' ? '0.75rem' : undefined,
                        background: idx === 0
                          ? `linear-gradient(135deg, ${account.primaryColor}, ${account.secondaryColor || account.primaryColor})`
                          : `linear-gradient(135deg, ${accentColor}, ${account.primaryColor})`,
                      }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="p-5">
                        <div className="text-xs text-white/60 mb-4">{card.name}</div>
                        <div className="w-8 h-5 bg-yellow-300/80 rounded mb-4" />
                        <div className="text-sm font-mono tracking-wider mb-3">{card.number}</div>
                        <div className="flex justify-between text-xs text-white/50">
                          <span>EXPIRES 12/28</span>
                          <span>{card.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Single card view */
              <div className="w-full max-w-md">
                <div
                  className="text-white relative overflow-hidden"
                  style={{
                    borderRadius: borderRadius === 'xl' ? '1rem' : borderRadius === 'lg' ? '0.75rem' : borderRadius === 'md' ? '0.5rem' : undefined,
                    background: `linear-gradient(135deg, ${account.primaryColor}, ${account.secondaryColor || account.primaryColor})`,
                    aspectRatio: '1.586/1',
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{account.templateName}</div>
                      <div className="text-xs text-white/60">Debit Card</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-yellow-300/80 rounded" />
                    </div>
                    <div>
                      <div className="text-lg font-mono tracking-wider mb-1">
                        •••• •••• •••• ••••
                      </div>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>VALID THRU 12/28</span>
                        <span>{account.accountHolder.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-white/40">VISA</div>
                  </div>
                </div>
              </div>
            )}

            {/* Card Controls */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 max-w-md">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Card Controls</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {cardFrozen ? <ShieldAlert className="w-4 h-4 text-red-500" /> : <ShieldCheck className="w-4 h-4 text-green-500" />}
                    <span className="text-sm text-gray-700">{cardFrozen ? 'Card Frozen' : 'Card Active'}</span>
                  </div>
                  <button
                    onClick={() => setCardFrozen(!cardFrozen)}
                    className="px-3 py-1.5 rounded text-xs font-medium transition-all"
                    style={{ backgroundColor: cardFrozen ? account.primaryColor : '#F3F4F6', color: cardFrozen ? 'white' : '#374151' }}
                  >
                    {cardFrozen ? 'Unfreeze' : 'Freeze'}
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Card PIN</label>
                  <input
                    type="text"
                    value={cardPin}
                    onChange={e => setCardPin(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm"
                    maxLength={4}
                    placeholder="••••"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm text-gray-700">Online Payments</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-8 h-4 bg-gray-200 rounded-full peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-colors"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Contactless Payments</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-8 h-4 bg-gray-200 rounded-full peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-colors"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATEMENTS TAB */}
        {activeTab === 'statements' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Statements</h2>
              <p className="text-xs text-gray-500 mt-1">Download your account statements</p>
            </div>
            {['November 2024', 'October 2024', 'September 2024', 'August 2024', 'July 2024', 'June 2024'].map((month, i) => (
              <div key={month} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{month}</div>
                    <div className="text-xs text-gray-400">PDF · {(2 + i * 0.5).toFixed(1)} MB</div>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Settings</h2>
              <p className="text-xs text-gray-500 mt-1">Manage your account preferences</p>
            </div>

            {/* Account Type Selection */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Type</h3>
              <div className="space-y-2">
                {account.accountTypes && account.accountTypes.length > 0 ? (
                  account.accountTypes.map((type: string) => (
                    <button
                      key={type}
                      onClick={() => setAccountType(type)}
                      className={`w-full px-3 py-2.5 rounded text-left text-sm transition-all ${
                        accountType === type
                          ? 'border-2 font-medium'
                          : 'border border-gray-200 hover:border-gray-300'
                      }`}
                      style={accountType === type ? { borderColor: account.primaryColor, backgroundColor: account.primaryColor + '10' } : {}}
                    >
                      <div className="font-medium">{type}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {type.includes('Savings') ? 'Earn interest on your deposits' : type.includes('Checking') || type.includes('Chequing') ? 'Daily spending and transfers' : type.includes('Investment') || type.includes('Investment') ? 'Grow your wealth over time' : 'Standard account features'}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-gray-400">No account types available</div>
                )}
              </div>
            </div>

            {/* Profile */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Name</label>
                  <input type="text" defaultValue={account.accountHolder} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                  <input type="email" defaultValue="user@example.com" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone</label>
                  <input type="tel" defaultValue="+1 234 567 890" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Security</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Two-Factor Authentication</div>
                    <div className="text-xs text-gray-400">Extra security for your account</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-8 h-4 bg-gray-200 rounded-full peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-colors"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Biometric Login</div>
                    <div className="text-xs text-gray-400">Use fingerprint or face ID</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-8 h-4 bg-gray-200 rounded-full peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-colors"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 text-white font-medium py-2.5 rounded-lg transition-all" style={{ backgroundColor: account.primaryColor }}>Save Changes</button>
              <button className="flex-1 bg-red-50 border border-red-200 text-red-600 font-medium py-2.5 rounded-lg hover:bg-red-100 transition-all">Delete Account</button>
            </div>
          </div>
        )}

        {/* TRANSACTION DETAILS MODAL */}
        {showTxnDetails && selectedTxn && (
          <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowTxnDetails(false)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Transaction Details</h3>
                <button
                  onClick={() => setShowTxnDetails(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedTxn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {selectedTxn.type === 'credit' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{selectedTxn.description || 'Transaction'}</div>
                    <div className="text-xs text-gray-400">{selectedTxn.type === 'credit' ? 'Credit' : 'Debit'} Transaction</div>
                  </div>
                  <div className={`text-base font-bold ${
                    selectedTxn.type === 'credit' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {selectedTxn.type === 'credit' ? '+' : '-'}{account.symbol}{selectedTxn.amount}
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Date</span>
                    <span className="font-medium">{selectedTxn.date || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-medium ${
                      selectedTxn.status === 'completed' ? 'text-green-600' :
                      selectedTxn.status === 'pending' ? 'text-yellow-600' : 'text-red-500'
                    }`}>
                      {selectedTxn.status || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Counterparty</span>
                    <span className="font-medium text-right max-w-[60%] truncate">{selectedTxn.counterparty || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Reference</span>
                    <span className="font-mono text-xs text-gray-500">{selectedTxn.id?.slice(-8) || 'N/A'}</span>
                  </div>
                  {selectedTxn.notes && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Notes</span>
                      <span className="text-sm text-gray-700 text-right max-w-[60%] truncate">{selectedTxn.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
