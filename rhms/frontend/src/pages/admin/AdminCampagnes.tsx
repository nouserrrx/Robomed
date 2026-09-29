import React, { useState, useEffect, useCallback } from 'react'
import {
  Heart, Plus, Search, Filter, Trash2, Edit3,
  Download, RefreshCw, Loader2, AlertCircle,
  TrendingUp, Calendar, CheckCircle2, Clock
} from 'lucide-react'
import { exportToCSV } from '../../utils/exportCsv'
import { campaignsAPI, projectsAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

interface Campagne {
  id: number
  titre: string
  description: string
  objectif: number | string
  collecte: number | string
  date_debut: string
  date_fin: string
  statut: 'active' | 'terminee' | 'a_venir'
  projet?: number | null
  projet_titre?: string
  taux_completion?: number
  nb_dons?: number
}

const statusBadge: Record<string, { label: string; color: string }> = {
  active:   { label: 'Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400' },
  a_venir:  { label: 'À venir', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400' },
  terminee: { label: 'Terminée', color: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400' },
}

export default function AdminCampagnes() {
  const [campaigns, setCampaigns] = useState<Campagne[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCampagne, setEditingCampagne] = useState<Campagne | null>(null)
  const [saving, setSaving] = useState(false)
  const { success, error: toastError } = useToast()

  // Form states
  const [formTitre, setFormTitre] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formObjectif, setFormObjectif] = useState('')
  const [formDateDebut, setFormDateDebut] = useState('')
  const [formDateFin, setFormDateFin] = useState('')
  const [formStatut, setFormStatut] = useState<Campagne['statut']>('active')
  const [formProjet, setFormProjet] = useState<number | ''>('')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [campRes, projRes] = await Promise.all([
        campaignsAPI.getAll(),
        projectsAPI.getAll(),
      ])

      if (campRes) {
        setCampaigns(Array.isArray(campRes) ? campRes : (campRes.results || []))
      }
      if (projRes) {
        setProjects(Array.isArray(projRes) ? projRes : (projRes.results || []))
      }
    } catch {
      toastError('Erreur', 'Impossible de charger les campagnes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openCreateModal = () => {
    setEditingCampagne(null)
    setFormTitre('')
    setFormDesc('')
    setFormObjectif('')
    setFormDateDebut(new Date().toISOString().split('T')[0])
    setFormDateFin(new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0])
    setFormStatut('active')
    setFormProjet('')
    setIsModalOpen(true)
  }

  const openEditModal = (c: Campagne) => {
    setEditingCampagne(c)
    setFormTitre(c.titre)
    setFormDesc(c.description)
    setFormObjectif(String(c.objectif))
    setFormDateDebut(c.date_debut)
    setFormDateFin(c.date_fin)
    setFormStatut(c.statut)
    setFormProjet(c.projet || '')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitre || !formObjectif) {
      toastError('Champs requis', 'Veuillez renseigner le titre et l\'objectif.')
      return
    }

    setSaving(true)
    const payload: any = {
      titre: formTitre,
      description: formDesc,
      objectif: parseFloat(formObjectif),
      date_debut: formDateDebut,
      date_fin: formDateFin,
      statut: formStatut,
      projet: formProjet ? Number(formProjet) : null,
    }

    try {
      if (editingCampagne) {
        await campaignsAPI.update(editingCampagne.id, payload)
        success('Campagne modifiée', `"${formTitre}" a été mise à jour.`)
      } else {
        await campaignsAPI.create(payload)
        success('Campagne créée', `"${formTitre}" a été publiée.`)
      }
      setIsModalOpen(false)
      await loadData()
    } catch {
      toastError('Erreur', 'Impossible d\'enregistrer la campagne.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous supprimer définitivement cette campagne ?')) return
    try {
      await campaignsAPI.delete(id)
      success('Campagne supprimée')
      setCampaigns((prev) => prev.filter((c) => c.id !== id))
    } catch {
      toastError('Erreur', 'Impossible de supprimer cette campagne.')
    }
  }

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.titre.toLowerCase().includes(search.toLowerCase()) || (c.projet_titre || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.statut === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
              <Heart className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Campagnes de Collecte & Financement</h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Gestion des appels aux dons, objectifs financiers et progression des collectes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData()}
            className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => exportToCSV('campagnes_robomed', filtered)}
            className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" /> Exporter CSV
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Nouvelle Campagne
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre de campagne ou projet..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'active', 'a_venir', 'terminee'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {st === 'all' ? 'Toutes' : st === 'active' ? 'Actives' : st === 'a_venir' ? 'À venir' : 'Terminées'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-gray-400">
            <Loader2 className="w-7 h-7 animate-spin mx-auto mb-2 text-emerald-600" />
            Chargement des campagnes...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            Aucune campagne ne correspond aux critères.
          </div>
        ) : (
          filtered.map((c) => {
            const pct = c.taux_completion ?? (c.objectif ? Math.min(100, Math.round((Number(c.collecte) / Number(c.objectif)) * 100)) : 0)
            const badge = statusBadge[c.statut] || statusBadge.active
            return (
              <div
                key={c.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{c.titre}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 mb-4">
                    {c.description || 'Aucune description renseignée.'}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {Number(c.collecte).toLocaleString()} € / FCFA
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        sur {Number(c.objectif).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                      <span>{pct}% collectés</span>
                      <span>{c.nb_dons ?? 0} dons</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {c.date_debut}
                  </span>
                  <span className="truncate max-w-[140px] text-right font-medium text-gray-600 dark:text-gray-300">
                    {c.projet_titre ? `Projet : ${c.projet_titre}` : 'Fonds général'}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal Campagne */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg border border-gray-100 dark:border-gray-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-600" />
                {editingCampagne ? 'Modifier la Campagne' : 'Créer une Campagne de Levée de Fonds'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Titre de la Campagne *
                </label>
                <input
                  type="text"
                  value={formTitre}
                  onChange={(e) => setFormTitre(e.target.value)}
                  placeholder="Ex: Forage du Puits de Mandélia"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Projet Humanitaire Associé
                </label>
                <select
                  value={formProjet}
                  onChange={(e) => setFormProjet(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white"
                >
                  <option value="">Aucun (Fonds général de solidarité)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.titre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Objectif Financier *
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={formObjectif}
                    onChange={(e) => setFormObjectif(e.target.value)}
                    placeholder="Ex: 10000"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Statut
                  </label>
                  <select
                    value={formStatut}
                    onChange={(e) => setFormStatut(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white font-semibold"
                  >
                    <option value="active">Active (En cours)</option>
                    <option value="a_venir">À venir (Planifiée)</option>
                    <option value="terminee">Terminée</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Date Début
                  </label>
                  <input
                    type="date"
                    value={formDateDebut}
                    onChange={(e) => setFormDateDebut(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Date Fin
                  </label>
                  <input
                    type="date"
                    value={formDateFin}
                    onChange={(e) => setFormDateFin(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description & Impact attendu
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Décrivez à quoi serviront les fonds collectés..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {editingCampagne ? 'Enregistrer les modifications' : 'Créer la Campagne'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
