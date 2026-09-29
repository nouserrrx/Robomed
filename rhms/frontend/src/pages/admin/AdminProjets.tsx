import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter, Trash2, Edit3, MapPin, Loader2, AlertCircle, RefreshCw, ListTodo, CheckCircle2 } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { projectsAPI, missionsAPI } from '../../services/api'

interface Projet {
  id: number
  titre: string
  description: string
  statut: 'en_cours' | 'termine' | 'a_venir'
  progression: number
  budget: string
  date_debut: string
  date_fin: string
  localisation?: string
}

const statusLabels: Record<string, string> = {
  en_cours: 'En cours',
  termine: 'Terminé',
  a_venir: 'À venir',
}

const statusStyles: Record<string, string> = {
  en_cours: 'bg-amber-50 text-amber-700 border-amber-200',
  termine: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  a_venir: 'bg-blue-50 text-blue-700 border-blue-200',
}

const progressColors: Record<string, string> = {
  en_cours: 'bg-amber-500',
  termine: 'bg-emerald-500',
  a_venir: 'bg-blue-500',
}

const emojisMap: Record<string, string> = {
  en_cours: '🚀',
  termine: '✅',
  a_venir: '📋',
}

const standardProjectTitles = [
  "Distribution de kits scolaires",
  "Puits d'eau potable & Assainissement",
  "Soutien aux enfants en oncologie pédiatrique",
  "Visites & Réconfort en Soins Palliatifs",
  "Distribution de jouets & friandises solidaires",
  "Sensibilisation à l'hygiène et santé communautaire",
  "Bourses d'études & Équipements éducatifs",
  "Parrainage d'écoles & Matériel informatique",
]

