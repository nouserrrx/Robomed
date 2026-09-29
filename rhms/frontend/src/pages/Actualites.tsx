import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Heart, Search, SlidersHorizontal, Calendar, Eye, MessageCircle,
  ArrowRight, ChevronLeft, ChevronRight, Send, RefreshCw, FileText
} from 'lucide-react'
import Button from '../components/ui/Button'
import { useLanguage } from '../context/LanguageContext'
import { newsAPI } from '../services/api'

const categoryColors: Record<string, { bg: string; text: string }> = {
  'Actualité': { bg: 'bg-primary', text: 'text-white' },
  'Rapport': { bg: 'bg-secondary', text: 'text-white' },
  'Événement': { bg: 'bg-amber-500', text: 'text-white' },
  'Communiqué': { bg: 'bg-purple-600', text: 'text-white' },
  'Témoignage': { bg: 'bg-pink-500', text: 'text-white' },
}

export default function Actualites() {
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const langKey = (language === 'en' ? 'en' : language === 'ar' ? 'ar' : 'fr') as 'fr' | 'en' | 'ar'

  const fetchNews = async () => {
    setLoading(true)
    try {
      const data = await newsAPI.getAll()
      if (Array.isArray(data)) {
        setItems(data.filter(item => item.statut !== 'brouillon'))
      } else if (data && Array.isArray(data.results)) {
        setItems(data.results.filter((item: any) => item.statut !== 'brouillon'))
      } else {
        setItems([])
      }
    } catch (err) {
      console.warn('Erreur de chargement des actualités:', err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const tabFilters = [
    { value: 'all', label: t('allArticlesFilter') },
    { value: 'Actualité', label: t('newsFilter') },
    { value: 'Communiqué', label: t('pressFilter') },
    { value: 'Événement', label: t('eventsFilter') },
    { value: 'Témoignage', label: t('testimonialsFilter') },
    { value: 'Rapport', label: t('reportsFilter') },
  ]

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'Actualité': return t('newsFilter')
      case 'Rapport': return t('reportsFilter')
      case 'Événement': return t('eventsFilter')
      case 'Communiqué': return t('pressFilter')
      case 'Témoignage': return t('testimonialsFilter')
      default: return cat || t('newsFilter')
    }
  }

  const countFor = (catValue: string) =>
    catValue === 'all'
      ? items.length
      : items.filter(a => a.categorie === catValue).length

  const categoryCounts = [
    { label: t('allArticlesFilter'), count: countFor('all') },
    { label: t('newsFilter'), count: countFor('Actualité') },
    { label: t('pressFilter'), count: countFor('Communiqué') },
    { label: t('eventsFilter'), count: countFor('Événement') },
    { label: t('testimonialsFilter'), count: countFor('Témoignage') },
    { label: t('reportsFilter'), count: countFor('Rapport') },
  ]

  const getItemTitle = (a: any) => {
    if (typeof a.titre === 'object' && a.titre !== null) {
      return a.titre[langKey] || a.titre.fr || ''
    }
    return a.titre || ''
  }

  const getItemResume = (a: any) => {
    if (typeof a.resume === 'object' && a.resume !== null) {
      return a.resume[langKey] || a.resume.fr || ''
    }
    return a.resume || a.contenu || ''
  }

  const getItemImage = (a: any) => {
    return a.image_url || a.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80'
  }

  const filtered = items
    .filter((a) => activeTab === 'all' || a.categorie === activeTab)
    .filter((a) => {
      const title = getItemTitle(a)
      return title.toLowerCase().includes(searchQuery.toLowerCase())
    })

  const featured = filtered.slice(0, 3)
  const rest = filtered.slice(3)

  return (
    <>
      {/* ──────────────── HERO ──────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 240 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&q=80')" }}
        />
        <div className="absolute inset-0 bg-[#0B2447]/75" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
            <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
              <Link to="/" className="hover:text-white">{t('home')}</Link>
              <span>›</span>
              <span className="text-white">{t('news')}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{t('newsPageTitle')}</h1>
            <p className="text-white/80 text-sm leading-relaxed">
              {t('newsPageSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ──────────────── FILTER TABS ──────────────── */}
      <section className="bg-white border-b border-gray-100 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {tabFilters.map((tab) => {
              const isActive = activeTab === tab.value
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-secondary text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
            <div className="flex-1" />
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchArticlePlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white w-48 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── MAIN CONTENT ──────────────── */}
      <section className="py-8 lg:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ─── Articles ─── */}
            <div className="lg:col-span-3">

              {loading ? (
                <div className="py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-secondary mb-3" />
                  <p className="text-xs font-semibold">Chargement des actualités...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                  <h3 className="text-base font-bold text-gray-800">Aucune actualité publiée pour le moment</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Revenez régulièrement pour suivre les actions et rapports récents de l'organisation RoBomed.
                  </p>
                </div>
              ) : (
                <>
                  {/* Featured cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {featured.map((article, index) => {
                      const cat = categoryColors[article.categorie] || { bg: 'bg-primary', text: 'text-white' }
                      const titre = getItemTitle(article)
                      const resume = getItemResume(article)
                      const image = getItemImage(article)
                      const dateStr = article.date_publication || article.date

                      return (
                        <motion.article
                          key={article.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08 }}
                          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative h-40 overflow-hidden">
                              <img src={image} alt={titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <span className={`absolute top-3 left-3 ${cat.bg} ${cat.text} text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase`}>
                                {getCategoryLabel(article.categorie)}
                              </span>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                                <Calendar className="w-3 h-3" />
                                {dateStr ? new Date(dateStr).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Récemment'}
                              </div>
                              <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{titre}</h3>
                              <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-3">{resume}</p>
                            </div>
                          </div>

                          <div className="p-4 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
                            <div className="flex gap-3">
                              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                                <Eye className="w-3 h-3" /> {(article.vues || 0).toLocaleString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR')} {t('viewsLabel')}
                              </span>
                            </div>
                            <button className="text-secondary text-xs font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer">
                              {t('readMoreBtn')} <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.article>
                      )
                    })}
                  </div>

                  {/* Rest cards (horizontal) */}
                  {rest.length > 0 && (
                    <div className="space-y-4 mb-8">
                      {rest.map((article, index) => {
                        const cat = categoryColors[article.categorie] || { bg: 'bg-primary', text: 'text-white' }
                        const titre = getItemTitle(article)
                        const resume = getItemResume(article)
                        const image = getItemImage(article)
                        const dateStr = article.date_publication || article.date

                        return (
                          <motion.article
                            key={article.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.06 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex group"
                          >
                            <div className="relative w-36 sm:w-44 shrink-0 overflow-hidden">
                              <img src={image} alt={titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <span className={`absolute top-2 left-2 ${cat.bg} ${cat.text} text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase`}>
                                {getCategoryLabel(article.categorie)}
                              </span>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                  <Calendar className="w-3 h-3" />
                                  {dateStr ? new Date(dateStr).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Récemment'}
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">{titre}</h3>
                                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{resume}</p>
                              </div>
                              <div className="flex gap-3 mt-2">
                                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                                  <Eye className="w-3 h-3" /> {(article.vues || 0).toLocaleString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR')} {t('viewsLabel')}
                                </span>
                              </div>
                            </div>
                          </motion.article>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ─── Sidebar ─── */}
            <div className="space-y-6">
              {/* Catégories */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4">{t('categoriesTitle')}</h3>
                <ul className="space-y-2.5">
                  {categoryCounts.map(({ label, count }) => (
                    <li key={label} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{label}</span>
                      <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full text-[10px]">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────── NEWSLETTER CTA ──────────────── */}
      <section className="bg-[#0B2447] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-white font-bold text-base">{t('dontMissNewsTitle')}</h3>
              <p className="text-white/60 text-xs">
                {t('dontMissNewsSub')}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder-white/50 w-56 focus:border-secondary outline-none"
              />
              <Button variant="secondary" size="md">
                <Send className="w-4 h-4" /> {t('subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
