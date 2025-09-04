import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Calendar, Repeat, DollarSign, Edit, Trash2 } from 'lucide-react'

const RecurringTransactions = ({ recurringTransactions, onUpdate, accounts, onClose }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    frequency: 'monthly',
    account: accounts[0]?.id || 1,
    startDate: new Date().toISOString().split('T')[0]
  })

  const categories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'
  ]

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingId) {
      // Update existing recurring transaction
      onUpdate(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, ...formData, lastProcessed: item.lastProcessed }
          : item
      ))
      setEditingId(null)
    } else {
      // Add new recurring transaction
      const newRecurring = {
        id: Date.now(),
        ...formData,
        lastProcessed: null
      }
      onUpdate(prev => [...prev, newRecurring])
    }
    
    resetForm()
    setShowForm(false)
  }

  const handleEdit = (item) => {
    setFormData({
      description: item.description,
      amount: item.amount,
      category: item.category,
      type: item.type,
      frequency: item.frequency,
      account: item.account,
      startDate: item.startDate || new Date().toISOString().split('T')[0]
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    onUpdate(prev => prev.filter(item => item.id !== id))
  }

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: '',
      type: 'expense',
      frequency: 'monthly',
      account: accounts[0]?.id || 1,
      startDate: new Date().toISOString().split('T')[0]
    })
  }

  const getNextOccurrence = (frequency, startDate) => {
    const start = new Date(startDate)
    const now = new Date()
    
    switch (frequency) {
      case 'daily':
        return new Date(start.getTime() + (Math.ceil((now - start) / (1000 * 60 * 60 * 24)) * 24 * 60 * 60 * 1000))
      case 'weekly':
        return new Date(start.getTime() + (Math.ceil((now - start) / (1000 * 60 * 60 * 24 * 7)) * 7 * 24 * 60 * 60 * 1000))
      case 'monthly':
        return new Date(start.getFullYear(), start.getMonth() + Math.ceil((now - start) / (1000 * 60 * 60 * 24 * 30)), start.getDate())
      case 'yearly':
        return new Date(start.getFullYear() + Math.ceil((now - start) / (1000 * 60 * 60 * 24 * 365)), start.getMonth(), start.getDate())
      default:
        return start
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Repeat className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recurring Transactions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Add/Edit Form */}
          {showForm && (
            <motion.form
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              onSubmit={handleSubmit}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {editingId ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    {frequencies.map(freq => (
                      <option key={freq.value} value={freq.value}>{freq.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account
                  </label>
                  <select
                    value={formData.account}
                    onChange={(e) => setFormData(prev => ({ ...prev, account: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </motion.form>
          )}

          {/* Add Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
            >
              <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600">
                <Plus className="h-5 w-5" />
                <span className="font-medium">Add Recurring Transaction</span>
              </div>
            </button>
          )}

          {/* Recurring Transactions List */}
          <div className="space-y-4">
            {recurringTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Repeat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recurring transactions yet</p>
                <p className="text-sm">Set up recurring bills, subscriptions, or income</p>
              </div>
            ) : (
              recurringTransactions.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === 'income' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {item.type}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          {item.frequency}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {item.description}
                      </h4>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>${parseFloat(item.amount).toFixed(2)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Next: {getNextOccurrence(item.frequency, item.startDate).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RecurringTransactions
