import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCheck, ExternalLink } from 'lucide-react'
import { useApp } from '@shared/context/AppContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

const typeIcons = { success: '✅', error: '❌', info: '📋', warning: '⚠️' }

export function NotificationBell({ role }) {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { notifications, getUnreadCount, markAsRead, markAllAsRead, newNotification } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [isRinging, setIsRinging] = useState(false)

  const unreadCount = getUnreadCount(role)
  const roleNotifications = notifications[role] || []

  useEffect(() => {
    if (newNotification[role]) {
      setIsRinging(true)
      setTimeout(() => setIsRinging(false), 1000)
    }
  }, [newNotification, role])

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "À l'instant"
    if (mins < 60) return `Il y a ${mins} min`
    const hours = Math.floor(diff / 3600000)
    if (hours < 24) return `Il y a ${hours}h`
    return `Il y a ${Math.floor(diff / 86400000)}j`
  }
  
  const handleNotificationClick = (notif) => {
    markAsRead(role, notif.id)
    if (notif.link) {
      setIsOpen(false)
      navigate(notif.link)
    }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn("relative w-10 h-10 rounded-xl flex items-center justify-center border transition-colors", isDark ? "bg-dark-900 text-dark-400 hover:text-white border-dark-800 hover:border-dark-700" : "bg-white text-gray-500 hover:text-gray-900 border-gray-200 hover:border-gray-300")}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div animate={isRinging ? { rotate: [0, 15, -15, 10, -10, 5, -5, 0] } : {}} transition={{ duration: 0.6 }}>
          <Bell className="w-5 h-5" />
        </motion.div>

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {newNotification[role] && (
            <motion.span
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full"
            />
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="fixed inset-0 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} />
            <motion.div
              className={cn("absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl overflow-hidden z-50", isDark ? "bg-dark-900 border-dark-800" : "bg-white border-gray-200")}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
            >
              <div className={cn("p-4 border-b flex items-center justify-between", isDark ? "border-dark-800" : "border-gray-100")}>
                <div>
                  <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Notifications</h3>
                  <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
                </div>
                {unreadCount > 0 && (
                  <button onClick={() => markAllAsRead(role)} className={cn("flex items-center gap-1 text-xs font-medium", isDark ? "text-gold-400 hover:text-gold-300" : "text-orange-600 hover:text-orange-500")}>
                    <CheckCheck className="w-3 h-3" />Tout lu
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {roleNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className={cn("w-8 h-8 mx-auto mb-2", isDark ? "text-dark-600" : "text-gray-300")} />
                    <p className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-500")}>Aucune notification</p>
                  </div>
                ) : (
                  roleNotifications.map((notif, i) => (
                    <motion.div
                      key={notif.id}
                      initial={i === 0 && newNotification[role] ? { x: -20, opacity: 0 } : false}
                      animate={{ x: 0, opacity: 1 }}
                      onClick={() => handleNotificationClick(notif)}
                      className={cn(
                        "p-4 border-b last:border-0 cursor-pointer transition-colors group",
                        isDark 
                          ? cn("border-dark-800/50", notif.read ? 'hover:bg-dark-800/30' : 'bg-dark-800/20 hover:bg-dark-800/40')
                          : cn("border-gray-100", notif.read ? 'hover:bg-gray-50' : 'bg-orange-50/50 hover:bg-orange-50')
                      )}
                    >
                      <div className="flex gap-3">
                        {notif.fromUser ? (
                          <img src={notif.fromUser.avatar} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0", isDark ? "bg-dark-800" : "bg-gray-100")}>
                            {typeIcons[notif.type] || '📋'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn("text-sm font-medium", notif.read ? (isDark ? 'text-dark-300' : 'text-gray-600') : (isDark ? 'text-white' : 'text-gray-900'))}>{notif.title}</p>
                            <div className="flex items-center gap-1">
                              {notif.link && <ExternalLink className={cn("w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity", isDark ? "text-dark-500" : "text-gray-400")} />}
                              {!notif.read && <span className={cn("w-2 h-2 rounded-full flex-shrink-0", isDark ? "bg-gold-500" : "bg-orange-500")} />}
                            </div>
                          </div>
                          <p className={cn("text-xs mt-0.5 line-clamp-2", isDark ? "text-dark-500" : "text-gray-500")}>{notif.message}</p>
                          <p className={cn("text-xs mt-1", isDark ? "text-dark-600" : "text-gray-400")}>{formatTime(notif.createdAt)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
