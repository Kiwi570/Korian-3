import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, ClipboardCheck, BarChart3, Clock, CalendarDays, Trophy, ChevronDown, User, Settings, LogOut, Briefcase, UserCircle, Sun, Moon } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { useApp } from '@shared/context/AppContext'
import { useTheme } from '@shared/context/ThemeContext'
import { NotificationBell, NotificationToast } from '@shared/components/ui'

const managerNav = [
  { label: 'Dashboard', href: '/app/manager', icon: LayoutDashboard },
  { label: 'Équipe', href: '/app/manager/team', icon: Users },
  { label: 'Approbations', href: '/app/manager/approvals', icon: ClipboardCheck, badge: true },
  { label: 'Rapports', href: '/app/manager/reports', icon: BarChart3 },
]

const consultantNav = [
  { label: 'Dashboard', href: '/app/consultant', icon: LayoutDashboard },
  { label: 'Timesheet', href: '/app/consultant/timesheet', icon: Clock },
  { label: 'Congés', href: '/app/consultant/leave', icon: CalendarDays },
  { label: 'Achievements', href: '/app/consultant/achievements', icon: Trophy },
]

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { users, getPendingCount, getUnreadCount } = useApp()
  const { isDark, toggleTheme } = useTheme()
  const [profileOpen, setProfileOpen] = useState(false)
  
  const isManager = location.pathname.includes('/manager')
  const currentRole = isManager ? 'manager' : 'consultant'
  const currentNav = isManager ? managerNav : consultantNav
  const currentUser = isManager ? users.manager : users.consultant
  const pendingCount = getPendingCount()

  const switchRole = (role) => navigate(role === 'manager' ? '/app/manager' : '/app/consultant')

  return (
    <div className={cn("min-h-screen transition-colors duration-200", isDark ? "bg-dark-950" : "bg-[#fafafa]")}>
      <NotificationToast role={currentRole} />

      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isDark 
          ? "bg-dark-950/95 backdrop-blur-xl border-b border-dark-800/50" 
          : "bg-white/80 backdrop-blur-xl border-b border-gray-200/80 shadow-sm"
      )}>
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <motion.div 
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                isDark 
                  ? "bg-gradient-to-br from-gold-400 to-gold-600 shadow-gold-500/20" 
                  : "bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-500/25"
              )} 
              whileHover={{ scale: 1.05, rotate: -5 }}
            >
              <span className={cn("font-bold text-lg", isDark ? "text-dark-950" : "text-white")}>K</span>
            </motion.div>
            <span className={cn("font-bold text-xl hidden sm:block", isDark ? "text-white" : "text-gray-900")}>Kokbif</span>
          </NavLink>

          {/* Role Switcher - Center */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <div className={cn(
              "flex items-center rounded-xl p-1 transition-colors duration-200",
              isDark ? "bg-dark-900 border border-dark-800" : "bg-gray-100 border border-gray-200"
            )}>
              <motion.button 
                onClick={() => switchRole('manager')}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  isManager 
                    ? isDark 
                      ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 shadow-lg shadow-gold-500/25' 
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                    : isDark ? 'text-dark-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                )}
                whileTap={{ scale: 0.98 }}
              >
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Manager</span>
                {!isManager && getUnreadCount('manager') > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {getUnreadCount('manager')}
                  </motion.span>
                )}
              </motion.button>
              <motion.button 
                onClick={() => switchRole('consultant')}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  !isManager 
                    ? isDark 
                      ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 shadow-lg shadow-gold-500/25' 
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                    : isDark ? 'text-dark-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                )}
                whileTap={{ scale: 0.98 }}
              >
                <UserCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Consultant</span>
                {isManager && getUnreadCount('consultant') > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {getUnreadCount('consultant')}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                isDark 
                  ? "bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-gold-400" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-orange-500"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            <NotificationBell role={currentRole} />
            
            {/* Profile Dropdown */}
            <div className="relative">
              <motion.button 
                onClick={() => setProfileOpen(!profileOpen)} 
                className={cn(
                  "flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl border transition-all duration-200",
                  isDark 
                    ? "bg-dark-900 border-dark-800 hover:border-dark-700" 
                    : "bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
                )} 
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-right hidden sm:block">
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>{currentUser.name}</p>
                  <p className={cn("text-xs", isDark ? "text-dark-400" : "text-gray-500")}>{currentUser.role}</p>
                </div>
                <div className="w-9 h-9 rounded-lg overflow-hidden ring-2 ring-offset-2 ring-offset-transparent ring-transparent">
                  <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isDark ? "text-dark-400" : "text-gray-400", profileOpen && "rotate-180")} />
              </motion.button>
              
              <AnimatePresence>
                {profileOpen && (
                  <>
                    <motion.div className="fixed inset-0 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProfileOpen(false)} />
                    <motion.div 
                      className={cn(
                        "absolute right-0 top-full mt-2 w-56 rounded-2xl border overflow-hidden z-50",
                        isDark 
                          ? "bg-dark-900 border-dark-800 shadow-2xl" 
                          : "bg-white border-gray-200 shadow-xl"
                      )} 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    >
                      <div className={cn("p-4 border-b", isDark ? "border-dark-800" : "border-gray-100")}>
                        <div className="flex items-center gap-3">
                          <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{currentUser.fullName}</p>
                            <p className={cn("text-xs", isDark ? "text-dark-400" : "text-gray-500")}>{currentUser.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <NavLink 
                          to="/app/profile" 
                          onClick={() => setProfileOpen(false)} 
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                            isDark ? "text-dark-300 hover:text-white hover:bg-dark-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          )}
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm font-medium">Mon Profil</span>
                        </NavLink>
                        <NavLink 
                          to="/app/settings" 
                          onClick={() => setProfileOpen(false)} 
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                            isDark ? "text-dark-300 hover:text-white hover:bg-dark-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          )}
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm font-medium">Paramètres</span>
                        </NavLink>
                      </div>
                      <div className={cn("border-t p-2", isDark ? "border-dark-800" : "border-gray-100")}>
                        <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Déconnexion</span>
                        </NavLink>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className={cn("border-t", isDark ? "border-dark-800/50" : "border-gray-100")}>
          <div className="max-w-[1600px] mx-auto px-6">
            <nav className="flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
              {currentNav.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                const showBadge = item.badge && pendingCount > 0
                return (
                  <NavLink 
                    key={item.href} 
                    to={item.href} 
                    className={cn(
                      'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                      isActive 
                        ? isDark ? 'text-gold-400' : 'text-orange-600' 
                        : isDark ? 'text-dark-400 hover:text-white hover:bg-dark-800/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {showBadge && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-1 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                        {pendingCount}
                      </motion.span>
                    )}
                    {isActive && (
                      <motion.div 
                        className={cn(
                          "absolute bottom-0 left-4 right-4 h-0.5 rounded-full",
                          isDark ? "bg-gradient-to-r from-gold-400 to-amber-500" : "bg-gradient-to-r from-orange-500 to-amber-500"
                        )} 
                        layoutId="activeTab" 
                      />
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-36 pb-8 px-6">
        <div className="max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
