import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CalendarDays, Trophy, CheckCircle, ChevronRight, Flame, Zap, TrendingUp } from 'lucide-react'
import { staggerContainer, staggerItem } from '@shared/lib/animations'
import { useApp } from '@shared/context/AppContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'
import { startOfWeek, addDays, format, isToday, getISOWeek, differenceInDays } from 'date-fns'
import { fr } from 'date-fns/locale'

// Badges avec noms pour tooltips
const DASHBOARD_BADGES = [
  { emoji: '🌅', name: 'Early Bird', desc: 'Soumis avant le 5', unlocked: true },
  { emoji: '🔥', name: 'Streak Master', desc: 'Série de 7 jours', unlocked: true },
  { emoji: '⭐', name: 'Perfect Week', desc: '40h validées', unlocked: true },
  { emoji: '⚡', name: 'Speed Demon', desc: 'Soumis en <2 min', unlocked: false },
]

// Messages d'encouragement dynamiques
const getEncouragementMessage = (weekHours, streak, daysLeft) => {
  if (weekHours >= 40) return { text: "Semaine complète ! 🎉 N'oubliez pas de soumettre.", type: 'success' }
  if (weekHours >= 32) return { text: `Plus que ${40 - weekHours}h pour compléter votre semaine !`, type: 'info' }
  if (streak >= 7 && daysLeft <= 2) return { text: `🔥 Plus que ${daysLeft}j pour maintenir votre streak de ${streak} jours !`, type: 'warning' }
  if (daysLeft === 1) return { text: "Dernier jour pour compléter votre semaine !", type: 'warning' }
  return { text: `${40 - weekHours}h restantes cette semaine. Bonne journée !`, type: 'default' }
}

// Génère les jours de la semaine
const getWeekDays = () => {
  const today = new Date()
  const monday = startOfWeek(today, { weekStartsOn: 1 })
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  return days.map((day, i) => {
    const date = addDays(monday, i)
    return {
      day,
      date: format(date, 'd'),
      key: i < 5 ? format(date, 'yyyy-MM-dd') : `we${i === 5 ? '' : '2'}`,
      isToday: isToday(date),
      fullDate: date
    }
  })
}

