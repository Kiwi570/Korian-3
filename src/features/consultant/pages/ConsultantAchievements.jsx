import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Flame, Award, Crown, Lock, Zap } from 'lucide-react'
import { staggerContainer, staggerItem } from '@shared/lib/animations'
import { Modal } from '@shared/components/ui'
import { useApp } from '@shared/context/AppContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'
import confetti from 'canvas-confetti'

const CATEGORIES = [
  { id: 'all', name: 'Tous' },
  { id: 'assiduity', name: 'Assiduité' },
  { id: 'speed', name: 'Rapidité' },
  { id: 'performance', name: 'Performance' },
  { id: 'special', name: 'Spécial' },
]

const badges = [
  { id: 1, name: 'Early Bird', desc: 'Soumettre avant le 5 du mois', icon: '🌅', unlocked: true, unlockedAt: '15 Jan', xp: 50, rarity: 'common', category: 'assiduity' },
  { id: 2, name: 'Streak Master', desc: 'Série de 7 jours consécutifs', icon: '🔥', unlocked: true, unlockedAt: '12 Jan', xp: 100, rarity: 'uncommon', category: 'assiduity' },
  { id: 3, name: 'Streak Legend', desc: 'Série de 30 jours consécutifs', icon: '💫', unlocked: false, progress: 40, xp: 300, rarity: 'epic', category: 'assiduity' },
  { id: 4, name: 'Never Miss', desc: '3 mois sans aucun retard', icon: '📆', unlocked: false, progress: 65, xp: 200, rarity: 'rare', category: 'assiduity' },
  { id: 5, name: 'Consistency King', desc: '6 mois de saisie parfaite', icon: '👑', unlocked: false, progress: 15, xp: 500, rarity: 'legendary', category: 'assiduity' },
  { id: 6, name: 'Speed Demon', desc: 'Soumettre en moins de 2 min', icon: '⚡', unlocked: false, progress: 80, xp: 100, rarity: 'uncommon', category: 'speed' },
  { id: 7, name: 'Quick Draw', desc: 'Saisir dès le lundi matin', icon: '🎯', unlocked: true, unlockedAt: '20 Jan', xp: 50, rarity: 'common', category: 'speed' },
  { id: 8, name: 'Lightning Fast', desc: '5 semaines soumises avant mercredi', icon: '⚡', unlocked: false, progress: 60, xp: 150, rarity: 'rare', category: 'speed' },
  { id: 9, name: 'Flash', desc: 'Soumettre en moins de 30 secondes', icon: '💨', unlocked: false, progress: 0, xp: 200, rarity: 'epic', category: 'speed' },
  { id: 10, name: 'Perfect Week', desc: 'Exactement 40h sans modification', icon: '⭐', unlocked: true, unlockedAt: '10 Jan', xp: 75, rarity: 'common', category: 'performance' },
  { id: 11, name: 'Perfect Month', desc: '4 semaines 100% validées', icon: '🏆', unlocked: true, unlockedAt: '1 Jan', xp: 200, rarity: 'rare', category: 'performance' },
  { id: 12, name: 'Overtime Hero', desc: '10h supplémentaires validées', icon: '💪', unlocked: false, progress: 30, xp: 100, rarity: 'uncommon', category: 'performance' },
  { id: 13, name: 'Multi-Project Pro', desc: '4 projets sur une même journée', icon: '🎭', unlocked: false, progress: 75, xp: 150, rarity: 'rare', category: 'performance' },
  { id: 14, name: 'Veteran', desc: '1 an sur la plateforme', icon: '🏅', unlocked: false, progress: 25, xp: 500, rarity: 'epic', category: 'special' },
  { id: 15, name: 'Pioneer', desc: 'Parmi les 100 premiers utilisateurs', icon: '🚀', unlocked: true, unlockedAt: '1 Jan', xp: 1000, rarity: 'legendary', category: 'special' },
]

const leaderboard = [
  { rank: 1, name: 'Sophie K.', level: 18, xp: 4520 },
  { rank: 2, name: 'Lucas B.', level: 15, xp: 3890 },
  { rank: 3, name: 'Paul M.', level: 12, xp: 2850, isCurrentUser: true },
  { rank: 4, name: 'Marie D.', level: 12, xp: 2720 },
  { rank: 5, name: 'Thomas W.', level: 10, xp: 2340 }
]

