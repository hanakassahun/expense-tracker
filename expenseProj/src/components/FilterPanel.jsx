import React from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar } from 'lucide-react'

const FilterPanel = ({ filters, onFiltersChange, accounts }) => {
  const categories = {
    all: 'All Categories',
    food: 'Food & Dining',
    transport: 'Transportation',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    health: 'Healthcare',
    education: 'Education',
    utilities: 'Utilities',
    rent: 'Rent',
    salary: 'Salary',
    freelance: 'Freelance',
    investment: 'Investment',
    other: 'Other'
  }

  const dateRanges = {
    all: 'All Time',
    week: 'This Week',
    month: 'This Month'
  }

  const amountRanges = {
    all: 'All Amounts',
    small: 'Small (< $50)',
    medium: 'Medium ($50 - $200)',
    large: 'Large (> $200)'
  }

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-primary-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters & Search
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Search className="h-4 w-4 inline mr-1" />
            Search Transactions
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input-field"
            placeholder="Search by description..."
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="input-field"
          >
            {Object.entries(categories).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="input-field"
          >
            {Object.entries(dateRanges).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount Range
          </label>
          <select
            value={filters.amountRange}
            onChange={(e) => handleFilterChange('amountRange', e.target.value)}
            className="input-field"
          >
            {Object.entries(amountRanges).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Account Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Account
          </label>
          <select
            value={filters.account}
            onChange={(e) => handleFilterChange('account', e.target.value)}
            className="input-field"
          >
            <option value="all">All Accounts</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {(filters.search || filters.category !== 'all' || filters.dateRange !== 'all' || filters.amountRange !== 'all' || filters.account !== 'all') && (
        <motion.button
          onClick={() => onFiltersChange({
            category: 'all',
            search: '',
            dateRange: 'all',
            amountRange: 'all',
            account: 'all'
          })}
          className="btn-secondary mt-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Clear All Filters
        </motion.button>
      )}
    </motion.div>
  )
}

export default FilterPanel
