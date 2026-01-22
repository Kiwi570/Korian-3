import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, ArrowRight, Sparkles, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '@shared/context/AuthContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth()
  const { isDark } = useTheme()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { setError('Veuillez entrer votre email'); return }
    const result = await forgotPassword(email)
    if (result.success) setSuccess(true)
    else setError(result.error)
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center p-8", isDark ? "bg-dark-950" : "bg-gray-50")}>
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-gradient-to-br from-gold-400 to-amber-500" : "bg-gradient-to-br from-orange-500 to-amber-500")}>
            <Sparkles className={cn("w-6 h-6", isDark ? "text-dark-950" : "text-white")} />
          </div>
          <span className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>Kokbif</span>
        </Link>

        <Link to="/login" className={cn("inline-flex items-center gap-2 transition-colors mb-8", isDark ? "text-dark-400 hover:text-white" : "text-gray-500 hover:text-gray-900")}>
          <ArrowLeft className="w-4 h-4" />Retour à la connexion
        </Link>

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6", isDark ? "bg-emerald-500/10" : "bg-emerald-50")}>
              <CheckCircle className={cn("w-10 h-10", isDark ? "text-emerald-400" : "text-emerald-600")} />
            </div>
            <h1 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Email envoyé ! 📬</h1>
            <p className={cn("mb-6", isDark ? "text-dark-400" : "text-gray-500")}>
              Si un compte existe avec <span className={cn(isDark ? "text-white" : "text-gray-900")}>{email}</span>, vous recevrez un lien.
            </p>
            <Link to="/login">
              <motion.button className={cn("w-full py-4 rounded-xl font-semibold", isDark ? "bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950" : "bg-gradient-to-r from-orange-500 to-amber-500 text-white")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Retour à la connexion
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className={cn("text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Mot de passe oublié ? 🔑</h1>
              <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Entrez votre email pour recevoir un lien de réinitialisation.</p>
            </div>

            {error && (
              <motion.div className={cn("mb-6 p-4 rounded-xl flex items-center gap-3 border", isDark ? "bg-rose-500/10 border-rose-500/30" : "bg-rose-50 border-rose-200")} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <AlertCircle className={cn("w-5 h-5 flex-shrink-0", isDark ? "text-rose-400" : "text-rose-600")} />
                <p className={cn("text-sm", isDark ? "text-rose-400" : "text-rose-600")}>{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>Email</label>
                <div className="relative">
                  <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", isDark ? "text-dark-500" : "text-gray-400")} />
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} placeholder="votre@email.com"
                    className={cn("w-full pl-12 pr-4 py-3.5 rounded-xl border transition-colors focus:outline-none", isDark ? "bg-dark-900 border-dark-800 text-white placeholder-dark-500 focus:border-gold-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500")} />
                </div>
              </div>

              <motion.button type="submit" disabled={isLoading} className={cn("w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50", isDark ? "bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950" : "bg-gradient-to-r from-orange-500 to-amber-500 text-white")} whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}>
                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Envoi...</> : <>Envoyer le lien<ArrowRight className="w-5 h-5" /></>}
              </motion.button>
            </form>

            <div className={cn("mt-8 p-4 rounded-xl border", isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-200")}>
              <p className={cn("text-sm", isDark ? "text-blue-300" : "text-blue-700")}>
                <strong>Démo :</strong> <span className={cn(isDark ? "text-white" : "text-blue-900")}>paul.martin@kokbif.com</span> / <span className={cn(isDark ? "text-white" : "text-blue-900")}>demo123</span>
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
