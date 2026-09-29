import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Image, Video, Folder, Search, X, ZoomIn, RefreshCw, CheckCircle2, Layers } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { galleryAPI } from '../services/api'

interface MediaItem {
  id: number
  titre: string
  url?: string
  fichier?: string
  type: 'image' | 'video'
  categorie: string
  date_upload?: string
  statut?: boolean
}

export default function Galerie() {
  const { language, t } = useLanguage()
  const [activeType, setActiveType] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [medias, setMedias] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null)

  useEffect(() => {
    setLoading(true)
    galleryAPI.getAll()
      .then(res => {
        const data = Array.isArray(res) ? res : (res?.results || [])
        setMedias(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Calculate dynamic categories and counts
  const categories = Array.from(new Set(medias.map(m => m.categorie).filter(Boolean)))

  const mediaTypeFilters = [
    { value: 'all', label: t('gallery') || 'Tous les médias', icon: Image },
    { value: 'photos', label: t('photosFilter') || 'Photos', icon: Image },
    { value: 'videos', label: t('videosFilter') || 'Vidéos', icon: Video },
  ]

  const filteredGallery = medias.filter(item => {
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || item.titre.toLowerCase().includes(q) || (item.categorie && item.categorie.toLowerCase().includes(q))
    const matchType = activeType === 'all' ||
                      (activeType === 'photos' && item.type !== 'video') ||
                      (activeType === 'videos' && item.type === 'video')
    const matchCategory = selectedCategory === 'ALL' || item.categorie === selectedCategory

    return matchSearch && matchType && matchCategory
  })

  return (
    <>
      {/* ──────────────── HERO ──────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 220 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&q=80')" }}
        />
        <div className="absolute inset-0 bg-[#0B2447]/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
              <Link to="/" className="hover:text-white">{t('home')}</Link>
              <span>›</span>
              <span className="text-white">{t('gallery')}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{t('galleryTitle')}</h1>
            <p className="text-white/80 text-sm leading-relaxed">
              {t('gallerySubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ──────────────── FILTER BAR ──────────────── */}
      <section className="bg-white border-b border-gray-100 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
              {mediaTypeFilters.map((filter) => {
                const isActive = activeType === filter.value
                const Icon = filter.icon
                return (
                  <button
                    key={filter.value}
                    onClick={() => setActiveType(filter.value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-secondary text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {filter.label}
                  </button>
                )
              })}
            </div>

            <div className="hidden md:block w-px h-6 bg-gray-200 mx-1" />

            {/* Category Pill Filter */}
            {categories.length > 0 && (
              <div className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    selectedCategory === 'ALL'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Toutes
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchGalleryPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white w-56 focus:border-secondary focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── MAIN CONTENT ──────────────── */}
      <section className="py-8 lg:py-12 bg-gray-50 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ─── Gallery grid ─── */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-secondary" />
                  <h2 className="text-lg font-bold text-gray-900">
                    {selectedCategory === 'ALL' ? (t('missionAlbumsTitle') || 'Photos & Actions Média') : selectedCategory}
                  </h2>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {filteredGallery.length} élément{filteredGallery.length > 1 ? 's' : ''}
                </span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-secondary mb-3" />
                  <span className="text-xs font-semibold">Chargement de la galerie...</span>
                </div>
              ) : filteredGallery.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-800 text-sm">Aucun média trouvé</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Aucune photo ou vidéo ne correspond actuellement à vos critères de recherche.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                  {filteredGallery.map((item, index) => {
                    const mediaUrl = item.url || item.fichier || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80'

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedImage(item)}
                        className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer shadow-sm border border-gray-100 bg-gray-900"
                      >
                        {item.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white relative">
                            <Video className="w-12 h-12 text-blue-400" />
                            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase">
                              Vidéo
                            </span>
                          </div>
                        ) : (
                          <img
                            src={mediaUrl}
                            alt={item.titre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                        
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ZoomIn className="w-4 h-4" />
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 backdrop-blur-sm text-white mb-1.5">
                            {item.categorie}
                          </span>
                          <h3 className="font-bold text-sm leading-tight">{item.titre}</h3>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ─── Sidebar ─── */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-secondary" />
                    <h3 className="font-bold text-gray-900 text-sm">Catégories & Thématiques</h3>
                  </div>
                </div>

                {categories.length === 0 ? (
                  <p className="text-xs text-gray-400">Aucune catégorie disponible.</p>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('ALL')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        selectedCategory === 'ALL'
                          ? 'bg-secondary/10 text-secondary font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" /> Tous les médias
                      </span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] text-gray-600">
                        {medias.length}
                      </span>
                    </button>

                    {categories.map((cat) => {
                      const count = medias.filter(m => m.categorie === cat).length
                      const isSelected = selectedCategory === cat

                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-secondary/10 text-secondary font-bold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="truncate">{cat}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] text-gray-600 shrink-0">
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── LIGHTBOX MODAL ──────────────── */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[75vh] flex items-center justify-center bg-black">
                {selectedImage.type === 'video' ? (
                  <div className="p-12 text-center text-white">
                    <Video className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h4 className="font-bold text-lg mb-2">{selectedImage.titre}</h4>
                    {selectedImage.url && (
                      <a
                        href={selectedImage.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                      >
                        Ouvrir la vidéo
                      </a>
                    )}
                  </div>
                ) : (
                  <img
                    src={selectedImage.url || selectedImage.fichier || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80'}
                    alt={selectedImage.titre}
                    className="max-h-[75vh] w-auto object-contain"
                  />
                )}
              </div>

              <div className="p-5 text-white flex items-center justify-between bg-gray-900">
                <div>
                  <h3 className="font-bold text-base">{selectedImage.titre}</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Catégorie : {selectedImage.categorie}</p>
                </div>
                <Link
                  to="/faire-un-don"
                  className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors"
                >
                  {t('supportActionBtn')}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
