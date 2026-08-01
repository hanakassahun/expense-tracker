import React, { createContext, useContext, useMemo, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const ExpenseContext = createContext(null)

const defaultTransactions = [
  {
    id: 1,
    description: 'Salary Deposit',
    amount: 3200,
    category: 'salary',
    type: 'income',
    account: 2,
    date: new Date().toISOString()
  },
  {
    id: 2,
    description: 'Groceries',
    amount: 84.5,
    category: 'food',
    type: 'expense',
    account: 1,
    date: new Date(Date.now() - 86400000).toISOString()
  }
]

export function ExpenseProvider({ children }) {
  const [transactions, setTransactions, transactionsHydrated] = useLocalStorage('hana_tracker_data', defaultTransactions)
  const [budget, setBudget] = useLocalStorage('hana_budget', 5000)
  const [recurringTransactions, setRecurringTransactions] = useLocalStorage('hana_recurring', [])
  const [savingsGoals, setSavingsGoals] = useLocalStorage('hana_goals', [])
  const [accounts, setAccounts] = useLocalStorage('hana_accounts', [
    { id: 1, name: 'Cash', balance: 0, currency: 'USD' },
    { id: 2, name: 'Bank', balance: 0, currency: 'USD' },
    { id: 3, name: 'Mobile Money', balance: 0, currency: 'USD' }
  ])
  const [baseCurrency, setBaseCurrency] = useLocalStorage('hana_currency', 'USD')
  const [notifications, setNotifications] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(1)
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    dateRange: 'all',
    amountRange: 'all',
    account: 'all',
    sort: 'newest'
  })

  const addTransaction = (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
      date: new Date().toISOString(),
      account: selectedAccount
    }

    setTransactions((prev) => [newItem, ...(Array.isArray(prev) ? prev : [])])
    setNotifications((prev) => [{
      id: Date.now(),
      message: `${item.type === 'income' ? 'Income' : 'Expense'} recorded for ${item.description}`,
      type: 'success',
      timestamp: new Date().toISOString()
    }, ...prev].slice(0, 6))
  }

  const deleteTransaction = (id) => {
    setTransactions((prev) => (Array.isArray(prev) ? prev.filter((transaction) => transaction.id !== id) : []))
    setNotifications((prev) => [{
      id: Date.now(),
      message: 'Transaction removed from your ledger',
      type: 'info',
      timestamp: new Date().toISOString()
    }, ...prev].slice(0, 6))
  }

  const updateBudget = (value) => {
    setBudget(value)
  }

  const value = useMemo(() => ({
    transactions,
    setTransactions,
    transactionsHydrated,
    budget,
    setBudget: updateBudget,
    recurringTransactions,
    setRecurringTransactions,
    savingsGoals,
    setSavingsGoals,
    accounts,
    setAccounts,
    baseCurrency,
    setBaseCurrency,
    notifications,
    setNotifications,
    selectedAccount,
    setSelectedAccount,
    filters,
    setFilters,
    addTransaction,
    deleteTransaction
  }), [
    transactions,
    transactionsHydrated,
    budget,
    recurringTransactions,
    savingsGoals,
    accounts,
    baseCurrency,
    notifications,
    selectedAccount,
    filters,
    setTransactions,
    setRecurringTransactions,
    setSavingsGoals,
    setAccounts,
    setBaseCurrency,
    setNotifications,
    setFilters,
    setSelectedAccount
  ])

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}

export function useExpenseContext() {
  const context = useContext(ExpenseContext)

  if (!context) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider')
  }

  return context
}
