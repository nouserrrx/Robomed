import { useState, useEffect, useCallback } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  HeartHandshake, 
  Download, 
  RefreshCw, 
  Loader2, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  XCircle,
  GraduationCap,
  Heart,
  Home,
  Utensils
} from 'lucide-react'
import { exportToCSV } from '../../utils/exportCsv'
import { beneficiariesAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

interface Beneficiaire {
  id: number
  nom: string
  prenom: string
  email?: string
  telephone: string
  adresse: string
  type_aide: 'alimentaire' | 'medicale' | 'educative' | 'logement' | 'autre'
  date_enregistrement: string
  statut: boolean
  photo?: string | null
}

const typeAideConfig: Record<string, { label: string; color: string; icon: any }> = {
  alimentaire: { label: 'Alimentaire', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Utensils },
  medicale:    { label: 'Médicale',    color: 'bg-rose-50 text-rose-700 border-rose-200', icon: Heart },
  educative:   { label: 'Éducative',   color: 'bg-blue-50 text-blue-700 border-blue-200', icon: GraduationCap },
  logement:    { label: 'Logement',    color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Home },
  autre:       { label: 'Autre aide',  color: 'bg-gray-50 text-gray-700 border-gray-200', icon: HeartHandshake },
}

export default function AdminBeneficiaires() {
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('Tous')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBen, setEditingBen] = useState<Beneficiaire | null>(null)
  const [saving, setSaving] = useState(false)
  const { success, error: toastError } = useToast()

  // Form states
  const [formNom, setFormNom] = useState('')
  const [formPrenom, setFormPrenom] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formTelephone, setFormTelephone] = useState('')
  const [formAdresse, setFormAdresse] = useState('')
  const [formTypeAide, setFormTypeAide] = useState<Beneficiaire['type_aide']>('alimentaire')
  const [formStatut, setFormStatut] = useState(true)

  const fetchBeneficiaires = useCallback(async () => {
    setLoading(true)
    try {
      const data = await beneficiariesAPI.getAll()
      if (data) {
        const list = Array.isArray(data) ? data : (data.results || [])
        setBeneficiaires(list)
      } else {
        toastError('Chargement impossible', 'Vérifiez la connexion au serveur.')
      }
    } catch {
      toastError('Erreur', 'Impossible de charger la liste des bénéficiaires.')
    } finally {
      setLoading(false)
    }
  }, [toastError])

  useEffect(() => {
    fetchBeneficiaires()
  }, [fetchBeneficiaires])

  const openCreateModal = () => {
    setEditingBen(null)
    setFormNom('')
    setFormPrenom('')
    setFormEmail('')
    setFormTelephone('')
    setFormAdresse('')
    setFormTypeAide('alimentaire')
    setFormStatut(true)
    setIsModalOpen(true)
  }

  const openEditModal = (b: Beneficiaire) => {
    setEditingBen(b)
    setFormNom(b.nom)
    setFormPrenom(b.prenom)
    setFormEmail(b.email || '')
    setFormTelephone(b.telephone)
    setFormAdresse(b.adresse || '')
    setFormTypeAide(b.type_aide)
    setFormStatut(b.statut)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formNom || !formPrenom) {
      toastError('Champs obligatoires', 'Veuillez saisir le nom et le prénom.')
      return
    }

    setSaving(true)
    const payload = {
      nom: formNom.trim(),
      prenom: formPrenom.trim(),
      email: formEmail.trim(),
      telephone: formTelephone.trim(),
      adresse: formAdresse.trim(),
      type_aide: formTypeAide,
      statut: formStatut,
    }

    try {
      if (editingBen) {
        await beneficiariesAPI.update(editingBen.id, payload)
        success('Bénéficiaire mis à jour', `${payload.prenom} ${payload.nom}`)
      } else {
        await beneficiariesAPI.create(payload)
        success('Bénéficiaire enregistré', `${payload.prenom} ${payload.nom}`)
      }
      setIsModalOpen(false)
      await fetchBeneficiaires()
    } catch (err: any) {
      console.error('Erreur sauvegarde bénéficiaire:', err)
      const detail = err?.response?.data
        ? typeof err.response.data === 'string'
          ? err.response.data
          : Object.entries(err.response.data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ')
        : "Impossible d'enregistrer le bénéficiaire."
      toastError('Erreur de sauvegarde', detail)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer définitivement ce bénéficiaire ? Cette action est irréversible.')) return
    try {
      await beneficiariesAPI.delete(id)
      setBeneficiaires(prev => prev.filter(b => b.id !== id))
      success('Bénéficiaire supprimé')
    } catch (err: any) {
      toastError('Erreur', err?.response?.data?.detail || 'Impossible de supprimer ce dossier.')
    }
  }

  const toggleStatut = async (b: Beneficiaire) => {
    try {
      await beneficiariesAPI.update(b.id, { statut: !b.statut })
      setBeneficiaires(prev => prev.map(x => x.id === b.id ? { ...x, statut: !b.statut } : x))
    } catch (err: any) {
      toastError('Erreur', err?.response?.data?.detail || 'Impossible de modifier le statut.')
    }
  }

  const handleExport = () => {
    const data = filtered.map(b => ({
      ID: b.id,
      Prénom: b.prenom,
      Nom: b.nom,
      Téléphone: b.telephone,
      Email: b.email || '',
      Adresse: b.adresse || '',
      'Type d\'aide': typeAideConfig[b.type_aide]?.label || b.type_aide,
      Statut: b.statut ? 'Actif' : 'Clôturé',
      'Date enregistrement': b.date_enregistrement ? b.date_enregistrement.split('T')[0] : '',
    }))
    exportToCSV('beneficiaires-robomed.csv', data)
  }

  const filtered = beneficiaires.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      b.nom.toLowerCase().includes(q) ||
      b.prenom.toLowerCase().includes(q) ||
      b.telephone.toLowerCase().includes(q) ||
      b.adresse?.toLowerCase().includes(q)
    const matchType = typeFilter === 'Tous' || b.type_aide === typeFilter
    return matchSearch && matchType
  })

  const countAlimentaire = beneficiaires.filter(b => b.type_aide === 'alimentaire').length
  const countMedicale = beneficiaires.filter(b => b.type_aide === 'medicale').length
  const countEducative = beneficiaires.filter(b => b.type_aide === 'educative').length

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Gestion des Bénéficiaires</h2>
          <p className="text-xs text-gray-500 mt-0.5">Suivi humanitaire des familles et bénéficiaires pris en charge</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchBeneficiaires}
            className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-xs flex items-center gap-1.5"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-xs font-medium flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter</span>
          </button>
          <button
            onClick={openCreateModal}
            className="px-3.5 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-xs font-medium flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau Bénéficiaire</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{beneficiaires.length}</div>
            <div className="text-[11px] font-medium text-gray-500">Total Enregistrés</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{countAlimentaire}</div>
            <div className="text-[11px] font-medium text-gray-500">Aide Alimentaire</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{countMedicale}</div>
            <div className="text-[11px] font-medium text-gray-500">Soutien Médical</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{countEducative}</div>
            <div className="text-[11px] font-medium text-gray-500">Kits Scolaires / Éduc.</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, téléphone, localisation..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="Tous">Tous les types d'aide</option>
            <option value="alimentaire">Aide alimentaire</option>
            <option value="medicale">Aide médicale</option>
            <option value="educative">Aide éducative</option>
            <option value="logement">Aide au logement</option>
            <option value="autre">Autre aide</option>
          </select>
        </div>
      </div>

      {/* Beneficiaries Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-xs text-gray-500">Chargement des bénéficiaires...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">Aucun bénéficiaire trouvé</p>
            <p className="text-xs text-gray-500 mt-1">Créez une nouvelle fiche ou modifiez vos critères de recherche.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Bénéficiaire</th>
                  <th className="py-3 px-4">Type d'aide</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Localisation</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filtered.map(b => {
                  const cfg = typeAideConfig[b.type_aide] || typeAideConfig.autre
                  const Icon = cfg.icon
                  return (
                    <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                            {b.prenom?.[0]}{b.nom?.[0]}
                          </div>
                          <div>
                            <div>{b.prenom} {b.nom}</div>
                            {b.email && <div className="text-[11px] font-normal text-gray-400">{b.email}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium ${cfg.color}`}>
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="flex items-center gap-1 text-gray-700">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{b.telephone || 'Non renseigné'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="flex items-center gap-1 text-gray-700 max-w-[200px] truncate">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">{b.adresse || 'N\'Djamena / Région'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleStatut(b)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                            b.statut 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}
                        >
                          {b.statut ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Actif
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Clôturé
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(b)}
                            className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                            title="Modifier"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {editingBen ? 'Modifier le Bénéficiaire' : 'Nouveau Bénéficiaire'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formPrenom}
                    onChange={e => setFormPrenom(e.target.value)}
                    placeholder="ex. Mariam"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formNom}
                    onChange={e => setFormNom(e.target.value)}
                    placeholder="ex. Idriss"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Type d'assistance *</label>
                <select
                  value={formTypeAide}
                  onChange={e => setFormTypeAide(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="alimentaire">Aide alimentaire</option>
                  <option value="medicale">Aide médicale</option>
                  <option value="educative">Aide éducative / Scolaire</option>
                  <option value="logement">Aide au logement</option>
                  <option value="autre">Autre aide humanitaire</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Téléphone de contact *</label>
                <input
                  type="text"
                  required
                  value={formTelephone}
                  onChange={e => setFormTelephone(e.target.value)}
                  placeholder="+235 66 00 00 00"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Adresse / Quartier / Ville</label>
                <input
                  type="text"
                  value={formAdresse}
                  onChange={e => setFormAdresse(e.target.value)}
                  placeholder="Quartier Dembe, N'Djamena"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Email (facultatif)</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  placeholder="contact@exemple.org"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-medium bg-primary text-white rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingBen ? 'Enregistrer' : 'Créer le dossier'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
