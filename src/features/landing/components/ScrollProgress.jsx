import { motion, useScroll, useSpring } from 'framer-motion'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

export default function ScrollProgress() {
  const { isDark } = useTheme()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      className={cn("fixed top-0 left-0 right-0 h-1 origin-left z-[100] bg-gradient-to-r", isDark ? "from-gold-400 via-amber-500 to-gold-600" : "from-orange-400 via-amber-500 to-orange-600")}
      style={{ scaleX }}
    />
  )
}
