import { motion } from 'framer-motion'
import type { TeamMember } from '../../data/team'
import { useLanguage } from '../../context/LanguageContext'

interface MemberCardProps {
  member: TeamMember
  index: number
}

export default function MemberCard({ member, index }: MemberCardProps) {
  const { language } = useLanguage()
  const langKey = (language || 'fr') as 'fr' | 'en' | 'ar'

  const roleStr = typeof member.role === 'object' ? member.role[langKey] || member.role.fr : member.role
  const bioStr = typeof member.bio === 'object' ? member.bio[langKey] || member.bio.fr : member.bio

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800"
    >
      <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.nom}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xl font-bold">
            {(member.nom || 'M').charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.nom}</h3>
        <p className="text-sm font-medium text-secondary mb-3">{roleStr}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{bioStr}</p>
      </div>
    </motion.div>
  )
}
