import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, Shield, Scale } from 'lucide-react'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

const sections = [
  {
    id: 'mentions', title: 'Mentions Légales', icon: FileText,
    content: `<h3>Éditeur du site</h3><p>Kokbif S.à r.l.</p><p>31, Porte de France</p><p>L-4360 Esch-sur-Alzette</p><p>Luxembourg</p><p>RCS Luxembourg: B123456</p><p>Email: contact@kokbif.com</p><p>Téléphone: +352 20 60 08 83</p><h3>Directeur de la publication</h3><p>Korian Dupont, CEO</p><h3>Hébergement</h3><p>Les services sont hébergés au Luxembourg conformément aux réglementations locales et européennes.</p>`
  },
  {
    id: 'privacy', title: 'Politique de Confidentialité', icon: Shield,
    content: `<h3>Collecte des données</h3><p>Nous collectons uniquement les données nécessaires au bon fonctionnement du service : nom, prénom, adresse email professionnelle, données de temps de travail.</p><h3>Utilisation des données</h3><p>Vos données sont utilisées exclusivement pour :</p><ul><li>La gestion de vos temps de travail</li><li>La génération de rapports pour votre employeur</li><li>L'amélioration de nos services</li></ul><h3>Conservation des données</h3><p>Vos données sont conservées pendant la durée de votre contrat de travail plus 5 ans conformément aux obligations légales luxembourgeoises.</p><h3>Vos droits (RGPD)</h3><p>Conformément au RGPD, vous disposez des droits suivants : accès, rectification, effacement, portabilité, opposition. Contactez-nous à privacy@kokbif.com</p>`
  },
  {
    id: 'cgu', title: "Conditions Générales d'Utilisation", icon: Scale,
    content: `<h3>Acceptation des conditions</h3><p>L'utilisation de Kokbif implique l'acceptation pleine et entière des présentes CGU.</p><h3>Description du service</h3><p>Kokbif est une plateforme de gestion des temps de travail et des congés destinée aux entreprises et consultants IT au Luxembourg.</p><h3>Obligations de l'utilisateur</h3><ul><li>Fournir des informations exactes</li><li>Maintenir la confidentialité de ses identifiants</li><li>Utiliser le service conformément à sa destination</li></ul><h3>Propriété intellectuelle</h3><p>L'ensemble des éléments du site (marques, logos, textes, design) sont la propriété exclusive de Kokbif S.à r.l.</p><h3>Limitation de responsabilité</h3><p>Kokbif s'engage à assurer la disponibilité du service 99.5% du temps. En cas d'interruption, aucune indemnité ne pourra être réclamée.</p>`
  }
]

export default function LegalPage() {
  const { isDark } = useTheme()
  
  return (
    <div className={cn("min-h-screen", isDark ? "bg-dark-950" : "bg-gray-50")}>
      <header className={cn("border-b", isDark ? "border-dark-800" : "border-gray-200")}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link to="/" className={cn("inline-flex items-center gap-2 transition-colors", isDark ? "text-dark-400 hover:text-white" : "text-gray-500 hover:text-gray-900")}>
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={cn("text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Informations Légales</h1>
          <p className={cn("mb-12", isDark ? "text-dark-400" : "text-gray-500")}>Dernière mise à jour : Janvier 2026</p>

          <div className="space-y-12">
            {sections.map((section, i) => {
              const Icon = section.icon
              return (
                <motion.section key={section.id} id={section.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={cn("rounded-2xl p-8 border", isDark ? "bg-dark-900/50 border-dark-800" : "bg-white border-gray-200 shadow-sm")}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-gold-500/10" : "bg-orange-50")}>
                      <Icon className={cn("w-5 h-5", isDark ? "text-gold-400" : "text-orange-600")} />
                    </div>
                    <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>{section.title}</h2>
                  </div>
                  <div className={cn("prose prose-sm max-w-none", isDark 
                    ? "prose-invert prose-headings:text-gold-400 prose-p:text-dark-300 prose-ul:text-dark-300" 
                    : "prose-headings:text-orange-600 prose-p:text-gray-600 prose-ul:text-gray-600",
                    "prose-headings:font-semibold prose-headings:text-base prose-headings:mt-6 prose-headings:mb-3 prose-p:leading-relaxed prose-li:my-1"
                  )} dangerouslySetInnerHTML={{ __html: section.content }} />
                </motion.section>
              )
            })}
          </div>

          <motion.div className={cn("mt-12 p-6 rounded-2xl border", isDark ? "bg-gold-500/10 border-gold-500/30" : "bg-orange-50 border-orange-200")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h3 className={cn("font-semibold mb-2", isDark ? "text-gold-400" : "text-orange-600")}>Une question ?</h3>
            <p className={cn("text-sm", isDark ? "text-dark-300" : "text-gray-600")}>
              Pour toute question concernant ces informations légales, contactez-nous à{' '}
              <a href="mailto:legal@kokbif.com" className={cn("hover:underline", isDark ? "text-gold-400" : "text-orange-600")}>legal@kokbif.com</a>
            </p>
          </motion.div>
        </motion.div>
      </main>

      <footer className={cn("border-t py-6", isDark ? "border-dark-800" : "border-gray-200")}>
        <div className={cn("max-w-4xl mx-auto px-6 text-center text-sm", isDark ? "text-dark-500" : "text-gray-500")}>© 2026 Kokbif S.à r.l. - Tous droits réservés</div>
      </footer>
    </div>
  )
}
