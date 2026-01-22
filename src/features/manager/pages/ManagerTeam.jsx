import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, Filter, UserCheck, UserX, Clock, Calendar, Mail, ChevronDown, Trophy, Flame, AlertTriangle, Eye, MoreVertical, TrendingUp, Star, MessageSquare } from 'lucide-react'
import { staggerContainer, staggerItem } from '@shared/lib/animations'
import { Modal } from '@shared/components/ui'
import { StatusBadge, ProgressBar, EmptyState } from '@shared/components/ui/ExtendedUI'
import { useApp } from '@shared/context/AppContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

const STATUS_FILTERS = [
  { id: 'all', label: 'Tous', count: null },
  { id: 'active', label: 'Actifs', count: null },
  { id: 'late', label: 'En retard', count: null },
  { id: 'leave', label: 'En congé', count: null },
]

export default function ManagerTeam() {
  const { team, stats, sendReminder, addToast, teamLeaves } = useApp()
  const { isDark } = useTheme()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [selectedMember, setSelectedMember] = useState(null)
  const [reminderSent, setReminderSent] = useState([])

  const filteredTeam = useMemo(() => {
    let result = [...team]
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(m => m.name.toLowerCase().includes(s) || m.role.toLowerCase().includes(s) || m.project.toLowerCase().includes(s))
    }
    if (statusFilter !== 'all') result = result.filter(m => m.status === statusFilter)
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'level') return b.level - a.level
      if (sortBy === 'streak') return b.streak - a.streak
      if (sortBy === 'hours') return b.hoursThisWeek - a.hoursThisWeek
      return 0
    })
    return result
  }, [team, search, statusFilter, sortBy])

  const filterCounts = useMemo(() => ({
    all: team.length,
    active: team.filter(m => m.status === 'active').length,
    late: team.filter(m => m.status === 'late').length,
    leave: team.filter(m => m.status === 'leave').length,
  }), [team])

  const handleSendReminder = (member) => {
    if (!reminderSent.includes(member.id)) {
      sendReminder(member.id)
      setReminderSent([...reminderSent, member.id])
    }
  }

  const getStatusColor = (status) => ({ active: 'emerald', late: 'rose', leave: 'violet' }[status] || 'gray')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl sm:text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Mon Équipe</h1>
          <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>{stats.totalTeam} consultants • {stats.activeConsultants} actifs</p>
        </div>
        
        <div className="flex items-center gap-3">
          {stats.lateConsultants.length > 0 && (
            <motion.div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border", isDark ? "bg-rose-500/10 border-rose-500/30" : "bg-rose-50 border-rose-200")} animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <AlertTriangle className={cn("w-4 h-4", isDark ? "text-rose-400" : "text-rose-600")} />
              <span className={cn("text-sm font-medium", isDark ? "text-rose-400" : "text-rose-600")}>{stats.lateConsultants.length} en retard</span>
            </motion.div>
          )}
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl", isDark ? "bg-dark-800" : "bg-gray-100")}>
            <Users className={cn("w-4 h-4", isDark ? "text-dark-400" : "text-gray-500")} />
            <span className={cn("text-sm", isDark ? "text-dark-300" : "text-gray-600")}>{stats.onLeave.length} en congé</span>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", isDark ? "text-dark-500" : "text-gray-400")} />
          <input
            type="text"
            placeholder="Rechercher un consultant..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={cn("w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none", isDark ? "bg-dark-900 border border-dark-800 text-white placeholder-dark-500 focus:border-gold-500" : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500")}
          />
        </div>
        
        <div className={cn("flex items-center gap-2 p-1 rounded-xl border", isDark ? "bg-dark-900 border-dark-800" : "bg-gray-50 border-gray-200")}>
          {STATUS_FILTERS.map(filter => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                statusFilter === filter.id
                  ? isDark ? "bg-gold-500/10 text-gold-400" : "bg-orange-50 text-orange-600"
                  : isDark ? "text-dark-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
              )}
            >
              {filter.label}
              <span className={cn("px-1.5 py-0.5 rounded text-xs", statusFilter === filter.id ? (isDark ? "bg-gold-500/20" : "bg-orange-100") : (isDark ? "bg-dark-800" : "bg-gray-200"))}>
                {filterCounts[filter.id]}
              </span>
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className={cn("px-4 py-3 rounded-xl focus:outline-none", isDark ? "bg-dark-900 border border-dark-800 text-white focus:border-gold-500" : "bg-white border border-gray-200 text-gray-900 focus:border-orange-500")}
        >
          <option value="name">Nom</option>
          <option value="level">Niveau</option>
          <option value="streak">Streak</option>
          <option value="hours">Heures</option>
        </select>
      </div>

      {/* Liste de l'équipe */}
      {filteredTeam.length === 0 ? (
        <EmptyState icon="users" title="Aucun consultant trouvé" description="Essayez de modifier vos filtres de recherche" />
      ) : (
        <motion.div className="grid gap-4" variants={staggerContainer} initial="hidden" animate="visible">
          {filteredTeam.map((member) => {
            const statusColor = getStatusColor(member.status)
            const isLate = member.status === 'late'
            const isOnLeave = member.status === 'leave'
            const hasReminder = reminderSent.includes(member.id)
            
            return (
              <motion.div
                key={member.id}
                variants={staggerItem}
                className={cn(
                  "rounded-2xl border overflow-hidden transition-all",
                  isDark ? "bg-dark-900/80 border-dark-800 hover:border-dark-700" : "bg-white border-gray-200 hover:border-gray-300 shadow-sm",
                  isLate && "ring-2 ring-rose-500/30"
                )}
              >
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-xl object-cover" />
                      <span className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2", isDark ? "border-dark-900" : "border-white", `bg-${statusColor}-500`)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn("font-semibold truncate", isDark ? "text-white" : "text-gray-900")}>{member.name}</h3>
                        <StatusBadge status={member.status} size="sm" />
                      </div>
                      <p className={cn("text-sm truncate", isDark ? "text-dark-400" : "text-gray-500")}>{member.role}</p>
                      <p className={cn("text-xs truncate", isDark ? "text-dark-500" : "text-gray-400")}>{member.project}</p>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Trophy className={cn("w-4 h-4", isDark ? "text-gold-400" : "text-orange-500")} />
                          <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>{member.level}</span>
                        </div>
                        <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>Niveau</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Flame className={cn("w-4 h-4", member.streak > 0 ? "text-amber-400" : (isDark ? "text-dark-600" : "text-gray-400"))} />
                          <span className={cn("text-lg font-bold", member.streak > 0 ? (isDark ? "text-white" : "text-gray-900") : (isDark ? "text-dark-600" : "text-gray-400"))}>{member.streak}</span>
                        </div>
                        <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>Streak</p>
                      </div>

                      <div className="text-center min-w-[60px]">
                        <p className={cn("text-lg font-bold mb-1", member.hoursThisWeek >= 40 ? "text-emerald-400" : member.hoursThisWeek >= 32 ? "text-amber-400" : "text-rose-400")}>{member.hoursThisWeek}h</p>
                        <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>/ 40h</p>
                      </div>

                      <StatusBadge status={member.timesheetStatus} />
                    </div>

                    <div className="flex items-center gap-2">
                      {isLate && !hasReminder && (
                        <motion.button onClick={() => handleSendReminder(member)} className={cn("flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium", isDark ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400" : "bg-rose-50 hover:bg-rose-100 text-rose-600")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Mail className="w-4 h-4" /><span className="hidden lg:inline">Rappeler</span>
                        </motion.button>
                      )}
                      {isLate && hasReminder && (
                        <span className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm", isDark ? "bg-dark-800 text-dark-400" : "bg-gray-100 text-gray-500")}>
                          <UserCheck className="w-4 h-4" /><span className="hidden lg:inline">Rappel envoyé</span>
                        </span>
                      )}
                      <motion.button onClick={() => setSelectedMember(member)} className={cn("p-2.5 rounded-xl", isDark ? "bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900")} whileTap={{ scale: 0.95 }}>
                        <Eye className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="md:hidden mt-4">
                    <ProgressBar value={member.hoursThisWeek} max={40} color={member.hoursThisWeek >= 40 ? 'emerald' : member.hoursThisWeek >= 32 ? 'gold' : 'rose'} showLabel label={`${member.hoursThisWeek}h / 40h cette semaine`} />
                  </div>

                  {isLate && (
                    <motion.div className={cn("mt-4 p-3 rounded-xl flex items-center gap-3 border", isDark ? "bg-rose-500/10 border-rose-500/20" : "bg-rose-50 border-rose-200")} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      <AlertTriangle className={cn("w-5 h-5 flex-shrink-0", isDark ? "text-rose-400" : "text-rose-600")} />
                      <p className={cn("text-sm", isDark ? "text-rose-300" : "text-rose-700")}><span className="font-medium">{member.daysLate} jours</span> sans saisie de temps</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Modal détail membre */}
      <Modal isOpen={!!selectedMember} onClose={() => setSelectedMember(null)} title={selectedMember?.name} subtitle={selectedMember?.role} maxWidth="max-w-lg">
        {selectedMember && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img src={selectedMember.avatar} alt={selectedMember.name} className="w-20 h-20 rounded-2xl object-cover" />
              <div>
                <h3 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>{selectedMember.name}</h3>
                <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>{selectedMember.role}</p>
                <p className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-400")}>{selectedMember.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className={cn("text-center p-4 rounded-xl", isDark ? "bg-dark-800/50" : "bg-gray-50")}>
                <Trophy className={cn("w-6 h-6 mx-auto mb-2", isDark ? "text-gold-400" : "text-orange-500")} />
                <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>{selectedMember.level}</p>
                <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>Niveau</p>
              </div>
              <div className={cn("text-center p-4 rounded-xl", isDark ? "bg-dark-800/50" : "bg-gray-50")}>
                <Flame className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>{selectedMember.streak}</p>
                <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>Streak</p>
              </div>
              <div className={cn("text-center p-4 rounded-xl", isDark ? "bg-dark-800/50" : "bg-gray-50")}>
                <Star className="w-6 h-6 text-violet-400 mx-auto mb-2" />
                <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>{selectedMember.xp.toLocaleString()}</p>
                <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>XP Total</p>
              </div>
            </div>

            <div className={cn("p-4 rounded-xl", isDark ? "bg-dark-800/50" : "bg-gray-50")}>
              <p className={cn("text-sm mb-1", isDark ? "text-dark-400" : "text-gray-500")}>Projet actuel</p>
              <p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{selectedMember.project}</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Heures cette semaine</span>
                <span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{selectedMember.hoursThisWeek}h / 40h</span>
              </div>
              <ProgressBar value={selectedMember.hoursThisWeek} max={40} color={selectedMember.hoursThisWeek >= 40 ? 'emerald' : 'gold'} />
            </div>

            <div className="flex gap-3">
              <motion.button onClick={() => setSelectedMember(null)} className={cn("flex-1 py-3 rounded-xl font-medium", isDark ? "bg-dark-800 hover:bg-dark-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700")} whileTap={{ scale: 0.98 }}>Fermer</motion.button>
              <motion.button className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold", isDark ? "bg-gold-500 hover:bg-gold-600 text-dark-950" : "bg-orange-500 hover:bg-orange-600 text-white")} whileTap={{ scale: 0.98 }}>
                <MessageSquare className="w-4 h-4" />Contacter
              </motion.button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
