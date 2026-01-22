import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, Loader2, Zap } from 'lucide-react'
import { useAuth } from '@shared/context/AuthContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, quickLogin, isLoading, error, clearError } = useAuth()
  const { isDark } = useTheme()
  
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false })
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    clearError()
    setLocalError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) { setLocalError('Veuillez remplir tous les champs'); return }
    const result = await login(formData.email, formData.password, formData.rememberMe)
    if (result.success) {
      navigate(result.user.hasCompletedOnboarding ? (result.user.role === 'manager' ? '/app/manager' : '/app/consultant') : '/onboarding')
    }
  }

  const handleQuickLogin = (role) => {
    const result = quickLogin(role)
    if (result.success) {
      navigate(result.user.hasCompletedOnboarding ? (result.user.role === 'manager' ? '/app/manager' : '/app/consultant') : '/onboarding')
    }
  }

  const displayError = localError || error

  return (
    <div className={cn("min-h-screen flex", isDark ? "bg-dark-950" : "bg-gray-50")}>
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-gradient-to-br from-gold-400 to-amber-500" : "bg-gradient-to-br from-orange-500 to-amber-500")}>
              <Sparkles className={cn("w-6 h-6", isDark ? "text-dark-950" : "text-white")} />
            </div>
            <span className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>Kokbif</span>
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className={cn("text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Bon retour ! 👋</h1>
            <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Connectez-vous pour accéder à votre espace</p>
          </div>

          {/* QUICK LOGIN - Plus visible */}
          <div className={cn("mb-6 p-4 rounded-2xl border", isDark ? "bg-emerald-500/10 border-emerald-500/30" : "bg-emerald-50 border-emerald-200")}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className={cn("w-5 h-5", isDark ? "text-emerald-400" : "text-emerald-600")} />
              <span className={cn("font-semibold", isDark ? "text-emerald-400" : "text-emerald-700")}>Accès rapide (démo)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={() => handleQuickLogin('consultant')}
                disabled={isLoading}
                className={cn("px-4 py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-50", isDark ? "bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400" : "bg-blue-100 hover:bg-blue-200 border border-blue-200 text-blue-700")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🧑‍💼 Consultant
              </motion.button>
              <motion.button
                onClick={() => handleQuickLogin('manager')}
                disabled={isLoading}
                className={cn("px-4 py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-50", isDark ? "bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-400" : "bg-violet-100 hover:bg-violet-200 border border-violet-200 text-violet-700")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                👔 Manager
              </motion.button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className={cn("w-full border-t", isDark ? "border-dark-800" : "border-gray-200")}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={cn("px-4", isDark ? "bg-dark-950 text-dark-500" : "bg-gray-50 text-gray-500")}>ou avec vos identifiants</span>
            </div>
          </div>

          {/* Error Message */}
          {displayError && (
            <motion.div className={cn("mb-6 p-4 rounded-xl flex items-center gap-3 border", isDark ? "bg-rose-500/10 border-rose-500/30" : "bg-rose-50 border-rose-200")} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <AlertCircle className={cn("w-5 h-5 flex-shrink-0", isDark ? "text-rose-400" : "text-rose-600")} />
              <p className={cn("text-sm", isDark ? "text-rose-400" : "text-rose-600")}>{displayError}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Email</label>
              <div className="relative">
                <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", isDark ? "text-dark-500" : "text-gray-400")} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className={cn("w-full pl-12 pr-4 py-3.5 rounded-xl border transition-colors focus:outline-none", isDark ? "bg-dark-900 border-dark-800 text-white placeholder-dark-500 focus:border-gold-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500")}
                />
              </div>
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Mot de passe</label>
              <div className="relative">
                <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", isDark ? "text-dark-500" : "text-gray-400")} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={cn("w-full pl-12 pr-12 py-3.5 rounded-xl border transition-colors focus:outline-none", isDark ? "bg-dark-900 border-dark-800 text-white placeholder-dark-500 focus:border-gold-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500")}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={cn("absolute right-4 top-1/2 -translate-y-1/2 transition-colors", isDark ? "text-dark-500 hover:text-dark-300" : "text-gray-400 hover:text-gray-600")}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className={cn("w-4 h-4 rounded focus:ring-offset-0", isDark ? "border-dark-700 bg-dark-900 text-gold-500 focus:ring-gold-500" : "border-gray-300 bg-white text-orange-500 focus:ring-orange-500")} />
                <span className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-600")}>Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" className={cn("text-sm font-medium transition-colors", isDark ? "text-gold-400 hover:text-gold-300" : "text-orange-600 hover:text-orange-500")}>Mot de passe oublié ?</Link>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className={cn("w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed", isDark ? "bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950" : "bg-gradient-to-r from-orange-500 to-amber-500 text-white")}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Connexion...</>) : (<>Se connecter<ArrowRight className="w-5 h-5" /></>)}
            </motion.button>
          </form>

          <p className={cn("mt-8 text-center", isDark ? "text-dark-400" : "text-gray-500")}>
            Pas encore de compte ?{' '}
            <Link to="/register" className={cn("font-medium transition-colors", isDark ? "text-gold-400 hover:text-gold-300" : "text-orange-600 hover:text-orange-500")}>Créer un compte</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
      <div className={cn("hidden lg:flex flex-1 items-center justify-center relative overflow-hidden", isDark ? "bg-gradient-to-br from-dark-900 to-dark-950" : "bg-gradient-to-br from-orange-500 to-amber-500")}>
        <div className={cn("absolute inset-0 bg-grid", isDark ? "opacity-20" : "opacity-10")} />
        <div className={cn("absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px]", isDark ? "bg-gold-500/20" : "bg-white/30")} />
        <div className={cn("absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px]", isDark ? "bg-violet-500/15" : "bg-amber-300/40")} />
        
        <div className="relative z-10 text-center px-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl", isDark ? "bg-gradient-to-br from-gold-400 to-amber-500 shadow-gold-500/30" : "bg-white shadow-orange-600/30")}>
              <Sparkles className={cn("w-12 h-12", isDark ? "text-dark-950" : "text-orange-500")} />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Gagnez du temps,<br /><span className={cn(isDark ? "text-gold-400" : "text-amber-200")}>gagnez des points</span></h2>
            <p className={cn("text-lg max-w-md mx-auto", isDark ? "text-dark-400" : "text-white/80")}>La première plateforme de timesheet qui récompense votre assiduité avec des badges et de l'XP.</p>
            
            <div className="flex items-center justify-center gap-12 mt-12">
              {[{ val: '4h', label: 'économisées/semaine' }, { val: '98%', label: 'taux de saisie' }, { val: '🇱🇺', label: 'Made for Lux' }].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold text-white">{s.val}</p>
                  <p className={cn("text-sm", isDark ? "text-dark-500" : "text-white/70")}>{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
