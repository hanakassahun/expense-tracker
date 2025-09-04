import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react'

const AnalyticsDashboard = ({ transactions, formatCurrency, baseCurrency }) => {
  const categories = {
    food: { name: 'Food & Dining', color: '#f97316' },
    transport: { name: 'Transportation', color: '#3b82f6' },
    entertainment: { name: 'Entertainment', color: '#a855f7' },
    shopping: { name: 'Shopping', color: '#ec4899' },
    health: { name: 'Healthcare', color: '#ef4444' },
    education: { name: 'Education', color: '#22c55e' },
    utilities: { name: 'Utilities', color: '#eab308' },
    rent: { name: 'Rent', color: '#6366f1' },
    salary: { name: 'Salary', color: '#10b981' },
    freelance: { name: 'Freelance', color: '#14b8a6' },
    investment: { name: 'Investment', color: '#06b6d4' },
    other: { name: 'Other', color: '#6b7280' }
  }

  // Calculate expense breakdown by category
  const expenseBreakdown = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const breakdown = {}
    
    expenses.forEach(expense => {
      const category = categories[expense.category]?.name || 'Other'
      breakdown[category] = (breakdown[category] || 0) + expense.amount
    })
    
    return Object.entries(breakdown).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    })).sort((a, b) => b.value - a.value)
  }, [transactions, categories])

  // Calculate spending trend over time (last 7 days)
  const spendingTrend = useMemo(() => {
    const last7Days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      
      const dayExpenses = transactions
        .filter(t => {
          const transactionDate = new Date(t.date)
          return t.type === 'expense' && 
                 transactionDate.toDateString() === date.toDateString()
        })
        .reduce((sum, t) => sum + t.amount, 0)
      
      last7Days.push({
        date: dateStr,
        amount: parseFloat(dayExpenses.toFixed(2))
      })
    }
    
    return last7Days
  }, [transactions])

  // Top 3 spending categories
  const topCategories = expenseBreakdown.slice(0, 3)

  const COLORS = expenseBreakdown.map(item => {
    const categoryKey = Object.keys(categories).find(key => 
      categories[key].name === item.name
    )
    return categories[categoryKey]?.color || '#6b7280'
  })

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <BarChart3 className="h-5 w-5 text-primary-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown Pie Chart */}
        <div className="space-y-4">
          <div className="flex items-center">
            <PieChartIcon className="h-4 w-4 text-primary-600 mr-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Expense Breakdown
            </h4>
          </div>
          
          {expenseBreakdown.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Amount']}
                    labelStyle={{ color: '#374151' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No expense data available
            </div>
          )}
        </div>

        {/* Spending Trend Line Chart */}
        <div className="space-y-4">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-primary-600 mr-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Spending Trend (Last 7 Days)
            </h4>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Spent']}
                  labelStyle={{ color: '#374151' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Spending Categories */}
      {topCategories.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Top Spending Categories
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topCategories.map((category, index) => (
              <motion.div
                key={category.name}
                className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </div>
                    <div className="text-lg font-bold text-primary-600">
                      {formatCurrency(category.value)}
                    </div>
                  </div>
                  <div className="text-2xl">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AnalyticsDashboard
