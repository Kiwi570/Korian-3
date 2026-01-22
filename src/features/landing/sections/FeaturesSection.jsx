import { motion } from 'framer-motion'
import { Clock, CalendarDays, Trophy, BarChart3, Shield, Zap, CheckCircle } from 'lucide-react'
import { FEATURES } from '@shared/lib/constants'
import { staggerContainer, staggerItem, viewportOnce } from '@shared/lib/animations'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

const iconMap = { Clock, CalendarDays, Trophy, BarChart3, Shield, Zap }

export default function FeaturesSection() {
  const { isDark } = useTheme()
  
  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      <div className={cn("absolute inset-0", isDark ? "bg-dark-950" : "bg-white")} />
      <div className={cn("absolute inset-0 bg-grid", isDark ? "opacity-20" : "opacity-10")} />
      <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[200px]", isDark ? "bg-gold-500/5" : "bg-orange-500/10")} />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-16 md:mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.6 }}>
          <motion.span className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6", isDark ? "bg-gold-500/10 text-gold-400" : "bg-orange-50 text-orange-600")} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewportOnce}>
            <Zap className="w-4 h-4" />La solution
          </motion.span>
          <h2 className={cn("text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>
            Tout ce dont vous avez<br /><span className={cn(isDark ? "text-gold-400" : "text-orange-600")}>besoin</span>
          </h2>
          <p className={cn("text-lg md:text-xl max-w-2xl mx-auto", isDark ? "text-dark-400" : "text-gray-600")}>Une suite complète d'outils conçus pour les consultants IT au Luxembourg</p>
        </motion.div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          {FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon]
            return (
              <motion.div key={feature.title} variants={staggerItem} className="group">
                <div className={cn("h-full p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1", isDark ? "bg-dark-900/50 border-dark-800 hover:border-gold-500/30 hover:bg-dark-900" : "bg-white border-gray-200 hover:border-orange-300 hover:shadow-lg shadow-sm")}>
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors", isDark ? "bg-gold-500/10 group-hover:bg-gold-500/20" : "bg-orange-50 group-hover:bg-orange-100")}>
                    <Icon className={cn("w-7 h-7", isDark ? "text-gold-400" : "text-orange-600")} />
                  </div>
                  <h3 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-gray-900")}>{feature.title}</h3>
                  <p className={cn("mb-6 leading-relaxed", isDark ? "text-dark-400" : "text-gray-600")}>{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2">
                        <CheckCircle className={cn("w-4 h-4 flex-shrink-0", isDark ? "text-emerald-400" : "text-emerald-500")} />
                        <span className={cn("text-sm", isDark ? "text-dark-300" : "text-gray-600")}>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
