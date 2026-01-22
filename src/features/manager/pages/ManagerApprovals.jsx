import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Calendar, FileText, AlertTriangle, CheckCheck, Sparkles } from 'lucide-react'
import { staggerContainer, staggerItem } from '@shared/lib/animations'
import { Modal, EmptyState, ConfirmModal } from '@shared/components/ui'
import { useApp } from '@shared/context/AppContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'
import confetti from 'canvas-confetti'

export default function ManagerApprovals() {
  const { pendingApprovals, approveItem, rejectItem, approveAll, addToast } = useApp()
  const { isDark } = useTheme()
  const [typeFilter, setTypeFilter] = useState('all')
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [confirmAllOpen, setConfirmAllOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [approvedIds, setApprovedIds] = useState([])

  const pendingItems = pendingApprovals.filter(i => i.status === 'pending')
  const filteredItems = pendingItems.filter(item => typeFilter === 'all' || item.type === typeFilter)
  const pendingCount = pendingItems.length
  
  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  
  const handleApprove = (id) => {
    setApprovedIds(prev => [...prev, id])
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 }, colors: ['#F59E0B', '#10B981', '#3B82F6'] })
    setTimeout(() => { approveItem(id); setApprovedIds(prev => prev.filter(i => i !== id)) }, 300)
  }
  
  const handleApproveSelected = () => {
    selectedIds.forEach((id, i) => setTimeout(() => handleApprove(id), i * 200))
    setSelectedIds([])
  }
  
  const handleApproveAll = () => {
    setConfirmAllOpen(false)
    filteredItems.forEach((item, i) => setTimeout(() => handleApprove(item.id), i * 150))
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
  }
  
  const handleReject = () => { 
    if (selectedItem && rejectReason.trim()) { 
      rejectItem(selectedItem.id, rejectReason)
      setRejectModalOpen(false)
      setRejectReason('')
      setSelectedItem(null)
    } 
  }

  const filterButtons = [
    { t: 'all', count: pendingCount, label: 'En attente', icon: Clock, color: 'amber' },
    { t: 'timesheet', count: pendingItems.filter(i => i.type === 'timesheet').length, label: 'Timesheets', icon: FileText, color: 'blue' },
    { t: 'leave', count: pendingItems.filter(i => i.type === 'leave').length, label: 'Congés', icon: Calendar, color: 'violet' },
  ]

  const colorMap = {
    amber: { bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', border: isDark ? 'border-amber-500/30' : 'border-amber-200', iconBg: 'bg-amber-500/20', text: isDark ? 'text-amber-400' : 'text-amber-600' },
    blue: { bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50', border: isDark ? 'border-blue-500/30' : 'border-blue-200', iconBg: 'bg-blue-500/20', text: isDark ? 'text-blue-400' : 'text-blue-600' },
    violet: { bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50', border: isDark ? 'border-violet-500/30' : 'border-violet-200', iconBg: 'bg-violet-500/20', text: isDark ? 'text-violet-400' : 'text-violet-600' },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl sm:text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Approbations</h1>
          <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>
            <span className={cn("font-semibold", isDark ? "text-amber-400" : "text-amber-600")}>{pendingCount}</span> demande{pendingCount > 1 ? 's' : ''} en attente
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <motion.button onClick={handleApproveSelected} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileTap={{ scale: 0.98 }}>
              <CheckCheck className="w-4 h-4" />Approuver ({selectedIds.length})
            </motion.button>
          )}
          {pendingCount > 1 && (
            <motion.button onClick={() => setConfirmAllOpen(true)} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm", isDark ? "bg-gold-500 hover:bg-gold-600 text-dark-950" : "bg-orange-500 hover:bg-orange-600 text-white")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Sparkles className="w-4 h-4" />Tout approuver
            </motion.button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-3 gap-4">
        {filterButtons.map(({ t, count, label, icon: Icon, color }) => {
          const colors = colorMap[color]
          return (
            <motion.button key={t} onClick={() => setTypeFilter(t)} className={cn("p-4 rounded-2xl border transition-all", typeFilter === t ? `${colors.bg} ${colors.border}` : (isDark ? 'bg-dark-900/80 border-dark-800 hover:border-dark-700' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'))} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.iconBg)}>
                  <Icon className={cn("w-5 h-5", colors.text)} />
                </div>
                <div className="text-left">
                  <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>{count}</p>
                  <p className={cn("text-xs", isDark ? "text-dark-400" : "text-gray-500")}>{label}</p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Liste */}
      {filteredItems.length === 0 ? (
        <motion.div className={cn("rounded-2xl border p-12 text-center", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4", isDark ? "bg-emerald-500/10" : "bg-emerald-50")} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <CheckCircle className={cn("w-8 h-8", isDark ? "text-emerald-400" : "text-emerald-600")} />
          </motion.div>
          <p className={cn("font-medium text-lg mb-2", isDark ? "text-white" : "text-gray-900")}>Tout est à jour ! 🎉</p>
          <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>Aucune demande en attente de validation</p>
        </motion.div>
      ) : (
        <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="visible">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div 
                key={item.id} 
                variants={staggerItem}
                layout
                exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
                className={cn(
                  "rounded-2xl border transition-all",
                  approvedIds.includes(item.id) 
                    ? 'border-emerald-500/50 bg-emerald-500/5' 
                    : selectedIds.includes(item.id) 
                      ? isDark ? 'border-gold-500/50 ring-2 ring-gold-500/20 bg-dark-900/80' : 'border-orange-400 ring-2 ring-orange-200 bg-white'
                      : isDark ? 'bg-dark-900/80 border-dark-800 hover:border-dark-700' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                )}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-4">
                    <motion.button onClick={() => toggleSelect(item.id)} className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0", selectedIds.includes(item.id) ? (isDark ? 'bg-gold-500 border-gold-500 text-dark-950' : 'bg-orange-500 border-orange-500 text-white') : (isDark ? 'border-dark-600 hover:border-gold-500' : 'border-gray-300 hover:border-orange-500'))} whileTap={{ scale: 0.9 }}>
                      {selectedIds.includes(item.id) && <CheckCircle className="w-4 h-4" />}
                    </motion.button>
                    
                    <img src={item.user.avatar} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{item.user.name}</h3>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", item.type === 'timesheet' ? (isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600') : (isDark ? 'bg-violet-500/10 text-violet-400' : 'bg-violet-100 text-violet-600'))}>
                          {item.type === 'timesheet' ? 'Timesheet' : 'Congé'}
                        </span>
                      </div>
                      <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{item.period}</p>
                      <p className={cn("text-sm mt-1", isDark ? "text-dark-500" : "text-gray-400")}>
                        {item.type === 'timesheet' ? `${item.hours}h` : `${item.days}j • ${item.leaveType}`}
                        {item.notes && ` • ${item.notes}`}
                      </p>
                    </div>
                    
                    <span className={cn("text-xs hidden sm:block flex-shrink-0", isDark ? "text-dark-500" : "text-gray-400")}>{item.submittedAt}</span>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button onClick={() => handleApprove(item.id)} className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100")} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={approvedIds.includes(item.id)}>
                        <CheckCircle className="w-5 h-5" />
                      </motion.button>
                      <motion.button onClick={() => { setSelectedItem(item); setRejectModalOpen(true) }} className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20" : "bg-rose-50 text-rose-600 hover:bg-rose-100")} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <XCircle className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal confirmation tout approuver */}
      <ConfirmModal isOpen={confirmAllOpen} onClose={() => setConfirmAllOpen(false)} onConfirm={handleApproveAll} title="Tout approuver ?" description={`Vous êtes sur le point d'approuver ${filteredItems.length} demande${filteredItems.length > 1 ? 's' : ''} d'un coup. Cette action est irréversible.`} confirmLabel="Tout approuver" type="success" />

      {/* Modal de rejet */}
      <Modal isOpen={rejectModalOpen} onClose={() => { setRejectModalOpen(false); setRejectReason('') }} title="Refuser la demande" icon={AlertTriangle} iconColor="rose">
        <div className="space-y-4">
          {selectedItem && (
            <div className={cn("flex items-center gap-3 p-3 rounded-xl", isDark ? "bg-dark-800/50" : "bg-gray-50")}>
              <img src={selectedItem.user.avatar} alt="" className="w-10 h-10 rounded-lg" />
              <div>
                <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{selectedItem.user.name}</p>
                <p className={cn("text-xs", isDark ? "text-dark-400" : "text-gray-500")}>{selectedItem.period}</p>
              </div>
            </div>
          )}
          <div>
            <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Motif du refus *</label>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Expliquez la raison du refus..." rows={4} className={cn("w-full px-4 py-3 rounded-xl resize-none focus:outline-none", isDark ? "bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-rose-500" : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-rose-500")} />
          </div>
          <div className="flex gap-3">
            <motion.button onClick={() => { setRejectModalOpen(false); setRejectReason('') }} className={cn("flex-1 py-3 rounded-xl font-medium", isDark ? "bg-dark-800 hover:bg-dark-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700")} whileTap={{ scale: 0.98 }}>Annuler</motion.button>
            <motion.button onClick={handleReject} disabled={!rejectReason.trim()} className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed" whileTap={{ scale: 0.98 }}>Confirmer le refus</motion.button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
