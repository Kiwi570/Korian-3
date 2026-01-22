import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, TrendingDown, Users, Clock, Calendar, Download, Filter, ChevronDown, FileText, PieChart, Activity, ArrowUpRight, ArrowDownRight, CheckCircle, AlertTriangle } from 'lucide-react'
import { staggerContainer, staggerItem } from '@shared/lib/animations'
import { useApp } from '@shared/context/AppContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'
import { format, subWeeks, startOfWeek, addDays, getISOWeek } from 'date-fns'
import { fr } from 'date-fns/locale'

const generateWeeklyData = () => {
  const data = []
  const today = new Date()
  for (let i = 11; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(today, i), { weekStartsOn: 1 })
    data.push({ week: `S${getISOWeek(weekStart)}`, hours: Math.floor(Math.random() * 100 + 400), target: 480, approved: Math.floor(Math.random() * 30 + 70) })
  }
  return data
}

const projectDistribution = [
  { name: 'BGL BNP Paribas', hours: 680, color: 'blue', percentage: 35 },
  { name: 'POST Luxembourg', hours: 520, color: 'emerald', percentage: 27 },
  { name: 'Clearstream', hours: 380, color: 'amber', percentage: 20 },
  { name: 'SES', hours: 220, color: 'violet', percentage: 11 },
  { name: 'Autres', hours: 140, color: 'gray', percentage: 7 },
]

const colorConfig = {
  blue: { bg: 'bg-blue-500', text: 'text-blue-400', textLight: 'text-blue-600', iconBg: 'bg-blue-500/10', iconBgLight: 'bg-blue-50' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', textLight: 'text-emerald-600', iconBg: 'bg-emerald-500/10', iconBgLight: 'bg-emerald-50' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-400', textLight: 'text-amber-600', iconBg: 'bg-amber-500/10', iconBgLight: 'bg-amber-50' },
  violet: { bg: 'bg-violet-500', text: 'text-violet-400', textLight: 'text-violet-600', iconBg: 'bg-violet-500/10', iconBgLight: 'bg-violet-50' },
  gray: { bg: 'bg-gray-500', text: 'text-gray-400', textLight: 'text-gray-600', iconBg: 'bg-gray-500/10', iconBgLight: 'bg-gray-50' },
  gold: { bg: 'bg-gold-500', text: 'text-gold-400', textLight: 'text-orange-600', iconBg: 'bg-gold-500/10', iconBgLight: 'bg-orange-50' },
}

