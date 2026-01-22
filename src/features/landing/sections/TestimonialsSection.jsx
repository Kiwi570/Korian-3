import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { TESTIMONIALS } from '@shared/lib/constants'
import { staggerContainer, staggerItem, viewportOnce } from '@shared/lib/animations'
import { useTheme } from '@shared/context/ThemeContext'
import { cn } from '@shared/lib/utils'

export default function TestimonialsSection() {
  const { isDark } = useTheme()
  
  return (
    <section id="testimonials" className="py-24 md:py-32 relative overflow-hidden">
      <div className={cn("absolute inset-0", isDark ? "bg-dark-950" : "bg-gray-50")} />
      <div className={cn("absolute inset-0 bg-grid", isDark ? "opacity-20" : "opacity-10")} />
      <div className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[150px]", isDark ? "bg-violet-500/5" : "bg-violet-500/10")} />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-16 md:mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.6 }}>
          <motion.span className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6", isDark ? "bg-violet-500/10 text-violet-400" : "bg-violet-50 text-violet-600")} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewportOnce}>
            <Star className="w-4 h-4" />Témoignages
          </motion.span>
          <h2 className={cn("text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>
            Ce qu'ils en<br /><span className={cn(isDark ? "text-violet-400" : "text-violet-600")}>pensent</span>
          </h2>
          <p className={cn("text-lg md:text-xl max-w-2xl mx-auto", isDark ? "text-dark-400" : "text-gray-600")}>Découvrez les retours de nos utilisateurs au Luxembourg</p>
        </motion.div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          {TESTIMONIALS.map((testimonial) => (
            <motion.div key={testimonial.name} variants={staggerItem} className="group">
              <div className={cn("h-full p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1", isDark ? "bg-dark-900/50 border-dark-800 hover:border-violet-500/30" : "bg-white border-gray-200 hover:border-violet-300 shadow-sm hover:shadow-md")}>
                <Quote className={cn("w-10 h-10 mb-6", isDark ? "text-violet-500/30" : "text-violet-200")} />
                <p className={cn("mb-6 leading-relaxed", isDark ? "text-dark-300" : "text-gray-600")}>"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{testimonial.name}</p>
                    <p className={cn("text-sm", isDark ? "text-dark-500" : "text-gray-500")}>{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-4 h-4 fill-current", isDark ? "text-gold-400" : "text-orange-400")} />)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
