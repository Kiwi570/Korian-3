import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@shared/lib/utils'
import { useTheme } from '@shared/context/ThemeContext'
import { FileText, Calendar, Trophy, Users, Clock, Search, Bell, CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

// ============================================
// SKELETON LOADER
// ============================================
export function Skeleton({ className, ...props }) {
  const { isDark } = useTheme()
  return <div className={cn("animate-pulse rounded-lg", isDark ? "bg-dark-800/50" : "bg-gray-200", className)} {...props} />
}

export function SkeletonCard({ className }) {
  const { isDark } = useTheme()
  return (
    <div className={cn("p-6 rounded-2xl border", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200", className)}>
      <Skeleton className="h-12 w-12 rounded-xl mb-4" />
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  )
}

export function SkeletonList({ count = 3 }) {
  const { isDark } = useTheme()
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className={cn("flex items-center gap-4 p-4 rounded-xl", isDark ? "bg-dark-900/50" : "bg-gray-50")}>
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div><Skeleton className="h-8 w-48 mb-2" /><Skeleton className="h-4 w-32" /></div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><Skeleton className="h-64 rounded-2xl" /></div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  )
}

// ============================================
// EMPTY STATE
// ============================================
const emptyIcons = { default: FileText, calendar: Calendar, trophy: Trophy, users: Users, clock: Clock, search: Search, bell: Bell }

export function EmptyState({ icon = 'default', title = "Rien à afficher", description = "Il n'y a pas encore de données ici.", action, actionLabel, className }) {
  const { isDark } = useTheme()
  const Icon = emptyIcons[icon] || emptyIcons.default
  
  return (
    <motion.div className={cn("flex flex-col items-center justify-center py-12 px-6 text-center", className)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <motion.div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4", isDark ? "bg-dark-800/50" : "bg-gray-100")} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <Icon className={cn("w-8 h-8", isDark ? "text-dark-600" : "text-gray-400")} />
      </motion.div>
      <h3 className={cn("text-lg font-semibold mb-2", isDark ? "text-dark-300" : "text-gray-700")}>{title}</h3>
      <p className={cn("text-sm max-w-sm mb-4", isDark ? "text-dark-500" : "text-gray-500")}>{description}</p>
      {action && actionLabel && (
        <motion.button onClick={action} className={cn("px-4 py-2 rounded-xl text-sm font-medium", isDark ? "bg-gold-500/10 hover:bg-gold-500/20 text-gold-400" : "bg-orange-50 hover:bg-orange-100 text-orange-600")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{actionLabel}</motion.button>
      )}
    </motion.div>
  )
}

// ============================================
// ALERT / INFO BOX
// ============================================
const alertConfig = {
  info: { dark: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' }, light: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' }, icon: Info },
  success: { dark: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' }, light: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' }, icon: CheckCircle },
  warning: { dark: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' }, light: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' }, icon: AlertTriangle },
  error: { dark: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400' }, light: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' }, icon: XCircle },
}

export function Alert({ type = 'info', title, children, onClose, className }) {
  const { isDark } = useTheme()
  const config = alertConfig[type]
  const variant = isDark ? config.dark : config.light
  const Icon = config.icon
  
  return (
    <motion.div className={cn("p-4 rounded-xl border", variant.bg, variant.border, className)} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-start gap-3">
        <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", variant.text)} />
        <div className="flex-1 min-w-0">
          {title && <p className={cn("font-medium mb-1", variant.text)}>{title}</p>}
          <p className={cn("text-sm", isDark ? "text-dark-300" : "text-gray-600")}>{children}</p>
        </div>
        {onClose && <button onClick={onClose} className={cn(isDark ? "text-dark-500 hover:text-dark-300" : "text-gray-400 hover:text-gray-600")}><X className="w-4 h-4" /></button>}
      </div>
    </motion.div>
  )
}

