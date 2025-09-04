import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Edit3, Check, X } from 'lucide-react'

const BudgetProgress = ({ budget, totalExpenses, onBudgetChange, formatCurrency }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(budget)

  const percentage = Math.min((totalExpenses / budget) * 100, 100)
  
  const getProgressColor = (percent) => {
    if (percent < 50) return 'bg-success-500'
    if (percent < 80) return 'bg-warning-500'
    return 'bg-danger-500'
  }

  const getProgressBgColor = (percent) => {
    if (percent < 50) return 'bg-success-100 dark:bg-success-900/20'
    if (percent < 80) return 'bg-warning-100 dark:bg-warning-900/20'
    return 'bg-danger-100 dark:bg-danger-900/20'
  }

  const handleSave = () => {
    if (editValue > 0) {
      onBudgetChange(parseFloat(editValue))
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditValue(budget)
    setIsEditing(false)
  }

  return (
    <motion.div 
      className="card card-hover"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Target className="h-5 w-5 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Monthly Budget
          </h3>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Edit3 className="h-4 w-4 text-gray-500" />
          </button>
        ) : (
          <div className="flex space-x-1">
            <button
              onClick={handleSave}
              className="p-1 rounded-lg hover:bg-success-100 dark:hover:bg-success-900/20 transition-colors duration-200"
            >
              <Check className="h-4 w-4 text-success-600" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg hover:bg-danger-100 dark:hover:bg-danger-900/20 transition-colors duration-200"
            >
              <X className="h-4 w-4 text-danger-600" />
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {formatCurrency(budget)}
        </div>
      ) : (
        <div className="mb-4">
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="input-field text-2xl font-bold text-center"
            placeholder="Enter budget"
            min="0"
            step="0.01"
          />
        </div>
      )}

      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Spent: {formatCurrency(totalExpenses)}</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        
        <div className={`w-full h-3 rounded-full ${getProgressBgColor(percentage)} overflow-hidden`}>
          <motion.div
            className={`h-full ${getProgressColor(percentage)} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        {percentage < 50 && (
          <span className="text-success-600 dark:text-success-400">
            Great! You're well within your budget. 🎉
          </span>
        )}
        {percentage >= 50 && percentage < 80 && (
          <span className="text-warning-600 dark:text-warning-400">
            Watch out! You're approaching your budget limit. ⚠️
          </span>
        )}
        {percentage >= 80 && (
          <span className="text-danger-600 dark:text-danger-400">
            Warning! You've exceeded your budget! 🚨
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default BudgetProgress
