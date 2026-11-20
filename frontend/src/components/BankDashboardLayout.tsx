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
  Target,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Filter,
  X,
  ShieldCheck,
  ShieldAlert,
  Trash2,
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
}: BankDashboardLayoutProps) {
  const isModern = account.layoutType === 'modern'
  const isClassic = account.layoutType === 'classic'
  const isMinimal = account.layoutType === 'minimal'
  const headerStyle = account.headerStyle || 'colored'
  const balanceStyle = account.balanceStyle || 'prominent'
  const txnStyle = account.txnStyle || 'list'
  const cardLayout = account.cardLayout || 'single'
  const accentColor = account.accentColor || account.primaryColor
  const borderRadius = account.borderRadius || 'md'
  const showGreeting = account.showGreeting !== false
  const showQuickActions = account.showQuickActions !== false
  const showSavingsGoalsOption = account.showSavingsGoals !== false

  // Border radius classes
  const borderRadiusMap: Record<string, string> = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  }
  const radiusClass = borderRadiusMap[borderRadius] || 'rounded-lg'

  // Header background
  const headerBg = headerStyle === 'colored'
    ? `linear-gradient(135deg, ${account.primaryColor}, ${account.secondaryColor || account.primaryColor})`
    : headerStyle === 'gradient'
      ? `linear-gradient(135deg, ${account.primaryColor}15, ${account.secondaryColor || account.primaryColor}25)`
      : headerStyle === 'minimal'
        ? 'rgba(0,0,0,0.02)'
        : account.primaryColor

  // Balance card style
  const balanceBg = balanceStyle === 'prominent'
    ? `linear-gradient(135deg, ${account.primaryColor}, ${account.secondaryColor || account.primaryColor})`
    : balanceStyle === 'compact'
      ? account.primaryColor + '10'
      : 'white'

  return (
    <div className="min-h-screen" style={{ backgroundColor: headerStyle === 'minimal' ? '#FAFAFA' : '#F3F4F6' }}>
      {/* HEADER */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: headerBg,
          borderColor: headerStyle === 'colored' ? `${account.primaryColor}30` : headerStyle === 'gradient' ? `${account.primaryColor}15` : '#E5E7EB',
        }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-white font-bold text-xs"
              style={{
                backgroundColor: headerStyle === 'minimal' ? account.primaryColor + '20' : 'rgba(255,255,255,0.2)',
              }}
            >
              {account.templateName.charAt(0)}
            </div>
            <span className="text-sm font-semibold text-white">{account.templateName}</span>
            <span className="text-xs text-white/50 hidden sm:inline">|</span>
            <span className="text-xs text-white/50 hidden sm:inline">{account.accountHolder}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowBalance(!showBalance)} className="p-1.5 text-white/70 hover:text-white transition" title="Toggle balance">
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button onClick={() => setShowAddFunds(!showAddFunds)} className="p-1.5 text-white/70 hover:text-white transition" title="Add funds">
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={onLogout} className="p-1.5 text-white/70 hover:text-white transition" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TABS */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-100 max-w-fit">
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
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
            {/* BALANCE CARD */}
            <div
              className="rounded-2xl p-6 text-white relative overflow-hidden"
              style={{
                background: headerStyle === 'minimal' ? 'white' : `linear-gradient(135deg, ${account.primaryColor}, ${account.secondaryColor || account.primaryColor})`,
                color: headerStyle === 'minimal' ? account.primaryColor : 'white',
                borderRadius: borderRadius === 'xl' ? '1rem' : '0.75rem',
              }}
            >
              {headerStyle !== 'minimal' && (
                <>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                </>
              )}
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm opacity-60">{account.templateName}</div>
                    <div className="text-xs opacity-40">Personal Account</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setShowBalance(!showBalance)} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition">
                      {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm opacity-60 mb-1">Available Balance</div>
                  <div className="text-3xl sm:text-4xl font-bold">
                    {account.symbol}{showBalance ? account.balance.toLocaleString() : '••••••'}
                    {showBalance && '.00'}
                  </div>
                </div>

                {/* QUICK ACTIONS */}
                {showQuickActions && (
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setActiveTab('transfer')} className="flex items-center gap-1.5 px-4 py-2 bg-white/15 rounded-lg text-sm font-medium hover:bg-white/25 transition">
                      <ArrowRightLeft className="w-4 h-4" /> Transfer
                    </button>
                    <button onClick={() => setActiveTab('cards')} className="flex items-center gap-1.5 px-4 py-2 bg-white/15 rounded-lg text-sm font-medium hover:bg-white/25 transition">
                      <CreditCard className="w-4 h-4" /> Cards
                    </button>
                    <button onClick={() => setActiveTab('statements')} className="flex items-center gap-1.5 px-4 py-2 bg-white/15 rounded-lg text-sm font-medium hover:bg-white/25 transition">
                      <FileText className="w-4 h-4" /> Statements
                    </button>
                    <button onClick={() => setActiveTab('settings')} className="flex items-center gap-1.5 px-4 py-2 bg-white/15 rounded-lg text-sm font-medium hover:bg-white/25 transition">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Income</div>
                <div className="text-sm font-bold text-green-600">+24,500.00</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Expenses</div>
                <div className="text-sm font-bold text-red-500">-3,280.50</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Savings</div>
                <div className="text-sm font-bold text-blue-600">€18,219.50</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Cards</div>
                <div className="text-sm font-bold text-gray-700">2 Active</div>
              </div>
            </div>

            {/* ACCOUNT INFO */}
            <div className="grid sm:grid-cols-2 gap-4">
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
                    <span className="text-gray-400">IBAN</span>
                    <span className="font-mono font-medium">{account.countryCode}12 3456 7890 1234 5678 90</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">SWIFT</span>
                    <span className="font-mono font-medium">{account.countryCode}10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Currency</span>
                    <span className="font-medium">{account.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-500 font-medium">Active</span>
                  </div>
                </div>
              </div>

              {/* SAVINGS GOALS (if enabled) */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Savings Goals</h3>
                  <button onClick={() => setShowSavingsGoals(!showSavingsGoals)} className="text-xs text-blue-600 hover:underline">
                    {showSavingsGoals ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="space-y-3">
                  {savingsGoals.map((goal: any) => (
                    <div key={goal.name}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <PiggyBank className="w-4 h-4 text-gray-400" />
                        <div className="text-xs font-medium text-gray-700">{goal.name}</div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%`, backgroundColor: goal.color }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>{account.symbol}{goal.current.toLocaleString()}</span>
                        <span>{account.symbol}{goal.target.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TRANSACTIONS */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Transaction History</h3>
                <button className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>

              {/* FILTERS */}
              <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                  <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={txnSearch}
                    onChange={e => setTxnSearch(e.target.value)}
                    className="pl-7 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500"
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

              <div className="space-y-1">
                {filteredTxns.map(txn => (
                  <div key={txn.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        txn.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {txn.type === 'credit' ? (
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
                        txn.type === 'credit' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {txn.type === 'credit' ? '+' : '-'}{account.symbol}{txn.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRANSFER TAB */}
        {activeTab === 'transfer' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Transfer Money</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={transferForm.recipient}
                    onChange={e => setTransferForm({...transferForm, recipient: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Full name of recipient"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Account / IBAN</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="DE12 3456 7890 1234 5678 90"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Amount ({account.symbol})</label>
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
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
                  disabled={!transferForm.amount || !transferForm.recipient}
                  className="w-full text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: account.primaryColor }}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Send className="w-4 h-4" /> Send Transfer
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
              <h2 className="text-lg font-bold text-gray-900">Your Cards</h2>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-medium hover:bg-gray-100">
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            </div>

            {/* CARD */}
            <div className="w-full max-w-md">
              <div
                className="rounded-2xl p-6 text-white relative overflow-hidden aspect-[1.586/1] flex flex-col justify-between"
                style={{ background: `linear-gradient(135deg, ${account.primaryColor}, ${account.secondaryColor || account.primaryColor})` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{account.templateName}</div>
                  <div className="text-xs text-white/60">Debit Card</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-yellow-300/80 rounded" />
                </div>
                <div>
                  <div className="text-lg font-mono tracking-wider">
                    •••• •••• •••• ••••
                  </div>
                  <div className="flex justify-between mt-1">
                    <div className="text-xs text-white/50">
                      VALID THRU<br/>12/28
                    </div>
                    <div className="text-xs text-white/50">
                      {account.accountHolder.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="text-xs text-white/40">VISA</div>
                </div>
              </div>
            </div>

            {/* CARD CONTROLS */}
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Card PIN</label>
                  <input
                    type="text"
                    value={cardPin}
                    onChange={e => setCardPin(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm"
                    maxLength={4}
                    placeholder="••••"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATEMENTS TAB */}
        {activeTab === 'statements' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Statements</h2>
            {['November 2024', 'October 2024', 'September 2024', 'August 2024'].map(month => (
              <div key={month} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{month}</div>
                  <div className="text-xs text-gray-400">PDF · 2.4 MB</div>
                </div>
                <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Settings</h2>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Type</h3>
              <div className="space-y-2">
                {account.accountTypes?.map((type: string) => (
                  <button
                    key={type}
                    onClick={() => setAccountType(type)}
                    className={`w-full px-3 py-2 rounded text-left text-sm transition-all ${
                      accountType === type
                        ? 'border-2 border-blue-600 bg-blue-50'
                        : 'border border-gray-200 hover:border-gray-300'
                    }`}
                    style={accountType === type ? { borderColor: account.primaryColor, backgroundColor: account.primaryColor + '10' } : {}}
                  >
                    <div className="font-medium">{type}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                  <input type="text" defaultValue={account.accountHolder} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input type="email" defaultValue="user@example.com" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                  <input type="tel" defaultValue="+1 234 567 890" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Security</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
                  <input type="password" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                  <input type="password" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm" placeholder="••••••••" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 text-white font-medium py-2.5 rounded-lg transition-all" style={{ backgroundColor: account.primaryColor }}>Save Changes</button>
              <button className="flex-1 bg-red-50 border border-red-200 text-red-600 font-medium py-2.5 rounded-lg hover:bg-red-100 transition-all">Delete Account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