// ============================================
// PROGRESS BAR
// ============================================
export function ProgressBar({ value, max = 100, color = 'gold', size = 'md', showLabel = false, label, className }) {
  const { isDark } = useTheme()
  const percentage = Math.min((value / max) * 100, 100)
  const colors = { gold: 'from-gold-500 to-amber-500', emerald: 'from-emerald-500 to-teal-500', blue: 'from-blue-500 to-cyan-500', violet: 'from-violet-500 to-purple-500', rose: 'from-rose-500 to-pink-500' }
  const sizes = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }
  
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1.5">
          <span className={cn(isDark ? "text-dark-400" : "text-gray-500")}>{label || 'Progression'}</span>
          <span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn("w-full rounded-full overflow-hidden", isDark ? "bg-dark-800" : "bg-gray-200", sizes[size])}>
        <motion.div className={cn("h-full bg-gradient-to-r rounded-full", colors[color])} initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
      </div>
    </div>
  )
}

// ============================================
// AVATAR GROUP
// ============================================
export function AvatarGroup({ users, max = 4, size = 'md' }) {
  const { isDark } = useTheme()
  const displayed = users.slice(0, max)
  const remaining = users.length - max
  const sizes = { sm: 'w-6 h-6 text-[10px]', md: 'w-8 h-8 text-xs', lg: 'w-10 h-10 text-sm' }
  
  return (
    <div className="flex -space-x-2">
      {displayed.map((user, i) => (
        <img key={user.id || i} src={user.avatar} alt={user.name} className={cn("rounded-full border-2 object-cover", isDark ? "border-dark-900" : "border-white", sizes[size])} title={user.name} />
      ))}
      {remaining > 0 && (
        <div className={cn("rounded-full border-2 flex items-center justify-center font-medium", isDark ? "border-dark-900 bg-dark-700 text-dark-300" : "border-white bg-gray-200 text-gray-600", sizes[size])}>+{remaining}</div>
      )}
    </div>
  )
}

// ============================================
// STATUS BADGE
// ============================================
export function StatusBadge({ status, size = 'md' }) {
  const { isDark } = useTheme()
  const config = {
    approved: { color: 'emerald', label: 'Approuvé', icon: CheckCircle },
    pending: { color: 'amber', label: 'En attente', icon: Clock },
    rejected: { color: 'rose', label: 'Refusé', icon: XCircle },
    draft: { color: 'blue', label: 'Brouillon', icon: FileText },
    submitted: { color: 'amber', label: 'Soumis', icon: Clock },
    active: { color: 'emerald', label: 'Actif', icon: CheckCircle },
    late: { color: 'rose', label: 'En retard', icon: AlertTriangle },
    leave: { color: 'violet', label: 'En congé', icon: Calendar },
  }
  
  const { color, label, icon: Icon } = config[status] || config.draft
  
  const colors = {
    emerald: isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
    amber: isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700',
    rose: isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-100 text-rose-700',
    blue: isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700',
    violet: isDark ? 'bg-violet-500/10 text-violet-400' : 'bg-violet-100 text-violet-700',
  }
  
  const sizes = { sm: 'px-2 py-0.5 text-[10px]', md: 'px-2.5 py-1 text-xs', lg: 'px-3 py-1.5 text-sm' }
  
  return <span className={cn("inline-flex items-center gap-1 font-medium rounded-full", colors[color], sizes[size])}><Icon className="w-3 h-3" />{label}</span>
}