const rarityConfig = {
  common: { dark: 'bg-dark-700 text-dark-300', light: 'bg-gray-100 text-gray-600', border: 'border-dark-700', borderLight: 'border-gray-200' },
  uncommon: { dark: 'bg-emerald-500/10 text-emerald-400', light: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-500/30', borderLight: 'border-emerald-200' },
  rare: { dark: 'bg-blue-500/10 text-blue-400', light: 'bg-blue-50 text-blue-600', border: 'border-blue-500/30', borderLight: 'border-blue-200' },
  epic: { dark: 'bg-violet-500/10 text-violet-400', light: 'bg-violet-50 text-violet-600', border: 'border-violet-500/30', borderLight: 'border-violet-200' },
  legendary: { dark: 'bg-gold-500/10 text-gold-400', light: 'bg-amber-50 text-amber-600', border: 'border-gold-500/30', borderLight: 'border-amber-200' },
}
const rarityNames = { common: 'Commun', uncommon: 'Peu commun', rare: 'Rare', epic: 'Épique', legendary: 'Légendaire' }

export default function ConsultantAchievements() {
  const { users } = useApp()
  const { isDark } = useTheme()
  const user = users.consultant
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [filter, setFilter] = useState('all')
  const [category, setCategory] = useState('all')

  const filteredBadges = badges.filter(b => {
    const statusMatch = filter === 'all' || (filter === 'unlocked' ? b.unlocked : !b.unlocked)
    const categoryMatch = category === 'all' || b.category === category
    return statusMatch && categoryMatch
  })
  
  const unlockedCount = badges.filter(b => b.unlocked).length
  const totalBadges = badges.length
  const completionPercent = Math.round((unlockedCount / totalBadges) * 100)

  const openBadge = (badge) => { 
    setSelectedBadge(badge)
    if (badge.unlocked) confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#fbbf24', '#f59e0b', '#d97706'] })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl sm:text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Achievements</h1>
          <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>{unlockedCount}/{totalBadges} badges débloqués</p>
        </div>
        <div className={cn("flex items-center gap-3 px-4 py-2 rounded-xl border", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
          <Trophy className={cn("w-5 h-5", isDark ? "text-gold-400" : "text-orange-500")} />
          <div className="w-32">
            <div className="flex justify-between text-xs mb-1">
              <span className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Complétion</span>
              <span className={cn("font-medium", isDark ? "text-gold-400" : "text-orange-500")}>{completionPercent}%</span>
            </div>
            <div className={cn("h-2 rounded-full overflow-hidden", isDark ? "bg-dark-800" : "bg-gray-200")}>
              <motion.div className={cn("h-full", isDark ? "bg-gradient-to-r from-gold-500 to-amber-400" : "bg-gradient-to-r from-orange-500 to-amber-400")} initial={{ width: 0 }} animate={{ width: `${completionPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {/* Level Card */}
        <motion.div className={cn("sm:col-span-2 rounded-2xl border p-6 relative overflow-hidden", isDark ? "bg-gradient-to-br from-gold-500/20 to-amber-500/10 border-gold-500/30" : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200")} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div className="absolute inset-0 pointer-events-none" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}>
            <div className={cn("w-1/4 h-full bg-gradient-to-r from-transparent to-transparent skew-x-12", isDark ? "via-gold-400/20" : "via-orange-400/20")} />
          </motion.div>
          
          <div className="flex items-center gap-4 mb-4">
            <motion.div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg", isDark ? "bg-gradient-to-br from-gold-400 to-amber-500 text-dark-950 shadow-gold-500/30" : "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-orange-500/30")} whileHover={{ scale: 1.05, rotate: 5 }}>
              {user.level}
            </motion.div>
            <div>
              <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>Niveau {user.level}</h2>
              <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>{user.xp} XP</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Prochain niveau</span>
              <span className={cn(isDark ? "text-gold-400" : "text-orange-500")}>350/500 XP</span>
            </div>
            <div className={cn("w-full h-3 rounded-full overflow-hidden", isDark ? "bg-dark-800" : "bg-white/50")}>
              <motion.div className={cn("h-full rounded-full", isDark ? "bg-gradient-to-r from-gold-500 to-amber-400" : "bg-gradient-to-r from-orange-500 to-amber-400")} initial={{ width: 0 }} animate={{ width: '70%' }} />
            </div>
          </div>
        </motion.div>
        
        <div className={cn("rounded-2xl border p-6", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-8 h-8 text-amber-400" />
            <span className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>{user.streak}</span>
          </div>
          <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>Streak actuel 🔥</p>
        </div>
        
        <div className={cn("rounded-2xl border p-6", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8 text-emerald-400" />
            <span className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>{unlockedCount}/{badges.length}</span>
          </div>
          <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>Badges débloqués</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Status filters */}
          <div className="flex flex-wrap gap-2">
            {['all', 'unlocked', 'locked'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all", filter === f ? (isDark ? 'bg-gold-500 text-dark-950' : 'bg-orange-500 text-white') : (isDark ? 'bg-dark-800 text-dark-400 hover:bg-dark-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'))}>
                {f === 'all' ? 'Tous' : f === 'unlocked' ? 'Débloqués' : 'À débloquer'}
              </button>
            ))}
          </div>
          
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setCategory(cat.id)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all border", category === cat.id ? (isDark ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' : 'bg-violet-50 text-violet-600 border-violet-200') : (isDark ? 'bg-dark-800/50 text-dark-500 hover:text-dark-300 border-transparent' : 'bg-gray-50 text-gray-500 hover:text-gray-700 border-transparent'))}>
                {cat.name}
                <span className={cn("ml-2 px-1.5 py-0.5 rounded text-[10px]", category === cat.id ? (isDark ? 'bg-violet-500/30' : 'bg-violet-100') : (isDark ? 'bg-dark-700' : 'bg-gray-200'))}>
                  {cat.id === 'all' ? badges.length : badges.filter(b => b.category === cat.id).length}
                </span>
              </button>
            ))}
          </div>
          
          {/* Badges grid */}
          <motion.div className="grid sm:grid-cols-2 gap-4" variants={staggerContainer} initial="hidden" animate="visible">
            {filteredBadges.map((badge) => {
              const rarity = rarityConfig[badge.rarity]
              return (
                <motion.button 
                  key={badge.id} 
                  variants={staggerItem} 
                  onClick={() => openBadge(badge)} 
                  className={cn(
                    "relative p-4 rounded-2xl border text-left overflow-hidden transition-shadow hover:shadow-lg",
                    badge.unlocked 
                      ? cn(isDark ? rarity.dark : rarity.light, isDark ? rarity.border : rarity.borderLight)
                      : cn(isDark ? 'bg-dark-900/50 border-dark-800' : 'bg-gray-50 border-gray-200', 'opacity-60')
                  )} 
                  whileHover={{ y: -2 }}
                >
                  {badge.unlocked && (
                    <motion.div className="absolute inset-0 pointer-events-none" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: badge.rarity === 'rare' || badge.rarity === 'epic' ? 2 : 4, ease: 'easeInOut' }}>
                      <div className={cn("w-1/3 h-full bg-gradient-to-r from-transparent to-transparent skew-x-12", badge.rarity === 'epic' ? 'via-violet-400/30' : badge.rarity === 'rare' ? 'via-blue-400/25' : badge.rarity === 'uncommon' ? 'via-emerald-400/20' : 'via-white/10')} />
                    </motion.div>
                  )}
                  
                  {!badge.unlocked && <Lock className={cn("absolute top-3 right-3 w-4 h-4", isDark ? "text-dark-600" : "text-gray-400")} />}
                  
                  <div className="flex items-start gap-4 relative">
                    <motion.div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-3xl", badge.unlocked ? (isDark ? 'bg-dark-800/50' : 'bg-white/50') : (isDark ? 'bg-dark-800 grayscale' : 'bg-gray-200 grayscale'))} whileHover={badge.unlocked ? { scale: 1.1, rotate: 10 } : {}}>
                      {badge.icon}
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn("font-semibold", badge.unlocked ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-dark-500' : 'text-gray-400'))}>{badge.name}</h3>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs", isDark ? rarity.dark : rarity.light)}>+{badge.xp} XP</span>
                      </div>
                      <p className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-500")}>{badge.desc}</p>
                      {badge.unlocked ? (
                        <p className={cn("text-xs mt-2", isDark ? "text-dark-600" : "text-gray-400")}>✓ Débloqué le {badge.unlockedAt}</p>
                      ) : badge.progress && (
                        <div className="mt-2">
                          <div className={cn("w-full h-1.5 rounded-full overflow-hidden", isDark ? "bg-dark-800" : "bg-gray-200")}>
                            <motion.div className={cn("h-full rounded-full", isDark ? "bg-gold-500" : "bg-orange-500")} initial={{ width: 0 }} animate={{ width: `${badge.progress}%` }} transition={{ duration: 1, delay: 0.2 }} />
                          </div>
                          <p className={cn("text-xs mt-1", isDark ? "text-dark-500" : "text-gray-400")}>{badge.progress}% complété</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </motion.div>
        </div>

        {/* Leaderboard */}
        <div className={cn("rounded-2xl border overflow-hidden h-fit", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
          <div className={cn("p-6 border-b", isDark ? "border-dark-800" : "border-gray-100")}>
            <div className="flex items-center gap-3">
              <Crown className={cn("w-6 h-6", isDark ? "text-gold-400" : "text-orange-500")} />
              <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>Classement</h2>
            </div>
          </div>
          <div className={cn("divide-y", isDark ? "divide-dark-800" : "divide-gray-100")}>
            {leaderboard.map((u) => (
              <motion.div key={u.rank} className={cn("p-4 flex items-center gap-3", u.isCurrentUser && (isDark ? 'bg-gold-500/5' : 'bg-orange-50'))} whileHover={{ x: 4 }}>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm", u.rank === 1 ? (isDark ? 'bg-gold-500 text-dark-950' : 'bg-orange-500 text-white') : u.rank === 2 ? 'bg-gray-400 text-white' : u.rank === 3 ? 'bg-amber-700 text-white' : (isDark ? 'bg-dark-800 text-dark-400' : 'bg-gray-100 text-gray-500'))}>
                  {u.rank}
                </div>
                <div className="flex-1">
                  <p className={cn("font-medium", u.isCurrentUser ? (isDark ? 'text-gold-400' : 'text-orange-600') : (isDark ? 'text-white' : 'text-gray-900'))}>{u.name}</p>
                  <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>Lvl {u.level}</p>
                </div>
                <div className="text-right">
                  <p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{u.xp.toLocaleString()}</p>
                  <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>XP</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Badge Modal */}
      <Modal isOpen={!!selectedBadge} onClose={() => setSelectedBadge(null)} maxWidth="max-w-sm">
        {selectedBadge && (
          <div className="text-center">
            <motion.div className={cn("w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center text-5xl relative overflow-hidden", isDark ? "bg-dark-800" : "bg-gray-100")} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }}>
              {selectedBadge.icon}
              {selectedBadge.unlocked && (
                <motion.div className="absolute inset-0 pointer-events-none" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}>
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </motion.div>
              )}
            </motion.div>
            <h2 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>{selectedBadge.name}</h2>
            <p className={cn("mb-3", isDark ? "text-dark-400" : "text-gray-500")}>{selectedBadge.desc}</p>
            <div className={cn("inline-block px-3 py-1 rounded-full text-xs font-medium mb-3", isDark ? rarityConfig[selectedBadge.rarity].dark : rarityConfig[selectedBadge.rarity].light)}>{rarityNames[selectedBadge.rarity]}</div>
            <div className={cn("flex items-center justify-center gap-2 px-4 py-2 rounded-xl mb-6", isDark ? rarityConfig[selectedBadge.rarity].dark : rarityConfig[selectedBadge.rarity].light)}>
              <Zap className="w-4 h-4" />+{selectedBadge.xp} XP
            </div>
            {selectedBadge.unlocked ? (
              <p className="text-sm text-emerald-400">✓ Débloqué le {selectedBadge.unlockedAt}</p>
            ) : (
              <div>
                <p className={cn("text-sm mb-2", isDark ? "text-dark-400" : "text-gray-500")}>Progression : {selectedBadge.progress || 0}%</p>
                <div className={cn("w-full h-2 rounded-full overflow-hidden", isDark ? "bg-dark-800" : "bg-gray-200")}>
                  <motion.div className={cn("h-full rounded-full", isDark ? "bg-gold-500" : "bg-orange-500")} initial={{ width: 0 }} animate={{ width: `${selectedBadge.progress || 0}%` }} />
                </div>
              </div>
            )}
            <motion.button onClick={() => setSelectedBadge(null)} className={cn("mt-6 px-6 py-2.5 rounded-xl font-medium", isDark ? "bg-dark-800 hover:bg-dark-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700")} whileTap={{ scale: 0.98 }}>Fermer</motion.button>
          </div>
        )}
      </Modal>
    </div>
  )
}
