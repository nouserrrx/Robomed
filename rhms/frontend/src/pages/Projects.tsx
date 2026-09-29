import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Heart, MapPin, Users, UserCheck, Search, SlidersHorizontal,
  Clock, CheckCircle, CalendarClock, HeartPulse, Droplet, BookOpen, Apple, Leaf, ChevronDown
} from 'lucide-react'
import Button from '../components/ui/Button'
import { projects } from '../data/projects'
import { useLanguage } from '../context/LanguageContext'

const filters = [
  { value: 'all', label: 'Tous les projets', icon: null },
  { value: 'en-cours', label: 'En cours', icon: Clock },
  { value: 'termine', label: 'Terminés', icon: CheckCircle },
  { value: 'a-venir', label: 'À venir', icon: CalendarClock },
]

const catFilters = [
  { value: 'Santé', icon: HeartPulse },
  { value: 'Eau & Assainissement', icon: Droplet },
  { value: 'Éducation', icon: BookOpen },
  { value: 'Aide alimentaire', icon: Apple },
]

const statusColors: Record<string, { bg: string; text: string }> = {
  'en-cours': { bg: 'bg-secondary', text: 'text-white' },
  'termine': { bg: 'bg-gray-500', text: 'text-white' },
  'a-venir': { bg: 'bg-amber-500', text: 'text-white' },
}
const statusLabels: Record<string, string> = {
  'en-cours': 'En cours',
  'termine': 'Terminé',
  'a-venir': 'À venir',
}

import { useEffect } from 'react'
import { projectsAPI } from '../services/api'

