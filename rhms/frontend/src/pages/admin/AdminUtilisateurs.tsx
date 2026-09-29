import { useState, useEffect, useCallback } from 'react'
import { Users, Plus, Search, Filter, Trash2, Edit3, Shield, ShieldCheck, ShieldX, Loader2, AlertCircle, RefreshCw, UserCheck, UserX, Mail, Phone } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { usersAPI } from '../../services/api'

interface Utilisateur {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: 'visiteur' | 'donateur' | 'benevole' | 'coordinateur' | 'administrateur'
  phone: string
  address: string
  statut: boolean
  is_approved: boolean
  date_creation: string
}

const roleConfig: Record<string, { label: string; color: string; icon: any }> = {
  administrateur: { label: 'Administrateur', color: 'bg-red-50 text-red-700 border-red-200', icon: ShieldCheck },
  coordinateur:   { label: 'Coordinateur',   color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Shield },
  benevole:       { label: 'Bénévole',       color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Users },
  donateur:       { label: 'Donateur',       color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: UserCheck },
  visiteur:       { label: 'Visiteur',       color: 'bg-gray-50 text-gray-600 border-gray-200', icon: UserX },
}

const inputClass = "w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
const selectClass = "w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"

function getInitials(u: Utilisateur) {
  const fn = u.first_name?.[0] || ''
  const ln = u.last_name?.[0] || ''
  return (fn + ln).toUpperCase() || u.username?.[0]?.toUpperCase() || 'U'
}

const avatarColors = [
  'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-teal-500',
]

const DEFAULT_INITIAL_USERS: Utilisateur[] = []

