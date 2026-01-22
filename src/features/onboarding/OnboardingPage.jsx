import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Clock, CalendarDays, Trophy, ArrowRight, ArrowLeft, Check, Camera, Upload, ChevronRight, Zap } from 'lucide-react'
import { useAuth } from '@shared/context/AuthContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'
import confetti from 'canvas-confetti'

const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Bienvenue sur Kokbif ! 🎉', subtitle: 'La plateforme qui transforme vos timesheets en jeu' },
  { id: 'avatar', title: 'Personnalisez votre profil', subtitle: 'Choisissez un avatar qui vous représente' },
  { id: 'tour-dashboard', title: 'Votre Dashboard', subtitle: "Votre vue d'ensemble en un coup d'œil", feature: 'dashboard' },
  { id: 'tour-timesheet', title: 'Saisie des heures', subtitle: 'Simple, rapide et intuitive', feature: 'timesheet' },
  { id: 'tour-achievements', title: 'Gagnez des badges ! 🏆', subtitle: 'Chaque action vous rapproche du niveau suivant', feature: 'achievements' },
  { id: 'ready', title: 'Vous êtes prêt !', subtitle: 'Commencez votre première semaine' },
]

const AVATARS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { user, updateProfile, completeOnboarding } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATARS[0])
  
  const step = ONBOARDING_STEPS[currentStep]
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100

  const handleNext = () => currentStep < ONBOARDING_STEPS.length - 1 ? setCurrentStep(prev => prev + 1) : handleComplete()
  const handlePrev = () => currentStep > 0 && setCurrentStep(prev => prev - 1)

  const handleComplete = () => {
    updateProfile({ avatar: selectedAvatar })
    completeOnboarding()
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#fbbf24', '#f59e0b', '#d97706', '#10b981'] })
    setTimeout(() => navigate(user?.role === 'manager' ? '/app/manager' : '/app/consultant'), 1000)
  }

  const handleSkip = () => { completeOnboarding(); navigate(user?.role === 'manager' ? '/app/manager' : '/app/consultant') }

  return (
    <div className={cn("min-h-screen flex flex-col", isDark ? "bg-dark-950" : "bg-gray-50")}>
      {/* Progress Bar */}
      <div className={cn("fixed top-0 left-0 right-0 h-1 z-50", isDark ? "bg-dark-900" : "bg-gray-200")}>
        <motion.div className={cn("h-full bg-gradient-to-r", isDark ? "from-gold-500 to-amber-500" : "from-orange-500 to-amber-500")} initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>

      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isDark ? "bg-gradient-to-br from-gold-400 to-amber-500" : "bg-gradient-to-br from-orange-500 to-amber-500")}>
            <Sparkles className={cn("w-5 h-5", isDark ? "text-dark-950" : "text-white")} />
          </div>
          <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>Kokbif</span>
        </div>
        <button onClick={handleSkip} className={cn("text-sm transition-colors", isDark ? "text-dark-500 hover:text-dark-300" : "text-gray-500 hover:text-gray-700")}>Passer l'intro</button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div key={step.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="text-center">
              
              {/* Welcome */}
              {step.id === 'welcome' && (
                <div>
                  <motion.div className="w-32 h-32 mx-auto mb-8 relative" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
                    <div className={cn("absolute inset-0 rounded-3xl rotate-6", isDark ? "bg-gradient-to-br from-gold-400 to-amber-500" : "bg-gradient-to-br from-orange-400 to-amber-500")} />
                    <div className={cn("absolute inset-0 rounded-3xl -rotate-6", isDark ? "bg-gradient-to-br from-gold-400 to-amber-500" : "bg-gradient-to-br from-orange-400 to-amber-500")} />
                    <div className={cn("relative w-full h-full rounded-3xl flex items-center justify-center", isDark ? "bg-gradient-to-br from-gold-400 to-amber-500" : "bg-gradient-to-br from-orange-400 to-amber-500")}>
                      <Sparkles className={cn("w-16 h-16", isDark ? "text-dark-950" : "text-white")} />
                    </div>
                  </motion.div>
                  <h1 className={cn("text-4xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>{step.title}</h1>
                  <p className={cn("text-xl mb-8", isDark ? "text-dark-400" : "text-gray-500")}>{step.subtitle}</p>
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                    {[
                      { icon: Clock, label: 'Timesheet rapide', color: 'blue' },
                      { icon: Trophy, label: 'Badges & XP', color: 'gold' },
                      { icon: CalendarDays, label: 'Congés faciles', color: 'violet' },
                    ].map((item, i) => (
                      <motion.div key={i} className={cn("p-4 rounded-xl border", isDark 
                        ? `bg-${item.color}-500/10 border-${item.color}-500/20` 
                        : `bg-${item.color === 'gold' ? 'orange' : item.color}-50 border-${item.color === 'gold' ? 'orange' : item.color}-200`
                      )} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}>
                        <item.icon className={cn("w-8 h-8 mx-auto mb-2", isDark ? `text-${item.color}-400` : `text-${item.color === 'gold' ? 'orange' : item.color}-500`)} />
                        <p className={cn("text-sm", isDark ? "text-dark-300" : "text-gray-600")}>{item.label}</p>
                      </motion.div>
                    ))}
                  </div>
                  <p className={cn(isDark ? "text-dark-500" : "text-gray-500")}>
                    Bonjour <span className={cn("font-medium", isDark ? "text-gold-400" : "text-orange-600")}>{user?.name || 'Utilisateur'}</span> ! Prêt à découvrir votre nouvel outil ?
                  </p>
                </div>
              )}

              {/* Avatar */}
              {step.id === 'avatar' && (
                <div>
                  <h1 className={cn("text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>{step.title}</h1>
                  <p className={cn("mb-8", isDark ? "text-dark-400" : "text-gray-500")}>{step.subtitle}</p>
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    <motion.img key={selectedAvatar} src={selectedAvatar} alt="Avatar" className={cn("w-full h-full rounded-3xl object-cover border-4 shadow-xl", isDark ? "border-gold-500 shadow-gold-500/20" : "border-orange-500 shadow-orange-500/20")} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} />
                    <div className={cn("absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg", isDark ? "bg-gradient-to-br from-gold-400 to-amber-500" : "bg-gradient-to-br from-orange-400 to-amber-500")}>
                      <Camera className={cn("w-5 h-5", isDark ? "text-dark-950" : "text-white")} />
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-3 max-w-md mx-auto mb-6">
                    {AVATARS.map((avatar, i) => (
                      <motion.button key={i} onClick={() => setSelectedAvatar(avatar)} className={cn("relative aspect-square rounded-xl overflow-hidden border-2 transition-all", selectedAvatar === avatar ? (isDark ? 'border-gold-500 ring-2 ring-gold-500/30' : 'border-orange-500 ring-2 ring-orange-500/30') : (isDark ? 'border-dark-700 hover:border-dark-500' : 'border-gray-200 hover:border-gray-400'))} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <img src={avatar} alt="" className="w-full h-full object-cover" />
                        {selectedAvatar === avatar && <div className={cn("absolute inset-0 flex items-center justify-center", isDark ? "bg-gold-500/20" : "bg-orange-500/20")}><Check className="w-6 h-6 text-white" /></div>}
                      </motion.button>
                    ))}
                  </div>
                  <button className={cn("inline-flex items-center gap-2 px-4 py-2 text-sm transition-colors", isDark ? "text-dark-400 hover:text-white" : "text-gray-500 hover:text-gray-700")}><Upload className="w-4 h-4" />Ou téléverser une photo</button>
                </div>
              )}

              {/* Dashboard Tour */}
              {step.feature === 'dashboard' && (
                <div>
                  <div className={cn("w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center", isDark ? "bg-blue-500/10" : "bg-blue-50")}><Clock className={cn("w-10 h-10", isDark ? "text-blue-400" : "text-blue-500")} /></div>
                  <h1 className={cn("text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>{step.title}</h1>
                  <p className={cn("mb-8", isDark ? "text-dark-400" : "text-gray-500")}>{step.subtitle}</p>
                  <div className={cn("rounded-2xl border p-6 max-w-lg mx-auto", isDark ? "bg-dark-900/50 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className={cn("p-4 rounded-xl", isDark ? "bg-dark-800/50" : "bg-gray-50")}><p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>32h</p><p className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-500")}>Cette semaine</p></div>
                      <div className={cn("p-4 rounded-xl", isDark ? "bg-dark-800/50" : "bg-gray-50")}><p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>18</p><p className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-500")}>Congés restants</p></div>
                    </div>
                    <div className={cn("flex items-center justify-between p-3 rounded-xl", isDark ? "bg-dark-800/30" : "bg-gray-100")}><span className={cn(isDark ? "text-dark-400" : "text-gray-600")}>Semaine en cours</span><span className={cn("font-medium", isDark ? "text-gold-400" : "text-orange-600")}>4/5 jours</span></div>
                  </div>
                </div>
              )}

              {/* Timesheet Tour */}
              {step.feature === 'timesheet' && (
                <div>
                  <div className={cn("w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center", isDark ? "bg-emerald-500/10" : "bg-emerald-50")}><CalendarDays className={cn("w-10 h-10", isDark ? "text-emerald-400" : "text-emerald-500")} /></div>
                  <h1 className={cn("text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>{step.title}</h1>
                  <p className={cn("mb-8", isDark ? "text-dark-400" : "text-gray-500")}>{step.subtitle}</p>
                  <div className={cn("rounded-2xl border p-6 max-w-lg mx-auto", isDark ? "bg-dark-900/50 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
                    <div className="grid grid-cols-5 gap-2">
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'].map((day, i) => (
                        <div key={day} className="text-center">
                          <p className={cn("text-xs mb-2", isDark ? "text-dark-500" : "text-gray-500")}>{day}</p>
                          <motion.div className={cn("aspect-square rounded-xl flex items-center justify-center text-lg font-bold border", i < 3 ? (isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200') : (isDark ? 'bg-dark-800/50 text-dark-400' : 'bg-gray-50 text-gray-400 border-gray-200'))} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>8h</motion.div>
                        </div>
                      ))}
                    </div>
                    <p className={cn("text-center text-sm mt-4", isDark ? "text-dark-500" : "text-gray-500")}>Cliquez sur un jour pour saisir vos heures</p>
                  </div>
                </div>
              )}

              {/* Achievements Tour */}
              {step.feature === 'achievements' && (
                <div>
                  <div className={cn("w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center", isDark ? "bg-gold-500/10" : "bg-orange-50")}><Trophy className={cn("w-10 h-10", isDark ? "text-gold-400" : "text-orange-500")} /></div>
                  <h1 className={cn("text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>{step.title}</h1>
                  <p className={cn("mb-8", isDark ? "text-dark-400" : "text-gray-500")}>{step.subtitle}</p>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    {['🌅', '🔥', '⭐', '⚡', '🎯'].map((emoji, i) => (
                      <motion.div key={i} className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl", isDark ? "bg-dark-800/50" : "bg-gray-100")} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + i * 0.1, type: 'spring' }} whileHover={{ scale: 1.1, y: -5 }}>{emoji}</motion.div>
                    ))}
                  </div>
                  <div className={cn("max-w-sm mx-auto p-4 rounded-xl border", isDark ? "bg-dark-900/50 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
                    <div className="flex items-center justify-between mb-2"><span className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Niveau 1</span><span className={cn(isDark ? "text-gold-400" : "text-orange-600")}>0/300 XP</span></div>
                    <div className={cn("h-2 rounded-full overflow-hidden", isDark ? "bg-dark-800" : "bg-gray-200")}><motion.div className={cn("h-full bg-gradient-to-r", isDark ? "from-gold-500 to-amber-500" : "from-orange-500 to-amber-500")} initial={{ width: 0 }} animate={{ width: '15%' }} transition={{ delay: 0.5, duration: 1 }} /></div>
                    <p className={cn("text-center text-sm mt-3", isDark ? "text-dark-500" : "text-gray-500")}>Complétez votre première semaine pour gagner <span className={cn(isDark ? "text-gold-400" : "text-orange-600")}>+50 XP</span></p>
                  </div>
                </div>
              )}

              {/* Ready */}
              {step.id === 'ready' && (
                <div>
                  <motion.div className="w-32 h-32 mx-auto mb-8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                    <div className="relative w-full h-full">
                      <img src={selectedAvatar} alt="Votre avatar" className={cn("w-full h-full rounded-3xl object-cover border-4", isDark ? "border-gold-500" : "border-orange-500")} />
                      <motion.div className="absolute -top-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}><Check className="w-6 h-6 text-white" /></motion.div>
                    </div>
                  </motion.div>
                  <h1 className={cn("text-4xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>{step.title}</h1>
                  <p className={cn("text-xl mb-8", isDark ? "text-dark-400" : "text-gray-500")}>{step.subtitle}</p>
                  <motion.div className={cn("max-w-md mx-auto p-6 rounded-2xl border", isDark ? "bg-gradient-to-br from-gold-500/10 to-amber-500/5 border-gold-500/30" : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200")} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", isDark ? "bg-gold-500/20" : "bg-orange-100")}><Zap className={cn("w-6 h-6", isDark ? "text-gold-400" : "text-orange-600")} /></div>
                      <div className="text-left"><p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Première quête</p><p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>Débloquez le badge Early Bird</p></div>
                    </div>
                    <div className={cn("flex items-center justify-between p-3 rounded-xl", isDark ? "bg-dark-800/50" : "bg-white/80")}><span className={cn(isDark ? "text-dark-300" : "text-gray-600")}>Soumettez votre première semaine</span><span className={cn("font-medium", isDark ? "text-gold-400" : "text-orange-600")}>+50 XP</span></div>
                  </motion.div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 flex items-center justify-between max-w-2xl mx-auto w-full">
        <div>{currentStep > 0 && <motion.button onClick={handlePrev} className={cn("flex items-center gap-2 px-4 py-2 transition-colors", isDark ? "text-dark-400 hover:text-white" : "text-gray-500 hover:text-gray-700")} initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ArrowLeft className="w-4 h-4" />Précédent</motion.button>}</div>
        <div className="flex items-center gap-2">{ONBOARDING_STEPS.map((_, i) => <div key={i} className={cn("h-2 rounded-full transition-colors", i === currentStep ? (isDark ? 'bg-gold-500 w-6' : 'bg-orange-500 w-6') : i < currentStep ? (isDark ? 'bg-gold-500/50' : 'bg-orange-500/50') : (isDark ? 'bg-dark-700 w-2' : 'bg-gray-300 w-2'))} />)}</div>
        <motion.button onClick={handleNext} className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-semibold", isDark ? "bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950" : "bg-gradient-to-r from-orange-500 to-amber-500 text-white")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {currentStep === ONBOARDING_STEPS.length - 1 ? <><span>Commencer</span><ChevronRight className="w-5 h-5" /></> : <><span>Suivant</span><ArrowRight className="w-5 h-5" /></>}
        </motion.button>
      </div>
    </div>
  )
}