export default function Projects() {
  const { language, t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [projectList, setProjectList] = useState(projects)
  const [_loading, setLoading] = useState(false)

  const filters = [
    { value: 'all', label: t('allProjectsFilter'), icon: null },
    { value: 'en-cours', label: t('inProgressFilter'), icon: Clock },
    { value: 'termine', label: t('completedFilter'), icon: CheckCircle },
    { value: 'a-venir', label: t('upcomingFilter'), icon: CalendarClock },
  ]

  const catFilters = [
    { value: 'Santé', label: t('healthCategory'), icon: HeartPulse },
    { value: 'Eau & Assainissement', label: t('waterCategory'), icon: Droplet },
    { value: 'Éducation', label: t('educationCategory'), icon: BookOpen },
    { value: 'Aide alimentaire', label: t('foodCategory'), icon: Apple },
  ]

  const statusLabels: Record<string, string> = {
    'en-cours': t('inProgressFilter'),
    'termine': t('completedFilter'),
    'a-venir': t('upcomingFilter'),
  }

  useEffect(() => {
    async function loadProjects() {
      setLoading(true)
      const data = await projectsAPI.getAll()
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((p: any) => ({
          id: p.id || String(p.titre),
          titre: p.titre || p.name,
          description: p.description || '',
          lieu: p.lieu || p.location || 'Tchad / Canada',
          statut: p.statut || p.status || 'en-cours',
          categorie: p.categorie || p.category || 'Santé',
          budget: p.budget || 1000000,
          collecte: p.collecte || p.budget_collecte || 750000,
          progres: p.progres || (p.budget ? Math.round(((p.collecte || 0) / p.budget) * 100) : 75),
          beneficiaires: p.beneficiaires || 500,
          benevoles: p.benevoles || 12,
          image: p.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
        }))
        setProjectList(mapped)
      }
      setLoading(false)
    }
    loadProjects()
  }, [])

  const langKey = (language === 'en' ? 'en' : language === 'ar' ? 'ar' : 'fr') as 'fr' | 'en' | 'ar'

  const filtered = projectList
    .filter((p) => activeFilter === 'all' || p.statut === activeFilter || p.categorie === activeFilter)
    .filter((p) => {
      const title = typeof p.titre === 'object' ? (p.titre[langKey] || p.titre.fr) : p.titre
      return title.toLowerCase().includes(searchQuery.toLowerCase())
    })

  const totalProjets = projectList.length
  const enCours = projectList.filter(p => p.statut === 'en-cours').length
  const aVenir = projectList.filter(p => p.statut === 'a-venir').length
  const totalBeneficiaires = projectList.reduce((s, p) => s + (p.beneficiaires || 0), 0)
  const totalBenevoles = projectList.reduce((s, p) => s + (p.benevoles || 0), 0)

  return (
    <>
      {/* ──────────────── HERO ──────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 260 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&q=80')" }}
        />
        <div className="absolute inset-0 bg-[#0B2447]/75" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
            <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-2">
              {t('projects')}
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{t('projectsPageTitle')}</h1>
            <div className="w-10 h-0.5 bg-secondary rounded-full mb-4" />
            <p className="text-white/80 text-sm leading-relaxed max-w-lg">
              {t('projectsPageSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ──────────────── FILTER BAR ──────────────── */}
      <section className="bg-white border-b border-gray-100 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status filters */}
            {filters.map((f) => {
              const Icon = f.icon
              const isActive = activeFilter === f.value
              return (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-secondary text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {f.label}
                </button>
              )
            })}

            <div className="hidden md:block w-px h-6 bg-gray-200 mx-1" />

            {/* Category filters */}
            {catFilters.map((f) => {
              const Icon = f.icon
              const isActive = activeFilter === f.value
              return (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(isActive ? 'all' : f.value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {f.label}
                </button>
              )
            })}

            <button className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 cursor-pointer">
              {t('moreFilters')} <ChevronDown className="w-3 h-3" />
            </button>

            {/* Spacer + search */}
            <div className="flex-1" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchProjectPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white w-52 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">
              <SlidersHorizontal className="w-3.5 h-3.5" /> {t('filterBtn')}
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────── MAIN CONTENT ──────────────── */}
      <section className="py-8 lg:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ─── Projects grid ─── */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  {t('allProjectsFilter')} ({filtered.length})
                </h2>
                <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white cursor-pointer">
                  <option>{t('sortByRecent')}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((project, index) => {
                  const langKey = (language === 'en' ? 'en' : language === 'ar' ? 'ar' : 'fr') as 'fr' | 'en' | 'ar'
                  const s = statusColors[project.statut] || statusColors['en-cours']
                  const titre = typeof project.titre === 'object' ? (project.titre[langKey] || project.titre.fr) : project.titre
                  const description = typeof project.description === 'object' ? (project.description[langKey] || project.description.fr) : project.description
                  const lieu = typeof project.lieu === 'object' ? (project.lieu[langKey] || project.lieu.fr) : project.lieu

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group"
                    >
                      {/* Image + badge */}
                      <div className="relative h-44 overflow-hidden">
                        <img src={project.image} alt={titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className={`absolute top-3 left-3 ${s.bg} ${s.text} text-[10px] font-semibold px-2.5 py-1 rounded-full`}>
                          {statusLabels[project.statut] || project.statut}
                        </span>
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer">
                          <Heart className="w-4 h-4 text-secondary" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-sm mb-1">{titre}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                          <MapPin className="w-3 h-3" /> {lieu}
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed mb-3">{description}</p>

                        {/* Progress */}
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-secondary">{project.progres}%</span>
                          <span className="text-gray-400">
                            {project.collecte.toLocaleString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR')} / {project.budget.toLocaleString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR')} FCFA
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                          <div
                            className={`h-full rounded-full ${project.progres > 0 ? 'bg-secondary' : 'bg-gray-200'}`}
                            style={{ width: `${project.progres}%` }}
                          />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-3">
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <Users className="w-3 h-3" /> {project.beneficiaires.toLocaleString('fr-FR')}
                              <span className="hidden sm:inline">{t('beneficiariesLabel')}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <UserCheck className="w-3 h-3" /> {project.benevoles}
                              <span className="hidden sm:inline">{t('volunteersLabel')}</span>
                            </span>
                          </div>
                          <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-[10px] font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer">
                            {t('viewDetailsBtn')}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {filtered.length === 0 && (
                <p className="text-center text-gray-500 mt-8 text-sm">{t('noProjectFound')}</p>
              )}
            </div>

            {/* ─── Sidebar ─── */}
            <div className="space-y-6">
              {/* Impact global */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-secondary" />
                  <h3 className="font-bold text-gray-900 text-sm">{t('ourGlobalImpactTitle')}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: totalProjets, label: t('completedProjectsCount'), icon: CheckCircle, color: '#16A34A' },
                    { value: enCours, label: t('inProgressFilter'), icon: Clock, color: '#0B4F9C' },
                    { value: aVenir, label: t('upcomingFilter'), icon: CalendarClock, color: '#D97706' },
                    { value: `${(totalBeneficiaires / 1000).toFixed(0)}K+`, label: t('beneficiariesLabel'), icon: Users, color: '#0B4F9C' },
                    { value: 45, label: t('impactedLocations'), icon: MapPin, color: '#16A34A' },
                    { value: `${totalBenevoles}+`, label: t('activeVolunteers'), icon: UserCheck, color: '#D97706' },
                  ].map((s, i) => {
                    const Icon = s.icon
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <Icon className="w-4 h-4 shrink-0" style={{ color: s.color }} />
                        <div>
                          <div className="text-sm font-bold text-gray-900">{s.value}</div>
                          <p className="text-[10px] text-gray-500 leading-tight">{s.label}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Zones d'intervention */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">{t('interventionZonesTitle')}</h3>
                  <button className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 text-gray-600 hover:bg-gray-50 cursor-pointer">
                    {t('seeOnMapBtn')}
                  </button>
                </div>
                <div className="bg-gray-100 rounded-xl h-44 flex items-center justify-center text-xs text-gray-400">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    {t('mapOfChad')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── CTA ──────────────── */}
      <section className="bg-[#0B2447] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-white font-bold text-lg">{t('contributeToProjectsTitle')}</h3>
              <p className="text-white/60 text-sm">
                {t('contributeToProjectsSub')}
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/faire-un-don">
                <Button variant="secondary" size="md">
                  <Heart className="w-4 h-4 fill-white" /> {t('donateNowBtn')}
                </Button>
              </Link>
              <Link to="/contact">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 rounded-lg text-white font-semibold text-sm hover:bg-white/10 transition-colors cursor-pointer">
                  <UserCheck className="w-4 h-4" /> {t('becomeVolunteerBtn')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