export default function AdminProjets() {
  const [projets, setProjets] = useState<Projet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { success, error: toastError } = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProjet, setEditingProjet] = useState<Projet | null>(null)

  // Form state
  const [formTitreSelect, setFormTitreSelect] = useState(standardProjectTitles[0])
  const [formCustomTitre, setFormCustomTitre] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formStatut, setFormStatut] = useState<Projet['statut']>('a_venir')
  const [formProgression, setFormProgression] = useState(0)
  const [formBudget, setFormBudget] = useState('')
  const [formDateDebut, setFormDateDebut] = useState('')
  const [formDateFin, setFormDateFin] = useState('')

  // Missions state
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState(false)
  const [selectedProjetForMissions, setSelectedProjetForMissions] = useState<Projet | null>(null)
  const [projectMissions, setProjectMissions] = useState<any[]>([])
  const [loadingMissions, setLoadingMissions] = useState(false)
  const [missionTitre, setMissionTitre] = useState('')
  const [missionDesc, setMissionDesc] = useState('')
  const [missionDateDebut, setMissionDateDebut] = useState('')
  const [missionDateFin, setMissionDateFin] = useState('')
  const [missionStatut, setMissionStatut] = useState('a_faire')
  const [savingMission, setSavingMission] = useState(false)

  const openMissionsModal = async (p: Projet) => {
    setSelectedProjetForMissions(p)
    setIsMissionsModalOpen(true)
    setMissionTitre('')
    setMissionDesc('')
    setMissionDateDebut(p.date_debut || new Date().toISOString().split('T')[0])
    setMissionDateFin(p.date_fin || new Date().toISOString().split('T')[0])
    setMissionStatut('a_faire')
    setLoadingMissions(true)
    try {
      const data = await missionsAPI.getAll()
      if (data) {
        const all = Array.isArray(data) ? data : (data.results || [])
        setProjectMissions(all.filter((m: any) => m.projet === p.id))
      }
    } catch {
      // Ignorer
    } finally {
      setLoadingMissions(false)
    }
  }

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProjetForMissions || !missionTitre) return
    setSavingMission(true)
    try {
      await missionsAPI.create({
        projet: selectedProjetForMissions.id,
        titre: missionTitre,
        description: missionDesc,
        date_debut: missionDateDebut,
        date_fin: missionDateFin,
        statut: missionStatut,
      })
      success('Mission ajoutée', `"${missionTitre}" a été rattachée au projet.`)
      setMissionTitre('')
      setMissionDesc('')
      const data = await missionsAPI.getAll()
      const all = Array.isArray(data) ? data : (data?.results || [])
      setProjectMissions(all.filter((m: any) => m.projet === selectedProjetForMissions.id))
    } catch {
      toastError('Erreur', 'Impossible de créer la mission.')
    } finally {
      setSavingMission(false)
    }
  }

  const handleDeleteMission = async (id: number) => {
    if (!window.confirm('Voulez-vous supprimer cette mission ?')) return
    try {
      await missionsAPI.delete(id)
      setProjectMissions((prev) => prev.filter((m) => m.id !== id))
      success('Mission supprimée')
    } catch {
      toastError('Erreur', 'Impossible de supprimer cette mission.')
    }
  }

  const fetchProjets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await projectsAPI.getAll()
      if (data) {
        setProjets(Array.isArray(data) ? data : (data.results || []))
      } else {
        setError('Impossible de charger les projets. Vérifiez que le serveur backend est démarré.')
      }
    } catch {
      setError('Impossible de charger les projets. Vérifiez que le serveur backend est démarré.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProjets() }, [fetchProjets])

  const openCreateModal = () => {
    setEditingProjet(null)
    setFormTitreSelect(standardProjectTitles[0])
    setFormCustomTitre('')
    setFormDesc('')
    setFormStatut('a_venir')
    setFormProgression(0)
    setFormBudget('')
    setFormDateDebut(new Date().toISOString().split('T')[0])
    setFormDateFin(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0])
    setIsModalOpen(true)
  }

  const openEditModal = (p: Projet) => {
    setEditingProjet(p)
    if (standardProjectTitles.includes(p.titre)) {
      setFormTitreSelect(p.titre)
      setFormCustomTitre('')
    } else {
      setFormTitreSelect('__custom__')
      setFormCustomTitre(p.titre)
    }
    setFormDesc(p.description)
    setFormStatut(p.statut)
    setFormProgression(p.progression)
    setFormBudget(p.budget)
    setFormDateDebut(p.date_debut)
    setFormDateFin(p.date_fin)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalTitre = formTitreSelect === '__custom__' ? formCustomTitre.trim() : formTitreSelect
    if (!finalTitre) return
    setSaving(true)

    const payload = {
      titre: finalTitre,
      description: formDesc,
      statut: formStatut,
      progression: Number(formProgression),
      budget: formBudget || '0',
      date_debut: formDateDebut,
      date_fin: formDateFin,
    }

    try {
      if (editingProjet) {
        await projectsAPI.update(editingProjet.id, payload)
      } else {
        await projectsAPI.create(payload)
      }

      await fetchProjets()
      setIsModalOpen(false)
      success(editingProjet ? 'Projet mis à jour' : 'Projet créé')
    } catch {
      toastError('Erreur', 'Impossible de sauvegarder le projet. Vérifiez votre connexion.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.')) return
    try {
      await projectsAPI.delete(id)
      setProjets(prev => prev.filter(p => p.id !== id))
      success('Projet supprimé')
    } catch {
      toastError('Erreur', 'Impossible de supprimer ce projet.')
    }
  }

  const filtered = projets.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.titre.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'Tous' || p.statut === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Projets & Actions Humanitaires</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {loading ? 'Chargement...' : `${projets.length} projet(s) enregistré(s) — Canada & Tchad`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProjets}
            disabled={loading}
            className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-slate-50 transition-all"
            title="Actualiser"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nouveau projet
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <div>
            <p className="font-bold">Connexion impossible au serveur</p>
            <p className="text-red-500 mt-0.5">{error}</p>
          </div>
          <button onClick={fetchProjets} className="ml-auto text-red-500 font-bold underline">Réessayer</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un projet..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Statut:</span>
          {[
            { key: 'Tous', label: 'Tous' },
            { key: 'en_cours', label: 'En cours' },
            { key: 'termine', label: 'Terminé' },
            { key: 'a_venir', label: 'À venir' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                statusFilter === s.key
                  ? 'bg-[#0B2447] text-white border-[#0B2447]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-slate-50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          <span className="ml-3 text-gray-400 text-sm">Chargement des projets...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="text-5xl mb-4">🌍</div>
          <h3 className="text-gray-900 font-bold text-base mb-1">Aucun projet trouvé</h3>
          <p className="text-gray-400 text-xs max-w-xs mx-auto mb-5">
            {projets.length === 0
              ? 'Commencez par créer votre premier projet humanitaire.'
              : 'Aucun projet ne correspond à votre recherche.'}
          </p>
          {projets.length === 0 && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> Créer le premier projet
            </button>
          )}
        </div>
      )}

      {/* Grid of Projects */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{emojisMap[p.statut] || '📌'}</span>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-sm">{p.titre}</h3>
                      <p className="text-gray-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-secondary" />
                        Budget: {parseFloat(p.budget).toLocaleString('fr-FR')} · {p.date_debut} → {p.date_fin}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${statusStyles[p.statut] || 'bg-gray-50 text-gray-700'}`}>
                    {statusLabels[p.statut] || p.statut}
                  </span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-2">{p.description}</p>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Progression</span>
                  <span className="font-bold text-gray-700">{p.progression}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${progressColors[p.statut] || 'bg-secondary'}`}
                    style={{ width: `${p.progression}%` }}
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openMissionsModal(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <ListTodo className="w-3.5 h-3.5" /> Missions
                  </button>
                  <button
                    onClick={() => openEditModal(p)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Edit3 className="w-3 h-3" /> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">
              {editingProjet ? '✏️ Modifier le projet' : '🆕 Créer un nouveau projet'}
            </h3>
            <p className="text-gray-400 text-xs mb-5">Tous les champs sont requis pour créer un projet.</p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Titre du projet *
                  <span className="text-gray-400 font-normal ml-1">(Sélectionnez ou saisissez)</span>
                </label>
                <select
                  value={formTitreSelect}
                  onChange={e => {
                    setFormTitreSelect(e.target.value)
                    if (e.target.value !== '__custom__') setFormCustomTitre('')
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                >
                  {standardProjectTitles.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                  <option value="__custom__">✏️ Autre (saisir un titre personnalisé)...</option>
                </select>

                {formTitreSelect === '__custom__' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      required
                      value={formCustomTitre}
                      onChange={e => setFormCustomTitre(e.target.value)}
                      placeholder="Saisissez le titre personnalisé du projet..."
                      autoFocus
                      className="w-full px-3.5 py-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
                    />
                    <p className="text-[10px] text-amber-600 mt-1 font-medium">
                      💡 Ce nouveau titre sera enregistré pour ce projet.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Décrivez l'objectif du projet, son contexte et son impact..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 resize-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Statut</label>
                  <select
                    value={formStatut}
                    onChange={e => setFormStatut(e.target.value as Projet['statut'])}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                  >
                    <option value="a_venir">À venir</option>
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Progression (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formProgression}
                    onChange={e => setFormProgression(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Budget (en FCFA ou CAD)</label>
                <input
                  type="number"
                  min="0"
                  value={formBudget}
                  onChange={e => setFormBudget(e.target.value)}
                  placeholder="Ex: 500000"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date de début *</label>
                  <input
                    type="date"
                    required
                    value={formDateDebut}
                    onChange={e => setFormDateDebut(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date de fin prévue *</label>
                  <input
                    type="date"
                    required
                    value={formDateFin}
                    onChange={e => setFormDateFin(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-secondary text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                  {editingProjet ? 'Mettre à jour' : 'Créer le projet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Missions du Projet */}
      {isMissionsModalOpen && selectedProjetForMissions && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl border border-gray-100 dark:border-gray-700 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-emerald-600" />
                  Missions de terrain : {selectedProjetForMissions.titre}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Planification des actions spécifiques et assignation aux bénévoles.
                </p>
              </div>
              <button
                onClick={() => setIsMissionsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Existing missions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Missions actuelles ({projectMissions.length})
              </h4>
              {loadingMissions ? (
                <div className="py-6 text-center text-gray-400 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1 text-emerald-600" />
                  Chargement des missions...
                </div>
              ) : projectMissions.length === 0 ? (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl text-center text-xs text-gray-400">
                  Aucune mission encore créée pour ce projet. Remplissez le formulaire ci-dessous.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {projectMissions.map((m: any) => (
                    <div
                      key={m.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-between gap-3 text-xs border border-gray-100 dark:border-gray-600"
                    >
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          {m.titre}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.statut === 'terminee'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.statut === 'en_cours'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {m.statut === 'terminee' ? 'Terminée' : m.statut === 'en_cours' ? 'En cours' : 'À faire'}
                          </span>
                        </div>
                        {m.description && <p className="text-gray-500 text-[11px] mt-0.5">{m.description}</p>}
                        <div className="text-[10px] text-gray-400 mt-1">
                          📅 {m.date_debut} → {m.date_fin} · Bénévole : <span className="font-semibold text-gray-700 dark:text-gray-300">{m.benevole_nom || 'Non assigné'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMission(m.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form to add mission */}
            <form onSubmit={handleCreateMission} className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3 text-xs">
              <h4 className="font-bold text-gray-800 dark:text-gray-200">Ajouter une nouvelle mission</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 mb-1">Titre de la mission *</label>
                  <input
                    type="text"
                    required
                    value={missionTitre}
                    onChange={(e) => setMissionTitre(e.target.value)}
                    placeholder="Ex: Distribution des cartables école A"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 mb-1">Statut initial</label>
                  <select
                    value={missionStatut}
                    onChange={(e) => setMissionStatut(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white"
                  >
                    <option value="a_faire">À faire (Recrutement ouvert)</option>
                    <option value="en_cours">En cours</option>
                    <option value="terminee">Terminée</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 mb-1">Date début</label>
                  <input
                    type="date"
                    value={missionDateDebut}
                    onChange={(e) => setMissionDateDebut(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 mb-1">Date fin</label>
                  <input
                    type="date"
                    value={missionDateFin}
                    onChange={(e) => setMissionDateFin(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1">Description & Consignes</label>
                <textarea
                  rows={2}
                  value={missionDesc}
                  onChange={(e) => setMissionDesc(e.target.value)}
                  placeholder="Objectif de la mission, point de rendez-vous..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingMission}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {savingMission ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Ajouter la mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
