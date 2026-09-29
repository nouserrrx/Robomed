import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Apple, HeartPulse, Droplet, Shirt, BookOpen, Users, Heart, UserCheck } from 'lucide-react'
import Counter from '../components/shared/Counter'
import Button from '../components/ui/Button'
import { actions } from '../data/actions'
import { useLanguage } from '../context/LanguageContext'

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Apple, HeartPulse, Droplet, Shirt, BookOpen, Users,
}

const actionPhotos = [
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80',
  'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=600&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80',
]

const impactChiffres = [
  { icon: Users, value: 56, suffix: '+', label: 'Projets réalisés', color: '#16A34A', bg: '#DCFCE7' },
  { icon: Heart, value: 6425000, suffix: '+', label: 'FCFA collectés', color: '#DC2626', bg: '#FEE2E2' },
  { icon: UserCheck, value: 12, suffix: '', label: 'Localités impactées', color: '#0B4F9C', bg: '#DBEAFE' },
  { icon: Users, value: 320, suffix: '+', label: 'Bénévoles actifs', color: '#D97706', bg: '#FEF3C7' },
]

export default function Actions() {
  const { language, t } = useLanguage()

  const impactChiffres = [
    { icon: Users, value: 56, suffix: '+', label: t('completedProjectsCount'), color: '#16A34A', bg: '#DCFCE7' },
    { icon: Heart, value: 6425000, suffix: '+', label: 'FCFA collectés', color: '#DC2626', bg: '#FEE2E2' },
    { icon: UserCheck, value: 12, suffix: '', label: t('impactedLocations'), color: '#0B4F9C', bg: '#DBEAFE' },
    { icon: Users, value: 320, suffix: '+', label: t('activeVolunteers'), color: '#D97706', bg: '#FEF3C7' },
  ]

  return (
    <>
      {/* ──────────────── HERO ──────────────── */}
      <section className="relative overflow-hidden dark:bg-gray-900" style={{ minHeight: 320 }}>
        <div
          className="absolute inset-y-0 right-0 w-[55%] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80')",
          }}
        />
        <div className="absolute inset-y-0 right-0 w-[55%] bg-gradient-to-r from-white dark:from-gray-900 via-white/30 dark:via-gray-900/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-gray-900 via-white/90 dark:via-gray-900/90 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg"
          >
            <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-2">
              {t('ourActionsFooter')}
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              {t('actionsPageTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {t('actionsSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ──────────────── DOMAINES ──────────────── */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {t('ourFieldsTitle')}
            </h2>
            <div className="mx-auto mt-2 w-12 h-0.5 bg-secondary rounded-full mb-3" />
            <p className="text-gray-500 text-sm">
              {t('ourFieldsSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action, index) => {
              const langKey = (language === 'en' ? 'en' : language === 'ar' ? 'ar' : 'fr') as 'fr' | 'en' | 'ar'
              const Icon = iconMap[action.icon]
              const photo = actionPhotos[index] || actionPhotos[0]
              const titre = typeof action.titre === 'object' ? (action.titre[langKey] || action.titre.fr) : action.titre
              const description = typeof action.description === 'object' ? (action.description[langKey] || action.description.fr) : action.description
              const statLabel = action.statLabel ? (typeof action.statLabel === 'object' ? (action.statLabel[langKey] || action.statLabel.fr) : action.statLabel) : ''

              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* top row: icon + title + desc */}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${action.couleur}18` }}
                      >
                        {Icon && <Icon className="w-5 h-5" style={{ color: action.couleur }} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm" style={{ color: action.couleur }}>
                          {titre}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{description}</p>
                      </div>
                    </div>
                  </div>

                  {/* photo */}
                  <img
                    src={photo}
                    alt={titre}
                    className="w-full h-36 object-cover"
                  />

                  {/* stat */}
                  {action.stat && (
                    <div className="px-5 py-3 flex items-center gap-2 border-t border-gray-100">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${action.couleur}18` }}
                      >
                        {Icon && <Icon className="w-3 h-3" style={{ color: action.couleur }} />}
                      </div>
                      <span className="font-bold text-sm" style={{ color: action.couleur }}>
                        {action.stat}
                      </span>
                      <span className="text-gray-500 text-xs">{statLabel}</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ──────────────── IMPACT COLLECTIF ──────────────── */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* left */}
            <div className="flex items-center gap-4 lg:w-64 shrink-0">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{t('ourImpactTogetherTitle')}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mt-1">
                  {t('ourImpactTogetherSub')}
                </p>
              </div>
            </div>

            {/* divider */}
            <div className="hidden lg:block w-px h-16 bg-gray-200" />

            {/* stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 flex-1">
              {impactChiffres.map((s, i) => {
                const Icon = s.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: s.bg }}
                    >
                      <Icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg leading-tight">
                        <Counter to={s.value} suffix={s.suffix} />
                      </div>
                      <p className="text-gray-500 text-xs">{s.label}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* CTA */}
            <Link to="/projets" className="shrink-0">
              <Button variant="outline" size="sm">
                {t('viewOurProjectsBtn')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────── CTA FINAL ──────────────── */}
      <section className="bg-[#0B2447] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-white font-bold text-xl mb-1">{t('actWithUsTitle')}</h3>
              <p className="text-white/70 text-sm">
                {t('actWithUsSub')}
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/contact">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-white/30 rounded-xl text-white font-semibold text-sm hover:bg-white/10 transition-colors cursor-pointer">
                  <UserCheck className="w-4 h-4" />
                  {t('becomeVolunteerBtn')}
                </button>
              </Link>
              <Link to="/faire-un-don">
                <Button variant="secondary" size="md">
                  <Heart className="w-4 h-4 fill-white" />
                  {t('donateBtn')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
