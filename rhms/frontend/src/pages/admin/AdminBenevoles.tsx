import React, { useState, useEffect, useCallback } from 'react'
import {
  Users, CheckCircle2, XCircle, Search, Filter,
  Trash2, Mail, Phone, Download, RefreshCw,
  Loader2, AlertCircle, Award, Calendar, Clock
} from 'lucide-react'
import { exportToCSV } from '../../utils/exportCsv'
import { volunteersAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

interface BenevoleItem {
  id: number
  nom: string
  email: string
  telephone: string
  username: string
  competences: string
  disponibilites: string
  date_inscription: string
  statut: boolean
}

export default function AdminBenevoles() {
  const [volunteers, setVolunteers] = useState<BenevoleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const { success, error: toastError } = useToast()

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await volunteersAPI.getAll()
      if (res) {
        setVolunteers(Array.isArray(res) ? res : (res.results || []))
      }
    } catch {
      toastError('Erreur', 'Impossible de charger les bénévoles.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleApprove = async (id: number, name: string) => {
    setActionLoading(id)
    try {
      await volunteersAPI.approve(id)
      success('Bénévole approuvé', `${name} peut désormais accéder aux missions et à la plateforme.`)
      setVolunteers((prev) => prev.map((v) => (v.id === id ? { ...v, statut: true } : v)))
    } catch {
      toastError('Erreur', 'Échec de l\'approbation.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: number, name: string) => {
    setActionLoading(id)
    try {
      await volunteersAPI.reject(id)
      success('Statut mis à jour', `Le dossier de ${name} a été suspendu ou refusé.`)
      setVolunteers((prev) => prev.map((v) => (v.id === id ? { ...v, statut: false } : v)))
    } catch {
      toastError('Erreur', 'Échec de l\'action.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous supprimer définitivement ce dossier de bénévole ?')) return
    try {
      await volunteersAPI.delete(id)
      success('Dossier supprimé')
      setVolunteers((prev) => prev.filter((v) => v.id !== id))
    } catch {
      toastError('Erreur', 'Impossible de supprimer ce dossier.')
    }
  }

  const filtered = volunteers.filter((v) => {
    const term = search.toLowerCase()
    const matchSearch =
      (v.nom || '').toLowerCase().includes(term) ||
      (v.email || '').toLowerCase().includes(term) ||
      (v.competences || '').toLowerCase().includes(term) ||
      (v.telephone || '').toLowerCase().includes(term)

    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'approved' && v.statut) ||
      (statusFilter === 'pending' && !v.statut)

    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Candidatures & Bénévoles Terrain</h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Examen des profils, validation des candidatures et gestion des compétences.
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
            onClick={() => exportToCSV('benevoles_robomed', filtered)}
            className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" /> Exporter CSV
          </button>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, téléphone ou compétence..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'pending', label: 'En attente' },
            { id: 'approved', label: 'Approuvés' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === st.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Bénévole / Candidat</th>
                <th className="py-3.5 px-4">Coordonnées</th>
                <th className="py-3.5 px-4">Compétences & Expérience</th>
                <th className="py-3.5 px-4">Disponibilités</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Chargement des dossiers de bénévoles...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Aucune candidature trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                          {v.nom ? v.nom.charAt(0).toUpperCase() : 'B'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{v.nom}</div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            Inscrit le {v.date_inscription ? v.date_inscription.split('T')[0] : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      {v.email && (
                        <a
                          href={`mailto:${v.email}`}
                          className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <Mail className="w-3 h-3" /> {v.email}
                        </a>
                      )}
                      {v.telephone && (
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                          <Phone className="w-3 h-3" /> {v.telephone}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-gray-800 dark:text-gray-200">
                        {v.competences || 'Non spécifié'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">
                      {v.disponibilites || 'Flexible'}
                    </td>
                    <td className="py-3.5 px-4">
                      {v.statut ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Approuvé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400">
                          <Clock className="w-3 h-3" /> En attente
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!v.statut ? (
                          <button
                            onClick={() => handleApprove(v.id, v.nom)}
                            disabled={actionLoading === v.id}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-sm transition disabled:opacity-50"
                            title="Approuver la candidature"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Valider
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReject(v.id, v.nom)}
                            disabled={actionLoading === v.id}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg flex items-center gap-1 transition disabled:opacity-50"
                            title="Suspendre ou refuser"
                          >
                            <XCircle className="w-3 h-3" /> Suspendre
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                          title="Supprimer le dossier"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
