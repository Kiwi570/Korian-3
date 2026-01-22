import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Clock, CheckCircle, CalendarDays, AlertTriangle, ArrowUpRight, TrendingUp, ChevronRight, UserCheck, UserX, Zap, Mail } from 'lucide-react'
import { staggerContainer, staggerItem } from '@shared/lib/animations'
import { Modal } from '@shared/components/ui'
import LeaveCalendar from '@shared/components/LeaveCalendar'
import { useApp } from '@shared/context/AppContext'
import { useAuth } from '@shared/context/AuthContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

// Données de démo
const LATE_CONSULTANTS = [
  { id: 1, name: 'Lucas Bernard', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', daysLate: 5, lastEntry: '2026-01-17' },
  { id: 2, name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', daysLate: 3, lastEntry: '2026-01-19' },
]

const UPCOMING_LEAVES = [
  { id: 1, name: 'Paul Martin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', dates: '26-30 Jan', days: 5, type: 'CP' },
  { id: 2, name: 'Marie Dupont', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', dates: '28 Jan - 2 Fév', days: 4, type: 'CP' },
  { id: 3, name: 'Sophie Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', dates: '23 Jan', days: 1, type: 'RTT' },
]

export default function ManagerDashboard() {
  const navigate = useNavigate()
  const { users, pendingApprovals, approveItem, rejectItem, addToast } = useApp()
  const { user } = useAuth()
  const { isDark } = useTheme()
  const pendingCount = pendingApprovals.filter(a => a.status === 'pending').length
  const displayedApprovals = pendingApprovals.filter(a => a.status === 'pending').slice(0, 4)
  
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [reminderSent, setReminderSent] = useState([])
  const [showApproveAllConfirm, setShowApproveAllConfirm] = useState(false)
  
  const handleOpenRejectModal = (item) => {
    setSelectedItem(item)
    setRejectReason('')
    setRejectModalOpen(true)
  }
  
  const handleConfirmReject = () => {
    if (selectedItem && rejectReason.trim()) {
      rejectItem(selectedItem.id, rejectReason)
      setRejectModalOpen(false)
      setRejectReason('')
      setSelectedItem(null)
    }
  }
  
  const handleSendReminder = (consultantId, consultantName) => {
    if (!reminderSent.includes(consultantId)) {
      setReminderSent([...reminderSent, consultantId])
      addToast(`Rappel envoyé à ${consultantName}`, 'success')
    }
  }
  
  const confirmApproveAll = () => {
    const pending = pendingApprovals.filter(a => a.status === 'pending')
    pending.forEach(item => approveItem(item.id))
    addToast(`${pending.length} élément(s) approuvé(s)`, 'success')
    setShowApproveAllConfirm(false)
  }

  const stats = [
    { label: 'Consultants actifs', value: '12', change: '+2', trend: 'up', icon: Users, color: 'blue' },
    { label: 'En attente', value: pendingCount, icon: Clock, color: 'amber', alert: pendingCount > 0 },
    { label: 'Validés ce mois', value: '89%', change: '+12%', trend: 'up', icon: CheckCircle, color: 'emerald' },
    { label: 'Retards saisie', value: LATE_CONSULTANTS.length, icon: AlertTriangle, color: 'rose', alert: LATE_CONSULTANTS.length > 0 },
  ]

  const colorMap = {
    blue: { light: 'bg-blue-50 text-blue-600', dark: 'bg-blue-500/10 text-blue-400', ring: 'ring-blue-500/30', dot: 'bg-blue-500' },
    amber: { light: 'bg-amber-50 text-amber-600', dark: 'bg-amber-500/10 text-amber-400', ring: 'ring-amber-500/30', dot: 'bg-amber-500' },
    emerald: { light: 'bg-emerald-50 text-emerald-600', dark: 'bg-emerald-500/10 text-emerald-400', ring: 'ring-emerald-500/30', dot: 'bg-emerald-500' },
    rose: { light: 'bg-rose-50 text-rose-600', dark: 'bg-rose-500/10 text-rose-400', ring: 'ring-rose-500/30', dot: 'bg-rose-500' },
    violet: { light: 'bg-violet-50 text-violet-600', dark: 'bg-violet-500/10 text-violet-400', ring: 'ring-violet-500/30', dot: 'bg-violet-500' },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl sm:text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>
            Bonjour, {users.manager.name} 👋
          </h1>
          <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Voici l'aperçu de votre équipe</p>
        </div>
        <motion.button
          onClick={() => navigate('/app/manager/reports')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors",
            isDark ? "bg-dark-800 hover:bg-dark-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          )}
          whileTap={{ scale: 0.98 }}
        >
          <TrendingUp className="w-4 h-4" />
          Rapports
        </motion.button>
      </div>

      {/* Stats */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer} initial="hidden" animate="visible">
        {stats.map((stat) => {
          const Icon = stat.icon
          const colors = colorMap[stat.color]
          return (
            <motion.div 
              key={stat.label} 
              variants={staggerItem} 
              className={cn(
                "relative p-5 rounded-2xl border transition-all",
                isDark 
                  ? "bg-dark-900/80 border-dark-800 hover:border-dark-700" 
                  : "bg-white border-gray-200 shadow-sm hover:shadow-md",
                stat.alert && `ring-2 ${colors.ring}`
              )} 
              whileHover={{ y: -2 }}
            >
              {stat.alert && <span className={`absolute -top-1.5 -right-1.5 w-3 h-3 ${colors.dot} rounded-full animate-pulse`} />}
              <div className="flex items-start justify-between mb-3">
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", isDark ? colors.dark : colors.light)}>
                  <Icon className="w-5 h-5" />
                </div>
                {stat.trend && (
                  <span className={cn("flex items-center gap-1 text-xs font-medium", isDark ? "text-emerald-400" : "text-emerald-600")}>
                    <ArrowUpRight className="w-3 h-3" />{stat.change}
                  </span>
                )}
              </div>
              <p className={cn("text-2xl font-bold mb-0.5", isDark ? "text-white" : "text-gray-900")}>{stat.value}</p>
              <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{stat.label}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Alerts Section */}
      {LATE_CONSULTANTS.length > 0 && (
        <motion.div 
          className={cn(
            "rounded-2xl p-5 border",
            isDark ? "bg-rose-500/10 border-rose-500/30" : "bg-rose-50 border-rose-200"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-rose-500/20" : "bg-rose-100")}>
              <AlertTriangle className={cn("w-5 h-5", isDark ? "text-rose-400" : "text-rose-600")} />
            </div>
            <div>
              <h3 className={cn("font-semibold", isDark ? "text-rose-400" : "text-rose-700")}>Retards de saisie</h3>
              <p className={cn("text-sm", isDark ? "text-dark-400" : "text-rose-600/70")}>{LATE_CONSULTANTS.length} consultant(s) n'ont pas saisi leurs heures</p>
            </div>
          </div>
          <div className="space-y-2">
            {LATE_CONSULTANTS.map((c) => (
              <div key={c.id} className={cn(
                "flex items-center justify-between p-3 rounded-xl",
                isDark ? "bg-dark-900/50" : "bg-white"
              )}>
                <div className="flex items-center gap-3">
                  <img src={c.avatar} alt="" className="w-9 h-9 rounded-lg object-cover" />
                  <div>
                    <p className={cn("font-medium text-sm", isDark ? "text-white" : "text-gray-900")}>{c.name}</p>
                    <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>{c.daysLate} jours de retard</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleSendReminder(c.id, c.name)}
                  disabled={reminderSent.includes(c.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    reminderSent.includes(c.id)
                      ? isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                      : isDark ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30" : "bg-rose-100 text-rose-600 hover:bg-rose-200"
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  {reminderSent.includes(c.id) ? <><CheckCircle className="w-3 h-3" />Envoyé</> : <><Mail className="w-3 h-3" />Rappeler</>}
                </motion.button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className={cn(
          "rounded-2xl border overflow-hidden",
          isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm"
        )}>
          <div className={cn("p-5 border-b flex items-center justify-between", isDark ? "border-dark-800" : "border-gray-100")}>
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-amber-500/10" : "bg-amber-50")}>
                <Clock className={cn("w-5 h-5", isDark ? "text-amber-400" : "text-amber-600")} />
              </div>
              <div>
                <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>En attente</h2>
                <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{pendingCount} demande(s)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <motion.button
                  onClick={() => setShowApproveAllConfirm(true)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                    isDark ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="w-3 h-3" />Tout approuver
                </motion.button>
              )}
              <motion.button
                onClick={() => navigate('/app/manager/approvals')}
                className={cn("flex items-center gap-1 text-sm font-medium", isDark ? "text-gold-400 hover:text-gold-300" : "text-orange-600 hover:text-orange-500")}
                whileHover={{ x: 4 }}
              >
                Voir tout<ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          <div className={cn("divide-y", isDark ? "divide-dark-800" : "divide-gray-100")}>
            {displayedApprovals.length === 0 ? (
              <div className="p-8 text-center">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4", isDark ? "bg-emerald-500/10" : "bg-emerald-50")}>
                  <CheckCircle className={cn("w-8 h-8", isDark ? "text-emerald-400" : "text-emerald-600")} />
                </div>
                <p className={cn("font-medium", isDark ? "text-dark-300" : "text-gray-700")}>Tout est à jour !</p>
                <p className={cn("text-sm mt-1", isDark ? "text-dark-500" : "text-gray-500")}>Aucune demande en attente</p>
              </div>
            ) : displayedApprovals.map((item, i) => (
              <motion.div 
                key={item.id} 
                className={cn("p-4", isDark ? "hover:bg-dark-800/50" : "hover:bg-gray-50")} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <img src={item.user.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={cn("font-medium truncate", isDark ? "text-white" : "text-gray-900")}>{item.user.name}</p>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        item.type === 'timesheet' 
                          ? isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
                          : isDark ? 'bg-violet-500/10 text-violet-400' : 'bg-violet-100 text-violet-600'
                      )}>
                        {item.type === 'timesheet' ? 'Timesheet' : 'Congé'}
                      </span>
                    </div>
                    <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{item.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button 
                      onClick={() => approveItem(item.id)} 
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center",
                        isDark ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                      )} 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <UserCheck className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                      onClick={() => handleOpenRejectModal(item)} 
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center",
                        isDark ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20" : "bg-rose-100 text-rose-600 hover:bg-rose-200"
                      )} 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <UserX className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Leaves */}
        <div className={cn(
          "rounded-2xl border overflow-hidden",
          isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm"
        )}>
          <div className={cn("p-5 border-b", isDark ? "border-dark-800" : "border-gray-100")}>
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-violet-500/10" : "bg-violet-50")}>
                <CalendarDays className={cn("w-5 h-5", isDark ? "text-violet-400" : "text-violet-600")} />
              </div>
              <div>
                <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>Congés équipe</h2>
                <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>Planning des absences</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {UPCOMING_LEAVES.map(leave => (
              <div key={leave.id} className={cn(
                "flex items-center gap-3 p-3 rounded-xl",
                isDark ? "bg-dark-800/50" : "bg-gray-50"
              )}>
                <img src={leave.avatar} alt="" className="w-9 h-9 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className={cn("font-medium text-sm truncate", isDark ? "text-white" : "text-gray-900")}>{leave.name}</p>
                  <p className={cn("text-xs", isDark ? "text-dark-400" : "text-gray-500")}>{leave.dates}</p>
                </div>
                <span className={cn(
                  "px-2 py-1 text-xs font-medium rounded-lg",
                  leave.type === 'CP' 
                    ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                    : isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
                )}>
                  {leave.days}j {leave.type}
                </span>
              </div>
            ))}
            <motion.button
              onClick={() => navigate('/app/manager/team')}
              className={cn(
                "w-full py-3 rounded-xl font-medium text-sm mt-2",
                isDark ? "bg-dark-800 hover:bg-dark-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              )}
              whileTap={{ scale: 0.98 }}
            >
              Voir le planning complet
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Calendrier complet des congés */}
      <div className="mt-6">
        <LeaveCalendar showTeam={true} />
      </div>
      
      {/* Modal de refus */}
      <Modal isOpen={rejectModalOpen} onClose={() => { setRejectModalOpen(false); setRejectReason('') }} title="Refuser la demande" icon={AlertTriangle} iconColor="rose">
        <div className="space-y-4">
          {selectedItem && (
            <div className={cn("flex items-center gap-3 p-3 rounded-xl", isDark ? "bg-dark-800/50" : "bg-gray-50")}>
              <img src={selectedItem.user.avatar} alt="" className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{selectedItem.user.name}</p>
                <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{selectedItem.type === 'timesheet' ? 'Timesheet' : 'Congé'} • {selectedItem.period}</p>
              </div>
            </div>
          )}
          <div>
            <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Motif du refus *</label>
            <textarea 
              value={rejectReason} 
              onChange={(e) => setRejectReason(e.target.value)} 
              placeholder="Expliquez la raison du refus..." 
              rows={4} 
              className={cn(
                "w-full px-4 py-3 rounded-xl resize-none focus:outline-none focus:ring-2",
                isDark 
                  ? "bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:ring-rose-500/50" 
                  : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-rose-500/50 focus:border-rose-500"
              )} 
            />
          </div>
          <div className="flex gap-3">
            <motion.button 
              onClick={() => { setRejectModalOpen(false); setRejectReason('') }} 
              className={cn(
                "flex-1 py-3 rounded-xl font-medium",
                isDark ? "bg-dark-800 hover:bg-dark-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              )} 
              whileTap={{ scale: 0.98 }}
            >
              Annuler
            </motion.button>
            <motion.button 
              onClick={handleConfirmReject} 
              disabled={!rejectReason.trim()} 
              className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed" 
              whileTap={{ scale: 0.98 }}
            >
              Confirmer le refus
            </motion.button>
          </div>
        </div>
      </Modal>
      
      {/* Modal confirmation Tout approuver */}
      <AnimatePresence>
        {showApproveAllConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowApproveAllConfirm(false)}
          >
            <motion.div
              className={cn(
                "rounded-2xl p-6 max-w-sm w-full border",
                isDark ? "bg-dark-900 border-dark-800" : "bg-white border-gray-200 shadow-xl"
              )}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4", isDark ? "bg-emerald-500/10" : "bg-emerald-50")}>
                <Zap className={cn("w-6 h-6", isDark ? "text-emerald-400" : "text-emerald-600")} />
              </div>
              <h3 className={cn("text-lg font-semibold text-center mb-2", isDark ? "text-white" : "text-gray-900")}>Tout approuver ?</h3>
              <p className={cn("text-sm text-center mb-4", isDark ? "text-dark-400" : "text-gray-500")}>
                Vous allez approuver <span className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{pendingCount} demande{pendingCount > 1 ? 's' : ''}</span> en attente.
              </p>
              <div className="space-y-2 mb-6 max-h-32 overflow-y-auto">
                {displayedApprovals.map(item => (
                  <div key={item.id} className={cn("flex items-center gap-2 p-2 rounded-lg text-xs", isDark ? "bg-dark-800/50" : "bg-gray-50")}>
                    <img src={item.user.avatar} alt="" className="w-6 h-6 rounded object-cover" />
                    <span className={cn(isDark ? "text-white" : "text-gray-900")}>{item.user.name}</span>
                    <span className={cn(isDark ? "text-dark-500" : "text-gray-400")}>•</span>
                    <span className={cn(isDark ? "text-dark-400" : "text-gray-500")}>{item.type === 'timesheet' ? 'Timesheet' : 'Congé'}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowApproveAllConfirm(false)} 
                  className={cn(
                    "flex-1 py-3 rounded-xl font-medium",
                    isDark ? "bg-dark-800 hover:bg-dark-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  )}
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmApproveAll} 
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
