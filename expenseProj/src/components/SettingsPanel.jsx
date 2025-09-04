import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Settings, Globe, CreditCard, Palette, Bell, Shield, Plus, Edit, Trash2 } from 'lucide-react'

const SettingsPanel = ({ 
  darkMode, 
  onDarkModeChange, 
  baseCurrency, 
  onCurrencyChange, 
  currencies, 
  accounts, 
  onAccountsUpdate, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('general')
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [accountForm, setAccountForm] = useState({
    name: '',
    currency: 'USD',
    initialBalance: '0'
  })

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'currency', label: 'Currency', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield }
  ]

  const handleAddAccount = (e) => {
    e.preventDefault()
    
    if (editingAccount) {
      // Update existing account
      onAccountsUpdate(prev => prev.map(account => 
        account.id === editingAccount.id 
          ? { ...account, ...accountForm, currency: accountForm.currency }
          : account
      ))
      setEditingAccount(null)
    } else {
      // Add new account
      const newAccount = {
        id: Date.now(),
        ...accountForm,
        balance: parseFloat(accountForm.initialBalance)
      }
      onAccountsUpdate(prev => [...prev, newAccount])
    }
    
    setAccountForm({ name: '', currency: 'USD', initialBalance: '0' })
    setShowAddAccount(false)
  }

  const handleEditAccount = (account) => {
    setAccountForm({
      name: account.name,
      currency: account.currency,
      initialBalance: account.balance.toString()
    })
    setEditingAccount(account)
    setShowAddAccount(true)
  }

  const handleDeleteAccount = (id) => {
    if (accounts.length <= 1) {
      alert('You must have at least one account.')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      onAccountsUpdate(prev => prev.filter(account => account.id !== id))
    }
  }

  const resetAccountForm = () => {
    setAccountForm({ name: '', currency: 'USD', initialBalance: '0' })
    setEditingAccount(null)
    setShowAddAccount(false)
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
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Settings className="h-6 w-6 text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Settings
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
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-700'
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
          {/* General Tab */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  General Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Configure basic application settings and preferences.
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Application Info</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Version</span>
                      <span className="font-medium text-gray-900 dark:text-white">1.0.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Data Storage</span>
                      <span className="font-medium text-gray-900 dark:text-white">Local Browser</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Data Management</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Auto-save</span>
                      <span className="font-medium text-green-600">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Backup Frequency</span>
                      <span className="font-medium text-gray-900 dark:text-white">Real-time</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Accounts Tab */}
          {activeTab === 'accounts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Account Management
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage your financial accounts and their settings.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddAccount(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Account</span>
                </button>
              </div>

              {/* Add/Edit Account Form */}
              {showAddAccount && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    {editingAccount ? 'Edit Account' : 'Add New Account'}
                  </h4>
                  
                  <form onSubmit={handleAddAccount} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Account Name
                        </label>
                        <input
                          type="text"
                          value={accountForm.name}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Currency
                        </label>
                        <select
                          value={accountForm.currency}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, currency: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          required
                        >
                          {currencies.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Initial Balance
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={accountForm.initialBalance}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, initialBalance: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={resetAccountForm}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingAccount ? 'Update' : 'Add'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Accounts List */}
              <div className="space-y-4">
                {accounts.map(account => (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">{account.name}</h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Balance: {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: account.currency,
                          }).format(account.balance)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Currency Tab */}
          {activeTab === 'currency' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Currency Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Configure your preferred currency and exchange rate settings.
                </p>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Base Currency</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Base Currency
                    </label>
                    <select
                      value={baseCurrency}
                      onChange={(e) => onCurrencyChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Note:</strong> Changing the base currency will affect how all amounts are displayed throughout the application. 
                      Historical data will maintain their original values.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Supported Currencies</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currencies.map(currency => (
                    <div
                      key={currency}
                      className={`p-3 rounded-lg border-2 ${
                        currency === baseCurrency
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-medium text-gray-900 dark:text-white">{currency}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {currency === baseCurrency ? 'Base Currency' : 'Supported'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Appearance Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Customize the look and feel of your application.
                </p>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Theme</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Dark Mode</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <button
                      onClick={() => onDarkModeChange(!darkMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Display Options</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Compact Mode</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Coming Soon</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">High Contrast</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Coming Soon</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Notification Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Configure how and when you receive notifications.
                </p>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Budget Alerts</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Budget Warnings</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified when you're approaching your budget limit
                      </p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Budget Exceeded</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Alert when you exceed your monthly budget
                      </p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Enabled</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Transaction Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">New Transaction Added</span>
                    <span className="text-sm text-green-600 font-medium">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Recurring Transactions</span>
                    <span className="text-sm text-green-600 font-medium">Enabled</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Privacy & Security
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Manage your data privacy and security settings.
                </p>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Data Storage</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Local Storage</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        All data is stored locally in your browser
                      </p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Secure</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Data Encryption</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Data is encrypted in local storage
                      </p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Enabled</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Privacy Features</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">No Data Collection</span>
                    <span className="text-sm text-green-600 font-medium">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">No Analytics</span>
                    <span className="text-sm text-green-600 font-medium">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">No Third-party Services</span>
                    <span className="text-sm text-green-600 font-medium">✓</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SettingsPanel
