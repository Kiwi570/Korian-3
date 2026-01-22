import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { NAV_LINKS, APP_NAME } from '@shared/lib/constants'
import { Button } from '@shared/components/ui'
import { useTheme } from '@shared/context/ThemeContext'

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled 
            ? (isDark ? 'bg-dark-950/90 backdrop-blur-xl border-b border-dark-800/50 shadow-lg shadow-dark-950/20' : 'bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm')
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shadow-lg", isDark ? "bg-gradient-to-br from-gold-400 to-gold-600 shadow-gold-500/25" : "bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-500/25")} whileHover={{ scale: 1.05, rotate: -5 }} whileTap={{ scale: 0.95 }}>
              <span className={cn("font-bold text-xl", isDark ? "text-dark-950" : "text-white")}>K</span>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className={cn("font-bold text-xl tracking-tight", isDark ? "text-white" : "text-gray-900")}>{APP_NAME}</h1>
              <p className={cn("text-[10px] font-medium uppercase tracking-widest", isDark ? "text-gold-400/80" : "text-orange-500/80")}>Votre temps, simplifié</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className={cn("relative text-sm font-medium transition-colors group", isDark ? "text-dark-300 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
                {link.label}
                <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300", isDark ? "bg-gold-500" : "bg-orange-500")} />
              </a>
            ))}
            <motion.button onClick={toggleTheme} className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", isDark ? "bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-gold-400" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-orange-500")} whileTap={{ scale: 0.95 }}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <Link to="/login"><Button size="md" className="ml-2">Connexion<ArrowRight className="w-4 h-4" /></Button></Link>
          </div>

          <motion.button className={cn("md:hidden w-11 h-11 rounded-xl flex items-center justify-center border", isDark ? "bg-dark-800 text-white border-dark-700" : "bg-gray-100 text-gray-700 border-gray-200")} onClick={() => setMobileOpen(!mobileOpen)} whileTap={{ scale: 0.95 }}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className={cn("fixed inset-0 backdrop-blur-sm z-40 md:hidden", isDark ? "bg-dark-950/80" : "bg-gray-900/50")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.div className={cn("fixed top-24 left-4 right-4 rounded-2xl border p-6 z-50 md:hidden shadow-2xl", isDark ? "bg-dark-900 border-dark-800" : "bg-white border-gray-200")} initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <a key={link.label} href={link.href} className={cn("px-4 py-3 rounded-xl transition-colors font-medium", isDark ? "text-dark-200 hover:text-white hover:bg-dark-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100")} onClick={() => setMobileOpen(false)}>{link.label}</a>
                ))}
                <button onClick={toggleTheme} className={cn("px-4 py-3 rounded-xl transition-colors font-medium flex items-center gap-2", isDark ? "text-dark-200 hover:text-white hover:bg-dark-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100")}>
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}{isDark ? 'Mode clair' : 'Mode sombre'}
                </button>
                <div className={cn("border-t mt-4 pt-4", isDark ? "border-dark-800" : "border-gray-200")}>
                  <Link to="/login" onClick={() => setMobileOpen(false)}><Button className="w-full" size="lg">Connexion<ArrowRight className="w-4 h-4" /></Button></Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
