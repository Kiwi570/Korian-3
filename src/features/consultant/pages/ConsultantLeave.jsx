import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Plus, CheckCircle, Clock, XCircle, Palmtree, Briefcase, Heart, Info, Baby, Sun, Moon, CalendarDays, LayoutGrid, List } from 'lucide-react'
import { staggerContainer, staggerItem } from '@shared/lib/animations'
import { Modal } from '@shared/components/ui'
import { useApp } from '@shared/context/AppContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'
import LeaveCalendar from '@shared/components/LeaveCalendar'

const LEAVE_TYPES = [
  { id: 'paid', name: 'Congé payé', icon: Palmtree, color: 'emerald' },
  { id: 'rtt', name: 'RTT', icon: Briefcase, color: 'blue' },
  { id: 'sick', name: 'Maladie', icon: Heart, color: 'rose' },
  { id: 'unpaid', name: 'Sans solde', icon: Calendar, color: 'amber' },
  { id: 'maternity', name: 'Maternité', icon: Baby, color: 'pink' },
  { id: 'paternity', name: 'Paternité', icon: Baby, color: 'cyan' },
]

const statusConfig = { 
  approved: { label: 'Approuvé', color: 'emerald', icon: CheckCircle }, 
  pending: { label: 'En attente', color: 'amber', icon: Clock }, 
  rejected: { label: 'Refusé', color: 'rose', icon: XCircle } 
}

const colorClasses = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', textLight: 'text-emerald-600', badge: 'bg-emerald-500/10 text-emerald-400', badgeLight: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', textLight: 'text-blue-600', badge: 'bg-blue-500/10 text-blue-400', badgeLight: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', textLight: 'text-rose-600', badge: 'bg-rose-500/10 text-rose-400', badgeLight: 'bg-rose-100 text-rose-700', bar: 'bg-rose-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', textLight: 'text-amber-600', badge: 'bg-amber-500/10 text-amber-400', badgeLight: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', textLight: 'text-pink-600', badge: 'bg-pink-500/10 text-pink-400', badgeLight: 'bg-pink-100 text-pink-700', bar: 'bg-pink-500' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', textLight: 'text-cyan-600', badge: 'bg-cyan-500/10 text-cyan-400', badgeLight: 'bg-cyan-100 text-cyan-700', bar: 'bg-cyan-500' },
}

