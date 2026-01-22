import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import { useApp } from '@shared/context/AppContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

export function NotificationToast({ role }) {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { notifications, newNotification, markAsRead } = useApp()
  const [visible, setVisible] = useState(false)
  const [currentNotif, setCurrentNotif] = useState(null)

  useEffect(() => {
    if (newNotification[role]) {
      const latest = notifications[role]?.[0]
      if (latest && !latest.read) {
        setCurrentNotif(latest)
        setVisible(true)
        const timer = setTimeout(() => setVisible(false), 5000)
        return () => clearTimeout(timer)
      }
    }
  }, [newNotification, role, notifications])

  const handleClose = () => {
    setVisible(false)
    if (currentNotif) markAsRead(role, currentNotif.id)
  }
  
  const handleClick = () => {
    if (currentNotif) {
      markAsRead(role, currentNotif.id)
      if (currentNotif.link) { setVisible(false); navigate(currentNotif.link) }
    }
  }

  const typeColors = {
    success: isDark ? 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30' : 'from-emerald-50 to-white border-emerald-200',
    error: isDark ? 'from-rose-500/20 to-rose-500/5 border-rose-500/30' : 'from-rose-50 to-white border-rose-200',
    info: isDark ? 'from-blue-500/20 to-blue-500/5 border-blue-500/30' : 'from-blue-50 to-white border-blue-200',
    warning: isDark ? 'from-amber-500/20 to-amber-500/5 border-amber-500/30' : 'from-amber-50 to-white border-amber-200',
  }

  return (
    <AnimatePresence>
      {visible && currentNotif && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={cn("fixed top-20 right-6 z-[9998] w-80 bg-gradient-to-r backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden cursor-pointer", typeColors[currentNotif.type] || typeColors.info)}
          onClick={handleClick}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              {currentNotif.fromUser ? (
                <img src={currentNotif.fromUser.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg", isDark ? "bg-dark-800" : "bg-gray-100")}>
                  {currentNotif.type === 'success' ? '✅' : currentNotif.type === 'error' ? '❌' : '📋'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}>{currentNotif.title}</p>
                  {currentNotif.link && <ExternalLink className={cn("w-3 h-3", isDark ? "text-dark-400" : "text-gray-400")} />}
                </div>
                <p className={cn("text-xs mt-0.5 line-clamp-2", isDark ? "text-dark-300" : "text-gray-600")}>{currentNotif.message}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleClose() }} className={cn(isDark ? "text-dark-400 hover:text-white" : "text-gray-400 hover:text-gray-600")}><X className="w-4 h-4" /></button>
            </div>
          </div>
          <motion.div initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 5, ease: 'linear' }} className={cn("h-1", isDark ? "bg-gold-500" : "bg-orange-500")} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
