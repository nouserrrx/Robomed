import { useState, useEffect } from 'react'
import { Newspaper, Plus, Trash2, Search, Filter, RefreshCw, Eye, CheckCircle2, FileText, Calendar, Edit3, Send, Upload } from 'lucide-react'
import { newsAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

interface ActualiteItem {
  id: number
  titre: string
  categorie: string
  resume?: string
  contenu?: string
  image_url?: string
  image?: string
  date_publication?: string
  statut?: string
  vues?: number
  commentaires?: number
  auteur_name?: string
}

export default function AdminActualites() {
  const [actualites, setActualites] = useState<ActualiteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategorie, setFilterCategorie] = useState<string>('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ActualiteItem | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [formTitre, setFormTitre] = useState('')
  const [formCategorie, setFormCategorie] = useState('Actualité')
  const [formStatut, setFormStatut] = useState('publie')
  const [formResume, setFormResume] = useState('')
  const [formContenu, setFormContenu] = useState('')
  const [formImageUrl, setFormImageUrl] = useState('')
  const [formFile, setFormFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const toast = useToast()

  const fetchActualites = async () => {
    setLoading(true)
    try {
      const data = await newsAPI.getAll()
      if (Array.isArray(data)) {
        setActualites(data)
      } else if (data && Array.isArray(data.results)) {
        setActualites(data.results)
      } else {
        setActualites([])
      }
    } catch {
      toast.error('Erreur', 'Impossible de charger les actualités.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActualites()
  }, [])

  const resetForm = () => {
    setEditingItem(null)
    setFormTitre('')
    setFormCategorie('Actualité')
    setFormStatut('publie')
    setFormResume('')
    setFormContenu('')
    setFormImageUrl('')
    setFormFile(null)
    setPreviewUrl(null)
  }

  const handleOpenModal = (item?: ActualiteItem) => {
    if (item) {
      setEditingItem(item)
      setFormTitre(item.titre || '')
      setFormCategorie(item.categorie || 'Actualité')
      setFormStatut(item.statut || 'publie')
      setFormResume(item.resume || '')
      setFormContenu(item.contenu || '')
      setFormImageUrl(item.image_url || item.image || '')
      setFormFile(null)
      setPreviewUrl(item.image_url || item.image || null)
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitre.trim()) {
      toast.error('Erreur', 'Veuillez saisir un titre.')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('titre', formTitre.trim())
      formData.append('categorie', formCategorie)
      formData.append('statut', formStatut)
      formData.append('resume', formResume.trim())
      formData.append('contenu', formContenu.trim())
      if (formFile) {
        formData.append('image', formFile)
      } else if (formImageUrl.trim()) {
        formData.append('image_url', formImageUrl.trim())
      }

      if (editingItem) {
        await newsAPI.update(editingItem.id, formData)
        toast.success('Succès', 'Actualité mise à jour avec succès !')
      } else {
        await newsAPI.create(formData)
        toast.success('Succès', 'Nouvelle actualité publiée avec succès !')
      }

      setIsModalOpen(false)
      resetForm()
      fetchActualites()
    } catch {
      toast.error('Erreur', 'Échec de l\'enregistrement de l\'actualité.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette actualité ?')) return
    try {
      await newsAPI.delete(id)
      toast.success('Succès', 'L\'actualité a été supprimée.')
      fetchActualites()
    } catch {
      toast.error('Erreur', 'Échec de la suppression.')
    }
  }

  // Filter list
  const filtered = actualites.filter(item => {
    const matchSearch = item.titre.toLowerCase().includes(search.toLowerCase()) ||
                        (item.resume && item.resume.toLowerCase().includes(search.toLowerCase())) ||
                        (item.categorie && item.categorie.toLowerCase().includes(search.toLowerCase()))
    const matchCategorie = filterCategorie === 'ALL' || item.categorie === filterCategorie
    return matchSearch && matchCategorie
  })

  const totalPublie = actualites.filter(a => a.statut === 'publie').length
  const totalVues = actualites.reduce((acc, curr) => acc + (curr.vues || 0), 0)

  return (
    <div className="space-y-6">
      {/* ── Top Header & Action ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-secondary" /> Gestion des Actualités & Articles
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Publiez, modifiez et gérez les communiqués, rapports et actualités officiels de RoBomed.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Publier une Actualité
        </button>
      </div>

      {/* ── KPI Widgets ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Total Articles</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white mt-1 block">{actualites.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Articles Publiés</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{totalPublie}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Lectures Totales</span>
            <span className="text-2xl font-black text-blue-600 mt-1 block">{totalVues}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* ── Toolbar Search & Filter ── */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une actualité..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-secondary text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={filterCategorie}
              onChange={e => setFilterCategorie(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-600 dark:text-gray-300 outline-none cursor-pointer"
            >
              <option value="ALL">Toutes les catégories</option>
              <option value="Actualité">Actualité</option>
              <option value="Rapport">Rapport</option>
              <option value="Événement">Événement</option>
              <option value="Communiqué">Communiqué</option>
              <option value="Témoignage">Témoignage</option>
            </select>
          </div>

          <button
            onClick={fetchActualites}
            className="p-2 bg-gray-50 dark:bg-gray-900 text-gray-500 hover:text-secondary border border-gray-100 dark:border-gray-700 rounded-xl transition-all cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Actualités Cards Grid ── */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-secondary mb-3" />
          <span className="text-xs font-semibold">Chargement des actualités...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h4 className="font-bold text-sm text-gray-900 dark:text-white">Aucune actualité trouvée</h4>
          <p className="text-xs mt-1">Cliquez sur « Publier une Actualité » pour ajouter vos véritables actualités.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(item => {
            const imgUrl = item.image_url || item.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80'

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Article image header */}
                  <div className="relative h-44 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={item.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-white shadow">
                        {item.categorie}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.statut === 'publie' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {item.statut === 'publie' ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                  </div>

                  {/* Body text */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date_publication ? new Date(item.date_publication).toLocaleDateString('fr-FR') : 'Récemment'}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">
                      {item.titre}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-3">
                      {item.resume || item.contenu || 'Aucun résumé fourni.'}
                    </p>
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/30">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {item.vues || 0} vues
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer"
                      title="Modifier"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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

      {/* ── Modal Create / Edit Actualité ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <Send className="w-5 h-5 text-secondary" />
                {editingItem ? 'Modifier l\'Actualité' : 'Publier une Nouvelle Actualité'}
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
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Titre de l'article *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Distribution de fournitures scolaires à Koumra"
                  value={formTitre}
                  onChange={e => setFormTitre(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Catégorie</label>
                  <select
                    value={formCategorie}
                    onChange={e => setFormCategorie(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-secondary cursor-pointer"
                  >
                    <option value="Actualité">Actualité</option>
                    <option value="Rapport">Rapport</option>
                    <option value="Événement">Événement</option>
                    <option value="Communiqué">Communiqué</option>
                    <option value="Témoignage">Témoignage</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Statut de publication</label>
                  <select
                    value={formStatut}
                    onChange={e => setFormStatut(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-secondary cursor-pointer"
                  >
                    <option value="publie">Publié</option>
                    <option value="brouillon">Brouillon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Image de couverture (Fichier)
                </label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-center hover:border-secondary transition-colors bg-gray-50/50 dark:bg-gray-900/50">
                  {previewUrl ? (
                    <div className="relative aspect-video max-h-40 mx-auto rounded-xl overflow-hidden bg-black/10">
                      <img src={previewUrl} alt="Aperçu article" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setFormFile(null); setPreviewUrl(null); setFormImageUrl('') }}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 text-xs shadow-md"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-1.5">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Glissez une image ou cliquez pour parcourir
                      </span>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WebP (max 10 Mo)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1 text-[11px]">
                  Ou entrez directement une URL d'image externe
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formImageUrl}
                  onChange={e => setFormImageUrl(e.target.value)}
                  disabled={Boolean(formFile)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-secondary disabled:opacity-50 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Résumé court</label>
                <textarea
                  rows={2}
                  placeholder="Aperçu concis de l'article pour les cartes de présentation..."
                  value={formResume}
                  onChange={e => setFormResume(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Contenu détaillé</label>
                <textarea
                  rows={5}
                  placeholder="Rédigez ici le texte complet de l'article ou du communiqué..."
                  value={formContenu}
                  onChange={e => setFormContenu(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-secondary"
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
                  {submitting ? 'Enregistrement...' : editingItem ? 'Mettre à jour' : 'Publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
