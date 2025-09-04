import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'

const NotificationCenter = ({ notifications, onClear }) => {
  useEffect(() => {
    // Auto-dismiss notifications after 5 seconds
    const timers = notifications.map(notification => {
      return setTimeout(() => {
        onClear()
      }, 5000)
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [notifications, onClear])

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-lg border shadow-lg ${getBgColor(notification.type)}`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={onClear}
                className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationCenter
