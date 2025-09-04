import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Target, DollarSign, Calendar, Edit, Trash2, TrendingUp } from 'lucide-react'

const SavingsGoals = ({ goals, onUpdate, onClose, formatCurrency }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: '',
    category: '',
    description: ''
  })

  const categories = [
    'Emergency Fund', 'Vacation', 'Home', 'Car', 'Education', 
    'Wedding', 'Retirement', 'Investment', 'Other'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingId) {
      // Update existing goal
      onUpdate(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, ...formData, targetAmount: parseFloat(formData.targetAmount), currentAmount: parseFloat(formData.currentAmount) }
          : item
      ))
      setEditingId(null)
    } else {
      // Add new goal
      const newGoal = {
        id: Date.now(),
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        createdAt: new Date().toISOString()
      }
      onUpdate(prev => [...prev, newGoal])
    }
    
    resetForm()
    setShowForm(false)
  }

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      targetAmount: item.targetAmount.toString(),
      currentAmount: item.currentAmount.toString(),
      targetDate: item.targetDate,
      category: item.category,
      description: item.description
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    onUpdate(prev => prev.filter(item => item.id !== id))
  }

  const handleProgressUpdate = (id, newAmount) => {
    onUpdate(prev => prev.map(item => 
      item.id === id 
        ? { ...item, currentAmount: parseFloat(newAmount) }
        : item
    ))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '0',
      targetDate: '',
      category: '',
      description: ''
    })
  }

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100)
  }

  const getDaysRemaining = (targetDate) => {
    const target = new Date(targetDate)
    const now = new Date()
    const diffTime = target - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (percentage, daysRemaining) => {
    if (percentage >= 100) return 'text-green-600 bg-green-100 dark:bg-green-900/20'
    if (daysRemaining < 0) return 'text-red-600 bg-red-100 dark:bg-red-900/20'
    if (daysRemaining < 30) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
    return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
  }

  const getStatusText = (percentage, daysRemaining) => {
    if (percentage >= 100) return 'Completed!'
    if (daysRemaining < 0) return 'Overdue'
    if (daysRemaining < 30) return 'Due Soon'
    return 'On Track'
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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Savings Goals
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
                {editingId ? 'Edit Savings Goal' : 'Add Savings Goal'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                    Target Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
              className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
            >
              <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 group-hover:text-green-600">
                <Plus className="h-5 w-5" />
                <span className="font-medium">Add Savings Goal</span>
              </div>
            </button>
          )}

          {/* Goals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.length === 0 ? (
              <div className="lg:col-span-2 text-center py-12 text-gray-500 dark:text-gray-400">
                <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No savings goals yet</p>
                <p className="text-sm">Set up your first financial goal to start tracking progress</p>
              </div>
            ) : (
              goals.map(goal => {
                const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount)
                const daysRemaining = getDaysRemaining(goal.targetDate)
                const statusColor = getStatusColor(progress, daysRemaining)
                const statusText = getStatusText(progress, daysRemaining)

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Goal Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                            {statusText}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                            {goal.category}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {goal.name}
                        </h4>
                        {goal.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {goal.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(goal)}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Progress: {progress.toFixed(1)}%
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                        <motion.div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Goal Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Target Date</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(goal.targetDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Days Remaining</p>
                          <p className={`font-medium ${daysRemaining < 0 ? 'text-red-600' : daysRemaining < 30 ? 'text-yellow-600' : 'text-gray-900 dark:text-white'}`}>
                            {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Update */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Update amount"
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const newAmount = parseFloat(e.target.value) + goal.currentAmount
                              handleProgressUpdate(goal.id, newAmount)
                              e.target.value = ''
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.target.previousElementSibling
                            const newAmount = parseFloat(input.value) + goal.currentAmount
                            handleProgressUpdate(goal.id, newAmount)
                            input.value = ''
                          }}
                          className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SavingsGoals
