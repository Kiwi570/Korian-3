import ScrollProgress from './components/ScrollProgress'
import { Navbar, HeroSection, ProblemSection, FeaturesSection, TestimonialsSection, ProcessSection, CtaSection, FooterSection } from './sections'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

export default function Landing() {
  const { isDark } = useTheme()
  
  return (
    <div className={cn("min-h-screen", isDark ? "bg-dark-950" : "bg-white")}>
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <TestimonialsSection />
        <ProcessSection />
        <CtaSection />
      </main>
      <FooterSection />
    </div>
  )
}
