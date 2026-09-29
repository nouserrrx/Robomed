import { motion } from 'framer-motion'
import { Heart, Users, Euro, GitMerge } from 'lucide-react'
import Counter from './Counter'
import type { Stat } from '../../data/stats'

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  GitMerge, Heart, Users, Euro,
}

interface StatCardProps {
  stat: Stat
}

export default function StatCard({ stat }: StatCardProps) {
  const Icon = iconMap[stat.icon]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        {Icon && <Icon className="w-7 h-7 text-primary" />}
      </div>
      <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
        <Counter to={stat.chiffre} suffix={stat.suffixe} />
      </div>
      <p className="text-gray-600 text-sm sm:text-base">{stat.label}</p>
    </motion.div>
  )
}