export default function ConsultantLeave() {
  const { leaveRequests, leaveBalance, addLeaveRequest, cancelLeaveRequest, addToast } = useApp()
  const { isDark } = useTheme()
  const [modalOpen, setModalOpen] = useState(false)
  const [leaveType, setLeaveType] = useState('paid')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [isHalfDay, setIsHalfDay] = useState(false)
  const [halfDayPeriod, setHalfDayPeriod] = useState('morning')
  const [viewMode, setViewMode] = useState('calendar')

  const calculateDays = () => {
    if (!startDate || !endDate) return 0
    if (isHalfDay) return 0.5
    const start = new Date(startDate), end = new Date(endDate)
    let days = 0
    const current = new Date(start)
    while (current <= end) {
      const dow = current.getDay()
      if (dow !== 0 && dow !== 6) days++
      current.setDate(current.getDate() + 1)
    }
    return days
  }

  const handleSubmit = () => {
    if (startDate && endDate) {
      const days = calculateDays()
      if (days === 0) { addToast('Sélectionnez des jours ouvrés', 'warning'); return }
      const typeInfo = LEAVE_TYPES.find(t => t.id === leaveType)
      addLeaveRequest({ type: typeInfo?.name || 'Congé payé', typeId: leaveType, startDate, endDate, days, reason, isHalfDay, halfDayPeriod: isHalfDay ? halfDayPeriod : null })
      setModalOpen(false)
      setStartDate(''); setEndDate(''); setReason(''); setIsHalfDay(false)
    }
  }

  const balances = [
    { type: 'Congés payés', used: leaveBalance.paidTotal - leaveBalance.paid, total: leaveBalance.paidTotal, color: 'emerald', icon: Palmtree },
    { type: 'RTT', used: leaveBalance.rttTotal - leaveBalance.rtt, total: leaveBalance.rttTotal, color: 'blue', icon: Briefcase },
    { type: 'Maladie', used: 2, total: '∞', color: 'rose', icon: Heart },
  ]
  
  const pendingDays = leaveRequests.filter(l => l.status === 'pending').reduce((sum, l) => sum + l.days, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl sm:text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Congés</h1>
          <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Gérez vos demandes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center rounded-xl p-1", isDark ? "bg-dark-800" : "bg-gray-100")}>
            <button onClick={() => setViewMode('calendar')} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors", viewMode === 'calendar' ? (isDark ? 'bg-dark-700 text-white' : 'bg-white text-gray-900 shadow-sm') : (isDark ? 'text-dark-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'))}>
              <LayoutGrid className="w-4 h-4" /><span className="hidden sm:inline">Calendrier</span>
            </button>
            <button onClick={() => setViewMode('list')} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors", viewMode === 'list' ? (isDark ? 'bg-dark-700 text-white' : 'bg-white text-gray-900 shadow-sm') : (isDark ? 'text-dark-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'))}>
              <List className="w-4 h-4" /><span className="hidden sm:inline">Liste</span>
            </button>
          </div>
          
          <motion.button onClick={() => setModalOpen(true)} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg", isDark ? "bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 shadow-gold-500/20" : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/20")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Plus className="w-4 h-4" />Nouvelle demande
          </motion.button>
        </div>
      </div>

      {viewMode === 'calendar' && (
        <LeaveCalendar 
          userLeaves={leaveRequests.map(l => ({ id: l.id, name: 'Moi', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', type: l.typeId || 'paid', start: l.startDate, end: l.endDate, color: l.typeId === 'rtt' ? 'blue' : l.typeId === 'sick' ? 'rose' : 'emerald' }))}
          showTeam={true}
        />
      )}

      {/* Balances */}
      <motion.div className="grid sm:grid-cols-3 gap-4" variants={staggerContainer} initial="hidden" animate="visible">
        {balances.map((b) => {
          const Icon = b.icon
          const remaining = typeof b.total === 'number' ? b.total - b.used : '∞'
          const colors = colorClasses[b.color]
          return (
            <motion.div key={b.type} variants={staggerItem} className={cn("rounded-2xl border p-6", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")} whileHover={{ y: -2 }}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={cn("w-6 h-6", isDark ? colors.text : colors.textLight)} />
                </div>
                <span className={cn("px-2 py-1 rounded-lg text-xs font-medium", isDark ? colors.badge : colors.badgeLight)}>{remaining} restants</span>
              </div>
              <h3 className={cn("text-lg font-semibold mb-1", isDark ? "text-white" : "text-gray-900")}>{b.type}</h3>
              <p className={cn("text-sm mb-4", isDark ? "text-dark-400" : "text-gray-500")}>{b.used} utilisés{typeof b.total === 'number' && ` sur ${b.total}`}</p>
              {typeof b.total === 'number' && (
                <div className={cn("w-full h-2 rounded-full overflow-hidden", isDark ? "bg-dark-800" : "bg-gray-200")}>
                  <motion.div className={`h-full ${colors.bar} rounded-full`} initial={{ width: 0 }} animate={{ width: `${((b.total - b.used) / b.total) * 100}%` }} />
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>
      
      {pendingDays > 0 && (
        <div className={cn("p-4 rounded-xl flex items-center gap-3", isDark ? "bg-amber-500/10 border border-amber-500/20" : "bg-amber-50 border border-amber-200")}>
          <Clock className={cn("w-5 h-5", isDark ? "text-amber-400" : "text-amber-600")} />
          <p className={cn("text-sm", isDark ? "text-amber-300" : "text-amber-700")}><span className="font-semibold">{pendingDays} jour(s)</span> en attente de validation</p>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
      <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
        <div className={cn("p-6 border-b flex items-center justify-between", isDark ? "border-dark-800" : "border-gray-100")}>
          <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>Historique</h2>
          <span className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-500")}>{leaveRequests.length} demande(s)</span>
        </div>
        <div className={cn("divide-y", isDark ? "divide-dark-800" : "divide-gray-100")}>
          {leaveRequests.length === 0 ? (
            <div className="p-8 text-center">
              <CalendarDays className={cn("w-12 h-12 mx-auto mb-4", isDark ? "text-dark-700" : "text-gray-300")} />
              <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Aucune demande</p>
            </div>
          ) : leaveRequests.map((leave, i) => {
            const status = statusConfig[leave.status]
            const StatusIcon = status.icon
            const typeInfo = LEAVE_TYPES.find(t => t.id === leave.typeId || t.name === leave.type) || LEAVE_TYPES[0]
            const TypeIcon = typeInfo.icon
            const typeColors = colorClasses[typeInfo.color]
            const statusColors = colorClasses[status.color]
            
            return (
              <motion.div key={leave.id} className={cn("p-4 sm:p-6", isDark ? "hover:bg-dark-800/30" : "hover:bg-gray-50")} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeColors.bg}`}>
                    <TypeIcon className={cn("w-6 h-6", isDark ? typeColors.text : typeColors.textLight)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{leave.type}</h3>
                      {leave.isHalfDay && (
                        <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-xs", isDark ? "bg-dark-800 text-dark-300" : "bg-gray-100 text-gray-600")}>
                          {leave.halfDayPeriod === 'morning' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                          {leave.halfDayPeriod === 'morning' ? 'Matin' : 'Après-midi'}
                        </span>
                      )}
                      <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", isDark ? statusColors.badge : statusColors.badgeLight)}>
                        <StatusIcon className="w-3 h-3" />{status.label}
                      </span>
                    </div>
                    <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>
                      {leave.startDate === leave.endDate ? leave.startDate : `${leave.startDate} → ${leave.endDate}`} • <span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{leave.days}j</span>
                    </p>
                    {leave.reason && <p className={cn("text-sm mt-1 truncate", isDark ? "text-dark-500" : "text-gray-400")}>{leave.reason}</p>}
                    {leave.rejectReason && <p className="text-sm text-rose-400 mt-1">Motif : {leave.rejectReason}</p>}
                  </div>
                  {leave.status === 'pending' && (
                    <motion.button onClick={() => cancelLeaveRequest(leave.id)} className={cn("px-3 py-1.5 rounded-lg text-sm font-medium", isDark ? "bg-dark-800 hover:bg-rose-500/20 text-dark-300 hover:text-rose-400" : "bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-500")} whileTap={{ scale: 0.95 }}>
                      Annuler
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle demande" icon={Calendar} iconColor="violet" maxWidth="max-w-lg">
        <div className="space-y-5">
          <div>
            <label className={cn("block text-sm font-medium mb-3", isDark ? "text-dark-300" : "text-gray-700")}>Type de congé</label>
            <div className="grid grid-cols-3 gap-2">
              {LEAVE_TYPES.slice(0, 6).map(type => {
                const TypeIcon = type.icon
                const colors = colorClasses[type.color]
                const isSelected = leaveType === type.id
                return (
                  <motion.button key={type.id} onClick={() => setLeaveType(type.id)} className={cn("p-3 rounded-xl border-2 transition-all", isSelected ? `${colors.bg} border-current ${isDark ? colors.text : colors.textLight}` : (isDark ? 'border-dark-700 hover:border-dark-600' : 'border-gray-200 hover:border-gray-300'))} whileTap={{ scale: 0.98 }}>
                    <TypeIcon className={cn("w-5 h-5 mx-auto mb-1", isSelected ? (isDark ? colors.text : colors.textLight) : (isDark ? 'text-dark-500' : 'text-gray-400'))} />
                    <p className={cn("text-xs font-medium", isSelected ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-dark-400' : 'text-gray-500'))}>{type.name}</p>
                  </motion.button>
                )
              })}
            </div>
          </div>
          
          <div className={cn("flex items-center justify-between p-3 rounded-xl", isDark ? "bg-dark-800/50" : "bg-gray-50")}>
            <span className={cn("text-sm", isDark ? "text-dark-300" : "text-gray-700")}>Demi-journée</span>
            <button onClick={() => setIsHalfDay(!isHalfDay)} className={cn("relative w-12 h-6 rounded-full transition-colors", isHalfDay ? (isDark ? 'bg-gold-500' : 'bg-orange-500') : (isDark ? 'bg-dark-700' : 'bg-gray-300'))}>
              <motion.div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" animate={{ left: isHalfDay ? '28px' : '4px' }} />
            </button>
          </div>
          
          {isHalfDay && (
            <motion.div className="grid grid-cols-2 gap-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <button onClick={() => setHalfDayPeriod('morning')} className={cn("p-3 rounded-xl border flex items-center justify-center gap-2", halfDayPeriod === 'morning' ? (isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-600') : (isDark ? 'border-dark-700 text-dark-400' : 'border-gray-200 text-gray-500'))}>
                <Sun className="w-4 h-4" /> Matin
              </button>
              <button onClick={() => setHalfDayPeriod('afternoon')} className={cn("p-3 rounded-xl border flex items-center justify-center gap-2", halfDayPeriod === 'afternoon' ? (isDark ? 'bg-violet-500/10 border-violet-500/30 text-violet-400' : 'bg-violet-50 border-violet-300 text-violet-600') : (isDark ? 'border-dark-700 text-dark-400' : 'border-gray-200 text-gray-500'))}>
                <Moon className="w-4 h-4" /> Après-midi
              </button>
            </motion.div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Début</label>
              <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); if (!endDate) setEndDate(e.target.value) }} className={cn("w-full px-4 py-3 rounded-xl focus:outline-none", isDark ? "bg-dark-800 border border-dark-700 text-white focus:border-gold-500" : "bg-white border border-gray-300 text-gray-900 focus:border-orange-500")} />
            </div>
            <div>
              <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Fin</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} className={cn("w-full px-4 py-3 rounded-xl focus:outline-none", isDark ? "bg-dark-800 border border-dark-700 text-white focus:border-gold-500" : "bg-white border border-gray-300 text-gray-900 focus:border-orange-500")} />
            </div>
          </div>
          
          {startDate && endDate && (
            <div className={cn("flex items-center justify-center gap-2 p-3 rounded-xl", isDark ? "bg-gold-500/10 border border-gold-500/20" : "bg-orange-50 border border-orange-200")}>
              <CalendarDays className={cn("w-5 h-5", isDark ? "text-gold-400" : "text-orange-500")} />
              <span className={cn("font-semibold", isDark ? "text-gold-400" : "text-orange-600")}>{calculateDays()} jour(s) ouvré(s)</span>
            </div>
          )}
          
          <div>
            <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Motif (optionnel)</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ex: Vacances familiales..." rows={2} className={cn("w-full px-4 py-3 rounded-xl resize-none focus:outline-none", isDark ? "bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-gold-500" : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500")} />
          </div>
          
          <div className={cn("flex items-start gap-3 p-3 rounded-xl", isDark ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-200")}>
            <Info className={cn("w-5 h-5 flex-shrink-0", isDark ? "text-blue-400" : "text-blue-600")} />
            <p className={cn("text-sm", isDark ? "text-blue-300" : "text-blue-700")}>Votre manager sera notifié immédiatement</p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <motion.button onClick={() => setModalOpen(false)} className={cn("flex-1 py-3 rounded-xl font-medium", isDark ? "bg-dark-800 hover:bg-dark-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700")} whileTap={{ scale: 0.98 }}>Annuler</motion.button>
            <motion.button onClick={handleSubmit} disabled={!startDate || !endDate} className={cn("flex-1 py-3 rounded-xl font-semibold disabled:opacity-50", isDark ? "bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950" : "bg-gradient-to-r from-orange-500 to-amber-500 text-white")} whileTap={{ scale: 0.98 }}>Soumettre</motion.button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
