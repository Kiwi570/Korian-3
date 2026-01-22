import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, Copy, Send, Info, Minus, Plus, CheckCircle, Trash2, MessageSquare, FileDown } from 'lucide-react'
import { Modal } from '@shared/components/ui'
import { useApp } from '@shared/context/AppContext'
import { useAuth } from '@shared/context/AuthContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'
import { startOfWeek, addDays, subWeeks, format, isToday, getISOWeek } from 'date-fns'
import { fr } from 'date-fns/locale'
import confetti from 'canvas-confetti'
import { exportCRA } from '@shared/lib/pdfExport'

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const HOLIDAYS = ['2026-01-01', '2026-04-06', '2026-05-01', '2026-05-14', '2026-05-25', '2026-06-23', '2026-08-15', '2026-11-01', '2026-12-25', '2026-12-26']

const PROJECTS = [
  { id: 'bgl-sprint', name: 'BGL - Sprint 12', client: 'BGL BNP Paribas', color: 'blue' },
  { id: 'bgl-support', name: 'BGL - Support', client: 'BGL BNP Paribas', color: 'blue' },
  { id: 'post-migration', name: 'POST - Migration', client: 'POST Luxembourg', color: 'emerald' },
  { id: 'internal-formation', name: 'Internal - Formation', client: 'Kokbif', color: 'violet' },
  { id: 'internal-meeting', name: 'Internal - Meeting', client: 'Kokbif', color: 'violet' },
]

const PROJECT_COLORS = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', textLight: 'text-blue-600', dot: 'bg-blue-500' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', textLight: 'text-emerald-600', dot: 'bg-emerald-500' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', textLight: 'text-violet-600', dot: 'bg-violet-500' },
}

