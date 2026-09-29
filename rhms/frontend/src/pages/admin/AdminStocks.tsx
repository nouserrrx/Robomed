import { useState, useEffect } from 'react'
import { Package, Plus, Search, Filter, AlertTriangle, CheckCircle, Trash2, Download, RefreshCw, Loader2, PenLine } from 'lucide-react'
import { exportToCSV } from '../../utils/exportCsv'
import { stocksAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

interface StockItem {
  id: number
  nom: string
  categorie: string
  quantite: number
  unite: string
  seuilAlerte: number
  location: string
  dateMiseAJour: string
}


// Pas de données hardcodées — tout vient de l'API


export default function AdminStocks() {
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const { success, error: toastError } = useToast()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('Tous')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStock, setEditingStock] = useState<StockItem | null>(null)

  // Form state
  const [formNom, setFormNom] = useState('')
  const [formCategorie, setFormCategorie] = useState('Éducation')
  const [formQuantite, setFormQuantite] = useState('')
  const [formUnite, setFormUnite] = useState('unités')
  const [formSeuil, setFormSeuil] = useState('50')
  const [formLocation, setFormLocation] = useState('🇹🇩 N\'Djamena (Tchad)')

  const fetchStocks = async () => {
    setLoading(true)
    try {
      const data = await stocksAPI.getAll()
      if (Array.isArray(data)) {
        const formatted: StockItem[] = data.map((item: any) => ({
          id: item.id,
          nom: item.produit_nom || item.nom || 'Article sans nom',
          categorie: item.categorie || 'Humanitaire',
          quantite: parseFloat(item.quantite || 0),
          unite: item.unite_mesure || 'unités',
          seuilAlerte: parseFloat(item.seuil_alerte || 10),
          location: item.location || '🇹🇩 N\'Djamena (Tchad)',
          dateMiseAJour: item.date_mise_a_jour ? item.date_mise_a_jour.split('T')[0] : new Date().toISOString().split('T')[0],
        }))
        setStocks(formatted)
      }
    } catch (err) {
      toastError('Chargement impossible', 'Vérifiez que le serveur backend est démarré.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStocks()
  }, [])

  const openCreateModal = () => {
    setEditingStock(null)
    setFormNom('')
    setFormCategorie('Éducation')
    setFormQuantite('')
    setFormUnite('unités')
    setFormSeuil('50')
    setFormLocation("🇹🇩 N'Djamena (Tchad)")
    setIsModalOpen(true)
  }

  const openEditModal = (item: StockItem) => {
    setEditingStock(item)
    setFormNom(item.nom)
    setFormCategorie(item.categorie || 'Éducation')
    setFormQuantite(String(item.quantite))
    setFormUnite(item.unite || 'unités')
    setFormSeuil(String(item.seuilAlerte))
    setFormLocation(item.location || "🇹🇩 N'Djamena (Tchad)")
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formNom || !formQuantite) return

    try {
      if (editingStock) {
        await stocksAPI.update(editingStock.id, {
          nom: formNom,
          categorie: formCategorie,
          quantite: parseFloat(formQuantite),
          unite: formUnite,
          seuil_alerte: parseFloat(formSeuil),
          location: formLocation,
        })
        success('Stock mis à jour', `${formNom} a été modifié avec succès.`)
      } else {
        await stocksAPI.create({
          nom: formNom,
          categorie: formCategorie,
          quantite: parseFloat(formQuantite),
          unite: formUnite,
          seuil_alerte: parseFloat(formSeuil),
          location: formLocation,
        })
        success('Stock ajouté', `${formNom} a été ajouté à l'inventaire.`)
      }
      await fetchStocks()
    } catch {
      toastError('Erreur', "Impossible d'enregistrer le stock. Vérifiez le serveur.")
    }

    setIsModalOpen(false)
    setEditingStock(null)
    setFormNom('')
    setFormQuantite('')
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous supprimer cet article du stock ?')) return
    try {
      await stocksAPI.delete(id)
      setStocks(stocks.filter(s => s.id !== id))
      success('Article supprimé')
    } catch {
      toastError('Erreur', 'Impossible de supprimer cet article.')
    }
  }

  const adjustQty = async (id: number, delta: number) => {
    const updated = stocks.map(s => {
      if (s.id === id) {
        const newQ = Math.max(0, s.quantite + delta)
        return { ...s, quantite: newQ, dateMiseAJour: new Date().toISOString().split('T')[0] }
      }
      return s
    })
    setStocks(updated)
    
    const targetItem = updated.find(s => s.id === id)
    if (targetItem) {
      try {
        await stocksAPI.update(id, { quantite: targetItem.quantite })
      } catch (err) {
        console.warn('Mise à jour serveur non exécutée:', err)
      }
    }
  }

  const filtered = stocks.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.nom.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
    const matchCat = catFilter === 'Tous' || s.categorie === catFilter
    return matchSearch && matchCat
  })

  const lowStockCount = stocks.filter(s => s.quantite <= s.seuilAlerte).length

  return (
    <div className="space-y-6">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Stocks & Logistique Terrain</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Suivi des fournitures, matériel médical et dons en nature (Tchad & Canada)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV('RoBomed_Inventaire_Stocks', stocks, [
              { key: 'nom', label: 'Nom Article' },
              { key: 'categorie', label: 'Catégorie' },
              { key: 'quantite', label: 'Quantité' },
              { key: 'unite', label: 'Unité' },
              { key: 'location', label: 'Entrepôt' },
              { key: 'seuilAlerte', label: 'Seuil Alerte' },
              { key: 'dateMiseAJour', label: 'Dernière Mise à Jour' },
            ])}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-gray-500" /> Exporter en CSV
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Ajouter au stock
          </button>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium">Total Références</p>
            <h3 className="text-2xl font-bold text-gray-900">{stocks.length} articles</h3>
            <p className="text-emerald-600 text-[10px] font-semibold mt-0.5">En inventaire</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'} flex items-center justify-center font-bold text-xl shrink-0`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium">Alerte Réapprovisionnement</p>
            <h3 className="text-2xl font-bold text-gray-900">{lowStockCount} article(s)</h3>
            <p className={`${lowStockCount > 0 ? 'text-amber-600' : 'text-blue-600'} text-[10px] font-semibold mt-0.5`}>
              {lowStockCount > 0 ? 'Stock sous le seuil d\'alerte' : 'Stock optimal'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl shrink-0">
            📍
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium">Entrepôts & Dépôts</p>
            <h3 className="text-2xl font-bold text-gray-900">2 Centres</h3>
            <p className="text-purple-600 text-[10px] font-semibold mt-0.5">N'Djamena & Montréal</p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par article ou entrepôt..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Catégorie:</span>
          {['Tous', 'Éducation', 'Hydratation', 'Oncologie', 'Soins Palliatifs'].map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                catFilter === cat
                  ? 'bg-[#0B2447] text-white border-[#0B2447]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">Article</th>
                <th className="px-5 py-3.5">Catégorie</th>
                <th className="px-5 py-3.5">Quantité disponible</th>
                <th className="px-5 py-3.5">Entrepôt / Dépôt</th>
                <th className="px-5 py-3.5">Mise à jour</th>
                <th className="px-5 py-3.5">État</th>
                <th className="px-5 py-3.5 text-right">Ajuster Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filtered.map(s => {
                const isLow = s.quantite <= s.seuilAlerte
                return (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-900">
                      {s.nom}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {s.categorie}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900 text-sm">
                      {s.quantite} <span className="text-gray-400 text-xs font-normal">{s.unite}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {s.location}
                    </td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-[11px]">
                      {s.dateMiseAJour}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        isLow ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {isLow ? <AlertTriangle className="w-3 h-3 text-amber-600" /> : <CheckCircle className="w-3 h-3 text-emerald-600" />}
                        {isLow ? 'Alerte stock bas' : 'En stock'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-1">
                      <button
                        onClick={() => adjustQty(s.id, 10)}
                        className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-0.5"
                        title="Ajouter 10"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => adjustQty(s.id, -10)}
                        className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-0.5"
                        title="Retirer 10"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 text-gray-400 hover:text-secondary hover:bg-slate-50 rounded-lg transition-colors inline-block ml-1"
                        title="Modifier cet article"
                      >
                        <PenLine className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block ml-1"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Stock */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {editingStock ? "Modifier l'article en stock" : "Ajouter un article en stock"}
            </h3>
            <p className="text-gray-400 text-xs mb-5">
              {editingStock ? "Mise à jour des informations de l'article." : "Nouveau lot ou matériel humanitaire répertorié."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom de l'article</label>
                <input
                  type="text"
                  required
                  value={formNom}
                  onChange={e => setFormNom(e.target.value)}
                  placeholder="Ex: Kits solaires, Cahiers, Friandises..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={formCategorie}
                    onChange={e => setFormCategorie(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                  >
                    <option value="Éducation">Éducation</option>
                    <option value="Hydratation">Hydratation</option>
                    <option value="Oncologie">Oncologie</option>
                    <option value="Soins Palliatifs">Soins Palliatifs</option>
                    <option value="Médical">Médical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Entrepôt / Dépôt</label>
                  <select
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                  >
                    <option value="🇹🇩 N'Djamena (Tchad)">🇹🇩 N'Djamena (Tchad)</option>
                    <option value="🇨🇦 Montréal (Canada)">🇨🇦 Montréal (Canada)</option>
                    <option value="🇨🇦 Québec (Canada)">🇨🇦 Québec (Canada)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Quantité</label>
                  <input
                    type="number"
                    required
                    value={formQuantite}
                    onChange={e => setFormQuantite(e.target.value)}
                    placeholder="100"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Unité</label>
                  <input
                    type="text"
                    value={formUnite}
                    onChange={e => setFormUnite(e.target.value)}
                    placeholder="kits, unités..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Seuil d'alerte (stock bas)</label>
                <input
                  type="number"
                  value={formSeuil}
                  onChange={e => setFormSeuil(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
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
                  className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  {editingStock ? 'Enregistrer les modifications' : 'Ajouter au stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