// ============================================
// CONFIRMATION MODAL
// ============================================
export function ConfirmModal({ isOpen, onClose, onConfirm, title, description, confirmLabel = 'Confirmer', cancelLabel = 'Annuler', type = 'warning' }) {
  const { isDark } = useTheme()
  const types = {
    warning: { dark: 'bg-amber-500/10', light: 'bg-amber-50', icon: AlertTriangle, iconColor: isDark ? 'text-amber-400' : 'text-amber-600', btnColor: 'bg-amber-500 hover:bg-amber-600' },
    danger: { dark: 'bg-rose-500/10', light: 'bg-rose-50', icon: XCircle, iconColor: isDark ? 'text-rose-400' : 'text-rose-600', btnColor: 'bg-rose-500 hover:bg-rose-600' },
    success: { dark: 'bg-emerald-500/10', light: 'bg-emerald-50', icon: CheckCircle, iconColor: isDark ? 'text-emerald-400' : 'text-emerald-600', btnColor: 'bg-emerald-500 hover:bg-emerald-600' },
  }
  
  const config = types[type]
  const Icon = config.icon
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={cn("fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4", isDark ? "bg-black/60" : "bg-gray-900/50")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className={cn("rounded-2xl p-6 max-w-sm w-full border", isDark ? "bg-dark-900 border-dark-800" : "bg-white border-gray-200")} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()}>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4", isDark ? config.dark : config.light)}>
              <Icon className={cn("w-6 h-6", config.iconColor)} />
            </div>
            <h3 className={cn("text-lg font-semibold text-center mb-2", isDark ? "text-white" : "text-gray-900")}>{title}</h3>
            <p className={cn("text-sm text-center mb-6", isDark ? "text-dark-400" : "text-gray-500")}>{description}</p>
            <div className="flex gap-3">
              <motion.button onClick={onClose} className={cn("flex-1 py-3 rounded-xl font-medium", isDark ? "bg-dark-800 hover:bg-dark-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700")} whileTap={{ scale: 0.98 }}>{cancelLabel}</motion.button>
              <motion.button onClick={onConfirm} className={cn("flex-1 py-3 text-white rounded-xl font-semibold", config.btnColor)} whileTap={{ scale: 0.98 }}>{confirmLabel}</motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// STAT CARD
// ============================================
export function StatCard({ label, value, suffix, icon: Icon, color = 'blue', trend, trendValue, alert, onClick }) {
  const { isDark } = useTheme()
  const colors = {
    blue: { dark: { bg: 'bg-blue-500/10', text: 'text-blue-400' }, light: { bg: 'bg-blue-50', text: 'text-blue-600' }, ring: 'ring-blue-500/30', dot: 'bg-blue-500' },
    amber: { dark: { bg: 'bg-amber-500/10', text: 'text-amber-400' }, light: { bg: 'bg-amber-50', text: 'text-amber-600' }, ring: 'ring-amber-500/30', dot: 'bg-amber-500' },
    emerald: { dark: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' }, light: { bg: 'bg-emerald-50', text: 'text-emerald-600' }, ring: 'ring-emerald-500/30', dot: 'bg-emerald-500' },
    violet: { dark: { bg: 'bg-violet-500/10', text: 'text-violet-400' }, light: { bg: 'bg-violet-50', text: 'text-violet-600' }, ring: 'ring-violet-500/30', dot: 'bg-violet-500' },
    rose: { dark: { bg: 'bg-rose-500/10', text: 'text-rose-400' }, light: { bg: 'bg-rose-50', text: 'text-rose-600' }, ring: 'ring-rose-500/30', dot: 'bg-rose-500' },
    gold: { dark: { bg: 'bg-gold-500/10', text: 'text-gold-400' }, light: { bg: 'bg-orange-50', text: 'text-orange-600' }, ring: 'ring-gold-500/30', dot: 'bg-gold-500' },
  }
  
  const c = colors[color]
  const variant = isDark ? c.dark : c.light
  
  return (
    <motion.div className={cn("relative p-5 rounded-2xl border transition-all cursor-pointer", isDark ? "bg-dark-900/80 border-dark-800 hover:border-dark-700" : "bg-white border-gray-200 hover:border-gray-300 shadow-sm", alert && `ring-2 ${c.ring}`)} whileHover={{ y: -2 }} onClick={onClick}>
      {alert && <span className={cn("absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full animate-pulse", c.dot)} />}
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", variant.bg)}><Icon className={cn("w-5 h-5", variant.text)} /></div>
        {trend && <span className={cn("text-xs font-medium", trend === 'up' ? 'text-emerald-400' : 'text-rose-400')}>{trend === 'up' ? '↑' : '↓'} {trendValue}</span>}
      </div>
      <p className={cn("text-2xl font-bold mb-0.5", isDark ? "text-white" : "text-gray-900")}>{value}{suffix && <span className={cn("text-lg font-normal", isDark ? "text-dark-500" : "text-gray-400")}>{suffix}</span>}</p>
      <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{label}</p>
    </motion.div>
  )
}
