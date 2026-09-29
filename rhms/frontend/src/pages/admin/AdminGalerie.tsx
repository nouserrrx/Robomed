import { useState, useEffect } from 'react'
import { Image, Video, Plus, Trash2, Search, Filter, RefreshCw, Upload, Eye, ExternalLink, Film, CheckCircle2, PenLine } from 'lucide-react'
import { galleryAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

interface MediaItem {
  id: number
  titre: string
  type: 'image' | 'video'
  categorie: string
  url?: string
  fichier?: string
  date_upload?: string
  statut?: boolean
}

export default function AdminGalerie() {
  const [medias, setMedias] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [formTitre, setFormTitre] = useState('')
  const [formType, setFormType] = useState<'image' | 'video'>('image')
  const [formCategorie, setFormCategorie] = useState('Éducation')
  const [formUrl, setFormUrl] = useState('')
  const [formFile, setFormFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const toast = useToast()

  const fetchMedias = async () => {
    setLoading(true)
    try {
      const data = await galleryAPI.getAll()
      if (Array.isArray(data)) {
        setMedias(data)
      } else if (data && Array.isArray(data.results)) {
        setMedias(data.results)
      }
    } catch {
      toast.error('Erreur', 'Impossible de charger la galerie.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedias()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const openCreateModal = () => {
    setEditingMedia(null)
    setFormTitre('')
    setFormType('image')
    setFormCategorie('Éducation')
    setFormUrl('')
    setFormFile(null)
    setPreviewUrl(null)
    setIsModalOpen(true)
  }

  const openEditModal = (media: MediaItem) => {
    setEditingMedia(media)
    setFormTitre(media.titre)
    setFormType(media.type || 'image')
    setFormCategorie(media.categorie || 'Éducation')
    setFormUrl(media.url || '')
    setFormFile(null)
    setPreviewUrl(media.url || media.fichier || null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitre.trim()) {
      toast.error('Erreur', 'Veuillez saisir un titre.')
      return
    }

    setSubmitting(true)
    try {
      if (editingMedia) {
        if (formFile) {
          const formData = new FormData()
          formData.append('titre', formTitre.trim())
          formData.append('type', formType)
          formData.append('categorie', formCategorie)
          formData.append('fichier', formFile)
          await galleryAPI.update(editingMedia.id, formData)
        } else {
          await galleryAPI.update(editingMedia.id, {
            titre: formTitre.trim(),
            type: formType,
            categorie: formCategorie,
            url: formUrl.trim(),
          })
        }
        toast.success('Succès', 'Média mis à jour avec succès !')
      } else {
        const formData = new FormData()
        formData.append('titre', formTitre.trim())
        formData.append('type', formType)
        formData.append('categorie', formCategorie)
        formData.append('statut', 'true')
        if (formFile) {
          formData.append('fichier', formFile)
        } else if (formUrl.trim()) {
          formData.append('url', formUrl.trim())
        }
        await galleryAPI.create(formData)
        toast.success('Succès', 'Média ajouté à la galerie !')
      }

      setIsModalOpen(false)
      setEditingMedia(null)
      setFormTitre('')
      setFormUrl('')
      setFormFile(null)
      setPreviewUrl(null)
      fetchMedias()
    } catch {
      toast.error('Erreur', "Échec de l'enregistrement du média.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous supprimer ce média de la galerie ?')) return
    try {
      await galleryAPI.delete(id)
      toast.success('Succès', 'Le média a été supprimé.')
      fetchMedias()
    } catch {
      toast.error('Erreur', 'Échec de la suppression.')
    }
  }

  // Filter list
  const filtered = medias.filter(m => {
    const matchSearch = m.titre.toLowerCase().includes(search.toLowerCase()) || 
                        (m.categorie && m.categorie.toLowerCase().includes(search.toLowerCase()))
    const matchType = filterType === 'ALL' || m.type === filterType
    return matchSearch && matchType
  })

  const totalImages = medias.filter(m => m.type === 'image').length
  const totalVideos = medias.filter(m => m.type === 'video').length

  return (
    <div className="space-y-6">
      
      {/* ── Top Header & KPI Widgets ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Image className="w-7 h-7 text-secondary" /> Gestion de la Galerie Média
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Ajoutez, organisez et gérez les photos et vidéos présentées sur la plateforme RoBomed.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Ajouter un Média
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Total Médias</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white mt-1 block">{medias.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
            <Image className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Photos</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{totalImages}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center">
            <Image className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Vidéos</span>
            <span className="text-2xl font-black text-blue-600 mt-1 block">{totalVideos}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
            <Video className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* ── Toolbar Search & Filter ── */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par titre ou catégorie..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-secondary text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-600 dark:text-gray-300 outline-none cursor-pointer"
            >
              <option value="ALL">Tous les types</option>
              <option value="image">Photos</option>
              <option value="video">Vidéos</option>
            </select>
          </div>

          <button
            onClick={fetchMedias}
            className="p-2 bg-gray-50 dark:bg-gray-900 text-gray-500 hover:text-secondary border border-gray-100 dark:border-gray-700 rounded-xl transition-all cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Gallery Cards Grid ── */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-secondary mb-3" />
          <span className="text-xs font-semibold">Chargement des médias...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h4 className="font-bold text-sm text-gray-900 dark:text-white">Aucun média dans la galerie</h4>
          <p className="text-xs mt-1">Cliquez sur « Ajouter un Média » pour ajouter des photos et vidéos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(media => {
            const mediaUrl = media.url || media.fichier || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80'

            return (
              <div
                key={media.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Media preview */}
                  <div className="relative aspect-[16/10] bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    {media.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white relative">
                        <Video className="w-10 h-10 text-blue-400" />
                        <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-blue-600 px-2 py-0.5 rounded text-white uppercase">
                          Vidéo
                        </span>
                      </div>
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={media.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                      {media.categorie}
                    </span>
                  </div>

                  {/* Title & Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-xs leading-snug line-clamp-2">
                      {media.titre}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {media.date_upload ? new Date(media.date_upload).toLocaleDateString('fr-FR') : 'Récemment ajouté'}
                    </p>
                  </div>
                </div>

                {/* Footer action */}
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/30">
                  {mediaUrl && (
                    <a
                      href={mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-secondary hover:underline font-semibold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Voir
                    </a>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      onClick={() => openEditModal(media)}
                      className="p-1.5 text-gray-400 hover:text-secondary hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                      title="Modifier ce média"
                    >
                      <PenLine className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(media.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Modal Add / Edit Media ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-secondary" /> {editingMedia ? 'Modifier le Média' : 'Ajouter une Photo / Vidéo'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Titre du média *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Distribution de kits scolaires 2027"
                  value={formTitre}
                  onChange={e => setFormTitre(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Type de média</label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value as 'image' | 'video')}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-secondary cursor-pointer"
                  >
                    <option value="image">Photo / Image</option>
                    <option value="video">Vidéo</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Catégorie</label>
                  <select
                    value={formCategorie}
                    onChange={e => setFormCategorie(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-secondary cursor-pointer"
                  >
                    <option value="Éducation">Éducation</option>
                    <option value="Eau & Assainissement">Eau & Assainissement</option>
                    <option value="Aide alimentaire">Aide alimentaire</option>
                    <option value="Santé">Santé</option>
                    <option value="Environnement">Environnement</option>
                    <option value="Événement">Événement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Téléverser un fichier (Photo ou Vidéo)
                </label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-center hover:border-secondary transition-colors bg-gray-50/50 dark:bg-gray-900/50">
                  {previewUrl ? (
                    <div className="relative aspect-video max-h-40 mx-auto rounded-xl overflow-hidden bg-black/10">
                      {formType === 'video' ? (
                        <video src={previewUrl} className="w-full h-full object-cover" controls />
                      ) : (
                        <img src={previewUrl} alt="Aperçu" className="w-full h-full object-contain" />
                      )}
                      <button
                        type="button"
                        onClick={() => { setFormFile(null); setPreviewUrl(null) }}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 text-xs shadow-md"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-1.5">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Glissez un fichier ou cliquez pour parcourir
                      </span>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WebP, MP4 (max 20 Mo)</span>
                      <input
                        type="file"
                        accept={formType === 'video' ? 'video/*' : 'image/*'}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1 text-[11px]">
                  Ou entrez directement une URL externe
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... ou lien YouTube"
                  value={formUrl}
                  onChange={e => setFormUrl(e.target.value)}
                  disabled={Boolean(formFile)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-secondary disabled:opacity-50 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 bg-gray-100 dark:bg-gray-700 font-bold hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-secondary text-white font-bold hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
                >
                  {submitting ? 'Enregistrement...' : editingMedia ? 'Enregistrer les modifications' : 'Ajouter à la galerie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
