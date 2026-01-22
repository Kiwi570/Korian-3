import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Briefcase, Trophy, Star, Flame, Camera, Save, CheckCircle, Calendar, Clock } from 'lucide-react'
import { staggerContainer, staggerItem } from '@shared/lib/animations'
import { useApp } from '@shared/context/AppContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

const PROFILE_BADGES = [
  { emoji: '🌅', name: 'Early Bird', date: '15 Jan' },
  { emoji: '🔥', name: 'Streak Master', date: '12 Jan' },
  { emoji: '⭐', name: 'Perfect Week', date: '10 Jan' },
  { emoji: '⚡', name: 'Speed Demon', date: null },
  { emoji: '🎯', name: 'Perfect Month', date: '1 Jan' },
  { emoji: '💎', name: 'Diamond', date: null },
  { emoji: '🏆', name: 'Champion', date: null },
  { emoji: '🚀', name: 'Pioneer', date: '1 Jan' },
]

function ProfileBadge({ badge, index, isDark }) {
  const [show, setShow] = useState(false)
  const unlocked = badge.date !== null
  
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <motion.div className={cn("aspect-square rounded-xl flex items-center justify-center text-2xl", unlocked ? (isDark ? 'bg-gradient-to-br from-gold-500/20 to-amber-500/10 border border-gold-500/20' : 'bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200') : (isDark ? 'bg-dark-800/50 opacity-40' : 'bg-gray-100 opacity-40'))} whileHover={unlocked ? { scale: 1.1 } : {}} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: unlocked ? 1 : 0.4, scale: 1 }} transition={{ delay: index * 0.05 }}>
        {badge.emoji}
      </motion.div>
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
            <div className={cn("rounded-lg px-3 py-2 shadow-xl whitespace-nowrap text-center border", isDark ? "bg-dark-800 border-dark-700" : "bg-white border-gray-200")}>
              <p className={cn("text-xs font-medium", isDark ? "text-white" : "text-gray-900")}>{badge.name}</p>
              {unlocked ? <p className="text-emerald-500 text-[10px]">✓ {badge.date}</p> : <p className={cn("text-[10px]", isDark ? "text-dark-500" : "text-gray-400")}>🔒 Verrouillé</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProfilePage() {
  const location = useLocation()
  const { users, addToast } = useApp()
  const { isDark } = useTheme()
  const isManager = location.pathname.includes('/manager')
  const currentUser = isManager ? users.manager : users.consultant
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ fullName: currentUser.fullName, email: currentUser.email })
  
  const handleSave = () => { addToast('Profil mis à jour !', 'success'); setIsEditing(false) }
  const xpProgress = (currentUser.xp % 300) / 300 * 100

  const stats = [
    { label: 'Niveau', value: currentUser.level, icon: Trophy, color: 'gold' },
    { label: 'XP Total', value: currentUser.xp.toLocaleString(), icon: Star, color: 'emerald' },
    ...(currentUser.streak ? [{ label: 'Streak', value: `${currentUser.streak} jours`, icon: Flame, color: 'amber' }] : []),
  ]
  
  const historicStats = [
    { label: 'Membre depuis', value: '45 jours', icon: Calendar },
    { label: 'Semaines validées', value: '6', icon: CheckCircle },
    { label: 'Heures totales', value: '240h', icon: Clock },
  ]
  
  const colorClasses = {
    gold: { dark: 'bg-gold-500/10 text-gold-400', light: 'bg-orange-50 text-orange-600' },
    emerald: { dark: 'bg-emerald-500/10 text-emerald-400', light: 'bg-emerald-50 text-emerald-600' },
    amber: { dark: 'bg-amber-500/10 text-amber-400', light: 'bg-amber-50 text-amber-600' },
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className={cn("text-2xl sm:text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Mon Profil</h1>
        <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Gérez vos informations personnelles</p>
      </div>

      <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
        <div className={cn("relative h-32", isDark ? "bg-gradient-to-r from-gold-500/20 via-amber-500/10 to-gold-500/20" : "bg-gradient-to-r from-orange-100 via-amber-50 to-orange-100")}>
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <img src={currentUser.avatar} alt={currentUser.fullName} className={cn("w-24 h-24 rounded-2xl object-cover border-4 shadow-xl", isDark ? "border-dark-900" : "border-white")} />
              <motion.button className={cn("absolute -bottom-1 -right-1 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg", isDark ? "bg-gold-500 text-dark-950" : "bg-orange-500 text-white")} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Camera className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
        
        <div className="pt-16 px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>{currentUser.fullName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", isDark ? "bg-gold-500/10 text-gold-400" : "bg-orange-100 text-orange-600")}>{currentUser.role}</span>
                <span className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-400")}>•</span>
                <span className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{currentUser.email}</span>
              </div>
            </div>
            <motion.button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className={cn("flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm", isEditing ? (isDark ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950' : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white') : (isDark ? 'bg-dark-800 hover:bg-dark-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'))} whileTap={{ scale: 0.98 }}>
              {isEditing ? <><Save className="w-4 h-4" />Enregistrer</> : <><User className="w-4 h-4" />Modifier</>}
            </motion.button>
          </div>
          
          <div className={cn("rounded-xl p-4 mb-6", isDark ? "bg-dark-800/50" : "bg-gray-50")}>
            <div className="flex items-center justify-between mb-2">
              <span className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>Progression vers niveau {currentUser.level + 1}</span>
              <span className={cn("text-sm font-medium", isDark ? "text-gold-400" : "text-orange-600")}>{Math.round(xpProgress)}%</span>
            </div>
            <div className={cn("w-full h-3 rounded-full overflow-hidden", isDark ? "bg-dark-800" : "bg-gray-200")}>
              <motion.div className={cn("h-full rounded-full", isDark ? "bg-gradient-to-r from-gold-500 to-amber-500" : "bg-gradient-to-r from-orange-500 to-amber-500")} initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
            </div>
            <p className={cn("text-xs mt-2", isDark ? "text-dark-500" : "text-gray-400")}>{currentUser.xp % 300} / 300 XP</p>
          </div>
          
          {isEditing && (
            <motion.div className={cn("space-y-4 mb-6 p-4 rounded-xl border", isDark ? "bg-dark-800/30 border-dark-700" : "bg-gray-50 border-gray-200")} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <div>
                <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Nom complet</label>
                <div className="relative">
                  <User className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5", isDark ? "text-dark-500" : "text-gray-400")} />
                  <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className={cn("w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none", isDark ? "bg-dark-800 border-dark-700 text-white focus:border-gold-500" : "bg-white border-gray-300 text-gray-900 focus:border-orange-500")} />
                </div>
              </div>
              <div>
                <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Email</label>
                <div className="relative">
                  <Mail className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5", isDark ? "text-dark-500" : "text-gray-400")} />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={cn("w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none", isDark ? "bg-dark-800 border-dark-700 text-white focus:border-gold-500" : "bg-white border-gray-300 text-gray-900 focus:border-orange-500")} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4" variants={staggerContainer} initial="hidden" animate="visible">
        {stats.map((stat) => {
          const Icon = stat.icon
          const colors = colorClasses[stat.color]
          return (
            <motion.div key={stat.label} variants={staggerItem} className={cn("rounded-2xl border p-6", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")} whileHover={{ y: -2 }}>
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", isDark ? colors.dark : colors.light)}>
                <Icon className="w-6 h-6" />
              </div>
              <p className={cn("text-2xl font-bold mb-1", isDark ? "text-white" : "text-gray-900")}>{stat.value}</p>
              <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{stat.label}</p>
            </motion.div>
          )
        })}
      </motion.div>

      <div className={cn("rounded-2xl border p-6", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
        <h3 className={cn("text-lg font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>Badges obtenus</h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {PROFILE_BADGES.map((badge, i) => <ProfileBadge key={i} badge={badge} index={i} isDark={isDark} />)}
        </div>
        <p className={cn("text-sm mt-4", isDark ? "text-dark-500" : "text-gray-400")}>{PROFILE_BADGES.filter(b => b.date).length} badges débloqués sur {PROFILE_BADGES.length}</p>
      </div>

      <div className={cn("rounded-2xl border p-6", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
        <h3 className={cn("text-lg font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>Statistiques</h3>
        <div className="grid grid-cols-3 gap-4">
          {historicStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className={cn("text-center p-4 rounded-xl", isDark ? "bg-dark-800/50" : "bg-gray-50")}>
                <Icon className={cn("w-6 h-6 mx-auto mb-2", isDark ? "text-dark-500" : "text-gray-400")} />
                <p className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>{stat.value}</p>
                <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className={cn("rounded-2xl border p-6", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
        <h3 className={cn("text-lg font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>Informations</h3>
        <div className="space-y-4">
          {[{ icon: Briefcase, label: 'Poste', value: currentUser.role }, { icon: Mail, label: 'Email', value: currentUser.email }].map((item, i) => (
            <div key={i} className={cn("flex items-center justify-between py-3 border-b", isDark ? "border-dark-800" : "border-gray-100")}>
              <div className="flex items-center gap-3"><item.icon className={cn("w-5 h-5", isDark ? "text-dark-500" : "text-gray-400")} /><span className={cn(isDark ? "text-dark-400" : "text-gray-500")}>{item.label}</span></div>
              <span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{item.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3"><CheckCircle className={cn("w-5 h-5", isDark ? "text-dark-500" : "text-gray-400")} /><span className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Statut</span></div>
            <span className={cn("px-2 py-1 rounded-lg text-sm font-medium", isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-600")}>Actif</span>
          </div>
        </div>
      </div>
    </div>
  )
}
