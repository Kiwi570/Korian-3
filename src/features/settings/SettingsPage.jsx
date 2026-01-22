import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Bell, Shield, Palette, Database, Globe, Camera, Mail, Phone, Briefcase, Save, Check, Sun, Moon, Monitor, ChevronRight, Lock, Key, Smartphone, LogOut, Trash2, Download, AlertTriangle } from 'lucide-react'
import { useAuth } from '@shared/context/AuthContext'
import { useApp } from '@shared/context/AppContext'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

const TABS = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Apparence', icon: Palette },
  { id: 'security', label: 'Sécurité', icon: Shield },
]

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuth()
  const { addToast } = useApp()
  const { isDark, toggleTheme } = useTheme()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState({ firstName: user?.name || '', lastName: user?.fullName?.split(' ')[1] || '', email: user?.email || '' })
  const [notifications, setNotifications] = useState({ emailEnabled: true, pushEnabled: true, reminderSaisie: true, validationRecue: true })
  
  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 800))
    updateProfile({ name: profile.firstName, fullName: `${profile.firstName} ${profile.lastName}` })
    addToast('Paramètres enregistrés !', 'success')
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl sm:text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Paramètres</h1>
          <p className={cn(isDark ? "text-dark-400" : "text-gray-500")}>Gérez votre compte et vos préférences</p>
        </div>
        <motion.button onClick={handleSave} disabled={isSaving} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50", isDark ? "bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950" : "bg-gradient-to-r from-orange-500 to-amber-500 text-white")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {isSaving ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Enregistrement...</> : <><Save className="w-4 h-4" />Enregistrer</>}
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className={cn("rounded-2xl border p-2 lg:sticky lg:top-6", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible scrollbar-hide">
              {TABS.map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap", isActive ? (isDark ? 'bg-gold-500/10 text-gold-400' : 'bg-orange-50 text-orange-600') : (isDark ? 'text-dark-400 hover:text-white hover:bg-dark-800/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'))} whileTap={{ scale: 0.98 }}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="hidden lg:inline">{tab.label}</span>
                  </motion.button>
                )
              })}
            </nav>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              
              {activeTab === 'profile' && (
                <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
                  <div className={cn("p-6 border-b", isDark ? "border-dark-800" : "border-gray-100")}>
                    <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>Informations personnelles</h2>
                    <p className={cn("text-sm mt-1", isDark ? "text-dark-400" : "text-gray-500")}>Mettez à jour vos informations</p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'} alt="Avatar" className={cn("w-24 h-24 rounded-2xl object-cover border-2", isDark ? "border-dark-700" : "border-gray-200")} />
                        <button className={cn("absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg", isDark ? "bg-gold-500 text-dark-950" : "bg-orange-500 text-white")}><Camera className="w-4 h-4" /></button>
                      </div>
                      <div>
                        <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{user?.fullName || 'Utilisateur'}</h3>
                        <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{user?.role === 'manager' ? 'Manager' : 'Consultant'}</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[{ label: 'Prénom', value: profile.firstName, key: 'firstName' }, { label: 'Nom', value: profile.lastName, key: 'lastName' }, { label: 'Email', value: profile.email, key: 'email', type: 'email' }].map(f => (
                        <div key={f.key}>
                          <label className={cn("block text-sm font-medium mb-2", isDark ? "text-dark-300" : "text-gray-700")}>{f.label}</label>
                          <input type={f.type || 'text'} value={f.value} onChange={(e) => setProfile({...profile, [f.key]: e.target.value})} className={cn("w-full px-4 py-3 rounded-xl border focus:outline-none", isDark ? "bg-dark-800 border-dark-700 text-white focus:border-gold-500" : "bg-white border-gray-300 text-gray-900 focus:border-orange-500")} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
                  <div className={cn("p-6 border-b", isDark ? "border-dark-800" : "border-gray-100")}>
                    <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>Notifications</h2>
                    <p className={cn("text-sm mt-1", isDark ? "text-dark-400" : "text-gray-500")}>Gérez vos préférences de notification</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {[{ key: 'emailEnabled', label: 'Notifications email', desc: 'Recevoir des emails' }, { key: 'pushEnabled', label: 'Notifications push', desc: 'Notifications navigateur' }, { key: 'reminderSaisie', label: 'Rappels de saisie', desc: 'Rappel pour saisir vos heures' }, { key: 'validationRecue', label: 'Validations', desc: 'Quand vos heures sont validées' }].map(n => (
                      <div key={n.key} className={cn("flex items-center justify-between p-4 rounded-xl", isDark ? "bg-dark-800/50" : "bg-gray-50")}>
                        <div>
                          <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{n.label}</p>
                          <p className={cn("text-sm", isDark ? "text-dark-400" : "text-gray-500")}>{n.desc}</p>
                        </div>
                        <button onClick={() => setNotifications({...notifications, [n.key]: !notifications[n.key]})} className={cn("w-12 h-7 rounded-full p-1 transition-colors", notifications[n.key] ? (isDark ? 'bg-gold-500' : 'bg-orange-500') : (isDark ? 'bg-dark-700' : 'bg-gray-300'))}>
                          <motion.div className="w-5 h-5 bg-white rounded-full shadow" animate={{ x: notifications[n.key] ? 20 : 0 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
                  <div className={cn("p-6 border-b", isDark ? "border-dark-800" : "border-gray-100")}>
                    <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>Apparence</h2>
                    <p className={cn("text-sm mt-1", isDark ? "text-dark-400" : "text-gray-500")}>Personnalisez l'interface</p>
                  </div>
                  <div className="p-6">
                    <p className={cn("text-sm font-medium mb-4", isDark ? "text-dark-300" : "text-gray-700")}>Thème</p>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button onClick={() => isDark && toggleTheme()} className={cn("p-4 rounded-xl border-2 text-left", !isDark ? (isDark ? 'border-gold-500 bg-gold-500/10' : 'border-orange-500 bg-orange-50') : (isDark ? 'border-dark-700 bg-dark-800' : 'border-gray-200 bg-white'))} whileTap={{ scale: 0.98 }}>
                        <Sun className={cn("w-6 h-6 mb-2", !isDark ? (isDark ? 'text-gold-400' : 'text-orange-600') : (isDark ? 'text-dark-500' : 'text-gray-400'))} />
                        <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>Clair</p>
                        <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>Thème lumineux</p>
                      </motion.button>
                      <motion.button onClick={() => !isDark && toggleTheme()} className={cn("p-4 rounded-xl border-2 text-left", isDark ? 'border-gold-500 bg-gold-500/10' : 'border-gray-200 bg-white')} whileTap={{ scale: 0.98 }}>
                        <Moon className={cn("w-6 h-6 mb-2", isDark ? 'text-gold-400' : 'text-gray-400')} />
                        <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>Sombre</p>
                        <p className={cn("text-xs", isDark ? "text-dark-500" : "text-gray-500")}>Thème sombre</p>
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-dark-900/80 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
                  <div className={cn("p-6 border-b", isDark ? "border-dark-800" : "border-gray-100")}>
                    <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>Sécurité</h2>
                    <p className={cn("text-sm mt-1", isDark ? "text-dark-400" : "text-gray-500")}>Gérez la sécurité de votre compte</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className={cn("p-4 rounded-xl", isDark ? "bg-dark-800/50" : "bg-gray-50")}>
                      <div className="flex items-center gap-3 mb-3">
                        <Lock className={cn("w-5 h-5", isDark ? "text-dark-500" : "text-gray-400")} />
                        <span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>Mot de passe</span>
                      </div>
                      <button className={cn("px-4 py-2 rounded-lg text-sm font-medium", isDark ? "bg-dark-700 hover:bg-dark-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700")}>Changer le mot de passe</button>
                    </div>
                    <div className={cn("p-4 rounded-xl", isDark ? "bg-rose-500/10 border border-rose-500/20" : "bg-rose-50 border border-rose-200")}>
                      <div className="flex items-center gap-3 mb-3">
                        <LogOut className={cn("w-5 h-5", isDark ? "text-rose-400" : "text-rose-600")} />
                        <span className={cn("font-medium", isDark ? "text-rose-400" : "text-rose-700")}>Déconnexion</span>
                      </div>
                      <button onClick={() => { logout(); window.location.href = '/login' }} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium">Se déconnecter</button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
