import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter, Trash2, Edit3, Mail, UserPlus, ShieldCheck, Award, Upload } from 'lucide-react'
import CertificateModal from '../../components/CertificateModal'
import { useToast } from '../../context/ToastContext'
import { loadTeamMembers, saveTeamMembers, type TeamMember } from '../../data/team'
import { teamAPI } from '../../services/api'


interface Membre {
  id: number
  name: string
  role: string
  branch: '🇨🇦 Canada' | '🇹🇩 Tchad'
  photo: string | null
  email: string
  tags: string[]
  color: string
}

export default function AdminEquipe() {
  const [team, setTeam] = useState<Membre[]>(() => {
    const members = loadTeamMembers()
    return members.map((m: any) => ({
      id: m.id,
      name: m.name || m.nom || 'Membre',
      role: typeof m.role === 'string' ? m.role : m.role?.fr || 'Membre',
      branch: m.branch?.includes('Tchad') || m.branch?.includes('TD') ? '🇹🇩 Tchad' : '🇨🇦 Canada',
      photo: m.photo || null,
      email: m.email || '',
      tags: Array.isArray(m.tags) ? m.tags : ['Bénévole'],
      color: m.color || (m.branch?.includes('Tchad') ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'),
    }))
  })
  const [search, setSearch] = useState('')
  const [branchFilter, setBranchFilter] = useState('Tous')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Membre | null>(null)
  const [saving, setSaving] = useState(false)
  const { success, error: toastError } = useToast()

  const refreshTeam = useCallback(async () => {
    try {
      const data = await teamAPI.getAll()
      const list = Array.isArray(data) ? data : (data?.results || [])
      if (list && list.length > 0) {
        const mapped = list.map((m: any) => ({
          id: m.id,
          name: m.nom || m.name || 'Membre',
          role: typeof m.role === 'string' ? m.role : m.role?.fr || 'Membre',
          branch: m.branch?.includes('Tchad') || m.branch?.includes('TD') ? '🇹🇩 Tchad' : '🇨🇦 Canada',
          photo: m.photo || m.photo_url || null,
          email: m.email || '',
          tags: Array.isArray(m.tags) ? m.tags : ['Bénévole'],
          color: m.color || (m.branch?.includes('Tchad') ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'),
        }))
        setTeam(mapped)
      }
    } catch (err) {
      console.warn('Erreur chargement équipe backend:', err)
    }
  }, [])

  useEffect(() => {
    refreshTeam()
  }, [refreshTeam])

  // Persist to team.ts storage and trigger real-time sync on every team change
  useEffect(() => {
    const exportList: TeamMember[] = team.map(m => ({
      id: m.id,
      nom: m.name,
      name: m.name,
      role: m.role,
      branch: m.branch,
      photo: m.photo,
      email: m.email,
      tags: m.tags,
      color: m.color,
      bio: `Membre de l'équipe RoBomed - ${m.role}`,
      missions: m.tags.map(t => `Mission & Expertise : ${t}`),
    }))
    saveTeamMembers(exportList)
  }, [team])


  // Form state
  const [formName, setFormName] = useState('')
  const [formRole, setFormRole] = useState('')
  const [formBranch, setFormBranch] = useState<'🇨🇦 Canada' | '🇹🇩 Tchad'>('🇨🇦 Canada')
  const [formEmail, setFormEmail] = useState('')
  const [formTags, setFormTags] = useState('')
  const [formPhoto, setFormPhoto] = useState('')
  const [formFile, setFormFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [certMember, setCertMember] = useState<Membre | null>(null)

  const openCreateModal = () => {
    setEditingMember(null)
    setFormName('')
    setFormRole('')
    setFormBranch('🇨🇦 Canada')
    setFormEmail('')
    setFormTags('Bénévole')
    setFormPhoto('')
    setFormFile(null)
    setPreviewUrl(null)
    setIsModalOpen(true)
  }

  const openEditModal = (m: Membre) => {
    setEditingMember(m)
    setFormName(m.name)
    setFormRole(m.role)
    setFormBranch(m.branch)
    setFormEmail(m.email)
    setFormTags(m.tags.join(', '))
    setFormPhoto(m.photo || '')
    setFormFile(null)
    setPreviewUrl(m.photo || null)
    setIsModalOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setFormPhoto('')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName) return
    setSaving(true)

    const tagsArray = formTags.split(',').map(t => t.trim()).filter(Boolean)
    const color = formBranch.includes('Canada') ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'

    try {
      const formData = new FormData()
      formData.append('nom', formName.trim())
      formData.append('role', formRole.trim() || 'Membre de l\'équipe')
      formData.append('branch', formBranch)
      formData.append('email', formEmail.trim())
      formData.append('color', color)
      formData.append('tags', JSON.stringify(tagsArray))
      formData.append('bio', `Membre de l'équipe RoBomed - ${formRole}`)
      formData.append('missions', JSON.stringify(tagsArray.map(t => `Mission & Expertise : ${t}`)))
      if (formFile) {
        formData.append('photo', formFile)
      } else if (formPhoto.trim()) {
        formData.append('photo_url', formPhoto.trim())
      }

      if (editingMember) {
        try {
          await teamAPI.update(editingMember.id, formData)
        } catch (updateErr: any) {
          if (updateErr?.response?.status === 404) {
            await teamAPI.create(formData)
          } else {
            throw updateErr
          }
        }
        success('Membre mis à jour', 'Modifications sauvegardées avec succès.')
      } else {
        await teamAPI.create(formData)
        success('Membre ajouté', `${formName} a rejoint l'équipe.`)
      }
      setIsModalOpen(false)
      await refreshTeam()
    } catch (err: any) {
      console.error('Erreur sauvegarde équipe:', err)
      const detail = err?.response?.data
        ? typeof err.response.data === 'string'
          ? err.response.data
          : Object.entries(err.response.data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ')
        : "Impossible d'enregistrer le membre de l'équipe."
      toastError('Erreur', detail)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous supprimer ce membre de l\'équipe ?')) return
    const m = team.find(x => x.id === id)
    try {
      await teamAPI.delete(id)
      setTeam(team.filter(m => m.id !== id))
      if (m) success('Membre supprimé', `${m.name} a été retiré de l'équipe.`)
    } catch (err) {
      console.error('Erreur suppression membre:', err)
      // Suppression locale si non trouvé sur le serveur
      setTeam(team.filter(m => m.id !== id))
      toastError('Attention', 'Supprimé localement (erreur réseau éventuelle).')
    }
  }

  const filtered = team.filter(m => {
    const q = search.toLowerCase()
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    const matchBranch = branchFilter === 'Tous' || m.branch.toLowerCase().includes(branchFilter.toLowerCase())
    return matchSearch && matchBranch
  })

  const countCanada = team.filter(m => m.branch.includes('Canada')).length
  const countTchad = team.filter(m => m.branch.includes('Tchad')).length

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Équipe RoBomed</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {team.length} membres actifs · Branches Canada & Tchad
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-100">
            🇨🇦 Canada · {countCanada}
          </span>
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
            🇹🇩 Tchad · {countTchad}
          </span>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm ml-2"
          >
            <UserPlus className="w-4 h-4" /> Ajouter un membre
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, rôle ou email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Branche:</span>
          {['Tous', 'Canada', 'Tchad'].map(b => (
            <button
              key={b}
              onClick={() => setBranchFilter(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                branchFilter === b
                  ? 'bg-[#0B2447] text-white border-[#0B2447]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-slate-50'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(m => (
          <div
            key={m.id}
            className={`bg-white rounded-2xl border ${m.color} p-5 flex flex-col items-center text-center gap-3 hover:shadow-md transition-all relative group`}
          >
            {m.photo ? (
              <img
                src={m.photo}
                alt={m.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow"
                onError={e => {
                  const target = e.target as HTMLImageElement
                  if (target.src.includes('khatere.jpeg')) {
                    target.src = '/khatera.jpeg'
                  } else {
                    target.style.display = 'none'
                  }
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-100 border-4 border-white shadow flex items-center justify-center text-2xl font-bold text-gray-400">
                👤
              </div>
            )}

            <div>
              <p className="font-bold text-gray-900 text-xs">{m.name}</p>
              <p className="text-gray-500 text-[10px] mt-0.5">{m.role}</p>
              <span className="inline-block text-[9px] font-semibold text-gray-400 mt-1">
                {m.branch}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 justify-center">
              {m.tags.map(t => (
                <span
                  key={t}
                  className="text-[9px] bg-slate-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium"
                >
                  {t}
                </span>
              ))}
            </div>

            {m.email && (
              <a
                href={`mailto:${m.email}`}
                className="text-[10px] text-secondary hover:underline truncate max-w-full flex items-center gap-1"
              >
                <Mail className="w-3 h-3 shrink-0" /> {m.email}
              </a>
            )}

            <div className="pt-2 border-t border-gray-100 w-full flex items-center justify-center gap-2 mt-auto">
              <button
                onClick={() => setCertMember(m)}
                className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1"
                title="Générer Certificat PDF"
              >
                <Award className="w-3 h-3 text-amber-600" /> Certificat PDF
              </button>
              <button
                onClick={() => openEditModal(m)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Modifier"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {editingMember ? 'Modifier le membre' : 'Ajouter un membre'}
            </h3>
            <p className="text-gray-400 text-xs mb-5">
              Renseignez les détails du membre de l'équipe RoBomed.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Ex: Aïcha Baradine"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rôle / Poste</label>
                <input
                  type="text"
                  required
                  value={formRole}
                  onChange={e => setFormRole(e.target.value)}
                  placeholder="Ex: Présidente, Logistique, Bénévole..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Branche</label>
                  <select
                    value={formBranch}
                    onChange={e => setFormBranch(e.target.value as '🇨🇦 Canada' | '🇹🇩 Tchad')}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                  >
                    <option value="🇨🇦 Canada">🇨🇦 Canada</option>
                    <option value="🇹🇩 Tchad">🇹🇩 Tchad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="email@robomed.org"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={e => setFormTags(e.target.value)}
                  placeholder="Leadership, Finance, Digital..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Photo de profil (Fichier)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-3 text-center hover:border-secondary transition-colors bg-gray-50/50">
                  {previewUrl ? (
                    <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-secondary shadow-sm">
                      <img
                        src={previewUrl}
                        alt="Aperçu photo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          if (target.src.includes('khatere.jpeg')) {
                            target.src = '/khatera.jpeg'
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => { setFormFile(null); setPreviewUrl(null); setFormPhoto('') }}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-[10px] shadow"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-1">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-xs font-medium text-gray-600">
                        Glissez une photo ou cliquez ici
                      </span>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WebP (max 5 Mo)</span>
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ou URL Photo externe</label>
                <input
                  type="text"
                  value={formPhoto}
                  onChange={e => {
                    const val = e.target.value
                    setFormPhoto(val)
                    if (!formFile) setPreviewUrl(val.trim() || null)
                  }}
                  disabled={Boolean(formFile)}
                  placeholder="/photo.jpg ou URL https://..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/60 transition-all disabled:opacity-50"
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
                  {editingMember ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Generator Modal */}
      {certMember && (
        <CertificateModal
          isOpen={!!certMember}
          onClose={() => setCertMember(null)}
          recipientName={certMember.name}
          role={certMember.role}
          location={certMember.branch}
        />
      )}
    </div>
  )
}
