import { motion } from 'framer-motion'
import { FileSpreadsheet, Clock, AlertTriangle, BarChart3 } from 'lucide-react'
import { PROBLEMS } from '@shared/lib/constants'
import { staggerContainer, staggerItem, viewportOnce } from '@shared/lib/animations'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

const iconMap = { FileSpreadsheet, Clock, AlertTriangle, BarChart3 }

const colorMap = {
  rose: { gradient: 'from-rose-500 to-rose-600', dark: { bg: 'bg-rose-500/10', text: 'text-rose-400' }, light: { bg: 'bg-rose-50', text: 'text-rose-600' }, border: 'group-hover:border-rose-500/30' },
  amber: { gradient: 'from-amber-500 to-amber-600', dark: { bg: 'bg-amber-500/10', text: 'text-amber-400' }, light: { bg: 'bg-amber-50', text: 'text-amber-600' }, border: 'group-hover:border-amber-500/30' },
  violet: { gradient: 'from-violet-500 to-violet-600', dark: { bg: 'bg-violet-500/10', text: 'text-violet-400' }, light: { bg: 'bg-violet-50', text: 'text-violet-600' }, border: 'group-hover:border-violet-500/30' },
  blue: { gradient: 'from-blue-500 to-blue-600', dark: { bg: 'bg-blue-500/10', text: 'text-blue-400' }, light: { bg: 'bg-blue-50', text: 'text-blue-600' }, border: 'group-hover:border-blue-500/30' },
}

export default function ProblemSection() {
  const { isDark } = useTheme()
  
  return (
    <section id="problem" className="py-24 md:py-32 relative overflow-hidden">
      <div className={cn("absolute inset-0", isDark ? "bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" : "bg-gradient-to-b from-gray-50 via-white to-gray-50")} />
      <div className={cn("absolute inset-0 bg-grid", isDark ? "opacity-20" : "opacity-10")} />
      <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]", isDark ? "bg-rose-500/5" : "bg-rose-500/10")} />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-16 md:mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.6 }}>
          <motion.span className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6", isDark ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600")} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewportOnce}>
            <AlertTriangle className="w-4 h-4" />Le problème
          </motion.span>
          <h2 className={cn("text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>
            Vous perdez du temps<br /><span className="text-rose-400">chaque semaine</span>
          </h2>
          <p className={cn("text-lg md:text-xl max-w-2xl mx-auto", isDark ? "text-dark-400" : "text-gray-600")}>Sans les bons outils, la gestion administrative devient un cauchemar</p>
        </motion.div>

        <motion.div className="grid md:grid-cols-2 gap-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          {PROBLEMS.map((problem, index) => {
            const Icon = iconMap[problem.icon]
            const colors = colorMap[problem.color]
            return (
              <motion.div key={problem.title} variants={staggerItem} className="group relative">
                <div className={cn("relative h-full p-8 backdrop-blur-sm rounded-3xl border transition-all duration-300 overflow-hidden hover:-translate-y-1", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm", colors.border)}>
                  <span className={cn("absolute top-4 right-6 text-[120px] font-bold leading-none select-none", isDark ? "text-dark-800/30" : "text-gray-100")}>{index + 1}</span>
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <div className="relative">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", isDark ? colors.dark.bg : colors.light.bg)}>
                      <Icon className={cn("w-7 h-7", isDark ? colors.dark.text : colors.light.text)} />
                    </div>
                    <h3 className={cn("text-xl md:text-2xl font-bold mb-3 transition-colors", isDark ? "text-white group-hover:text-gold-400" : "text-gray-900 group-hover:text-orange-600")}>{problem.title}</h3>
                    <p className={cn("mb-6 leading-relaxed", isDark ? "text-dark-400" : "text-gray-600")}>{problem.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>{problem.stat}</span>
                      <span className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-500")}>{problem.statLabel}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div className="text-center mt-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewportOnce} transition={{ delay: 0.5 }}>
          <p className={cn("mb-4", isDark ? "text-dark-400" : "text-gray-500")}>Il existe une meilleure façon de faire</p>
          <motion.a href="#features" className={cn("inline-flex items-center gap-2 font-semibold transition-colors", isDark ? "text-gold-400 hover:text-gold-300" : "text-orange-600 hover:text-orange-500")} whileHover={{ x: 5 }}>
            Découvrir la solution<motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
