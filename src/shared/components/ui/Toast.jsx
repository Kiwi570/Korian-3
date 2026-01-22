import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useApp } from '@shared/context/AppContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

const icons = { success: CheckCircle, error: XCircle, info: Info, warning: AlertTriangle }
const colorsConfig = {
  success: { dark: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' }, light: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' } },
  error: { dark: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400' }, light: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' } },
  info: { dark: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' }, light: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' } },
  warning: { dark: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' }, light: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' } },
}

export function ToastContainer() {
  const { toasts, removeToast } = useApp()
  const { isDark } = useTheme()

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || icons.info
          const colorSet = colorsConfig[toast.type] || colorsConfig.info
          const color = isDark ? colorSet.dark : colorSet.light
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg", color.bg, color.border)}
            >
              <Icon className={cn("w-5 h-5", color.text)} />
              <span className={cn("text-sm font-medium", color.text)}>{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className={cn("ml-2", isDark ? "text-dark-400 hover:text-white" : "text-gray-400 hover:text-gray-600")}>
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
