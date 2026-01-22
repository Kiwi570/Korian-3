import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Briefcase, ArrowRight, Sparkles, AlertCircle, Loader2, Check, Users } from 'lucide-react'
import { useAuth } from '@shared/context/AuthContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuth()
  const { isDark } = useTheme()
  
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'consultant', acceptTerms: false })
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    clearError(); setLocalError('')
  }

  const passwordChecks = { length: formData.password.length >= 8, uppercase: /[A-Z]/.test(formData.password), lowercase: /[a-z]/.test(formData.password), number: /[0-9]/.test(formData.password) }
  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) { setLocalError('Veuillez remplir tous les champs'); return }
    if (formData.password !== formData.confirmPassword) { setLocalError('Les mots de passe ne correspondent pas'); return }
    if (passwordStrength < 3) { setLocalError('Le mot de passe n\'est pas assez sécurisé'); return }
    if (!formData.acceptTerms) { setLocalError('Vous devez accepter les conditions'); return }
    const result = await register(formData)
    if (result.success) navigate('/onboarding')
  }

  const displayError = localError || error
  const inputClass = cn("w-full pl-12 pr-4 py-3.5 rounded-xl border transition-colors focus:outline-none", isDark ? "bg-dark-900 border-dark-800 text-white placeholder-dark-500 focus:border-gold-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500")

  return (
    <div className={cn("min-h-screen flex", isDark ? "bg-dark-950" : "bg-gray-50")}>
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div className="w-full max-w-md py-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-gradient-to-br from-gold-400 to-amber-500" : "bg-gradient-to-br from-orange-500 to-amber-500")}>
              <Sparkles className={cn("w-6 h-6", isDark ? "text-dark-950" : "text-white")} />
            </div>
            <span className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>Kokbif</span>
          </Link>

          <div className="mb-8">
            <h1 className={cn("text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Créer un compte ✨</h1>
            <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Rejoignez Kokbif et simplifiez vos timesheets</p>
          </div>

          {displayError && (
            <motion.div className={cn("mb-6 p-4 rounded-xl flex items-center gap-3 border", isDark ? "bg-rose-500/10 border-rose-500/30" : "bg-rose-50 border-rose-200")} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <AlertCircle className={cn("w-5 h-5 flex-shrink-0", isDark ? "text-rose-400" : "text-rose-600")} />
              <p className={cn("text-sm", isDark ? "text-rose-400" : "text-rose-600")}>{displayError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Prénom</label>
                <div className="relative">
                  <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", isDark ? "text-dark-500" : "text-gray-400")} />
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Paul" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Nom</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Martin" className={cn("w-full px-4 py-3.5 rounded-xl border transition-colors focus:outline-none", isDark ? "bg-dark-900 border-dark-800 text-white placeholder-dark-500 focus:border-gold-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500")} />
              </div>
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Email professionnel</label>
              <div className="relative">
                <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", isDark ? "text-dark-500" : "text-gray-400")} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="paul.martin@entreprise.com" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Votre rôle</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ role: 'consultant', icon: Briefcase, label: 'Consultant', desc: 'Je saisis mes heures' }, { role: 'manager', icon: Users, label: 'Manager', desc: 'Je valide mon équipe' }].map(r => (
                  <button key={r.role} type="button" onClick={() => setFormData(prev => ({ ...prev, role: r.role }))}
                    className={cn("p-4 rounded-xl border-2 transition-all", formData.role === r.role ? (isDark ? 'border-gold-500 bg-gold-500/10' : 'border-orange-500 bg-orange-50') : (isDark ? 'border-dark-800 bg-dark-900 hover:border-dark-700' : 'border-gray-200 bg-white hover:border-gray-300'))}>
                    <r.icon className={cn("w-6 h-6 mx-auto mb-2", formData.role === r.role ? (isDark ? 'text-gold-400' : 'text-orange-600') : (isDark ? 'text-dark-500' : 'text-gray-400'))} />
                    <p className={cn("font-medium", formData.role === r.role ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-dark-400' : 'text-gray-500'))}>{r.label}</p>
                    <p className={cn("text-xs mt-1", isDark ? "text-dark-500" : "text-gray-400")}>{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Mot de passe</label>
              <div className="relative">
                <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", isDark ? "text-dark-500" : "text-gray-400")} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={cn("w-full pl-12 pr-12 py-3.5 rounded-xl border transition-colors focus:outline-none", isDark ? "bg-dark-900 border-dark-800 text-white placeholder-dark-500 focus:border-gold-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={cn("absolute right-4 top-1/2 -translate-y-1/2", isDark ? "text-dark-500 hover:text-dark-300" : "text-gray-400 hover:text-gray-600")}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">{[1,2,3,4].map(l => <div key={l} className={cn("h-1 flex-1 rounded-full transition-colors", passwordStrength >= l ? (passwordStrength <= 2 ? 'bg-rose-500' : passwordStrength === 3 ? 'bg-amber-500' : 'bg-emerald-500') : (isDark ? 'bg-dark-800' : 'bg-gray-200'))} />)}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[{ k: 'length', t: '8 caractères min' }, { k: 'uppercase', t: '1 majuscule' }, { k: 'lowercase', t: '1 minuscule' }, { k: 'number', t: '1 chiffre' }].map(c => (
                      <div key={c.k} className={cn("flex items-center gap-1", passwordChecks[c.k] ? 'text-emerald-500' : (isDark ? 'text-dark-500' : 'text-gray-400'))}><Check className="w-3 h-3" />{c.t}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Confirmer</label>
              <div className="relative">
                <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", isDark ? "text-dark-500" : "text-gray-400")} />
                <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••"
                  className={cn("w-full pl-12 pr-4 py-3.5 rounded-xl border transition-colors focus:outline-none", formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-rose-500' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-emerald-500' : (isDark ? "bg-dark-900 border-dark-800 text-white placeholder-dark-500 focus:border-gold-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500"))} />
                {formData.confirmPassword && formData.password === formData.confirmPassword && <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />}
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className={cn("w-5 h-5 mt-0.5 rounded focus:ring-offset-0", isDark ? "border-dark-700 bg-dark-900 text-gold-500 focus:ring-gold-500" : "border-gray-300 bg-white text-orange-500 focus:ring-orange-500")} />
              <span className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-600")}>J'accepte les <Link to="/legal" className={cn(isDark ? "text-gold-400" : "text-orange-600")}>conditions</Link></span>
            </label>

            <motion.button type="submit" disabled={isLoading} className={cn("w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50", isDark ? "bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950" : "bg-gradient-to-r from-orange-500 to-amber-500 text-white")} whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}>
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Création...</> : <>Créer mon compte<ArrowRight className="w-5 h-5" /></>}
            </motion.button>
          </form>

          <p className={cn("mt-8 text-center", isDark ? "text-dark-400" : "text-gray-500")}>Déjà un compte ? <Link to="/login" className={cn("font-medium", isDark ? "text-gold-400" : "text-orange-600")}>Se connecter</Link></p>
        </motion.div>
      </div>

      <div className={cn("hidden lg:flex flex-1 items-center justify-center relative overflow-hidden", isDark ? "bg-gradient-to-br from-dark-900 to-dark-950" : "bg-gradient-to-br from-emerald-500 to-teal-500")}>
        <div className={cn("absolute inset-0 bg-grid", isDark ? "opacity-20" : "opacity-10")} />
        <div className={cn("absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-[120px]", isDark ? "bg-emerald-500/20" : "bg-white/30")} />
        <div className="relative z-10 text-center px-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-center gap-4 mb-8">
              {['🌅', '🔥', '⭐', '⚡', '🎯'].map((e, i) => (
                <motion.div key={i} className={cn("w-16 h-16 backdrop-blur rounded-2xl flex items-center justify-center text-3xl", isDark ? "bg-dark-800/50" : "bg-white/20")} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ scale: 1.1, y: -5 }}>{e}</motion.div>
              ))}
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Débloquez des badges,<br /><span className={cn(isDark ? "text-gold-400" : "text-emerald-200")}>montez en niveau</span></h2>
            <p className={cn("text-lg max-w-md mx-auto", isDark ? "text-dark-400" : "text-white/80")}>Chaque timesheet soumis vous rapproche du prochain badge.</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