export default function ManagerReports() {
  const { team, stats, projects, addToast } = useApp()
  const { isDark } = useTheme()
  const [period, setPeriod] = useState('month')
  const [weeklyData] = useState(generateWeeklyData)

  const totalHoursThisMonth = useMemo(() => team.reduce((sum, m) => sum + (m.hoursThisWeek || 0) * 4, 0), [team])
  const avgApprovalTime = '4.2h'
  const complianceRate = 94

  const handleExport = (type) => {
    addToast(`Export ${type} en cours...`, 'info')
    setTimeout(() => addToast(`${type} exporté avec succès !`, 'success'), 1500)
  }

  const statCards = [
    { label: 'Heures totales', value: totalHoursThisMonth.toLocaleString(), suffix: 'h', icon: Clock, color: 'blue', trend: 'up', trendValue: '+12%', description: 'vs mois précédent' },
    { label: 'Taux de validation', value: stats.approvedThisMonth, suffix: '%', icon: CheckCircle, color: 'emerald', trend: 'up', trendValue: '+5%', description: 'ce mois' },
    { label: 'Temps moyen approbation', value: avgApprovalTime, icon: Activity, color: 'violet', trend: 'down', trendValue: '-18%', description: 'amélioration' },
    { label: 'Conformité', value: complianceRate, suffix: '%', icon: FileText, color: 'gold', trend: 'up', trendValue: '+2%', description: 'règles respectées' },
  ]

  const topPerformers = useMemo(() => [...team].sort((a, b) => b.streak - a.streak).slice(0, 5), [team])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl sm:text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Rapports</h1>
          <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Analyse des performances de l'équipe</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select value={period} onChange={e => setPeriod(e.target.value)} className={cn("px-4 py-2.5 rounded-xl focus:outline-none", isDark ? "bg-dark-800 border border-dark-700 text-white focus:border-gold-500" : "bg-white border border-gray-200 text-gray-900 focus:border-orange-500")}>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          
          <div className="relative group">
            <motion.button className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm", isDark ? "bg-gold-500 hover:bg-gold-600 text-dark-950" : "bg-orange-500 hover:bg-orange-600 text-white")} whileTap={{ scale: 0.98 }}>
              <Download className="w-4 h-4" />Exporter<ChevronDown className="w-4 h-4" />
            </motion.button>
            <div className={cn("absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10", isDark ? "bg-dark-900 border border-dark-800" : "bg-white border border-gray-200")}>
              {['PDF', 'Excel', 'CSV'].map((type, i) => (
                <button key={type} onClick={() => handleExport(type)} className={cn("w-full px-4 py-3 text-left text-sm transition-colors", isDark ? "text-dark-300 hover:text-white hover:bg-dark-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50", i === 0 && "rounded-t-xl", i === 2 && "rounded-b-xl")}>
                  Export {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer} initial="hidden" animate="visible">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const colors = colorConfig[stat.color]
          const isUp = stat.trend === 'up'
          
          return (
            <motion.div key={stat.label} variants={staggerItem} className={cn("p-5 rounded-2xl border transition-all", isDark ? "bg-dark-900/80 border-dark-800 hover:border-dark-700" : "bg-white border-gray-200 hover:border-gray-300 shadow-sm")} whileHover={{ y: -2 }}>
              <div className="flex items-start justify-between mb-3">
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", isDark ? colors.iconBg : colors.iconBgLight)}>
                  <Icon className={cn("w-5 h-5", isDark ? colors.text : colors.textLight)} />
                </div>
                <span className={cn("flex items-center gap-1 text-xs font-medium", isUp ? "text-emerald-400" : "text-rose-400")}>
                  {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{stat.trendValue}
                </span>
              </div>
              <p className={cn("text-2xl font-bold mb-0.5", isDark ? "text-white" : "text-gray-900")}>
                {stat.value}{stat.suffix && <span className={cn("text-lg", isDark ? "text-dark-500" : "text-gray-400")}>{stat.suffix}</span>}
              </p>
              <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{stat.label}</p>
              <p className={cn("text-xs mt-1", isDark ? "text-dark-500" : "text-gray-400")}>{stat.description}</p>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Graphique heures par semaine */}
        <div className={cn("lg:col-span-2 rounded-2xl border overflow-hidden", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
          <div className={cn("p-6 border-b", isDark ? "border-dark-800" : "border-gray-100")}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-blue-500/10" : "bg-blue-50")}>
                  <BarChart3 className={cn("w-5 h-5", isDark ? "text-blue-400" : "text-blue-600")} />
                </div>
                <div>
                  <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>Heures par semaine</h2>
                  <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>12 dernières semaines</p>
                </div>
              </div>
              <div className={cn("flex items-center gap-4 text-xs", isDark ? "text-dark-400" : "text-gray-500")}>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded"></span> Heures</span>
                <span className="flex items-center gap-1.5"><span className={cn("w-3 h-3 rounded", isDark ? "bg-dark-600" : "bg-gray-300")}></span> Objectif</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-end justify-between h-48 gap-2">
              {weeklyData.map((data, i) => {
                const heightPercent = (data.hours / 600) * 100
                const isAboveTarget = data.hours >= data.target
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="relative w-full flex flex-col items-center" style={{ height: '160px' }}>
                      <motion.div className={cn("w-full rounded-t-lg", isAboveTarget ? "bg-emerald-500" : "bg-blue-500")} style={{ height: `${heightPercent}%` }} initial={{ height: 0 }} animate={{ height: `${heightPercent}%` }} transition={{ duration: 0.5, delay: i * 0.05 }} />
                      <div className={cn("absolute w-full border-t-2 border-dashed", isDark ? "border-dark-600" : "border-gray-300")} style={{ bottom: `${(data.target / 600) * 100}%` }} />
                    </div>
                    <span className={cn("text-[10px]", isDark ? "text-dark-500" : "text-gray-400")}>{data.week}</span>
                  </div>
                )
              })}
            </div>
            <div className={cn("mt-4 pt-4 border-t flex items-center justify-between text-sm", isDark ? "border-dark-800" : "border-gray-100")}>
              <span className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Moyenne: <span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>456h</span>/semaine</span>
              <span className="text-emerald-400">+8% vs période précédente</span>
            </div>
          </div>
        </div>

        {/* Top performers */}
        <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
          <div className={cn("p-6 border-b", isDark ? "border-dark-800" : "border-gray-100")}>
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-gold-500/10" : "bg-orange-50")}>
                <TrendingUp className={cn("w-5 h-5", isDark ? "text-gold-400" : "text-orange-600")} />
              </div>
              <div>
                <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>Top Performers</h2>
                <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>Par streak</p>
              </div>
            </div>
          </div>
          <div className={cn("divide-y", isDark ? "divide-dark-800" : "divide-gray-100")}>
            {topPerformers.map((member, i) => (
              <motion.div key={member.id} className={cn("p-4 flex items-center gap-3", isDark ? "hover:bg-dark-800/30" : "hover:bg-gray-50")} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm", i === 0 ? (isDark ? "bg-gold-500 text-dark-950" : "bg-orange-500 text-white") : i === 1 ? "bg-gray-400 text-white" : i === 2 ? "bg-amber-700 text-white" : (isDark ? "bg-dark-800 text-dark-400" : "bg-gray-100 text-gray-500"))}>
                  {i + 1}
                </div>
                <img src={member.avatar} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className={cn("font-medium truncate", isDark ? "text-white" : "text-gray-900")}>{member.name}</p>
                  <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-400">{member.streak}🔥</p>
                  <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>jours</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Répartition par projet */}
      <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
        <div className={cn("p-6 border-b", isDark ? "border-dark-800" : "border-gray-100")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-violet-500/10" : "bg-violet-50")}>
                <PieChart className={cn("w-5 h-5", isDark ? "text-violet-400" : "text-violet-600")} />
              </div>
              <div>
                <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>Répartition par client</h2>
                <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>Heures facturées ce mois</p>
              </div>
            </div>
            <span className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>1,940h</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {projectDistribution.map((project, i) => {
            const colors = colorConfig[project.color]
            return (
              <motion.div key={project.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-3 h-3 rounded", colors.bg)} />
                    <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>{project.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{project.hours}h</span>
                    <span className={cn("text-sm font-medium", isDark ? colors.text : colors.textLight)}>{project.percentage}%</span>
                  </div>
                </div>
                <div className={cn("w-full h-2 rounded-full overflow-hidden", isDark ? "bg-dark-800" : "bg-gray-200")}>
                  <motion.div className={cn("h-full rounded-full", colors.bg)} initial={{ width: 0 }} animate={{ width: `${project.percentage}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Alertes et recommandations */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className={cn("rounded-2xl p-6 border", isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-200")}>
          <div className="flex items-start gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", isDark ? "bg-amber-500/20" : "bg-amber-100")}>
              <AlertTriangle className={cn("w-6 h-6", isDark ? "text-amber-400" : "text-amber-600")} />
            </div>
            <div>
              <h3 className={cn("font-semibold mb-2", isDark ? "text-amber-400" : "text-amber-700")}>Alertes à traiter</h3>
              <ul className={cn("space-y-2 text-sm", isDark ? "text-dark-300" : "text-amber-800")}>
                <li>• {stats.lateConsultants.length} consultant(s) en retard de saisie</li>
                <li>• 2 timesheets en attente depuis +48h</li>
                <li>• Budget projet "Clearstream - SI" à 80%</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={cn("rounded-2xl p-6 border", isDark ? "bg-emerald-500/10 border-emerald-500/30" : "bg-emerald-50 border-emerald-200")}>
          <div className="flex items-start gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", isDark ? "bg-emerald-500/20" : "bg-emerald-100")}>
              <TrendingUp className={cn("w-6 h-6", isDark ? "text-emerald-400" : "text-emerald-600")} />
            </div>
            <div>
              <h3 className={cn("font-semibold mb-2", isDark ? "text-emerald-400" : "text-emerald-700")}>Points positifs</h3>
              <ul className={cn("space-y-2 text-sm", isDark ? "text-dark-300" : "text-emerald-800")}>
                <li>• Taux de validation record ce mois (+5%)</li>
                <li>• 8 consultants avec streak &gt; 15 jours</li>
                <li>• Temps d'approbation moyen réduit de 18%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
