import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Users, Palmtree, Briefcase, Heart, Calendar, AlertTriangle } from 'lucide-react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

const TEAM_LEAVES = [
  { id: 1, name: 'Paul Martin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', type: 'paid', start: '2026-01-26', end: '2026-01-30', color: 'emerald' },
  { id: 2, name: 'Marie Dupont', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', type: 'paid', start: '2026-01-28', end: '2026-02-02', color: 'emerald' },
  { id: 3, name: 'Lucas Bernard', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', type: 'rtt', start: '2026-01-23', end: '2026-01-23', color: 'blue' },
  { id: 4, name: 'Sophie Chen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', type: 'sick', start: '2026-01-22', end: '2026-01-24', color: 'rose' },
  { id: 5, name: 'Paul Martin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', type: 'rtt', start: '2026-02-14', end: '2026-02-14', color: 'blue' },
]

const HOLIDAYS_LU = {
  '2026-01-01': 'Nouvel An',
  '2026-04-06': 'Lundi de Pâques',
  '2026-05-01': 'Fête du Travail',
  '2026-05-14': 'Ascension',
  '2026-05-25': 'Lundi de Pentecôte',
  '2026-06-23': 'Fête Nationale',
  '2026-08-15': 'Assomption',
  '2026-11-01': 'Toussaint',
  '2026-12-25': 'Noël',
  '2026-12-26': 'Saint-Étienne',
}

const TYPE_CONFIG = {
  paid: { label: 'CP', icon: Palmtree, bg: 'bg-emerald-500/20', bgLight: 'bg-emerald-100', text: 'text-emerald-400', textLight: 'text-emerald-600', border: 'border-emerald-500/30', borderLight: 'border-emerald-200' },
  rtt: { label: 'RTT', icon: Briefcase, bg: 'bg-blue-500/20', bgLight: 'bg-blue-100', text: 'text-blue-400', textLight: 'text-blue-600', border: 'border-blue-500/30', borderLight: 'border-blue-200' },
  sick: { label: 'Maladie', icon: Heart, bg: 'bg-rose-500/20', bgLight: 'bg-rose-100', text: 'text-rose-400', textLight: 'text-rose-600', border: 'border-rose-500/30', borderLight: 'border-rose-200' },
}

export default function LeaveCalendar({ userLeaves = [], showTeam = true }) {
  const { isDark } = useTheme()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  
  const allLeaves = useMemo(() => showTeam ? [...userLeaves, ...TEAM_LEAVES] : userLeaves, [userLeaves, showTeam])

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
    const days = []
    let day = startDate
    while (day <= endDate) { days.push(day); day = addDays(day, 1) }
    return days
  }, [currentMonth])

  const getLeavesForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return allLeaves.filter(leave => {
      const start = new Date(leave.start), end = new Date(leave.end), current = new Date(dateStr)
      return current >= start && current <= end
    })
  }

  const isHoliday = (date) => HOLIDAYS_LU[format(date, 'yyyy-MM-dd')]

  const getWeekAbsents = (date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 })
    const absentsThisWeek = new Set()
    for (let i = 0; i < 5; i++) {
      const d = addDays(weekStart, i)
      getLeavesForDay(d).forEach(l => absentsThisWeek.add(l.name))
    }
    return absentsThisWeek.size
  }

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
      {/* Header */}
      <div className={cn("p-4 sm:p-6 border-b", isDark ? "border-dark-800" : "border-gray-100")}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900")} whileTap={{ scale: 0.95 }}>
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            
            <div className="text-center min-w-[160px]">
              <h2 className={cn("text-xl font-bold capitalize", isDark ? "text-white" : "text-gray-900")}>
                {format(currentMonth, 'MMMM yyyy', { locale: fr })}
              </h2>
            </div>
            
            <motion.button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900")} whileTap={{ scale: 0.95 }}>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button onClick={() => setCurrentMonth(new Date())} className={cn("px-3 py-1.5 rounded-lg text-sm", isDark ? "bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900")} whileTap={{ scale: 0.98 }}>
              Aujourd'hui
            </motion.button>
          </div>
          
          {showTeam && (
            <div className="flex items-center gap-2 text-sm">
              <Users className={cn("w-4 h-4", isDark ? "text-dark-500" : "text-gray-400")} />
              <span className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Équipe visible</span>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className={cn("px-4 sm:px-6 py-3 border-b flex flex-wrap gap-4 text-xs", isDark ? "border-dark-800" : "border-gray-100")}>
        {[
          { color: 'bg-emerald-500', label: 'Congés payés' },
          { color: 'bg-blue-500', label: 'RTT' },
          { color: 'bg-rose-500', label: 'Maladie' },
          { color: 'bg-sky-500', label: 'Férié 🇱🇺' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className={cn(isDark ? "text-dark-400" : "text-gray-500")}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {dayNames.map(day => (
            <div key={day} className={cn("text-center text-xs sm:text-sm font-medium py-2", isDark ? "text-dark-500" : "text-gray-500")}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day, idx) => {
            const leaves = getLeavesForDay(day)
            const holiday = isHoliday(day)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isTodayDate = isToday(day)
            const isWeekend = day.getDay() === 0 || day.getDay() === 6
            const isSelected = selectedDay && isSameDay(day, selectedDay)
            
            return (
              <motion.button
                key={idx}
                onClick={() => setSelectedDay(isSameDay(day, selectedDay) ? null : day)}
                className={cn(
                  "relative min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 rounded-xl text-left transition-all border",
                  !isCurrentMonth && 'opacity-30',
                  isWeekend && (isDark ? 'bg-dark-800/30' : 'bg-gray-50'),
                  !isWeekend && !holiday && (isDark ? 'bg-dark-800/50' : 'bg-white'),
                  holiday && (isDark ? 'bg-sky-500/10 border-sky-500/30' : 'bg-sky-50 border-sky-200'),
                  !holiday && (isDark ? 'border-transparent' : 'border-gray-100'),
                  isTodayDate && (isDark ? 'ring-2 ring-gold-500' : 'ring-2 ring-orange-500'),
                  isSelected && (isDark ? 'ring-2 ring-violet-500 bg-violet-500/10' : 'ring-2 ring-violet-500 bg-violet-50'),
                  isDark ? 'hover:bg-dark-700/50' : 'hover:bg-gray-50'
                )}
                whileTap={{ scale: 0.98 }}
              >
                <div className={cn("text-sm font-medium mb-1",
                  isTodayDate && (isDark ? 'text-gold-400' : 'text-orange-600'),
                  holiday && !isTodayDate && 'text-sky-400',
                  isWeekend && !isTodayDate && !holiday && (isDark ? 'text-dark-600' : 'text-gray-400'),
                  !isWeekend && !isTodayDate && !holiday && (isDark ? 'text-white' : 'text-gray-900')
                )}>
                  {format(day, 'd')}
                </div>
                
                {holiday && (
                  <div className={cn("text-[10px] truncate mb-1", isDark ? "text-sky-400" : "text-sky-600")}>
                    🇱🇺 {holiday}
                  </div>
                )}
                
                <div className="space-y-0.5">
                  {leaves.slice(0, 3).map((leave, i) => {
                    const config = TYPE_CONFIG[leave.type] || TYPE_CONFIG.paid
                    return (
                      <div key={i} className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate", isDark ? `${config.bg} ${config.text}` : `${config.bgLight} ${config.textLight}`)}>
                        <img src={leave.avatar} alt="" className="w-3 h-3 rounded-full" />
                        <span className="truncate hidden sm:inline">{leave.name.split(' ')[0]}</span>
                      </div>
                    )
                  })}
                  {leaves.length > 3 && (
                    <div className={cn("text-[10px] pl-1", isDark ? "text-dark-500" : "text-gray-400")}>+{leaves.length - 3} autres</div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Selected Day Detail */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={cn("border-t", isDark ? "border-dark-800" : "border-gray-100")}>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>
                  {format(selectedDay, 'EEEE d MMMM yyyy', { locale: fr })}
                </h3>
                <button onClick={() => setSelectedDay(null)} className={cn("text-sm", isDark ? "text-dark-500 hover:text-white" : "text-gray-500 hover:text-gray-900")}>Fermer</button>
              </div>
              
              {isHoliday(selectedDay) && (
                <div className={cn("mb-4 p-3 rounded-xl flex items-center gap-3 border", isDark ? "bg-sky-500/10 border-sky-500/30" : "bg-sky-50 border-sky-200")}>
                  <span className="text-xl">🇱🇺</span>
                  <div>
                    <p className={cn("font-medium", isDark ? "text-sky-400" : "text-sky-600")}>{isHoliday(selectedDay)}</p>
                    <p className={cn("text-xs", isDark ? "text-dark-400" : "text-gray-500")}>Jour férié au Luxembourg</p>
                  </div>
                </div>
              )}
              
              {getLeavesForDay(selectedDay).length > 0 ? (
                <div className="space-y-2">
                  {getLeavesForDay(selectedDay).map((leave, i) => {
                    const config = TYPE_CONFIG[leave.type] || TYPE_CONFIG.paid
                    const Icon = config.icon
                    return (
                      <div key={i} className={cn("flex items-center gap-3 p-3 rounded-xl border", isDark ? `${config.bg} ${config.border}` : `${config.bgLight} ${config.borderLight}`)}>
                        <img src={leave.avatar} alt="" className="w-10 h-10 rounded-xl" />
                        <div className="flex-1 min-w-0">
                          <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{leave.name}</p>
                          <p className={cn("text-xs", isDark ? "text-dark-400" : "text-gray-500")}>
                            {leave.start === leave.end ? leave.start : `${leave.start} → ${leave.end}`}
                          </p>
                        </div>
                        <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-lg", isDark ? `${config.bg} ${config.text}` : `${config.bgLight} ${config.textLight}`)}>
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-medium">{config.label}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>Aucune absence ce jour</p>
              )}
              
              {getWeekAbsents(selectedDay) >= 3 && (
                <div className={cn("mt-4 p-3 rounded-xl flex items-center gap-3 border", isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-200")}>
                  <AlertTriangle className={cn("w-5 h-5", isDark ? "text-amber-400" : "text-amber-600")} />
                  <div>
                    <p className={cn("text-sm font-medium", isDark ? "text-amber-400" : "text-amber-700")}>{getWeekAbsents(selectedDay)} personnes absentes cette semaine</p>
                    <p className={cn("text-xs", isDark ? "text-dark-400" : "text-gray-500")}>Attention au planning de l'équipe</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
