    const [quickAddLoading, setQuickAddLoading] = useState(false);
    const [quickAddSuccess, setQuickAddSuccess] = useState(false);
    const quickAddInputRef = React.useRef(null);

    // Auto-focus Quick Add on mount
    React.useEffect(() => {
      if (quickAddInputRef.current) quickAddInputRef.current.focus();
    }, []);
  // Recent transactions for quick repeat
  const [recentQuickAdds, setRecentQuickAdds] = useState([]);

  // Smart default: last used category
  const lastCategory = recentQuickAdds.length > 0 ? recentQuickAdds[0].category : 'food';
// --- Quick Add Helper ---
const quickAddCategories = {
  food: 'food',
  transport: 'transport',
  entertainment: 'entertainment',
  shopping: 'shopping',
  health: 'health',
  education: 'education',
  utilities: 'utilities',
  rent: 'rent',
  salary: 'salary',
  freelance: 'freelance',
  investment: 'investment',
  other: 'other',
};

function parseQuickAdd(input) {
  // Example: "food 200" or "salary 1000" or "transport 50"
  if (!input) return null;
  const parts = input.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const categoryKey = parts[0].toLowerCase();
  const amount = parseFloat(parts[1]);
  if (!quickAddCategories[categoryKey] || isNaN(amount) || amount <= 0) return null;
  // Guess type
  const type = ['salary', 'freelance', 'investment'].includes(categoryKey) ? 'income' : 'expense';
  return {
    description: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
    amount,
    category: quickAddCategories[categoryKey],
    type,
  };
}
  const [quickAddValue, setQuickAddValue] = useState("");
  const [quickAddError, setQuickAddError] = useState("");
  // Quick Add handler
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    setQuickAddLoading(true);
    setQuickAddSuccess(false);
    const parsed = parseQuickAdd(quickAddValue);
    if (!parsed) {
      setQuickAddError("Format: category amount (e.g., food 200)");
      setQuickAddLoading(false);
      return;
    }
    setQuickAddError("");
    // Use selectedAccount
    await new Promise(res => setTimeout(res, 250)); // Simulate quick feedback
    addTransaction({ ...parsed, account: selectedAccount });
    setRecentQuickAdds(prev => [parsed, ...prev.filter(t => t.description !== parsed.description || t.amount !== parsed.amount)].slice(0, 5));
    setQuickAddValue("");
    setQuickAddLoading(false);
    setQuickAddSuccess(true);
    setTimeout(() => setQuickAddSuccess(false), 900);
    if (quickAddInputRef.current) quickAddInputRef.current.focus();
  };

  // Voice input for Quick Add
  const handleVoiceQuickAdd = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setQuickAddError('Voice input not supported in this browser.');
      return;
    }
    setQuickAddError('Listening...');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuickAddValue(transcript);
      setQuickAddError('');
    };
    recognition.onerror = (event) => {
      setQuickAddError('Voice input error: ' + event.error);
    };
    recognition.start();
  };
import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Database, LayoutDashboard, Settings, Sparkles } from 'lucide-react'

