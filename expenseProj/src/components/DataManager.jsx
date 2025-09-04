import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Download, Upload, Database, FileText, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'

const DataManager = ({ transactions, onImport, onClose, formatCurrency }) => {
  const [activeTab, setActiveTab] = useState('export')
  const [importData, setImportData] = useState('')
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState(false)

  const tabs = [
    { id: 'export', label: 'Export Data', icon: Download },
    { id: 'import', label: 'Import Data', icon: Upload },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
    { id: 'analytics', label: 'Data Analytics', icon: FileText }
  ]

  const exportData = () => {
    const data = {
      transactions,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expense-tracker-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Account']
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        `"${t.description}"`,
        t.amount,
        t.type,
        t.category,
        t.account
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    try {
      const data = JSON.parse(importData)
      
      if (!data.transactions || !Array.isArray(data.transactions)) {
        throw new Error('Invalid data format. Expected transactions array.')
      }
      
      // Validate transaction structure
      const isValidTransaction = (t) => {
        return t.id && t.description && t.amount && t.type && t.category
      }
      
      if (!data.transactions.every(isValidTransaction)) {
        throw new Error('Some transactions have invalid structure.')
      }
      
      onImport(data.transactions)
      setImportSuccess(true)
      setImportError('')
      setImportData('')
      
      setTimeout(() => setImportSuccess(false), 3000)
    } catch (error) {
      setImportError(error.message)
      setImportSuccess(false)
    }
  }

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      onImport([])
      setImportSuccess(true)
      setImportError('')
      setTimeout(() => setImportSuccess(false), 3000)
    }
  }

  const getDataStats = () => {
    const totalTransactions = transactions.length
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    
    const categories = {}
    transactions.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + parseFloat(t.amount)
    })
    
    const topCategories = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
    
    return { totalTransactions, totalIncome, totalExpenses, topCategories }
  }

  const stats = getDataStats()

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
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Data Manager
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Export Tab */}
          {activeTab === 'export' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Export Your Data
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Download your financial data in various formats for backup, analysis, or sharing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg text-center">
                  <Download className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">JSON Export</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Complete data backup in JSON format
                  </p>
                  <button
                    onClick={exportData}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Export JSON
                  </button>
                </div>

                <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg text-center">
                  <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">CSV Export</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Transaction data in spreadsheet format
                  </p>
                  <button
                    onClick={exportCSV}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Export Summary</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                      Your data will include {stats.totalTransactions} transactions, 
                      {formatCurrency(stats.totalIncome)} in income, and {formatCurrency(stats.totalExpenses)} in expenses.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Import Tab */}
          {activeTab === 'import' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Import Data
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Import previously exported data or data from other sources. This will replace your current data.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paste JSON Data
                  </label>
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Paste your JSON data here..."
                    rows="8"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                  />
                </div>

                {importError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900 dark:text-red-100">Import Error</h4>
                        <p className="text-sm text-red-800 dark:text-red-200 mt-1">{importError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {importSuccess && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900 dark:text-green-100">Import Successful</h4>
                        <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                          Your data has been imported successfully!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={handleImport}
                    disabled={!importData.trim()}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Import Data
                  </button>
                  <button
                    onClick={() => {
                      setImportData('')
                      setImportError('')
                      setImportSuccess(false)
                    }}
                    className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Warning</h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                      Importing data will replace your current transactions. Make sure to export your current data first if you want to keep it.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Backup Tab */}
          {activeTab === 'backup' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Backup & Restore
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Manage your data backups and restore points.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Automatic Backup</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Your data is automatically saved to your browser's local storage.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Backup:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Storage Used:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {Math.round(JSON.stringify(transactions).length / 1024)} KB
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Manual Backup</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Create a manual backup before making major changes.
                  </p>
                  <button
                    onClick={exportData}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create Backup Now
                  </button>
                </div>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900 dark:text-red-100">Danger Zone</h4>
                    <p className="text-sm text-red-800 dark:text-red-200 mt-1 mb-3">
                      This action will permanently delete all your data and cannot be undone.
                    </p>
                    <button
                      onClick={clearAllData}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Data Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Overview of your financial data and insights.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalTransactions}</div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">Total Transactions</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{formatCurrency(stats.totalIncome)}</div>
                  <div className="text-sm text-green-800 dark:text-green-200">Total Income</div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">{formatCurrency(stats.totalExpenses)}</div>
                  <div className="text-sm text-red-800 dark:text-red-200">Total Expenses</div>
                </div>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Spending Categories</h4>
                {stats.topCategories.length > 0 ? (
                  <div className="space-y-3">
                    {stats.topCategories.map(([category, amount], index) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${
                            index === 0 ? 'bg-red-500' : 
                            index === 1 ? 'bg-orange-500' : 
                            index === 2 ? 'bg-yellow-500' : 
                            index === 3 ? 'bg-blue-500' : 'bg-gray-500'
                          }`} />
                          <span className="font-medium text-gray-900 dark:text-white">{category}</span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No data available</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DataManager
