import { motion } from 'framer-motion'
import Badge from '../ui/Badge'
import type { Project } from '../../data/projects'
import { useLanguage } from '../../context/LanguageContext'

interface ProjectCardProps {
  project: Project
}

const statusConfig: Record<string, { label: string; variant: 'info' | 'success' | 'warning' }> = {
  'en-cours': { label: 'En cours', variant: 'info' },
  'termine': { label: 'Terminé', variant: 'success' },
  'a-venir': { label: 'À venir', variant: 'warning' },
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { language } = useLanguage()
  const langKey = (language || 'fr') as 'fr' | 'en' | 'ar'
  const badge = statusConfig[project.statut] || { label: 'En cours', variant: 'info' }

  const titleStr = typeof project.titre === 'object' ? project.titre[langKey] || project.titre.fr : project.titre
  const descStr = typeof project.description === 'object' ? project.description[langKey] || project.description.fr : project.description

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={titleStr}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{titleStr}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{descStr}</p>
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span>Progression</span>
            <span className="font-semibold text-primary dark:text-emerald-400">{project.progres}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${project.progres}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="bg-primary dark:bg-emerald-500 h-2.5 rounded-full"
            />
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Budget : <span className="font-semibold text-gray-700 dark:text-gray-200">{project.budget?.toLocaleString()} €</span>
        </div>
      </div>
    </motion.div>
  )
}
