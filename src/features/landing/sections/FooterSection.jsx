import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Linkedin, Twitter, Github, Mail } from 'lucide-react'
import { APP_NAME, FOOTER_LINKS, SOCIAL_LINKS } from '@shared/lib/constants'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

const socialIcons = { linkedin: Linkedin, twitter: Twitter, github: Github }

export default function FooterSection() {
  const { isDark } = useTheme()
  
  return (
    <footer className={cn("py-16 relative", isDark ? "bg-dark-950 border-t border-dark-800" : "bg-gray-50 border-t border-gray-200")}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-gradient-to-br from-gold-400 to-gold-600" : "bg-gradient-to-br from-orange-500 to-amber-500")}>
                <Sparkles className={cn("w-5 h-5", isDark ? "text-dark-950" : "text-white")} />
              </div>
              <span className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>{APP_NAME}</span>
            </Link>
            <p className={cn("mb-6 max-w-sm", isDark ? "text-dark-400" : "text-gray-600")}>La plateforme qui simplifie la gestion des temps pour les consultants IT au Luxembourg.</p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = socialIcons[social.icon]
                return (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", isDark ? "bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700" : "bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200")} aria-label={social.label}>
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h4 className={cn("font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className={cn("text-sm transition-colors", isDark ? "text-dark-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={cn("pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4", isDark ? "border-dark-800" : "border-gray-200")}>
          <p className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-500")}>© 2026 {APP_NAME}. Tous droits réservés.</p>
          <div className="flex items-center gap-2">
            <span className="text-xl">🇱🇺</span>
            <span className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-500")}>Made in Luxembourg</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