// XP Animation
function XPAnimation({ show, amount, onComplete }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-1/2 left-1/2 z-[9999] pointer-events-none"
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -100, scale: 1 }}
          exit={{ opacity: 0, y: -150, scale: 0.8 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          onAnimationComplete={onComplete}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-500 to-amber-500 rounded-full shadow-lg shadow-gold-500/30">
            <span className="text-dark-950 font-bold text-lg">+{amount} XP</span>
            <span className="text-xl">✨</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ConsultantTimesheet() {
  const { timesheets, updateTimesheet, submitWeek, addToast } = useApp()
  const { user } = useAuth()
  const { isDark } = useTheme()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedDateStr, setSelectedDateStr] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [showXP, setShowXP] = useState(false)
  const [xpAmount, setXpAmount] = useState(0)
  
  const [entries, setEntries] = useState([{ projectId: 'bgl-sprint', hours: 8 }])
  const [dayNote, setDayNote] = useState('')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startingDay = (firstDay.getDay() + 6) % 7
  const daysInMonth = lastDay.getDate()
  
  const today = new Date()
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 })
  const currentWeekNumber = getISOWeek(today)
  
  const currentWeekDates = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => format(addDays(currentWeekStart, i), 'yyyy-MM-dd')), 
    [currentWeekStart]
  )
  
  const previousWeekStart = subWeeks(currentWeekStart, 1)
  const previousWeekDates = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => format(addDays(previousWeekStart, i), 'yyyy-MM-dd')), 
    [previousWeekStart]
  )
  
  const weekCompletion = useMemo(() => {
    const filledDays = currentWeekDates.filter(d => {
      const ts = timesheets[d]
      if (!ts) return false
      const total = ts.entries ? ts.entries.reduce((sum, e) => sum + e.hours, 0) : (ts.hours || 0)
      return total > 0
    }).length
    return { filled: filledDays, total: 5 }
  }, [currentWeekDates, timesheets])

  const getDayStatus = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const d = new Date(year, month, day)
    const dow = d.getDay()
    if (dow === 0 || dow === 6) return 'weekend'
    if (HOLIDAYS.includes(dateStr)) return 'holiday'
    return timesheets[dateStr]?.status || 'empty'
  }
  
  const getTotalHours = (dateStr) => {
    const data = timesheets[dateStr]
    if (!data) return 0
    if (data.entries) return data.entries.reduce((sum, e) => sum + e.hours, 0)
    return data.hours || 0
  }

  const openDayModal = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const status = getDayStatus(day)
    if (status === 'weekend' || status === 'holiday') return
    
    setSelectedDay(day)
    setSelectedDateStr(dateStr)
    
    const existing = timesheets[dateStr]
    if (existing?.entries) {
      setEntries(existing.entries)
    } else if (existing) {
      const projId = PROJECTS.find(p => p.name === existing.project)?.id || 'bgl-sprint'
      setEntries([{ projectId: projId, hours: existing.hours || 8 }])
    } else {
      setEntries([{ projectId: 'bgl-sprint', hours: 8 }])
    }
    setDayNote(existing?.note || '')
    setModalOpen(true)
  }

  const addEntry = () => {
    if (entries.length < 4) setEntries([...entries, { projectId: 'internal-meeting', hours: 1 }])
  }
  
  const updateEntry = (index, updatedEntry) => {
    const newEntries = [...entries]
    newEntries[index] = updatedEntry
    setEntries(newEntries)
  }
  
  const removeEntry = (index) => {
    if (entries.length > 1) setEntries(entries.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)
    const isNewEntry = !timesheets[selectedDateStr]
    
    updateTimesheet(selectedDateStr, { 
      entries,
      hours: totalHours,
      project: PROJECTS.find(p => p.id === entries[0].projectId)?.name || 'Multi-projets',
      note: dayNote || null
    })
    setModalOpen(false)
    
    if (isNewEntry && totalHours > 0) { setXpAmount(10); setShowXP(true) }
  }

  const handleSubmitWeek = () => {
    const weekDatesWithData = currentWeekDates.filter(d => timesheets[d])
    if (weekDatesWithData.length === 0) { addToast('Aucune heure à soumettre', 'warning'); return }
    
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#fbbf24', '#f59e0b', '#d97706'] })
    submitWeek(weekDatesWithData, currentWeekNumber)
    setTimeout(() => { setXpAmount(50); setShowXP(true) }, 500)
  }
  
  const handleCopyPreviousWeek = () => {
    let copied = 0
    previousWeekDates.forEach((prevDate, i) => {
      const prevData = timesheets[prevDate]
      if (prevData) {
        const currentDateStr = currentWeekDates[i]
        const currentData = timesheets[currentDateStr]
        if (!currentData || currentData.status === 'draft' || currentData.status === 'empty') {
          updateTimesheet(currentDateStr, { hours: prevData.hours, project: prevData.project, entries: prevData.entries })
          copied++
        }
      }
    })
    if (copied > 0) { addToast(`${copied} jour(s) copiés depuis S${String(currentWeekNumber - 1).padStart(2, '0')}`, 'success'); setXpAmount(5 * copied); setShowXP(true) }
    else { addToast('Aucune donnée à copier', 'info') }
  }
  
  const handleExportPDF = () => {
    addToast('Génération du CRA...', 'info')
    try {
      exportCRA(timesheets, currentWeekDates, currentWeekNumber, user)
      setTimeout(() => addToast('CRA S' + String(currentWeekNumber).padStart(2, '0') + ' généré !', 'success'), 500)
    } catch (error) { addToast('Erreur lors de la génération', 'error') }
  }

  const weekStats = { total: currentWeekDates.reduce((sum, d) => sum + getTotalHours(d), 0) }
  const weekPeriod = `${format(currentWeekStart, 'd', { locale: fr })}-${format(addDays(currentWeekStart, 6), 'd MMM', { locale: fr })}`
  const totalModalHours = entries.reduce((sum, e) => sum + e.hours, 0)

  const calendarDays = useMemo(() => {
    const days = []
    for (let i = 0; i < startingDay; i++) days.push({ type: 'empty', key: `empty-${i}` })
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const status = getDayStatus(day)
      const hours = getTotalHours(dateStr)
      const isTodayDate = isToday(new Date(year, month, day))
      const data = timesheets[dateStr]
      const hasMultipleProjects = data?.entries?.length > 1
      days.push({ type: 'day', key: day, day, dateStr, status, hours, isTodayDate, data, hasMultipleProjects })
    }
    return days
  }, [year, month, startingDay, daysInMonth, timesheets])

  return (
    <div className="space-y-6">
      <XPAnimation show={showXP} amount={xpAmount} onComplete={() => setShowXP(false)} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl sm:text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Timesheet</h1>
          <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Saisissez vos heures de travail</p>
        </div>
        <motion.button 
          onClick={handleExportPDF} 
          className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium", isDark ? "bg-dark-800 hover:bg-dark-700 text-dark-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600")} 
          whileTap={{ scale: 0.98 }}
        >
          <FileDown className="w-4 h-4" />Export CRA
        </motion.button>
      </div>

      {/* Calendrier */}
      <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
        {/* Header du calendrier */}
        <div className={cn("p-4 sm:p-6 border-b", isDark ? "border-dark-800" : "border-gray-200")}>
          <div className="flex items-center justify-between">
            <motion.button 
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))} 
              className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900")} 
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <div className="text-center">
              <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>{MONTHS[month]} {year}</h2>
              <p className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-500")}>Cliquez sur un jour pour saisir</p>
            </div>
            <motion.button 
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))} 
              className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900")} 
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Légende */}
        <div className={cn("px-4 sm:px-6 py-3 border-b", isDark ? "border-dark-800 bg-dark-800/30" : "border-gray-100 bg-gray-50")}>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {[
              { color: 'bg-emerald-500', label: 'Approuvé' },
              { color: 'bg-amber-500', label: 'Soumis' },
              { color: 'bg-blue-500', label: 'Brouillon' },
              { color: isDark ? 'bg-dark-600' : 'bg-gray-300', label: 'À saisir' },
              { color: 'bg-sky-500', label: 'Férié 🇱🇺' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className={cn(isDark ? "text-dark-400" : "text-gray-500")}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grille du calendrier */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
              <div key={d} className={cn("text-center text-xs sm:text-sm font-medium py-2", isDark ? "text-dark-500" : "text-gray-500")}>{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((item) => {
              if (item.type === 'empty') return <div key={item.key} className="h-14 sm:h-16" />
              
              const { day, status, hours, isTodayDate, data, hasMultipleProjects } = item
              const isClickable = status !== 'weekend' && status !== 'holiday'
              
              return (
                <motion.button
                  key={day}
                  onClick={() => isClickable && openDayModal(day)}
                  disabled={!isClickable}
                  className={cn(
                    "relative h-14 sm:h-16 rounded-xl flex flex-col items-center justify-center transition-all",
                    status === 'weekend' && (isDark ? 'bg-dark-800/20' : 'bg-gray-100'),
                    status === 'holiday' && 'bg-sky-500/10 border border-sky-500/30',
                    status === 'approved' && 'bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50',
                    status === 'submitted' && 'bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50',
                    status === 'draft' && 'bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/50',
                    status === 'empty' && (isDark 
                      ? 'bg-dark-800/40 border border-dark-700 hover:border-gold-500/50 hover:bg-dark-800/60' 
                      : 'bg-gray-50 border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'),
                    isTodayDate && (isDark ? 'ring-2 ring-gold-500 ring-offset-1 ring-offset-dark-900' : 'ring-2 ring-orange-500 ring-offset-1 ring-offset-white'),
                    !isClickable && 'cursor-default'
                  )}
                  whileHover={isClickable ? { scale: 1.03 } : {}}
                  whileTap={isClickable ? { scale: 0.97 } : {}}
                >
                  <span className={cn(
                    "text-sm font-semibold",
                    status === 'weekend' && (isDark ? 'text-dark-600' : 'text-gray-400'),
                    isTodayDate && (isDark ? 'text-gold-400' : 'text-orange-600'),
                    status !== 'weekend' && !isTodayDate && (isDark ? 'text-white' : 'text-gray-900')
                  )}>{day}</span>
                  
                  {status === 'holiday' && <span className="text-[10px] text-sky-400">🇱🇺</span>}
                  {status !== 'weekend' && status !== 'empty' && status !== 'holiday' && (
                    <span className={cn("text-[10px] sm:text-xs font-medium",
                      status === 'approved' && (isDark ? 'text-emerald-400' : 'text-emerald-600'),
                      status === 'submitted' && (isDark ? 'text-amber-400' : 'text-amber-600'),
                      status === 'draft' && (isDark ? 'text-blue-400' : 'text-blue-600')
                    )}>{hours}h</span>
                  )}
                  
                  {status === 'approved' && <CheckCircle className={cn("absolute top-1 right-1 w-3 h-3", isDark ? "text-emerald-400" : "text-emerald-500")} />}
                  {hasMultipleProjects && <span className="absolute bottom-1 right-1 w-4 h-4 bg-violet-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{data.entries.length}</span>}
                  {data?.note && <MessageSquare className={cn("absolute bottom-1 left-1 w-3 h-3", isDark ? "text-dark-500" : "text-gray-400")} />}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Résumé de la semaine */}
        <div className={cn("p-4 sm:p-6 border-t", isDark ? "border-dark-800 bg-dark-800/30" : "border-gray-100 bg-gray-50")}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>
                  Semaine {String(currentWeekNumber).padStart(2, '0')} • {weekPeriod}
                </p>
                <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full", isDark ? "bg-dark-800" : "bg-white border border-gray-200")}>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={cn("w-2 h-2 rounded-full", i < weekCompletion.filled ? 'bg-emerald-400' : (isDark ? 'bg-dark-600' : 'bg-gray-300'))} />
                    ))}
                  </div>
                  <span className={cn("text-xs font-medium", weekCompletion.filled === 5 ? 'text-emerald-400' : (isDark ? 'text-dark-400' : 'text-gray-500'))}>{weekCompletion.filled}/5 jours</span>
                </div>
              </div>
              <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                {weekStats.total}h <span className={cn("font-normal text-lg ml-1", isDark ? "text-dark-500" : "text-gray-400")}>/ 40h</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button 
                onClick={handleCopyPreviousWeek} 
                className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm", isDark ? "bg-dark-800 hover:bg-dark-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700")} 
                whileTap={{ scale: 0.98 }}
              >
                <Copy className="w-4 h-4" /><span className="hidden sm:inline">Copier</span> S{String(currentWeekNumber - 1).padStart(2, '0')}
              </motion.button>
              <motion.button 
                onClick={handleSubmitWeek} 
                className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg", isDark ? "bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 shadow-gold-500/20" : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/20")} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-4 h-4" />Soumettre
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Multi-Projets */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Saisie d'heures" subtitle={selectedDay ? `${selectedDay} ${MONTHS[month]} ${year}` : ''} icon={Clock} iconColor="gold" maxWidth="max-w-lg">
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={cn("text-sm font-medium", isDark ? "text-dark-300" : "text-gray-700")}>Projets ({entries.length}/4)</label>
              <span className={cn("text-sm font-bold", totalModalHours === 8 ? 'text-emerald-400' : totalModalHours > 12 ? 'text-rose-400' : (isDark ? 'text-gold-400' : 'text-orange-500'))}>Total: {totalModalHours}h</span>
            </div>
            
            <AnimatePresence>
              {entries.map((entry, index) => {
                const project = PROJECTS.find(p => p.id === entry.projectId) || PROJECTS[0]
                const colors = PROJECT_COLORS[project.color]
                
                return (
                  <motion.div key={index} className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <select
                        value={entry.projectId}
                        onChange={(e) => updateEntry(index, { ...entry, projectId: e.target.value })}
                        className={cn("flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none", isDark ? "bg-dark-800 border border-dark-700 text-white focus:border-gold-500" : "bg-white border border-gray-300 text-gray-900 focus:border-orange-500")}
                      >
                        {PROJECTS.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                      </select>
                      {entries.length > 1 && (
                        <motion.button onClick={() => removeEntry(index)} className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isDark ? "bg-dark-800 hover:bg-rose-500/20 text-dark-500 hover:text-rose-400" : "bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-500")} whileTap={{ scale: 0.95 }}>
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>Heures:</span>
                      <div className="flex items-center gap-2">
                        <motion.button onClick={() => updateEntry(index, { ...entry, hours: Math.max(0.5, entry.hours - 0.5) })} className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isDark ? "bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-white" : "bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200")} whileTap={{ scale: 0.95 }}><Minus className="w-4 h-4" /></motion.button>
                        <span className={cn("text-xl font-bold min-w-[50px] text-center", isDark ? colors.text : colors.textLight)}>{entry.hours}h</span>
                        <motion.button onClick={() => updateEntry(index, { ...entry, hours: Math.min(12, entry.hours + 0.5) })} className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isDark ? "bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-white" : "bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200")} whileTap={{ scale: 0.95 }}><Plus className="w-4 h-4" /></motion.button>
                      </div>
                      <div className="flex-1" />
                      <span className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-400")}>{project.client}</span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            
            {entries.length < 4 && (
              <motion.button onClick={addEntry} className={cn("w-full py-3 border-2 border-dashed rounded-xl text-sm font-medium transition-colors", isDark ? "border-dark-700 hover:border-gold-500/50 text-dark-400 hover:text-gold-400" : "border-gray-300 hover:border-orange-400 text-gray-400 hover:text-orange-500")} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                + Ajouter un projet
              </motion.button>
            )}
          </div>
          
          <div>
            <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}><MessageSquare className="w-4 h-4 inline mr-2" />Note (optionnel)</label>
            <textarea
              value={dayNote}
              onChange={(e) => setDayNote(e.target.value)}
              placeholder="Ex: Réunion client, déplacement..."
              rows={2}
              className={cn("w-full px-4 py-3 rounded-xl resize-none text-sm focus:outline-none", isDark ? "bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-gold-500" : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500")}
            />
          </div>
          
          <div className={cn("flex items-start gap-3 p-3 rounded-xl", isDark ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-200")}>
            <Info className={cn("w-5 h-5 flex-shrink-0 mt-0.5", isDark ? "text-blue-400" : "text-blue-600")} />
            <p className={cn("text-sm", isDark ? "text-blue-300" : "text-blue-700")}>
              Sera soumis avec la semaine • <span className={cn("font-medium", isDark ? "text-gold-400" : "text-orange-500")}>+10 XP</span>
            </p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <motion.button onClick={() => setModalOpen(false)} className={cn("flex-1 py-3 rounded-xl font-medium", isDark ? "bg-dark-800 hover:bg-dark-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700")} whileTap={{ scale: 0.98 }}>Annuler</motion.button>
            <motion.button onClick={handleSave} className={cn("flex-1 py-3 rounded-xl font-semibold", isDark ? "bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950" : "bg-gradient-to-r from-orange-500 to-amber-500 text-white")} whileTap={{ scale: 0.98 }}>Enregistrer</motion.button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
