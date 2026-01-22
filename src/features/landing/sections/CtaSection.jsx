import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Check } from 'lucide-react'
import { Button } from '@shared/components/ui'
import { viewportOnce } from '@shared/lib/animations'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

const benefits = ['Essai gratuit 14 jours', 'Sans engagement', 'Support inclus', 'Données sécurisées']

export default function CtaSection() {
  const { isDark } = useTheme()
  
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className={cn("absolute inset-0", isDark ? "bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" : "bg-gradient-to-b from-white via-orange-50/30 to-white")} />
      <div className={cn("absolute inset-0 bg-grid", isDark ? "opacity-20" : "opacity-10")} />
      <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px]", isDark ? "bg-gold-500/10" : "bg-orange-500/20")} />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.6 }}>
          <motion.div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8", isDark ? "bg-gold-500/10 text-gold-400" : "bg-orange-100 text-orange-600")} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewportOnce}>
            <Sparkles className="w-4 h-4" />Commencez maintenant
          </motion.div>

          <h2 className={cn("text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>
            Prêt à reprendre le<br /><span className={cn(isDark ? "text-gold-400" : "text-orange-600")}>contrôle</span> ?
          </h2>

          <p className={cn("text-lg md:text-xl mb-10 max-w-2xl mx-auto", isDark ? "text-dark-400" : "text-gray-600")}>
            Rejoignez les consultants qui ont déjà transformé leur gestion du temps
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link to="/register"><Button size="xl" className="w-full sm:w-auto group">Démarrer gratuitement<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button></Link>
            <Link to="/login"><Button variant="secondary" size="xl" className="w-full sm:w-auto">Se connecter</Button></Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <Check className={cn("w-5 h-5", isDark ? "text-emerald-400" : "text-emerald-500")} />
                <span className={cn("text-sm", isDark ? "text-dark-300" : "text-gray-600")}>{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
