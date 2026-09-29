import { motion } from 'framer-motion'

interface SectionTitleProps {
  title: string
  subtitle?: string
  light?: boolean
}

export default function SectionTitle({ title, subtitle, light = false }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <h2 className={`text-3xl sm:text-4xl font-bold ${light ? 'text-white' : 'text-gray-900'} mb-4`}>
        {title}
      </h2>
      <div className="w-20 h-1 bg-secondary mx-auto rounded-full mb-4" />
      {subtitle && (
        <p className={`text-lg max-w-2xl mx-auto ${light ? 'text-white/70' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
