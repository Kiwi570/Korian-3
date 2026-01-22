import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

const iconColorsConfig = {
  gold: { dark: 'bg-gold-500/10 text-gold-400', light: 'bg-orange-50 text-orange-600' },
  blue: { dark: 'bg-blue-500/10 text-blue-400', light: 'bg-blue-50 text-blue-600' },
  violet: { dark: 'bg-violet-500/10 text-violet-400', light: 'bg-violet-50 text-violet-600' },
  emerald: { dark: 'bg-emerald-500/10 text-emerald-400', light: 'bg-emerald-50 text-emerald-600' },
  rose: { dark: 'bg-rose-500/10 text-rose-400', light: 'bg-rose-50 text-rose-600' },
  amber: { dark: 'bg-amber-500/10 text-amber-400', light: 'bg-amber-50 text-amber-600' },
}

export function Modal({ isOpen, onClose, title, subtitle, icon: Icon, iconColor = 'gold', children, maxWidth = 'max-w-md' }) {
  const { isDark } = useTheme()
  
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const iconColorClass = iconColorsConfig[iconColor] || iconColorsConfig.gold

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            className={cn("absolute inset-0 backdrop-blur-sm", isDark ? "bg-dark-950/80" : "bg-gray-900/50")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(`relative w-full ${maxWidth} rounded-3xl border shadow-2xl overflow-hidden`, isDark ? "bg-dark-900 border-dark-800" : "bg-white border-gray-200")}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {(title || Icon) && (
              <div className={cn("p-6 border-b flex items-center justify-between", isDark ? "border-dark-800" : "border-gray-100")}>
                <div className="flex items-center gap-3">
                  {Icon && <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? iconColorClass.dark : iconColorClass.light)}><Icon className="w-5 h-5" /></div>}
                  <div>
                    {title && <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>{title}</h2>}
                    {subtitle && <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{subtitle}</p>}
                  </div>
                </div>
                <button onClick={onClose} className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", isDark ? "bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900")}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  if (typeof window !== 'undefined') return createPortal(modalContent, document.body)
  return null
}
