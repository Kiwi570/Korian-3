import { motion } from 'framer-motion'
import { UserPlus, Clock, Send, PartyPopper, ArrowRight } from 'lucide-react'
import { PROCESS_STEPS } from '@shared/lib/constants'
import { staggerContainer, staggerItem, viewportOnce } from '@shared/lib/animations'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

const iconMap = { UserPlus, Clock, Send, PartyPopper }

export default function ProcessSection() {
  const { isDark } = useTheme()
  
  return (
    <section id="process" className="py-24 md:py-32 relative overflow-hidden">
      <div className={cn("absolute inset-0", isDark ? "bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" : "bg-gradient-to-b from-gray-50 via-white to-gray-50")} />
      <div className={cn("absolute inset-0 bg-grid", isDark ? "opacity-20" : "opacity-10")} />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-16 md:mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.6 }}>
          <motion.span className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6", isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600")} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewportOnce}>
            <ArrowRight className="w-4 h-4" />Comment ça marche
          </motion.span>
          <h2 className={cn("text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>
            Simple comme<br /><span className={cn(isDark ? "text-emerald-400" : "text-emerald-600")}>1, 2, 3, 4</span>
          </h2>
          <p className={cn("text-lg md:text-xl max-w-2xl mx-auto", isDark ? "text-dark-400" : "text-gray-600")}>Commencez en quelques minutes, pas en quelques jours</p>
        </motion.div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          {PROCESS_STEPS.map((step, index) => {
            const Icon = iconMap[step.icon]
            return (
              <motion.div key={step.title} variants={staggerItem} className="relative">
                {index < PROCESS_STEPS.length - 1 && (
                  <div className={cn("hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5", isDark ? "bg-gradient-to-r from-dark-700 to-transparent" : "bg-gradient-to-r from-gray-200 to-transparent")} />
                )}
                <div className={cn("relative p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1", isDark ? "bg-dark-900/50 border-dark-800 hover:border-emerald-500/30" : "bg-white border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-md")}>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 font-bold text-lg", isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600")}>{index + 1}</div>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", isDark ? "bg-dark-800" : "bg-gray-100")}>
                    <Icon className={cn("w-6 h-6", isDark ? "text-white" : "text-gray-700")} />
                  </div>
                  <h3 className={cn("text-lg font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>{step.title}</h3>
                  <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-600")}>{step.description}</p>
                  <p className={cn("text-xs mt-3", isDark ? "text-dark-600" : "text-gray-400")}>{step.duration}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
