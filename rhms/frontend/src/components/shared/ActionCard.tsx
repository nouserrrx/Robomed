import { motion } from 'framer-motion'
import { Apple, HeartPulse, Droplet, Shirt, BookOpen, Tent } from 'lucide-react'
import type { Action } from '../../data/actions'
import { useLanguage } from '../../context/LanguageContext'

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Apple, HeartPulse, Droplet, Shirt, BookOpen, Tent,
}

interface ActionCardProps {
  action: Action
  index: number
}

export default function ActionCard({ action, index }: ActionCardProps) {
  const { language } = useLanguage()
  const langKey = (language || 'fr') as 'fr' | 'en' | 'ar'
  const Icon = iconMap[action.icon]

  const titleStr = typeof action.titre === 'object' ? action.titre[langKey] || action.titre.fr : action.titre
  const descStr = typeof action.description === 'object' ? action.description[langKey] || action.description.fr : action.description

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-default border border-gray-100 dark:border-gray-800"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm"
        style={{ backgroundColor: `${action.couleur}15` }}
      >
        {Icon && <Icon className="w-7 h-7" style={{ color: action.couleur }} />}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{titleStr}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{descStr}</p>
    </motion.div>
  )
}
