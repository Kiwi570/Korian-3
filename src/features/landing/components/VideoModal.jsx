import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

export default function VideoModal({ isOpen, onClose }) {
  const { isDark } = useTheme()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div className={cn("fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50 p-4", isDark ? "bg-black/90" : "bg-gray-900/80")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className={cn("relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl", isDark ? "bg-dark-900" : "bg-white")} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className={cn("absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors", isDark ? "bg-dark-800/80 hover:bg-dark-700" : "bg-gray-800/80 hover:bg-gray-700")}>
            <X className="w-5 h-5" />
          </button>

          <div className={cn("aspect-video relative", isDark ? "bg-gradient-to-br from-dark-800 to-dark-900" : "bg-gradient-to-br from-gray-100 to-gray-200")}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-2xl", isDark ? "bg-gradient-to-br from-gold-400 to-amber-500 shadow-gold-500/30" : "bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-500/30")} animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                <span className={cn("font-bold text-4xl", isDark ? "text-dark-950" : "text-white")}>K</span>
              </motion.div>
              <h3 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>Découvrez Kokbif en action</h3>
              <p className={cn("text-center max-w-md mb-8", isDark ? "text-dark-400" : "text-gray-600")}>Regardez comment notre plateforme simplifie la gestion du temps pour les consultants IT au Luxembourg.</p>
              <div className="grid grid-cols-3 gap-6 max-w-2xl">
                {[{ title: 'Saisie rapide', desc: '< 2 min/semaine' }, { title: 'Approbation', desc: 'En 1 clic' }, { title: 'Gamification', desc: 'XP & Badges' }].map((feature, i) => (
                  <motion.div key={i} className={cn("text-center p-4 rounded-xl", isDark ? "bg-dark-800/50" : "bg-white/80")} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                    <p className={cn("font-semibold mb-1", isDark ? "text-white" : "text-gray-900")}>{feature.title}</p>
                    <p className={cn("text-sm", isDark ? "text-gold-400" : "text-orange-600")}>{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <span className={cn("px-4 py-2 border rounded-full text-sm", isDark ? "bg-gold-500/10 border-gold-500/30 text-gold-400" : "bg-orange-50 border-orange-200 text-orange-600")}>🎬 Vidéo complète bientôt disponible</span>
              </motion.div>
            </div>
            <div className={cn("absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t", isDark ? "from-dark-950/90" : "from-gray-900/90", "to-transparent")}>
              <div className="flex items-center gap-4">
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div className={cn("h-full", isDark ? "bg-gold-500" : "bg-orange-500")} initial={{ width: '0%' }} animate={{ width: isPlaying ? '100%' : '45%' }} transition={{ duration: isPlaying ? 60 : 0 }} />
                </div>
                <span className="text-white/60 text-sm font-mono">2:34 / 5:12</span>
                <button onClick={() => setIsMuted(!isMuted)} className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"><Maximize className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

          <div className={cn("p-6 flex items-center justify-between", isDark ? "bg-dark-800/50" : "bg-gray-100")}>
            <div>
              <p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Prêt à simplifier votre gestion du temps ?</p>
              <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-600")}>Créez votre compte gratuitement en 30 secondes</p>
            </div>
            <motion.a href="/register" className={cn("px-6 py-3 rounded-xl font-semibold", isDark ? "bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950" : "bg-gradient-to-r from-orange-500 to-amber-500 text-white")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Commencer gratuitement</motion.a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
