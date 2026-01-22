import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { useTheme } from '@shared/context/ThemeContext'

const variantsConfig = {
  primary: {
    dark: 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 shadow-lg shadow-gold-500/25 hover:shadow-gold-500/50',
    light: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/50'
  },
  secondary: {
    dark: 'bg-dark-800 text-dark-200 border border-dark-700 hover:bg-dark-700',
    light: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
  },
  ghost: {
    dark: 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50',
    light: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
  },
  outline: {
    dark: 'bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30',
    light: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
  },
  danger: {
    dark: 'bg-rose-500 text-white hover:bg-rose-600',
    light: 'bg-rose-500 text-white hover:bg-rose-600'
  },
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-xl',
  xl: 'px-10 py-5 text-lg rounded-2xl',
}

export const Button = forwardRef(({ children, variant = 'primary', size = 'md', loading = false, disabled = false, className, ...props }, ref) => {
  const { isDark } = useTheme()
  const variantStyle = variantsConfig[variant] || variantsConfig.primary
  
  return (
    <motion.button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        isDark ? variantStyle.dark : variantStyle.light,
        sizes[size],
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  )
})

Button.displayName = 'Button'
