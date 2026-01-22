import { cn } from '@shared/lib/utils'
import { useTheme } from '@shared/context/ThemeContext'

const variantsConfig = {
  default: { dark: 'bg-dark-800 text-dark-300 border-dark-700', light: 'bg-gray-100 text-gray-600 border-gray-200' },
  gold: { dark: 'bg-gold-500/15 text-gold-400 border-gold-500/30', light: 'bg-orange-100 text-orange-600 border-orange-200' },
  success: { dark: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', light: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  warning: { dark: 'bg-amber-500/15 text-amber-400 border-amber-500/30', light: 'bg-amber-100 text-amber-600 border-amber-200' },
  danger: { dark: 'bg-rose-500/15 text-rose-400 border-rose-500/30', light: 'bg-rose-100 text-rose-600 border-rose-200' },
  info: { dark: 'bg-violet-500/15 text-violet-400 border-violet-500/30', light: 'bg-violet-100 text-violet-600 border-violet-200' },
  'solid-gold': { dark: 'bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 border-transparent', light: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent' },
  'solid-success': { dark: 'bg-emerald-500 text-white border-transparent', light: 'bg-emerald-500 text-white border-transparent' },
}

const sizes = { sm: 'px-2 py-0.5 text-[10px]', md: 'px-2.5 py-1 text-xs', lg: 'px-3 py-1.5 text-sm' }

export function Badge({ children, variant = 'default', size = 'md', className }) {
  const { isDark } = useTheme()
  const variantStyle = variantsConfig[variant] || variantsConfig.default
  
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-semibold rounded-full border', isDark ? variantStyle.dark : variantStyle.light, sizes[size], className)}>
      {children}
    </span>
  )
}
