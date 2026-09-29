import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/api'
import {
  User, Mail, Phone, MapPin, Shield, Edit3,
  Lock, Eye, EyeOff, CheckCircle2, LogOut, Camera, Upload
} from 'lucide-react'

export default function AdminProfil() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { success, error: toastError } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editMode, setEditMode] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    (user as any)?.photo || null
  )
  const [photoHover, setPhotoHover] = useState(false)

  // Form state
  const [name, setName]       = useState(user?.name || 'Administrateur')
  const [email, setEmail]     = useState(user?.email || 'admin@robomed.org')
  const [phone, setPhone]     = useState((user as any)?.phone || '')
  const [address, setAddress] = useState((user as any)?.address || '')
  const [newPass, setNewPass] = useState('')

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name)
      if (user.email) setEmail(user.email)
      if ((user as any).phone) setPhone((user as any).phone)
      if ((user as any).address) setAddress((user as any).address)
      if ((user as any).photo) setPhotoPreview((user as any).photo)
    }
  }, [user])

  const initials = (name || 'Admin')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('')

  // ── Photo upload (mémoire locale pour l'aperçu, upload serveur au save) ─────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('La photo ne doit pas dépasser 5 Mo.')
      return
    }
    setSelectedPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (selectedPhotoFile) {
        const formData = new FormData()
        formData.append('photo', selectedPhotoFile)
        formData.append('first_name', name.split(' ')[0] || '')
        formData.append('last_name', name.split(' ').slice(1).join(' ') || '')
        formData.append('email', email)
        formData.append('phone', phone)
        formData.append('address', address)
        if (newPass) formData.append('password', newPass)

        await api.patch('/accounts/me/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        const payload: any = {
          first_name: name.split(' ')[0] || '',
          last_name: name.split(' ').slice(1).join(' ') || '',
          email,
          phone,
          address,
        }
        if (newPass) payload.password = newPass
        await api.patch('/accounts/me/', payload)
      }

      success('Profil mis à jour', 'Vos informations ont été enregistrées avec succès.')
      setEditMode(false)
      setNewPass('')
      setSelectedPhotoFile(null)
    } catch {
      toastError('Erreur', 'Impossible de sauvegarder le profil. Réessayez.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  // ── Avatar component ──────────────────────────────────────────────────────
  const Avatar = ({ size = 'lg', overlay = false }: { size?: 'sm' | 'lg'; overlay?: boolean }) => {
    const dim = size === 'lg' ? 'w-24 h-24' : 'w-10 h-10'
    const textSize = size === 'lg' ? 'text-3xl' : 'text-sm'
    return (
      <div
        className={`${dim} rounded-full shrink-0 relative cursor-pointer group`}
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={() => setPhotoHover(true)}
        onMouseLeave={() => setPhotoHover(false)}
      >
        {photoPreview ? (
          <img
            src={photoPreview}
            alt="Photo de profil"
            className={`${dim} rounded-full object-cover border-2 border-white/30`}
          />
        ) : (
          <div className={`${dim} rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center ${textSize} font-extrabold text-secondary`}>
            {initials}
          </div>
        )}
        {/* Hover overlay */}
        {overlay && (
          <div className={`absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center gap-1 transition-opacity duration-200 ${photoHover ? 'opacity-100' : 'opacity-0'}`}>
            <Camera className="w-5 h-5 text-white" />
            <span className="text-white text-[9px] font-bold">Changer</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handlePhotoChange}
      />

      {/* Header card */}
      <div className="bg-gradient-to-br from-[#0f1729] to-[#0B4F9C] rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6">
        
        {/* Avatar with click-to-upload */}
        <div className="relative">
          <Avatar size="lg" overlay={true} />
          {/* Camera badge */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-secondary hover:bg-emerald-500 rounded-full border-2 border-[#0f1729] flex items-center justify-center transition-colors shadow-lg"
            title="Changer la photo de profil"
          >
            <Camera className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <div className="text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
            <span className="text-[10px] font-bold bg-secondary/20 text-secondary border border-secondary/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" /> Super Administrateur
            </span>
          </div>
          <h1 className="text-2xl font-extrabold">{name}</h1>
          <p className="text-white/60 text-sm mt-0.5">{email}</p>
          <p className="text-white/40 text-xs mt-1">📍 {address}</p>
          {/* Upload hint */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-white/40 hover:text-white/70 transition-colors"
          >
            <Upload className="w-3 h-3" />
            Cliquez sur l'avatar pour changer la photo
          </button>
        </div>

        <button
          onClick={() => setEditMode(e => !e)}
          className="sm:ml-auto shrink-0 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold transition-all"
        >
          <Edit3 className="w-4 h-4" />
          {editMode ? 'Annuler' : 'Modifier'}
        </button>
      </div>

      {/* Photo upload area (visible in edit mode) */}
      {editMode && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-secondary" /> Photo de profil
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-5">
              {/* Preview */}
              <div className="w-20 h-20 rounded-full shrink-0 overflow-hidden border-2 border-gray-200">
                {photoPreview ? (
                  <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#0f1729] flex items-center justify-center text-secondary font-extrabold text-xl">
                    {initials}
                  </div>
                )}
              </div>
              {/* Upload zone */}
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-secondary/50 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 group-hover:bg-secondary/20 flex items-center justify-center transition-colors">
                    <Upload className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-700">Cliquez pour choisir une photo</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP · Max 5 Mo</p>
                  </div>
                </button>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => { setPhotoPreview(null); setSelectedPhotoFile(null) }}
                    className="mt-2 w-full text-center text-[10px] text-red-500 hover:text-red-700 font-semibold transition-colors"
                  >
                    ✕ Supprimer la photo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* (success/error feedback via Toast) */}

      {/* Info / Edit form */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-bold text-gray-900">Informations du compte</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {editMode ? 'Modifiez vos informations puis enregistrez.' : "Vos informations personnelles et d'accès."}
          </p>
        </div>

        {editMode ? (
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Nom complet</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Téléphone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Adresse</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Nouveau mot de passe <span className="text-gray-400 font-normal">(laisser vide pour ne pas changer)</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 bg-secondary hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-semibold rounded-xl text-sm transition-all"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            {[
              { icon: User,   label: 'Nom complet', value: name },
              { icon: Mail,   label: 'Email',        value: email },
              { icon: Phone,  label: 'Téléphone',    value: phone },
              { icon: MapPin, label: 'Adresse',      value: address },
              { icon: Shield, label: 'Rôle',         value: user?.role || 'administrateur' },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <row.icon className="w-4 h-4 text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{row.label}</p>
                  <p className="text-sm font-semibold text-gray-800 truncate capitalize">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Session */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-bold text-gray-900">Session</h2>
        </div>
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>

    </div>
  )
}
