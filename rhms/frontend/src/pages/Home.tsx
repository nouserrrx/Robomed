import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Heart, ArrowRight, Users, Globe,
  Apple, HeartPulse, Droplet, BookOpen, Leaf,
  GraduationCap, Sparkles, MapPin, CheckCircle2,
  Quote, Cpu, Shield, Award, ChevronRight, ShieldCheck, Download
} from 'lucide-react'
import Button from '../components/ui/Button'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import ImpactMap from '../components/shared/ImpactMap'
import Skeleton, { CardSkeleton } from '../components/ui/Skeleton'

export default function Home() {
  const { t, language } = useLanguage()
  const langKey = (language || 'fr') as 'fr' | 'en' | 'ar'
  const [activeImpactTab, setActiveImpactTab] = useState<'tchad' | 'canada'>('tchad')
  const [realProjects, setRealProjects] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  useEffect(() => {
    api.get('/projects/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.results || [])
        setRealProjects(data)
      })
      .catch(() => setRealProjects([]))
      .finally(() => setLoadingProjects(false))
  }, [])

  const quickNav = [
    {
      icon: Users, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)',
      title: t('quickNav1Title'), desc: t('quickNav1Desc'),
      link: '/a-propos', linkText: t('quickNav1Link'),
    },
    {
      icon: Globe, color: '#0284C7', bg: 'rgba(2, 132, 199, 0.1)',
      title: t('quickNav2Title'), desc: t('quickNav2Desc'),
      link: '/nos-actions', linkText: t('quickNav2Link'),
    },
    {
      icon: GraduationCap, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)',
      title: t('quickNav3Title'), desc: t('quickNav3Desc'),
      link: '/contact', linkText: t('quickNav3Link'),
    },
    {
      icon: Heart, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)',
      title: t('quickNav4Title'), desc: t('quickNav4Desc'),
      link: '/faire-un-don', linkText: t('quickNav4Link'),
    },
  ]

  const domaines = [
    { icon: Droplet, label: t('domainWater'), color: '#0284C7' },
    { icon: BookOpen, label: t('domainEducation'), color: '#2563EB' },
    { icon: HeartPulse, label: t('domainPalliative'), color: '#8B5CF6' },
    { icon: Apple, label: t('domainPediatric'), color: '#10B981' },
    { icon: Leaf, label: t('domainSales'), color: '#F59E0B' },
    { icon: GraduationCap, label: t('domainAmbassadors'), color: '#EF4444' },
  ]

  return (
    <>
      {/* ──────────────── HERO SECTION ──────────────── */}
      <section className="relative bg-[#071325] text-white overflow-hidden py-20 lg:py-32">
        {/* Background glow effects & decorative grid */}
        <div className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&q=80')" }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071325]/80 via-[#071325]/95 to-[#071325]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-400 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-black/10">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
                  {t('heroBadge')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold shadow-sm">
                  {t('heroBadgeCountry')}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
                {t('heroTitle')}
              </h1>

              <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                {t('heroDesc')}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link to="/faire-un-don">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="font-extrabold shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all duration-200"
                  >
                    <Heart className="w-5 h-5 fill-white animate-pulse" />
                    {t('heroCta')}
                  </Button>
                </Link>
                <Link to="/contact">
                  <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm border border-white/20 backdrop-blur-md transition-all shadow-lg cursor-pointer">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                    {t('heroCta2')}
                  </button>
                </Link>
              </div>

              <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-white/80">
                <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('heroCheck3')}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('heroCheck1')}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('heroCheck2')}</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 hidden lg:block"
            >
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80"
                    alt={t('heroActionLabel')}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071325] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white px-3 py-1 rounded-full mb-1.5 inline-block shadow-md">
                      🇹🇩 {t('heroActionTitle')}
                    </span>
                    <h3 className="font-extrabold text-base leading-snug">{t('heroActionLabel')}</h3>
                    <p className="text-xs text-white/80 mt-0.5">{t('heroActionSub')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <div className="text-2xl font-black text-white">{t('heroStatValue1')}</div>
                    <div className="text-[11px] text-white/70 font-semibold">{t('heroStatLabel1')}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <div className="text-2xl font-black text-emerald-400">{t('heroStatValue2')}</div>
                    <div className="text-[11px] text-white/70 font-semibold">{t('heroStatLabel2')}</div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ──────────────── QUICK NAV CARDS ──────────────── */}
      <section className="-mt-10 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-5 sm:p-7 backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickNav.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-5 rounded-2xl bg-slate-50/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 hover:bg-white dark:hover:bg-gray-800 card-glow transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform shadow-sm"
                    style={{ backgroundColor: item.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-4">{item.desc}</p>
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold transition-colors"
                    style={{ color: item.color }}
                  >
                    {item.linkText} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ──────────────── 3 BRANCHES ROBOMED ──────────────── */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-secondary text-xs font-extrabold uppercase tracking-widest block">
              {t('branchesBadge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {t('branchesTitle')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              {t('branchesDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Humanitaire */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-7 rounded-3xl bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
                <Heart className="w-7 h-7 fill-white" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg">
                {t('branchLabel')} 01
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-3 mb-2">
                {t('branch1Title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                {t('branch1Desc')}
              </p>
            </motion.div>

            {/* Éducative */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-7 rounded-3xl bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0B4F9C] text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg">
                {t('branchLabel')} 02
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-3 mb-2">
                {t('branch2Title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                {t('branch2Desc')}
              </p>
            </motion.div>

            {/* Technique */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-7 rounded-3xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/30">
                <Cpu className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-lg">
                {t('branchLabel')} 03
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-3 mb-2">
                {t('branch3Title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                {t('branch3Desc')}
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ──────────────── FEATURED PROJECTS GRID ──────────────── */}
      <section className="py-20 bg-slate-50/80 dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-secondary text-xs font-extrabold uppercase tracking-widest block mb-1">
                {t('projectsSubtitle')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                {t('projectsTitle')}
              </h2>
            </div>
            <Link to="/projets">
              <Button variant="outline" size="sm" className="bg-white dark:bg-gray-800 dark:text-white font-extrabold shadow-sm">
                {t('seeAllProjects')} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : realProjects.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800">
              <Sparkles className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Nos Projets en Déploiement</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                Explorez nos actions de terrain ci-dessous sur notre carte d'impact en direct.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {realProjects.map((p: any, i: number) => {
                const title = typeof p.titre === 'object' ? p.titre[langKey] || p.titre.fr : p.titre
                const desc = typeof p.description === 'object' ? p.description[langKey] || p.description.fr : p.description
                const location = typeof p.lieu === 'object' ? p.lieu[langKey] || p.lieu.fr : (p.lieu || 'Tchad / Canada')
                const budget = p.budget ? `${parseFloat(p.budget).toLocaleString()} FCFA` : '—'
                const progress = p.progres || 0

                return (
                  <motion.div
                    key={p.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-7 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-2 bg-emerald-50 dark:bg-gray-800 rounded-2xl border border-emerald-100 dark:border-gray-700">🌱</span>
                          <div>
                            <h3 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg">{title}</h3>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-secondary" /> {location}
                            </span>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-extrabold border border-emerald-100 dark:border-gray-700 shadow-sm capitalize">
                          {p.categorie || 'Action'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mb-6">{desc}</p>
                    </div>

                    {/* Progress bar & action */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                          <span>{t('progressLabel')}</span>
                          <span className="text-secondary">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs">
                          <span className="text-gray-400 block text-[10px] font-semibold">{t('budgetLabel')}</span>
                          <span className="font-extrabold text-gray-900 dark:text-white">{budget}</span>
                        </div>
                        <Link
                          to="/faire-un-don"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-secondary text-white rounded-xl text-xs font-extrabold hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" /> {t('supportBtn')}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ──────────────── INTERACTIVE IMPACT MAP SECTION ──────────────── */}
      <section className="py-16 bg-slate-50 dark:bg-[#070E1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImpactMap />
        </div>
      </section>

      {/* ──────────────── TRANSPARENCY & USER PORTALS BANNER ──────────────── */}
      <section className="py-14 bg-gradient-to-r from-[#0B2447] via-[#08305C] to-[#041D3B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1: Espace Donateur */}
            <div className="p-7 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-4 hover:bg-white/10 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Espace Donateur & Reçus</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Retrouvez l'historique de vos contributions, le suivi de vos campagnes financées et téléchargez vos reçus fiscaux en 1 clic.
                </p>
              </div>
              <Link to="/espace-donateur" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300">
                Accéder à mon espace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Box 2: Espace Bénévole */}
            <div className="p-7 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-4 hover:bg-white/10 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Portail Ambassadeurs</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Consultez les missions ouvertes au Canada et au Tchad, postulez et obtenez votre attestation officielle de bénévolat.
                </p>
              </div>
              <Link to="/espace-benevole" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300">
                Découvrir les missions <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Box 3: Transparence Financière */}
            <div className="p-7 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-4 hover:bg-white/10 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Transparence 100%</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Consultez nos bilans financiers certifiés : 87% de nos ressources sont directement investies dans les actions terrain.
                </p>
              </div>
              <Link to="/transparence" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300">
                Consulter les bilans financiers <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────── INTERACTIVE COUNTRY IMPACT SWITCHER ──────────────── */}
      <section className="py-20 bg-[#071325] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-secondary text-xs font-extrabold uppercase tracking-widest block">
              {t('impactSwitcherTag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {t('impactSwitcherTitle')}
            </h2>
            <p className="text-white/70 text-xs sm:text-sm">
              {t('impactSwitcherDesc')}
            </p>

            {/* Country Selector Tabs */}
            <div className="inline-flex p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 mt-4">
              <button
                onClick={() => setActiveImpactTab('tchad')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeImpactTab === 'tchad'
                    ? 'bg-secondary text-white shadow-lg shadow-emerald-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {t('impactTabChad')}
              </button>
              <button
                onClick={() => setActiveImpactTab('canada')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeImpactTab === 'canada'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {t('impactTabCanada')}
              </button>
            </div>
          </div>

          {/* Dynamic Content Display */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
            {activeImpactTab === 'tchad' ? (
              <motion.div
                key="tchad"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-4 text-left">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-extrabold">
                    {t('impactChadBranchBadge')}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold">
                    {t('impactChadTitle')}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                    {t('impactChadText')}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-xl font-black text-emerald-400">12 500+</div>
                      <div className="text-[10px] text-white/60 font-semibold">{t('impactChadStat1Label')}</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-xl font-black text-blue-400">8 Puits</div>
                      <div className="text-[10px] text-white/60 font-semibold">{t('impactChadStat2Label')}</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-xl font-black text-amber-400">1 200</div>
                      <div className="text-[10px] text-white/60 font-semibold">{t('impactChadStat3Label')}</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                    <img
                      src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80"
                      alt="Action Tchad"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="canada"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-4 text-left">
                  <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-xs font-extrabold">
                    {t('impactCanadaBranchBadge')}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold">
                    {t('impactCanadaTitle')}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                    {t('impactCanadaText')}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-xl font-black text-red-400">45</div>
                      <div className="text-[10px] text-white/60 font-semibold">{t('impactCanadaStat1Label')}</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-xl font-black text-pink-400">350+</div>
                      <div className="text-[10px] text-white/60 font-semibold">{t('impactCanadaStat2Label')}</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-xl font-black text-purple-400">12 Hôpitaux</div>
                      <div className="text-[10px] text-white/60 font-semibold">{t('impactCanadaStat3Label')}</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                    <img
                      src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80"
                      alt="Action Canada"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </section>

      {/* ──────────────── FOUNDER QUOTE ──────────────── */}
      <section className="py-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-secondary flex items-center justify-center mx-auto shadow-md">
              <Quote className="w-8 h-8" />
            </div>
            <blockquote className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 leading-relaxed italic">
              {t('quoteText')}
            </blockquote>
            <div>
              <h4 className="font-extrabold text-gray-900 dark:text-white text-lg">{t('quoteAuthor')}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-0.5">{t('quoteRole')}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────── AMBASSADOR RECRUITMENT ──────────────── */}
      <section className="py-20 bg-[#071325] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-500/20 via-blue-500/10 to-transparent p-8 sm:p-14 rounded-3xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-3 max-w-2xl text-left">
              <span className="px-3.5 py-1 bg-secondary text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-md">
                {t('ambassadorTag')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                {t('ambassadorTitle')}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-normal">
                {t('ambassadorDesc')}
              </p>
            </div>
            <Link to="/contact" className="shrink-0">
              <Button variant="secondary" size="lg" className="shadow-xl shadow-emerald-500/20 font-extrabold">
                <GraduationCap className="w-5 h-5" />
                {t('ambassadorBtn')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────── DOMAINS ──────────────── */}
      <section className="py-14 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xs font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-10">
            {t('domainsTitle')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {domaines.map((d, i) => {
              const Icon = d.icon
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-slate-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/80 hover:bg-white dark:hover:bg-gray-800 card-glow transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${d.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: d.color }} />
                  </div>
                  <span className="text-xs text-gray-800 dark:text-gray-200 font-bold leading-tight">{d.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
