import React from 'react'
import { ShieldCheck, Flame, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const AchievementBadges = ({ thirtyDayStreak, goals = [], budgetHealthy }) => {
  const badges = []
  if (thirtyDayStreak) badges.push({ id: 'streak', label: '30-Day Streak', icon: <Flame className="h-4 w-4 text-white" /> })
  if (goals && goals.length > 0) badges.push({ id: 'savings', label: 'Savings Shield', icon: <ShieldCheck className="h-4 w-4 text-white" /> })
  if (budgetHealthy) badges.push({ id: 'thrifty', label: 'Thrifty Saver', icon: <Star className="h-4 w-4 text-white" /> })

  if (badges.length === 0) return null

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Achievements</h4>
        <div className="text-xs text-gray-500">Keep it up</div>
      </div>

      <div className="flex flex-wrap gap-3">
        {badges.map(b => (
          <motion.div
            key={b.id}
            className="badge-glow"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div style={{ background: 'linear-gradient(90deg, var(--accent-1), var(--accent-2))' }} className="p-2 rounded-full shadow-md">
              {b.icon}
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{b.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AchievementBadges
