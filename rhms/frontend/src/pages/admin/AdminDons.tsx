import { useState, useEffect, useCallback } from 'react'
import { Heart, Plus, Search, Filter, Trash2, CheckCircle2, Clock, Download, Loader2, AlertCircle, RefreshCw, FileText } from 'lucide-react'
import { exportToCSV } from '../../utils/exportCsv'
import { useToast } from '../../context/ToastContext'
import { donationsAPI, projectsAPI } from '../../services/api'
import { generateTaxReceiptPDF } from '../../utils/taxReceiptPdf'

interface Donation {
  id: number
  montant: string
  message: string
  date_don: string
  statut: 'en_attente' | 'confirme' | 'annule'
  reference: string
  donateur?: number | null
  campagne?: number | null
  // Extra fields for display (entered manually)
  donor_name?: string
  method?: string
  currency?: string
  project_name?: string
}

const statutLabels: Record<string, string> = {
  confirme: 'Confirmé',
  en_attente: 'En attente',
  annule: 'Annulé',
}

function generateRef() {
  return `DON-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}

export default function AdminDons() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { success, error: toastError } = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('Tous')

  // Form state
  const [formDonor, setFormDonor] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formCurrency, setFormCurrency] = useState('FCFA')
  const [formProject, setFormProject] = useState('__custom__')
  const [formCustomProject, setFormCustomProject] = useState('')
  const [formMethod, setFormMethod] = useState('Espèces / Ventes solidaires')
  const [formMessage, setFormMessage] = useState('')

  // Projects for dropdown
  const [projects, setProjects] = useState<{ id: number; titre: string }[]>([])

  const fetchDonations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await donationsAPI.getAll()
      if (data) {
        setDonations(Array.isArray(data) ? data : (data.results || []))
      } else {
        setError('Impossible de charger les dons. Vérifiez que le serveur backend est démarré.')
      }
    } catch {
      setError('Impossible de charger les dons. Vérifiez que le serveur backend est démarré.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDonations()
    projectsAPI.getAll()
      .then(d => {
        if (d) {
          const list = Array.isArray(d) ? d : (d.results || [])
          setProjects(list)
        }
      })
      .catch(() => {})
  }, [fetchDonations])

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formDonor || !formAmount) return
    setSaving(true)

    // Resolve project name: from dropdown, fonds général, or custom input
    const resolvedProject = formProject === '__custom__'
      ? formCustomProject || 'Fonds général RoBomed'
      : formProject === '__fonds__'
      ? 'Fonds général RoBomed'
      : formProject || 'Fonds général RoBomed'

    const payload = {
      montant: parseFloat(formAmount),
      message: formMessage || `Don de ${formDonor} — ${resolvedProject} (${formCurrency})`,
      statut: 'confirme',
      reference: generateRef(),
    }

    try {
      await donationsAPI.create(payload)
      await fetchDonations()
      setIsModalOpen(false)
      setFormDonor(''); setFormAmount(''); setFormMessage('')
      setFormProject('__custom__'); setFormCustomProject('')
      success('Don enregistré', `Réf. ${payload.reference}`)
    } catch {
      toastError('Erreur', 'Impossible d\'enregistrer le don. Vérifiez la connexion.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous supprimer définitivement cet enregistrement de don ?')) return
    try {
      await donationsAPI.delete(id)
      setDonations(prev => prev.filter(d => d.id !== id))
      success('Don supprimé')
    } catch {
      toastError('Erreur', 'Impossible de supprimer ce don.')
    }
  }

  const toggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'confirme' ? 'en_attente' : 'confirme'
    try {
      await donationsAPI.update(id, { statut: nextStatus })
      setDonations(prev =>
        prev.map(d => d.id === id ? { ...d, statut: nextStatus as Donation['statut'] } : d)
      )
    } catch { /* ignore */ }
  }

  const filtered = donations.filter(d => {
    const q = search.toLowerCase()
    const matchSearch = !q || d.reference.toLowerCase().includes(q) || d.message.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'Tous' || d.statut === statusFilter
    return matchSearch && matchStatus
  })

  const totalConfirme = donations
    .filter(d => d.statut === 'confirme')
    .reduce((sum, d) => sum + parseFloat(d.montant || '0'), 0)

  const exportData = filtered.map(d => ({
    reference: d.reference,
    montant: d.montant,
    statut: statutLabels[d.statut] || d.statut,
    date: d.date_don ? new Date(d.date_don).toLocaleDateString('fr-FR') : '',
    message: d.message,
  }))

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Gestion des Dons & Collectes</h2>
          <p className="text-gray-400 text-xs mt-0.5">Suivi financier des contributions et financements solidaires</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={fetchDonations}
            disabled={loading}
            className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-slate-50 transition-all"
            title="Actualiser"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => exportToCSV('RoBomed_Dons', exportData, [
              { key: 'reference', label: 'Référence' },
              { key: 'montant', label: 'Montant' },
              { key: 'statut', label: 'Statut' },
              { key: 'date', label: 'Date' },
              { key: 'message', label: 'Notes' },
            ])}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-gray-500" /> Exporter CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Enregistrer un don
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <p className="font-medium">{error}</p>
          <button onClick={fetchDonations} className="ml-auto text-red-500 font-bold underline">Réessayer</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium">Total collecté (confirmé)</p>
            <h3 className="text-2xl font-extrabold text-gray-900">
              {loading ? '...' : totalConfirme.toLocaleString('fr-FR')}
            </h3>
            <p className="text-emerald-600 text-[10px] font-semibold mt-0.5">Dons validés</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">👥</div>
          <div>
            <p className="text-gray-400 text-xs font-medium">Nombre de contributions</p>
            <h3 className="text-2xl font-extrabold text-gray-900">{loading ? '...' : donations.length}</h3>
            <p className="text-blue-600 text-[10px] font-semibold mt-0.5">Donateurs & ventes</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">⏳</div>
          <div>
            <p className="text-gray-400 text-xs font-medium">En attente de validation</p>
            <h3 className="text-2xl font-extrabold text-gray-900">
              {loading ? '...' : donations.filter(d => d.statut === 'en_attente').length}
            </h3>
            <p className="text-amber-600 text-[10px] font-semibold mt-0.5">À valider</p>
          </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par référence ou notes..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Statut:</span>
          {[
            { key: 'Tous', label: 'Tous' },
            { key: 'confirme', label: 'Confirmé' },
            { key: 'en_attente', label: 'En attente' },
            { key: 'annule', label: 'Annulé' },
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          <span className="ml-3 text-gray-400 text-sm">Chargement des dons...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="text-5xl mb-4">💰</div>
          <h3 className="text-gray-900 font-bold text-base mb-1">Aucun don enregistré</h3>
          <p className="text-gray-400 text-xs max-w-xs mx-auto mb-5">
            Enregistrez votre premier don ou vente solidaire pour commencer le suivi financier.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Enregistrer le premier don
          </button>
        </div>
      )}

      {/* Donations list — cards mobile / table desktop */}
      {!loading && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* ── Mobile cards (< md) ── */}
          <div className="divide-y divide-gray-50 md:hidden">
            {filtered.map(d => (
              <div key={d.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono text-gray-400">{d.reference}</p>
                    <p className="text-xl font-extrabold text-gray-900">
                      {parseFloat(d.montant).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleStatus(d.id, d.statut)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${
                      d.statut === 'confirme'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : d.statut === 'annule'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {d.statut === 'confirme' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {statutLabels[d.statut] || d.statut}
                  </button>
                </div>
                {d.message && <p className="text-[10px] text-gray-500 truncate">{d.message}</p>}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-gray-400 font-mono">
                    {d.date_don ? new Date(d.date_don).toLocaleDateString('fr-FR') : '—'}
                  </span>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop table (≥ md) ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-gray-100">
                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Référence</th>
                  <th className="px-5 py-3.5">Montant</th>
                  <th className="px-5 py-3.5">Notes / Message</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Statut</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filtered.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900 font-mono text-[11px]">{d.reference}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-extrabold text-gray-900 text-sm">
                        {parseFloat(d.montant).toLocaleString('fr-FR')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 max-w-xs truncate">{d.message || '—'}</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-[11px]">
                      {d.date_don ? new Date(d.date_don).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleStatus(d.id, d.statut)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          d.statut === 'confirme'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : d.statut === 'annule'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {d.statut === 'confirme' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {statutLabels[d.statut] || d.statut}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => generateTaxReceiptPDF({
                            reference: d.reference,
                            donorName: d.donor_name || 'Donateur Solidaire',
                            donorEmail: 'donateur@robomed.org',
                            amount: parseFloat(d.montant),
                            currency: d.currency || 'FCFA',
                            project: d.project_name || 'Fonds humanitaire général',
                            date: d.date_don,
                          })}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Générer le reçu fiscal officiel"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Modal: Enregistrer un don */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">💰 Enregistrer un don</h3>
            <p className="text-gray-400 text-xs mb-5">Ajoutez manuellement un financement, une vente solidaire ou une contribution.</p>

            <form onSubmit={handleAddDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nom du donateur / Source *</label>
                <input
                  type="text"
                  required
                  value={formDonor}
                  onChange={e => setFormDonor(e.target.value)}
                  placeholder="Ex: Vente de gâteaux, Marie Dupont, Anonyme..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Montant *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formAmount}
                    onChange={e => setFormAmount(e.target.value)}
                    placeholder="Ex: 5000"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Devise</label>
                  <select
                    value={formCurrency}
                    onChange={e => setFormCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                  >
                    <option value="FCFA">FCFA</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Projet attribué
                  {projects.length > 0 && (
                    <span className="text-gray-400 font-normal ml-1">({projects.length} projet(s) disponible(s))</span>
                  )}
                </label>

                {/* Dropdown of existing projects */}
                <select
                  value={formProject}
                  onChange={e => {
                    setFormProject(e.target.value)
                    if (e.target.value !== '__custom__') setFormCustomProject('')
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                >
                  {projects.length === 0 ? (
                    <option value="__custom__">Aucun projet enregistré — Saisir manuellement</option>
                  ) : (
                    <>
                      <option value="" disabled>— Sélectionner un projet —</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.titre}>{p.titre}</option>
                      ))}
                      <option value="__fonds__">Fonds général RoBomed</option>
                      <option value="__custom__">✏️ Autre (saisir manuellement)…</option>
                    </>
                  )}
                </select>

                {/* Custom input shown only when "Autre" is selected */}
                {formProject === '__custom__' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formCustomProject}
                      onChange={e => setFormCustomProject(e.target.value)}
                      placeholder="Ex: Ventes de gâteaux, Aide médicale Tchad..."
                      autoFocus
                      className="w-full px-3.5 py-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
                    />
                    <p className="text-[10px] text-amber-600 mt-1 font-medium">
                      💡 Ce projet sera noté dans le message du don. Pour l'ajouter officiellement, créez-le dans la section Projets.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mode de collecte</label>
                <select
                  value={formMethod}
                  onChange={e => setFormMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                >
                  <option value="Espèces / Ventes solidaires">Espèces / Ventes solidaires</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="Virement bancaire">Virement bancaire</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Note / Commentaire</label>
                <textarea
                  rows={2}
                  value={formMessage}
                  onChange={e => setFormMessage(e.target.value)}
                  placeholder="Contexte supplémentaire sur ce don..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 resize-none transition-all"
                />
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
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