// Badge avec tooltip
function BadgeWithTooltip({ badge, isDark }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <motion.div 
        className={cn(
          "aspect-square rounded-xl flex items-center justify-center text-2xl transition-colors",
          badge.unlocked 
            ? isDark ? 'bg-dark-800/50 hover:bg-dark-800' : 'bg-gray-100 hover:bg-gray-200' 
            : isDark ? 'bg-dark-800/30 opacity-40 grayscale' : 'bg-gray-50 opacity-40 grayscale'
        )}
        whileHover={badge.unlocked ? { scale: 1.1 } : {}}
      >
        {badge.emoji}
      </motion.div>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <div className={cn(
              "rounded-xl px-3 py-2 whitespace-nowrap",
              isDark ? "bg-dark-800 border border-dark-700 shadow-xl" : "bg-white border border-gray-200 shadow-lg"
            )}>
              <p className={cn("text-xs font-semibold", isDark ? "text-white" : "text-gray-900")}>{badge.name}</p>
              <p className={cn("text-[10px]", isDark ? "text-dark-400" : "text-gray-500")}>{badge.desc}</p>
              {!badge.unlocked && <p className={cn("text-[10px]", isDark ? "text-dark-500" : "text-gray-400")}>🔒 Verrouillé</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ConsultantDashboard() {
  const navigate = useNavigate()
  const { users, timesheets, leaveBalance } = useApp()
  const { isDark } = useTheme()
  const user = users.consultant
  
  const weekDays = getWeekDays()
  const currentWeekNumber = getISOWeek(new Date())
  const weekHours = weekDays.slice(0, 5).reduce((sum, d) => sum + (timesheets[d.key]?.hours || 0), 0)
  
  // Calcul jours restants
  const today = new Date()
  const friday = addDays(startOfWeek(today, { weekStartsOn: 1 }), 4)
  const daysLeft = Math.max(0, differenceInDays(friday, today) + 1)
  const encouragement = getEncouragementMessage(weekHours, user.streak, daysLeft)

  // Stat card component
  const StatCard = ({ label, value, suffix, icon: Icon, color }) => {
    const colorMap = {
      blue: { light: 'bg-blue-50 text-blue-600', dark: 'bg-blue-500/10 text-blue-400' },
      violet: { light: 'bg-violet-50 text-violet-600', dark: 'bg-violet-500/10 text-violet-400' },
      gold: { light: 'bg-orange-50 text-orange-600', dark: 'bg-gold-500/10 text-gold-400' },
      emerald: { light: 'bg-emerald-50 text-emerald-600', dark: 'bg-emerald-500/10 text-emerald-400' },
    }
    const colors = colorMap[color]
    
    return (
      <motion.div 
        variants={staggerItem} 
        className={cn(
          "p-6 rounded-2xl transition-all duration-200",
          isDark 
            ? "bg-dark-900/80 border border-dark-800 hover:border-dark-700" 
            : "bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
        )} 
        whileHover={{ y: -2 }}
      >
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", isDark ? colors.dark : colors.light)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>{value}</p>
          {suffix && <span className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-400")}>{suffix}</span>}
        </div>
        <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{label}</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl sm:text-3xl font-bold mb-1", isDark ? "text-white" : "text-gray-900")}>
            Bonjour, {user.name} 👋
          </h1>
          <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>
            Semaine {currentWeekNumber} • {format(weekDays[0].fullDate, 'd', { locale: fr })}-{format(weekDays[6].fullDate, 'd MMM', { locale: fr })}
          </p>
        </div>
        <motion.div 
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full",
            isDark ? "bg-amber-500/10 border border-amber-500/20" : "bg-orange-50 border border-orange-200"
          )}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Flame className={cn("w-5 h-5", isDark ? "text-amber-400" : "text-orange-500")} />
          <span className={cn("text-sm font-semibold", isDark ? "text-amber-400" : "text-orange-600")}>{user.streak} jours</span>
          <span className="text-lg">🔥</span>
        </motion.div>
      </div>

      {/* Message d'encouragement */}
      <motion.div 
        className={cn(
          "p-4 rounded-xl flex items-center gap-3",
          encouragement.type === 'success' 
            ? isDark ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'
            : encouragement.type === 'warning' 
            ? isDark ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'
            : encouragement.type === 'info' 
            ? isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
            : isDark ? 'bg-dark-800/50 border border-dark-700' : 'bg-gray-50 border border-gray-200'
        )}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {encouragement.type === 'success' && <CheckCircle className={cn("w-5 h-5 flex-shrink-0", isDark ? "text-emerald-400" : "text-emerald-600")} />}
        {encouragement.type === 'warning' && <Flame className={cn("w-5 h-5 flex-shrink-0", isDark ? "text-amber-400" : "text-amber-600")} />}
        {encouragement.type === 'info' && <TrendingUp className={cn("w-5 h-5 flex-shrink-0", isDark ? "text-blue-400" : "text-blue-600")} />}
        {encouragement.type === 'default' && <Zap className={cn("w-5 h-5 flex-shrink-0", isDark ? "text-gold-400" : "text-orange-500")} />}
        <p className={cn(
          "text-sm font-medium",
          encouragement.type === 'success' ? isDark ? 'text-emerald-300' : 'text-emerald-700' :
          encouragement.type === 'warning' ? isDark ? 'text-amber-300' : 'text-amber-700' :
          encouragement.type === 'info' ? isDark ? 'text-blue-300' : 'text-blue-700' : 
          isDark ? 'text-dark-300' : 'text-gray-600'
        )}>
          {encouragement.text}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer} initial="hidden" animate="visible">
        <StatCard label="Heures semaine" value={weekHours} suffix="/40h" icon={Clock} color="blue" />
        <StatCard label="Congés restants" value={leaveBalance.paid} suffix=" jours" icon={CalendarDays} color="violet" />
        <StatCard label="Niveau" value={user.level} icon={Trophy} color="gold" />
        <StatCard label="XP Total" value={user.xp} icon={CheckCircle} color="emerald" />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Week Calendar */}
        <div className={cn(
          "lg:col-span-2 rounded-2xl overflow-hidden transition-all duration-200",
          isDark ? "bg-dark-900/80 border border-dark-800" : "bg-white border border-gray-200 shadow-sm"
        )}>
          <div className={cn("p-6 border-b flex items-center justify-between", isDark ? "border-dark-800" : "border-gray-100")}>
            <div>
              <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>Cette semaine</h2>
              <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>
                S{String(currentWeekNumber).padStart(2, '0')} • {format(weekDays[0].fullDate, 'd', { locale: fr })}-{format(weekDays[6].fullDate, 'd MMM', { locale: fr })}
              </p>
            </div>
            <motion.button 
              onClick={() => navigate('/app/consultant/timesheet')} 
              className={cn("flex items-center gap-1 text-sm font-medium", isDark ? "text-gold-400 hover:text-gold-300" : "text-orange-600 hover:text-orange-500")} 
              whileHover={{ x: 4 }}
            >
              Voir tout<ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((d, i) => {
                const ts = timesheets[d.key]
                const isWe = d.key.startsWith('we')
                const status = ts?.status || (isWe ? 'weekend' : 'empty')
                
                return (
                  <motion.div 
                    key={i} 
                    onClick={() => !isWe && navigate('/app/consultant/timesheet')} 
                    className={cn(
                      "relative p-3 rounded-xl text-center transition-all duration-200",
                      isWe 
                        ? isDark ? 'bg-dark-800/30 cursor-default' : 'bg-gray-50 cursor-default'
                        : status === 'approved' 
                        ? isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
                        : status === 'submitted' 
                        ? isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
                        : status === 'draft' 
                        ? isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                        : isDark 
                        ? 'bg-dark-800/50 border border-dark-700 hover:border-gold-500/50 cursor-pointer' 
                        : 'bg-gray-50 border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 cursor-pointer',
                      d.isToday && (isDark ? 'ring-2 ring-gold-500' : 'ring-2 ring-orange-500')
                    )} 
                    whileHover={!isWe ? { scale: 1.05 } : {}}
                  >
                    <p className={cn(
                      "text-xs font-medium mb-1",
                      isWe 
                        ? isDark ? 'text-dark-600' : 'text-gray-400' 
                        : isDark ? 'text-dark-400' : 'text-gray-500'
                    )}>{d.day}</p>
                    <p className={cn(
                      "text-lg font-bold mb-2",
                      d.isToday 
                        ? isDark ? 'text-gold-400' : 'text-orange-600'
                        : isWe 
                        ? isDark ? 'text-dark-600' : 'text-gray-400' 
                        : isDark ? 'text-white' : 'text-gray-900'
                    )}>{d.date}</p>
                    <div className={cn(
                      "text-sm font-semibold",
                      status === 'approved' 
                        ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                        : status === 'submitted' 
                        ? isDark ? 'text-amber-400' : 'text-amber-600'
                        : status === 'draft' 
                        ? isDark ? 'text-blue-400' : 'text-blue-600'
                        : isDark ? 'text-dark-600' : 'text-gray-400'
                    )}>
                      {isWe ? '-' : `${ts?.hours || 0}h`}
                    </div>
                    {status === 'approved' && <CheckCircle className={cn("absolute top-2 right-2 w-3 h-3", isDark ? "text-emerald-400" : "text-emerald-500")} />}
                  </motion.div>
                )
              })}
            </div>
            <div className={cn("mt-6 pt-6 border-t flex items-center justify-between", isDark ? "border-dark-800" : "border-gray-100")}>
              <div>
                <p className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-500")}>Total</p>
                <p className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {weekHours}h <span className={cn("font-normal", isDark ? "text-dark-500" : "text-gray-400")}>/ 40h</span>
                </p>
              </div>
              <motion.button 
                onClick={() => navigate('/app/consultant/timesheet')} 
                className={cn(
                  "px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg",
                  isDark 
                    ? "bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 shadow-gold-500/25" 
                    : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/25"
                )} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                Saisir mes heures
              </motion.button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className={cn(
            "rounded-2xl p-6 transition-all duration-200",
            isDark ? "bg-dark-900/80 border border-dark-800" : "bg-white border border-gray-200 shadow-sm"
          )}>
            <h3 className={cn("text-lg font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>Actions rapides</h3>
            <div className="space-y-2">
              <motion.button 
                onClick={() => navigate('/app/consultant/timesheet')} 
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200",
                  isDark ? "bg-dark-800 hover:bg-dark-700" : "bg-gray-50 hover:bg-gray-100"
                )} 
                whileHover={{ x: 4 }}
              >
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isDark ? "bg-blue-500/10" : "bg-blue-50")}>
                  <Clock className={cn("w-5 h-5", isDark ? "text-blue-400" : "text-blue-600")} />
                </div>
                <div>
                  <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>Saisir heures</p>
                  <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>S{String(currentWeekNumber).padStart(2, '0')}</p>
                </div>
              </motion.button>
              <motion.button 
                onClick={() => navigate('/app/consultant/leave')} 
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200",
                  isDark ? "bg-dark-800 hover:bg-dark-700" : "bg-gray-50 hover:bg-gray-100"
                )} 
                whileHover={{ x: 4 }}
              >
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isDark ? "bg-violet-500/10" : "bg-violet-50")}>
                  <CalendarDays className={cn("w-5 h-5", isDark ? "text-violet-400" : "text-violet-600")} />
                </div>
                <div>
                  <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>Demander congé</p>
                  <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>{leaveBalance.paid} jours dispo</p>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Badges */}
          <div className={cn(
            "rounded-2xl p-6",
            isDark 
              ? "bg-gradient-to-br from-gold-500/10 to-amber-500/5 border border-gold-500/20" 
              : "bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200"
          )}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>Mes badges</h3>
              <motion.button 
                onClick={() => navigate('/app/consultant/achievements')} 
                className={cn("text-sm font-medium", isDark ? "text-gold-400 hover:text-gold-300" : "text-orange-600 hover:text-orange-500")} 
                whileHover={{ x: 4 }}
              >
                Voir tout →
              </motion.button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {DASHBOARD_BADGES.map((badge, i) => (
                <BadgeWithTooltip key={i} badge={badge} isDark={isDark} />
              ))}
            </div>
            <p className={cn("text-xs mt-3", isDark ? "text-dark-500" : "text-gray-500")}>3 badges débloqués • +25 XP prochain</p>
          </div>
        </div>
      </div>
    </div>
  )
}
