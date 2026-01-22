import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@shared/lib/utils'
import { useTheme } from '@shared/context/ThemeContext'

export const Card = forwardRef(({ children, hover = false, glow = false, glass = false, className, ...props }, ref) => {
  const { isDark } = useTheme()
  const Component = hover || glow ? motion.div : 'div'
  
  const motionProps = (hover || glow) ? { whileHover: { y: -5, transition: { duration: 0.2 } } } : {}

  return (
    <Component
      ref={ref}
      className={cn(
        'rounded-2xl border p-6 transition-all duration-300',
        glass 
          ? (isDark ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-white/80 backdrop-blur-xl border-gray-200') 
          : (isDark ? 'bg-dark-900/80 backdrop-blur-sm border-dark-800' : 'bg-white border-gray-200 shadow-sm'),
        hover && (isDark ? 'hover:border-dark-700 hover:bg-dark-800/80' : 'hover:border-gray-300 hover:shadow-md'),
        glow && (isDark ? 'hover:border-gold-500/30 hover:shadow-glow-gold' : 'hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10'),
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
})

Card.displayName = 'Card'
