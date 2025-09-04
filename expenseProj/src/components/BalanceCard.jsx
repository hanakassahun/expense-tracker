import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const BalanceCard = ({ balance, totalIncome, totalExpenses, formatCurrency }) => {

  return (
    <motion.div 
      className="card card-hover"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-center">
        <div className="gradient-bg p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <DollarSign className="h-8 w-8 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Current Balance
        </h2>
        
        <div className="text-4xl font-bold mb-6">
          <span className={balance >= 0 ? 'text-success-600' : 'text-danger-600'}>
            {formatCurrency(balance)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            className="text-center p-3 rounded-lg bg-success-50 dark:bg-success-900/20"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-success-600 mr-1" />
              <span className="text-sm font-medium text-success-600">Income</span>
            </div>
            <div className="text-lg font-bold text-success-700 dark:text-success-400">
              {formatCurrency(totalIncome)}
            </div>
          </motion.div>

          <motion.div 
            className="text-center p-3 rounded-lg bg-danger-50 dark:bg-danger-900/20"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center mb-1">
              <TrendingDown className="h-4 w-4 text-danger-600 mr-1" />
              <span className="text-sm font-medium text-danger-600">Expenses</span>
            </div>
            <div className="text-lg font-bold text-danger-700 dark:text-danger-400">
              {formatCurrency(totalExpenses)}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default BalanceCard
