import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, DollarSign, TrendingUp, PieChart, Filter, Search, Download, Upload, Settings, Bell, Target, Receipt } from 'lucide-react'
import BalanceCard from './components/BalanceCard'
import BudgetProgress from './components/BudgetProgress'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import TransactionList from './components/TransactionList'
import AddTransaction from './components/AddTransaction'
import FilterPanel from './components/FilterPanel'
import RecurringTransactions from './components/RecurringTransactions'
import SavingsGoals from './components/SavingsGoals'
import DataManager from './components/DataManager'
import SettingsPanel from './components/SettingsPanel'
import NotificationCenter from './components/NotificationCenter'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [budget, setBudget] = useState(5000)
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    dateRange: 'all',
    amountRange: 'all',
    account: 'all'
  })
  const [recurringTransactions, setRecurringTransactions] = useState([])
  const [savingsGoals, setSavingsGoals] = useState([])
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Main Account', balance: 0, currency: 'USD' },
    { id: 2, name: 'Savings', balance: 0, currency: 'USD' }
  ])
  const [selectedAccount, setSelectedAccount] = useState(1)
  const [currencies, setCurrencies] = useState(['USD', 'EUR', 'GBP', 'JPY', 'CAD'])
  const [baseCurrency, setBaseCurrency] = useState('USD')
  const [notifications, setNotifications] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const [showDataManager, setShowDataManager] = useState(false)
  const [showRecurring, setShowRecurring] = useState(false)
  const [showGoals, setShowGoals] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions')
    const savedBudget = localStorage.getItem('budget')
    const savedDarkMode = localStorage.getItem('darkMode')
    const savedRecurring = localStorage.getItem('recurringTransactions')
    const savedGoals = localStorage.getItem('savingsGoals')
    const savedAccounts = localStorage.getItem('accounts')
    const savedBaseCurrency = localStorage.getItem('baseCurrency')
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
    if (savedBudget) {
      setBudget(JSON.parse(savedBudget))
    }
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
    if (savedRecurring) {
      setRecurringTransactions(JSON.parse(savedRecurring))
    }
    if (savedGoals) {
      setSavingsGoals(JSON.parse(savedGoals))
    }
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts))
    }
    if (savedBaseCurrency) {
      setBaseCurrency(savedBaseCurrency)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget))
  }, [budget])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions))
  }, [recurringTransactions])

  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals))
  }, [savingsGoals])

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    localStorage.setItem('baseCurrency', baseCurrency)
  }, [baseCurrency])

  // Process recurring transactions daily
  useEffect(() => {
    const checkRecurringTransactions = () => {
      const today = new Date()
      const newTransactions = []
      
      recurringTransactions.forEach(recurring => {
        if (shouldProcessRecurring(recurring, today)) {
          newTransactions.push({
            id: Date.now() + Math.random(),
            description: recurring.description,
            amount: recurring.amount,
            category: recurring.category,
            type: recurring.type,
            account: recurring.account,
            date: today.toISOString(),
            isRecurring: true,
            recurringId: recurring.id
          })
        }
      })
      
      if (newTransactions.length > 0) {
        setTransactions(prev => [...newTransactions, ...prev])
        addNotification(`Added ${newTransactions.length} recurring transactions`)
      }
    }

    // Check once per day
    const interval = setInterval(checkRecurringTransactions, 24 * 60 * 60 * 1000)
    checkRecurringTransactions() // Check immediately on mount
    
    return () => clearInterval(interval)
  }, [recurringTransactions])

  const shouldProcessRecurring = (recurring, today) => {
    const lastProcessed = new Date(recurring.lastProcessed || 0)
    const daysSinceLastProcessed = Math.floor((today - lastProcessed) / (1000 * 60 * 60 * 24))
    
    switch (recurring.frequency) {
      case 'daily':
        return daysSinceLastProcessed >= 1
      case 'weekly':
        return daysSinceLastProcessed >= 7
      case 'monthly':
        return daysSinceLastProcessed >= 30
      case 'yearly':
        return daysSinceLastProcessed >= 365
      default:
        return false
    }
  }

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString(),
      account: selectedAccount
    }
    setTransactions(prev => [newTransaction, ...prev])
    
    // Update account balance
    updateAccountBalance(selectedAccount, transaction.amount, transaction.type)
    
    // Check budget alerts
    checkBudgetAlerts(transaction)
    
    addNotification(`Added ${transaction.type}: ${transaction.description}`)
  }

  const updateAccountBalance = (accountId, amount, type) => {
    setAccounts(prev => prev.map(account => {
      if (account.id === accountId) {
        const change = type === 'income' ? amount : -amount
        return { ...account, balance: account.balance + change }
      }
      return account
    }))
  }

  const checkBudgetAlerts = (transaction) => {
    if (transaction.type === 'expense') {
      const currentExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) + parseFloat(transaction.amount)
      
      if (currentExpenses > budget * 0.8) {
        addNotification(`Warning: You've used ${Math.round((currentExpenses / budget) * 100)}% of your budget!`, 'warning')
      }
      if (currentExpenses > budget) {
        addNotification(`Alert: You've exceeded your budget by ${formatCurrency(currentExpenses - budget)}!`, 'error')
      }
    }
  }

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString()
    }
    setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Keep only last 10
  }

  const deleteTransaction = (id) => {
    const transaction = transactions.find(t => t.id === id)
    if (transaction) {
      updateAccountBalance(transaction.account, transaction.amount, transaction.type === 'income' ? 'expense' : 'income')
    }
    setTransactions(prev => prev.filter(t => t.id !== id))
    addNotification('Transaction deleted')
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesCategory = filters.category === 'all' || transaction.category === filters.category
    const matchesSearch = transaction.description.toLowerCase().includes(filters.search.toLowerCase())
    const matchesAccount = filters.account === 'all' || transaction.account === parseInt(filters.account)
    
    let matchesDateRange = true
    if (filters.dateRange !== 'all') {
      const transactionDate = new Date(transaction.date)
      const now = new Date()
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      switch (filters.dateRange) {
        case 'week':
          matchesDateRange = transactionDate >= startOfWeek
          break
        case 'month':
          matchesDateRange = transactionDate >= startOfMonth
          break
        default:
          matchesDateRange = true
      }
    }

    let matchesAmountRange = true
    if (filters.amountRange !== 'all') {
      const amount = parseFloat(transaction.amount)
      switch (filters.amountRange) {
        case 'small':
          matchesAmountRange = amount < 50
          break
        case 'medium':
          matchesAmountRange = amount >= 50 && amount < 200
          break
        case 'large':
          matchesAmountRange = amount >= 200
          break
        default:
          matchesAmountRange = true
      }
    }
    
    return matchesCategory && matchesSearch && matchesDateRange && matchesAmountRange && matchesAccount
  })

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const balance = totalIncome - totalExpenses

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: baseCurrency,
    }).format(amount)
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="gradient-bg p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Finance Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile-first responsive buttons */}
              <button
                onClick={() => setShowRecurring(!showRecurring)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                title="Recurring Transactions"
              >
                <Target className="h-5 w-5 text-blue-600" />
              </button>
              
              <button
                onClick={() => setShowGoals(!showGoals)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                title="Savings Goals"
              >
                <TrendingUp className="h-5 w-5 text-green-600" />
              </button>
              
              <button
                onClick={() => setShowDataManager(!showDataManager)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                title="Data Management"
              >
                <Download className="h-5 w-5 text-purple-600" />
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                title="Settings"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                title="Toggle Theme"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Center */}
      <NotificationCenter 
        notifications={notifications} 
        onClear={() => setNotifications([])}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Left Column - Balance, Budget, and Quick Actions */}
          <div className="xl:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BalanceCard 
                balance={balance}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                formatCurrency={formatCurrency}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <BudgetProgress 
                budget={budget}
                totalExpenses={totalExpenses}
                onBudgetChange={setBudget}
                formatCurrency={formatCurrency}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AddTransaction 
                onAdd={addTransaction} 
                accounts={accounts}
                selectedAccount={selectedAccount}
                onAccountChange={setSelectedAccount}
                currencies={currencies}
                baseCurrency={baseCurrency}
              />
            </motion.div>

            {/* Account Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Accounts</h3>
              <div className="space-y-3">
                {accounts.map(account => (
                  <div 
                    key={account.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAccount === account.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedAccount(account.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">{account.name}</span>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {account.currency}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Analytics and Transactions */}
          <div className="xl:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <AnalyticsDashboard 
                transactions={transactions} 
                formatCurrency={formatCurrency}
                baseCurrency={baseCurrency}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <FilterPanel 
                filters={filters} 
                onFiltersChange={setFilters}
                accounts={accounts}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <TransactionList 
                transactions={filteredTransactions}
                onDelete={deleteTransaction}
                formatCurrency={formatCurrency}
                accounts={accounts}
              />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Modals and Overlays */}
      <AnimatePresence>
        {showRecurring && (
          <RecurringTransactions
            recurringTransactions={recurringTransactions}
            onUpdate={setRecurringTransactions}
            accounts={accounts}
            onClose={() => setShowRecurring(false)}
          />
        )}
        
        {showGoals && (
          <SavingsGoals
            goals={savingsGoals}
            onUpdate={setSavingsGoals}
            onClose={() => setShowGoals(false)}
            formatCurrency={formatCurrency}
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
        
        {showSettings && (
          <SettingsPanel
            darkMode={darkMode}
            onDarkModeChange={setDarkMode}
            baseCurrency={baseCurrency}
            onCurrencyChange={setBaseCurrency}
            currencies={currencies}
            accounts={accounts}
            onAccountsUpdate={setAccounts}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