export default function AdminUtilisateurs() {
  const [users, setUsers] = useState<Utilisateur[]>(DEFAULT_INITIAL_USERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { success, error: toastError } = useToast()

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Tous')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Utilisateur | null>(null)

  // Form
  const [formUsername, setFormUsername] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formFirstName, setFormFirstName] = useState('')
  const [formLastName, setFormLastName] = useState('')
  const [formRole, setFormRole] = useState<Utilisateur['role']>('visiteur')
  const [formPhone, setFormPhone] = useState('')
  const [formAddress, setFormAddress] = useState('')
  const [formPassword, setFormPassword] = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await usersAPI.getAll()
      if (data) {
        const fetched = Array.isArray(data) ? data : (data.results || [])
        setUsers(fetched)
      } else {
        setError('Impossible de charger les utilisateurs.')
      }
    } catch {
      setError('Erreur de connexion au serveur.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const openCreateModal = () => {
    setEditingUser(null)
    setFormUsername(''); setFormEmail(''); setFormFirstName(''); setFormLastName('')
    setFormRole('visiteur'); setFormPhone(''); setFormAddress(''); setFormPassword('')
    setIsModalOpen(true)
  }

  const openEditModal = (u: Utilisateur) => {
    setEditingUser(u)
    setFormUsername(u.username); setFormEmail(u.email)
    setFormFirstName(u.first_name); setFormLastName(u.last_name)
    setFormRole(u.role); setFormPhone(u.phone || ''); setFormAddress(u.address || '')
    setFormPassword('')
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload: any = {
      username: formUsername,
      email: formEmail,
      first_name: formFirstName,
      last_name: formLastName,
      role: formRole,
      phone: formPhone,
      address: formAddress,
    }
    if (formPassword) payload.password = formPassword

    try {
      if (editingUser) {
        await usersAPI.update(editingUser.id, payload)
      } else {
        await usersAPI.create(payload)
      }
      await fetchUsers()
      setIsModalOpen(false)
      success(editingUser ? 'Utilisateur mis à jour' : 'Utilisateur créé')
    } catch {
      toastError('Erreur', 'Impossible de sauvegarder l\'utilisateur.')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatut = async (u: Utilisateur) => {
    try {
      await usersAPI.update(u.id, { statut: !u.statut })
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, statut: !u.statut } : x))
    } catch {
      toastError('Erreur', 'Impossible de changer le statut.')
    }
  }

  const approveUser = async (u: Utilisateur) => {
    try {
      await usersAPI.update(u.id, { is_approved: true, statut: true })
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_approved: true, statut: true } : x))
      success('Utilisateur approuvé', `${u.username} a maintenant accès à la plateforme.`)
    } catch {
      toastError('Erreur', 'Impossible d\'approuver cet utilisateur.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer définitivement cet utilisateur ? Cette action est irréversible.')) return
    try {
      await usersAPI.delete(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      success('Utilisateur supprimé')
    } catch {
      toastError('Erreur', 'Impossible de supprimer l\'utilisateur.')
    }
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q)

    if (roleFilter === 'En attente') return matchSearch && !u.is_approved
    if (roleFilter === 'Tous') return matchSearch
    return matchSearch && u.role === roleFilter
  })

  const pendingCount = users.filter(u => !u.is_approved).length

  const stats = {
    total: users.length,
    actifs: users.filter(u => u.statut).length,
    admins: users.filter(u => u.role === 'administrateur').length,
    benevoles: users.filter(u => u.role === 'benevole').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Gestion des Utilisateurs</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {loading ? 'Chargement...' : `${users.length} compte(s) enregistré(s) sur la plateforme`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchUsers} disabled={loading}
            className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-slate-50 transition-all"
            title="Actualiser">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Nouvel utilisateur
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <p className="font-medium">{error}</p>
          <button onClick={fetchUsers} className="ml-auto text-red-500 font-bold underline">Réessayer</button>
        </div>
      )}

      {/* Stats KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total comptes', value: stats.total, icon: Users, color: 'bg-blue-50 text-blue-600' },
          { label: 'Comptes actifs', value: stats.actifs, icon: UserCheck, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Administrateurs', value: stats.admins, icon: ShieldCheck, color: 'bg-red-50 text-red-600' },
          { label: 'Bénévoles', value: stats.benevoles, icon: Shield, color: 'bg-purple-50 text-purple-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-gray-900">{loading ? '—' : s.value}</div>
              <div className="text-[10px] text-gray-400 font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email ou pseudo..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Filtre:</span>
          {/* Pending approval filter — shown first with badge */}
          <button onClick={() => setRoleFilter('En attente')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
              roleFilter === 'En attente'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-amber-600 border-amber-300 hover:bg-amber-50'
            }`}>
            ⏳ En attente
            {pendingCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          {['Tous', 'administrateur', 'coordinateur', 'benevole', 'donateur', 'visiteur'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                roleFilter === r
                  ? 'bg-[#0B2447] text-white border-[#0B2447]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-slate-50'
              }`}>
              {r === 'Tous' ? 'Tous' : roleConfig[r]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          <span className="ml-3 text-gray-400 text-sm">Chargement des utilisateurs...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="text-5xl mb-4">👤</div>
          <h3 className="text-gray-900 font-bold text-base mb-1">Aucun utilisateur trouvé</h3>
          <p className="text-gray-400 text-xs max-w-xs mx-auto mb-5">
            {users.length === 0
              ? 'Créez le premier compte utilisateur de la plateforme.'
              : 'Aucun compte ne correspond à votre recherche.'}
          </p>
          {users.length === 0 && (
            <button onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm">
              <Plus className="w-4 h-4" /> Créer le premier utilisateur
            </button>
          )}
        </div>
      )}

      {/* Users Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((u, idx) => {
            const RoleIcon = roleConfig[u.role]?.icon || Users
            const avatarColor = avatarColors[u.id % avatarColors.length]
            const fullName = `${u.first_name} ${u.last_name}`.trim() || u.username

            return (
              <div key={u.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all flex flex-col gap-4">
                {/* Top: Avatar + Name + Role badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl ${avatarColor} flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-md`}>
                      {getInitials(u)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-gray-900 text-sm truncate">{fullName}</p>
                      <p className="text-gray-400 text-[11px] font-mono truncate">@{u.username}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${roleConfig[u.role]?.color}`}>
                      <RoleIcon className="w-2.5 h-2.5" />
                      {roleConfig[u.role]?.label}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${u.statut ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {u.statut ? '● Actif' : '○ Inactif'}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-gray-300 shrink-0" />
                    <span className="truncate">{u.email || '—'}</span>
                  </div>
                  {u.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-gray-300 shrink-0" />
                      <span>{u.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 text-[10px] font-mono">Inscrit le</span>
                    <span className="text-gray-400 text-[10px]">
                      {u.date_creation ? new Date(u.date_creation).toLocaleDateString('fr-FR') : '—'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-50 pt-3 flex items-center justify-between gap-2">
                  {/* Approve button — shown only for pending users */}
                  {!u.is_approved ? (
                    <button
                      onClick={() => approveUser(u)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition-colors"
                      title="Approuver l'accès de cet utilisateur"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      ✅ Approuver
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleStatut(u)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                        u.statut
                          ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                      }`}
                      title={u.statut ? 'Désactiver' : 'Réactiver'}
                    >
                      {u.statut ? <ShieldX className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                      {u.statut ? 'Désactiver' : 'Réactiver'}
                    </button>
                  )}
                  <div className="flex gap-1">
                    <button onClick={() => openEditModal(u)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg text-[10px] font-semibold transition-colors">
                      <Edit3 className="w-3 h-3" /> Modifier
                    </button>
                    {u.role !== 'administrateur' && (
                      <button onClick={() => handleDelete(u.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">
              {editingUser ? '✏️ Modifier l\'utilisateur' : '👤 Créer un utilisateur'}
            </h3>
            <p className="text-gray-400 text-xs mb-5">
              {editingUser ? 'Modifiez les informations du compte.' : 'Créez un nouveau compte sur la plateforme RoBomed.'}
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Prénom</label>
                  <input type="text" value={formFirstName} onChange={e => setFormFirstName(e.target.value)}
                    placeholder="Aïcha" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nom</label>
                  <input type="text" value={formLastName} onChange={e => setFormLastName(e.target.value)}
                    placeholder="Baradine" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nom d'utilisateur (login) *</label>
                <input type="text" required value={formUsername} onChange={e => setFormUsername(e.target.value)}
                  placeholder="aicha_baradine" className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Adresse email *</label>
                <input type="email" required value={formEmail} onChange={e => setFormEmail(e.target.value)}
                  placeholder="aicha@robomed.org" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Rôle</label>
                  <select value={formRole} onChange={e => setFormRole(e.target.value as Utilisateur['role'])}
                    className={selectClass}>
                    <option value="visiteur">Visiteur</option>
                    <option value="donateur">Donateur</option>
                    <option value="benevole">Bénévole</option>
                    <option value="coordinateur">Coordinateur</option>
                    <option value="administrateur">Administrateur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Téléphone</label>
                  <input type="tel" value={formPhone} onChange={e => setFormPhone(e.target.value)}
                    placeholder="+235 60 90 90 92" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {editingUser ? 'Nouveau mot de passe (laisser vide = inchangé)' : 'Mot de passe *'}
                </label>
                <input type="password"
                  required={!editingUser}
                  value={formPassword}
                  onChange={e => setFormPassword(e.target.value)}
                  placeholder={editingUser ? '••••••••' : 'Minimum 8 caractères'}
                  className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Adresse / Localisation</label>
                <input type="text" value={formAddress} onChange={e => setFormAddress(e.target.value)}
                  placeholder="N'Djamena, Tchad ou Montréal, Canada" className={inputClass} />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-slate-100 rounded-xl transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-secondary text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-60">
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                  {editingUser ? 'Mettre à jour' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
