import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { format, parseISO } from 'date-fns'

const TransactionList = ({ transactions, onDelete, formatCurrency, accounts }) => {
  const categories = {
    food: { name: 'Food & Dining', icon: '🍔', color: 'bg-orange-500' },
    transport: { name: 'Transportation', icon: '🚗', color: 'bg-blue-500' },
    entertainment: { name: 'Entertainment', icon: '🎬', color: 'bg-purple-500' },
    shopping: { name: 'Shopping', icon: '🛍️', color: 'bg-pink-500' },
    health: { name: 'Healthcare', icon: '🏥', color: 'bg-red-500' },
    education: { name: 'Education', icon: '📚', color: 'bg-green-500' },
    utilities: { name: 'Utilities', icon: '⚡', color: 'bg-yellow-500' },
    rent: { name: 'Rent', icon: '🏠', color: 'bg-indigo-500' },
    salary: { name: 'Salary', icon: '💰', color: 'bg-emerald-500' },
    freelance: { name: 'Freelance', icon: '💼', color: 'bg-teal-500' },
    investment: { name: 'Investment', icon: '📈', color: 'bg-cyan-500' },
    other: { name: 'Other', icon: '📦', color: 'bg-gray-500' }
  }



  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy')
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const getCategoryInfo = (category) => {
    return categories[category] || { name: 'Other', icon: '📦', color: 'bg-gray-500' }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      onDelete(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <motion.div 
        className="card flex items-center justify-center min-h-[220px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center py-10 sm:py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
            No transactions found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-base">
            Add some transactions to see them here, or adjust your filters.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2 sm:gap-0">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Recent Transactions
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {transactions.map((transaction, index) => {
            const categoryInfo = getCategoryInfo(transaction.category)
            const isIncome = transaction.type === 'income'
            
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  {/* Category Icon */}
                  <div className={`p-3 rounded-full ${categoryInfo.color} text-white shadow-md`}>
                    <span className="text-xl">{categoryInfo.icon}</span>
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {transaction.description}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                        {categoryInfo.name}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(transaction.date)}
                    </div>
                    {accounts && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Account: {accounts.find(a => a.id === transaction.account)?.name || 'Unknown'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className={`font-bold text-lg ${
                      isIncome ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      {isIncome ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {isIncome ? 'Income' : 'Expense'}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <motion.button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-2 rounded-lg hover:bg-danger-100 dark:hover:bg-danger-900/20 text-danger-600 hover:text-danger-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-danger-400"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default TransactionList
