import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, ChevronDown, Sparkles } from 'lucide-react'
import { Button, Badge, AnimatedCounter } from '@shared/components/ui'
import { HERO_STATS, MORPHING_WORDS, CLIENT_LOGOS } from '@shared/lib/constants'
import { useMousePosition } from '@shared/hooks'
import { staggerContainer, staggerItem } from '@shared/lib/animations'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

export default function HeroSection() {
  const { isDark } = useTheme()
  const [currentWord, setCurrentWord] = useState(0)
  const { normalized } = useMousePosition()

  useEffect(() => {
    const interval = setInterval(() => setCurrentWord((prev) => (prev + 1) % MORPHING_WORDS.length), 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className={cn("absolute inset-0", isDark ? "bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" : "bg-gradient-to-b from-gray-50 via-white to-gray-50")} />
      <div className={cn("absolute inset-0 bg-grid", isDark ? "opacity-30" : "opacity-10")} />

      <motion.div className={cn("absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]", isDark ? "bg-gold-500/20" : "bg-orange-500/20")} animate={{ x: normalized.x * 30, y: normalized.y * 30 }} transition={{ type: 'spring', stiffness: 50, damping: 30 }} />
      <motion.div className={cn("absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]", isDark ? "bg-violet-500/15" : "bg-violet-500/10")} animate={{ x: normalized.x * -20, y: normalized.y * -20 }} transition={{ type: 'spring', stiffness: 50, damping: 30 }} />
      <motion.div className={cn("absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full blur-[80px]", isDark ? "bg-emerald-500/10" : "bg-emerald-500/10")} animate={{ x: normalized.x * 15, y: normalized.y * 15 }} transition={{ type: 'spring', stiffness: 50, damping: 30 }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div key={i} className={cn("absolute w-1 h-1 rounded-full", isDark ? "bg-gold-400/30" : "bg-orange-400/40")} style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ y: [0, -500], opacity: [0, 1, 0] }} transition={{ duration: Math.random() * 8 + 8, repeat: Infinity, delay: Math.random() * 5, ease: 'linear' }} />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div className="max-w-4xl mx-auto text-center" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={staggerItem} className="mb-8">
            <Badge variant="gold" size="lg" className="gap-2">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}><Sparkles className="w-4 h-4" /></motion.span>
              Nouveau • Version 1.0 disponible
            </Badge>
          </motion.div>

          <motion.h1 variants={staggerItem} className="mb-6">
            <span className={cn("block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-4", isDark ? "text-white" : "text-gray-900")}>Votre temps est</span>
            <div className="relative h-20 sm:h-24 md:h-28 lg:h-32">
              <AnimatePresence mode="wait">
                <motion.span key={currentWord} className={`absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r ${MORPHING_WORDS[currentWord].color} bg-clip-text text-transparent`} initial={{ y: 40, opacity: 0, rotateX: -40 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} exit={{ y: -40, opacity: 0, rotateX: 40 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                  {MORPHING_WORDS[currentWord].text}.
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>

          <motion.p variants={staggerItem} className={cn("text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed", isDark ? "text-dark-300" : "text-gray-600")}>
            La plateforme qui libère <span className={cn("font-semibold", isDark ? "text-gold-400" : "text-orange-600")}>4 heures par semaine</span> aux consultants IT. Conçue pour le <span className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Luxembourg</span> 🇱🇺
          </motion.p>

          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/login"><Button size="xl" className="w-full sm:w-auto group glow-pulse">Commencer gratuitement<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button></Link>
            <Button variant="outline" size="xl" className="w-full sm:w-auto group">
              <div className={cn("relative w-10 h-10 rounded-full flex items-center justify-center mr-1", isDark ? "bg-white/10" : "bg-orange-100")}>
                <Play className={cn("w-4 h-4 ml-0.5", isDark ? "text-gold-400" : "text-orange-500")} fill="currentColor" />
                <span className={cn("absolute inset-0 rounded-full border animate-ping opacity-50", isDark ? "border-gold-500/50" : "border-orange-500/50")} />
              </div>
              Voir la démo
            </Button>
          </motion.div>

          <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {HERO_STATS.map((stat) => (
              <motion.div key={stat.label} className="text-center group" whileHover={{ scale: 1.05 }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className={cn("text-3xl sm:text-4xl md:text-5xl font-bold transition-colors", isDark ? "text-white group-hover:text-gold-400" : "text-gray-900 group-hover:text-orange-600")}><AnimatedCounter value={stat.value} suffix={stat.suffix} /></span>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className={cn("text-sm font-medium", isDark ? "text-dark-400" : "text-gray-500")}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className={cn("mt-20 pt-12 border-t", isDark ? "border-dark-800/50" : "border-gray-200")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}>
          <p className={cn("text-center text-sm mb-8", isDark ? "text-dark-500" : "text-gray-500")}>Nos utilisateurs travaillent chez</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {CLIENT_LOGOS.map((client) => (
              <motion.span key={client.name} className={cn("text-lg font-bold transition-colors cursor-default", isDark ? "text-dark-600 hover:text-dark-300" : "text-gray-400 hover:text-gray-600")} whileHover={{ scale: 1.1, color: client.color }}>{client.initials}</motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.a href="#problem" className={cn("absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-colors cursor-pointer", isDark ? "text-dark-500 hover:text-dark-300" : "text-gray-400 hover:text-gray-600")} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
        <span className="text-xs uppercase tracking-widest">Découvrir</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ChevronDown className="w-5 h-5" /></motion.div>
      </motion.a>
    </section>
  )
}
