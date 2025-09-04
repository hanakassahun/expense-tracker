import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, DollarSign, CreditCard } from 'lucide-react'

const AddTransaction = ({ onAdd, accounts, selectedAccount, onAccountChange, currencies, baseCurrency }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'food',
    type: 'expense'
  })

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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.description.trim() || !formData.amount) {
      return
    }

    const transaction = {
      ...formData,
      amount: parseFloat(formData.amount),
      category: formData.category
    }

    onAdd(transaction)
    
    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: 'food',
      type: 'expense'
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <motion.div 
      className="card card-hover"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center mb-4">
        <Plus className="h-5 w-5 text-primary-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Add Transaction
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              formData.type === 'expense'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="h-4 w-4 inline mr-1" />
            Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              formData.type === 'income'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="h-4 w-4 inline mr-1" />
            Income
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter description..."
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {baseCurrency === 'USD' ? '$' : baseCurrency === 'EUR' ? '€' : baseCurrency === 'GBP' ? '£' : baseCurrency}
            </span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="input-field pl-8"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Account Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Account
          </label>
          <select
            value={selectedAccount}
            onChange={(e) => onAccountChange(parseInt(e.target.value))}
            className="input-field"
            required
          >
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.currency})
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(categories)
              .filter(([key]) => {
                if (formData.type === 'income') {
                  return ['salary', 'freelance', 'investment', 'other'].includes(key)
                }
                return ['salary', 'freelance', 'investment'].includes(key) === false
              })
              .map(([key, category]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: key }))}
                  className={`p-2 rounded-lg text-center transition-all duration-200 ${
                    formData.category === key
                      ? `${category.color} text-white shadow-md`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="text-lg mb-1">{category.icon}</div>
                  <div className="text-xs font-medium">{category.name}</div>
                </button>
              ))}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="btn-primary w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-4 w-4 inline mr-2" />
          Add {formData.type === 'income' ? 'Income' : 'Expense'}
        </motion.button>
      </form>
    </motion.div>
  )
}

export default AddTransaction