import AddTransaction from './components/AddTransaction'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import BalanceCard from './components/BalanceCard'
import BudgetProgress from './components/BudgetProgress'
import DataManager from './components/DataManager'
import FilterPanel from './components/FilterPanel'
import NotificationCenter from './components/NotificationCenter'
import RecurringTransactions from './components/RecurringTransactions'
import SavingsGoals from './components/SavingsGoals'
import SettingsPanel from './components/SettingsPanel'
import TransactionList from './components/TransactionList'
import { useExpenseContext } from './context/ExpenseContext'

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const [showDataManager, setShowDataManager] = useState(false)
  const [showRecurring, setShowRecurring] = useState(false)
  const [showGoals, setShowGoals] = useState(false)
  const [currencies] = useState(['USD', 'EUR', 'GBP', 'JPY', 'CAD'])

  const {
    transactions,
    budget,
    recurringTransactions,
    savingsGoals,
    accounts,
    baseCurrency,
    notifications,
    setNotifications,
    selectedAccount,
    setSelectedAccount,
    filters,
    setFilters,
    addTransaction,
    deleteTransaction,
    setBudget,
    setAccounts,
    setBaseCurrency,
    setRecurringTransactions,
    setSavingsGoals
  } = useExpenseContext()

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: baseCurrency
    }).format(value)

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0)

    const expenses = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0)

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses
    }
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const result = (transactions || []).filter((transaction) => {
      const matchesCategory = filters.category === 'all' || transaction.category === filters.category
      const matchesSearch = transaction.description.toLowerCase().includes(filters.search.toLowerCase())
      const matchesAccount = filters.account === 'all' || transaction.account === Number(filters.account)

      let matchesDateRange = true
      if (filters.dateRange !== 'all') {
        const transactionDate = new Date(transaction.date)
        const now = new Date()
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        if (filters.dateRange === 'week') {
          matchesDateRange = transactionDate >= startOfWeek
        } else if (filters.dateRange === 'month') {
          matchesDateRange = transactionDate >= startOfMonth
        }
      }

      let matchesAmountRange = true
      if (filters.amountRange !== 'all') {
        const amount = Number(transaction.amount)
        if (filters.amountRange === 'small') {
          matchesAmountRange = amount < 50
        } else if (filters.amountRange === 'medium') {
          matchesAmountRange = amount >= 50 && amount < 200
        } else if (filters.amountRange === 'large') {
          matchesAmountRange = amount >= 200
        }
      }

      return matchesCategory && matchesSearch && matchesAccount && matchesDateRange && matchesAmountRange
    })

    switch (filters.sort) {
      case 'oldest':
        return [...result].sort((a, b) => new Date(a.date) - new Date(b.date))
      case 'largest':
        return [...result].sort((a, b) => Number(b.amount) - Number(a.amount))
      case 'smallest':
        return [...result].sort((a, b) => Number(a.amount) - Number(b.amount))
      case 'category':
        return [...result].sort((a, b) => a.category.localeCompare(b.category))
      default:
        return [...result].sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  }, [filters, transactions])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <NotificationCenter notifications={notifications} onClear={() => setNotifications([])} />

      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 px-4 py-4 shadow-lg backdrop-blur-2xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 p-3 shadow-lg">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Finance OS</p>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Hana Tracker Dashboard</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setNotifications((prev) => [
                  {
                    id: Date.now(),
                    message: 'Daily snapshot refreshed',
                    type: 'info',
                    timestamp: new Date().toISOString()
                  },
                  ...prev
                ].slice(0, 6))
              }}
              className="rounded-xl border border-slate-200 bg-white/80 p-2.5 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              aria-label="Show notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowDataManager(true)}
              className="rounded-xl border border-slate-200 bg-white/80 p-2.5 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              aria-label="Open data manager"
            >
              <Database className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="rounded-xl border border-slate-200 bg-white/80 p-2.5 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              aria-label="Open settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <div className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
              <Sparkles className="mr-2 inline h-4 w-4" />
              Live ledger synced
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-6">
            <BalanceCard balance={balance} totalIncome={totalIncome} totalExpenses={totalExpenses} formatCurrency={formatCurrency} />
            <AddTransaction onAdd={addTransaction} accounts={accounts} selectedAccount={selectedAccount} onAccountChange={setSelectedAccount} currencies={currencies} baseCurrency={baseCurrency} />
            <FilterPanel filters={filters} onFiltersChange={setFilters} accounts={accounts} />
          </div>

          <div className="space-y-6">
            <AnalyticsDashboard transactions={transactions} formatCurrency={formatCurrency} baseCurrency={baseCurrency} />
            <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} formatCurrency={formatCurrency} accounts={accounts} />
          </div>

          <div className="space-y-6">
            <BudgetProgress budget={budget} totalExpenses={totalExpenses} onBudgetChange={setBudget} formatCurrency={formatCurrency} />
            <SavingsGoals goals={savingsGoals} onUpdate={setSavingsGoals} onClose={() => setShowGoals(false)} formatCurrency={formatCurrency} />
            <RecurringTransactions recurringTransactions={recurringTransactions} onUpdate={setRecurringTransactions} accounts={accounts} onClose={() => setShowRecurring(false)} />
          </div>
        </div>
      </main>

      {showSettings && (
        <SettingsPanel
          darkMode={false}
          onDarkModeChange={() => {}}
          baseCurrency={baseCurrency}
          onCurrencyChange={setBaseCurrency}
          currencies={currencies}
          accounts={accounts}
          onAccountsUpdate={setAccounts}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showDataManager && (
        <DataManager
          transactions={transactions}
          onImport={setTransactions}
          onClose={() => setShowDataManager(false)}
          formatCurrency={formatCurrency}
        />
      )}

      {showRecurring && <RecurringTransactions recurringTransactions={recurringTransactions} onUpdate={setRecurringTransactions} accounts={accounts} onClose={() => setShowRecurring(false)} />}
      {showGoals && <SavingsGoals goals={savingsGoals} onUpdate={setSavingsGoals} onClose={() => setShowGoals(false)} formatCurrency={formatCurrency} />}
    </div>
  )
}

export default App
