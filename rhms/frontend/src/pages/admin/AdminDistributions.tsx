import React, { useState, useEffect, useCallback } from 'react'
import {
  Truck, Plus, Search, Filter, Trash2, Download,
  RefreshCw, Loader2, AlertCircle, CheckCircle2,
  MapPin, Package, UserCheck, Calendar
} from 'lucide-react'
import { exportToCSV } from '../../utils/exportCsv'
import { distributionsAPI, stocksAPI, beneficiariesAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

interface DistributionRecord {
  id: number
  produit: number
  produit_nom?: string
  beneficiaire: number
  beneficiaire_nom?: string
  quantite: number | string
  lieu: string
  notes?: string
  date_distribution?: string
}

export default function AdminDistributions() {
  const [distributions, setDistributions] = useState<DistributionRecord[]>([])
  const [stocks, setStocks] = useState<any[]>([])
  const [beneficiaries, setBeneficiaries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const { success, error: toastError } = useToast()

  // Form
  const [selectedProduit, setSelectedProduit] = useState<number | ''>('')
  const [selectedBeneficiaire, setSelectedBeneficiaire] = useState<number | ''>('')
  const [quantite, setQuantite] = useState('')
  const [lieu, setLieu] = useState("N'Djamena (Tchad)")
  const [notes, setNotes] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [distRes, stockRes, benRes] = await Promise.all([
        distributionsAPI.getAll(),
        stocksAPI.getAll(),
        beneficiariesAPI.getAll(),
      ])

      if (distRes) {
        setDistributions(Array.isArray(distRes) ? distRes : (distRes.results || []))
      }
      if (stockRes) {
        setStocks(Array.isArray(stockRes) ? stockRes : (stockRes.results || []))
      }
      if (benRes) {
        setBeneficiaries(Array.isArray(benRes) ? benRes : (benRes.results || []))
      }
    } catch {
      toastError('Erreur de chargement', 'Vérifiez la connexion avec le serveur.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const selectedStockItem = stocks.find((s) => s.id === Number(selectedProduit) || s.produit === Number(selectedProduit))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduit || !selectedBeneficiaire || !quantite) {
      toastError('Champs requis', 'Veuillez sélectionner un article, un bénéficiaire et une quantité.')
      return
    }

    const qty = parseFloat(quantite)
    if (isNaN(qty) || qty <= 0) {
      toastError('Quantité invalide', 'La quantité doit être supérieure à zéro.')
      return
    }

    if (selectedStockItem && qty > parseFloat(selectedStockItem.quantite)) {
      toastError('Stock insuffisant', `Seulement ${selectedStockItem.quantite} disponibles en réserve.`)
      return
    }

    setSaving(true)
    try {
      await distributionsAPI.create({
        produit: Number(selectedProduit),
        beneficiaire: Number(selectedBeneficiaire),
        quantite: qty,
        lieu,
        notes,
      })
      success('Distribution enregistrée', 'Le stock a été déduit automatiquement avec succès.')
      setIsModalOpen(false)
      setSelectedProduit('')
      setSelectedBeneficiaire('')
      setQuantite('')
      setNotes('')
      await loadData()
    } catch (err: any) {
      const msg = err.response?.data?.quantite?.[0] || 'Erreur lors de la distribution.'
      toastError('Erreur', msg)
    } finally {
      setSaving(false)
    }
  }

  const filtered = distributions.filter((d) => {
    const term = search.toLowerCase()
    const pName = (d.produit_nom || '').toLowerCase()
    const bName = (d.beneficiaire_nom || '').toLowerCase()
    const lName = (d.lieu || '').toLowerCase()
    return pName.includes(term) || bName.includes(term) || lName.includes(term)
  })

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette distribution ? La quantité sera automatiquement réintégrée dans le stock.')) {
      return
    }
    try {
      await distributionsAPI.delete(id)
      success('Distribution supprimée', 'La distribution a été retirée et le stock réajusté.')
      await loadData()
    } catch {
      toastError('Erreur', 'Impossible de supprimer cette distribution.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
              <Truck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Distributions & Logistique Terrain</h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enregistrement des dotations aux bénéficiaires et déduction instantanée des stocks.
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
            onClick={() => exportToCSV('distributions_robomed', filtered)}
            className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" /> Exporter CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Nouvelle Distribution
          </button>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par produit, bénéficiaire ou lieu..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {filtered.length} distribution(s) trouvée(s)
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Produit Distribué</th>
                <th className="py-3.5 px-4">Quantité</th>
                <th className="py-3.5 px-4">Bénéficiaire</th>
                <th className="py-3.5 px-4">Lieu</th>
                <th className="py-3.5 px-4">Notes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Chargement des distributions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Aucune distribution trouvée. Cliquez sur « Nouvelle Distribution » pour en enregistrer une.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                      {d.date_distribution ? d.date_distribution.split('T')[0] : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-600" />
                      {d.produit_nom || `Produit #${d.produit}`}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                      {d.quantite}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {d.beneficiaire_nom || `Bénéficiaire #${d.beneficiaire}`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {d.lieu || 'Non renseigné'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 italic max-w-xs truncate">
                      {d.notes || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                        title="Supprimer cette distribution"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouvelle Distribution */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg border border-gray-100 dark:border-gray-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                Enregistrer une Distribution Terrain
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Produit en Réserve *
                </label>
                <select
                  value={selectedProduit}
                  onChange={(e) => setSelectedProduit(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Sélectionner un produit...</option>
                  {stocks.map((s) => (
                    <option key={s.id} value={s.produit || s.id}>
                      {s.produit_nom || s.nom} — Disponible : {s.quantite} {s.unite_mesure || s.unite || 'unités'}
                    </option>
                  ))}
                </select>
                {selectedStockItem && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    ✓ Stock actuel disponible : {selectedStockItem.quantite} {selectedStockItem.unite_mesure || 'unités'}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Bénéficiaire *
                </label>
                <select
                  value={selectedBeneficiaire}
                  onChange={(e) => setSelectedBeneficiaire(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Sélectionner un bénéficiaire...</option>
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.prenom} {b.nom} ({b.type_aide || 'Bénéficiaire'}) — {b.telephone || b.adresse}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Quantité Distribuée *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={quantite}
                    onChange={(e) => setQuantite(e.target.value)}
                    placeholder="Ex: 5"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Lieu de Distribution
                  </label>
                  <input
                    type="text"
                    value={lieu}
                    onChange={(e) => setLieu(e.target.value)}
                    placeholder="Ex: N'Djamena Centre"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Observations / Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Remise de kits en main propre, signature de fiche..."
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
                  Valider la distribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
