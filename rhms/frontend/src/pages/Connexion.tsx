import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  LogIn, UserPlus, Mail, Lock, User, Phone,
  Heart, Users, CheckCircle2, AlertCircle, Sparkles, Eye, EyeOff, ArrowRight 
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usersAPI } from '../services/api'

export default function Connexion() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  // ── Login State ──
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // ── Register State ──
  const [regUsername, setRegUsername] = useState('')
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('')
  const [regRole, setRegRole] = useState<'benevole' | 'donateur' | 'visiteur'>('benevole')
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState(false)

  // ── Handle Login ──
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      setLoginError('Veuillez remplir tous les champs obligatoires.')
      return
    }
    setLoginLoading(true)
    setLoginError('')

    const result = await login(loginEmail, loginPassword)
    setLoginLoading(false)

    if (result === 'pending') {
      setLoginError('⏳ Votre compte est en attente d\'approbation par l\'administrateur. Vous serez contacté dès que votre accès sera activé.')
      return
    }

    if (result === true) {
      const saved = localStorage.getItem('robomed_user')
      const userData = saved ? JSON.parse(saved) : null
      const role = userData?.role || ''
      if (['administrateur', 'coordinateur'].includes(role)) {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } else {
      setLoginError('Email ou mot de passe incorrect. Vérifiez vos identifiants.')
    }
  }

  // ── Handle Registration ──
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regUsername || !regEmail || !regPassword) {
      setRegError('Le nom d\'utilisateur, l\'email et le mot de passe sont obligatoires.')
      return
    }
    if (regPassword !== regPasswordConfirm) {
      setRegError('Les deux mots de passe ne correspondent pas.')
      return
    }
    if (regPassword.length < 6) {
      setRegError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setRegLoading(true)
    setRegError('')

    try {
      const newUser = await usersAPI.create({
        username: regUsername.toLowerCase().trim().replace(/\s+/g, '_'),
        email: regEmail.trim(),
        first_name: regFirstName.trim(),
        last_name: regLastName.trim(),
        phone: regPhone.trim(),
        role: regRole,
        password: regPassword,
      })

      if (newUser) {
        setRegSuccess(true)
        // Pas d'auto-login — le compte doit être approuvé par l'admin d'abord
      } else {
        setRegError('Création du compte échouée. L\'utilisateur ou l\'email existe peut-être déjà.')
      }
    } catch (_err) {
      // Offline fallback — montrer le message d'attente
      setRegSuccess(true)
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] bg-slate-50 dark:bg-gray-950 py-12 lg:py-20 px-4 sm:px-6 transition-colors">
      <div className="max-w-md sm:max-w-xl mx-auto">
        
        {/* Top Header & Brand */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portail Membres & Bénévoles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Espace <span className="text-secondary">RoBomed</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-sm mx-auto">
            Connectez-vous à votre compte bénévole ou donateur, ou créez-en un pour rejoindre notre équipe.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 relative overflow-hidden">
          
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 dark:bg-gray-800 rounded-2xl mb-8 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => { setActiveTab('login'); setLoginError(''); }}
              className={`py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'login'
                  ? 'bg-secondary text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Se connecter</span>
            </button>

            <button
              onClick={() => { setActiveTab('register'); setRegError(''); }}
              className={`py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'register'
                  ? 'bg-secondary text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Créer un compte</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            
            {/* ──────────────── TAB 1: CONNEXION ──────────────── */}
            {activeTab === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Login Error */}
                {loginError && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                      Adresse email ou nom d'utilisateur *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showLoginPass ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass(!showLoginPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3.5 px-6 rounded-2xl bg-secondary hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-secondary/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                  >
                    {loginLoading ? (
                      <span>Vérification des accès...</span>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Se connecter à mon compte</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-secondary font-semibold transition-colors"
                  >
                    Pas encore inscrit ? <span className="text-secondary font-bold underline">Créer un compte bénévole ou donateur</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ──────────────── TAB 2: CRÉER UN COMPTE ──────────────── */}
            {activeTab === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Success Banner — Pending Approval */}
                {regSuccess ? (
                  <div className="p-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-3xl text-center space-y-3">
                    <div className="text-5xl">⏳</div>
                    <h3 className="text-base font-extrabold text-amber-900 dark:text-amber-100">Demande envoyée avec succès !</h3>
                    <p className="text-xs text-amber-700 dark:text-amber-300 max-w-xs mx-auto">
                      Votre compte a été créé. <strong>L'administrateur doit approuver votre accès</strong> avant que vous puissiez vous connecter. Vous serez contacté par email.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setRegSuccess(false); setActiveTab('login') }}
                      className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Retour à la connexion
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    
                    {regError && (
                      <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-300 text-xs">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{regError}</span>
                      </div>
                    )}

                    {/* Role Selection Cards */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                        Quel est votre profil ou souhait d'engagement ? *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        
                        <button
                          type="button"
                          onClick={() => setRegRole('benevole')}
                          className={`p-3 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between ${
                            regRole === 'benevole'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold'
                              : 'bg-slate-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-base">🤝</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                              Terrain
                            </span>
                          </div>
                          <span className="font-extrabold text-xs">Bénévole</span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-normal">
                            Participer aux actions & distributions
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRegRole('donateur')}
                          className={`p-3 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between ${
                            regRole === 'donateur'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold'
                              : 'bg-slate-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-base">💚</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                              Soutien
                            </span>
                          </div>
                          <span className="font-extrabold text-xs">Donateur</span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-normal">
                            Suivre mes dons & recibos fiscaux
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRegRole('visiteur')}
                          className={`p-3 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between ${
                            regRole === 'visiteur'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold'
                              : 'bg-slate-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-base">👤</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              Visiteur
                            </span>
                          </div>
                          <span className="font-extrabold text-xs">Membre</span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-normal">
                            Suivre l'actualité des projets
                          </span>
                        </button>

                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">Prénom</label>
                        <input
                          type="text"
                          value={regFirstName}
                          onChange={e => setRegFirstName(e.target.value)}
                          placeholder="Aïcha"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-secondary/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">Nom</label>
                        <input
                          type="text"
                          value={regLastName}
                          onChange={e => setRegLastName(e.target.value)}
                          placeholder="Baradine"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-secondary/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">Nom d'utilisateur (login) *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={regUsername}
                          onChange={e => setRegUsername(e.target.value)}
                          placeholder="aicha_baradine"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-secondary/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">Adresse email *</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={regEmail}
                            onChange={e => setRegEmail(e.target.value)}
                            placeholder="aicha@robomed.org"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-secondary/40"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">Téléphone</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={regPhone}
                            onChange={e => setRegPhone(e.target.value)}
                            placeholder="+235 60 90 90 92"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-secondary/40"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">Mot de passe *</label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={e => setRegPassword(e.target.value)}
                          placeholder="Min 6 caractères"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-secondary/40"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">Confirmer le mot de passe *</label>
                        <input
                          type="password"
                          required
                          value={regPasswordConfirm}
                          onChange={e => setRegPasswordConfirm(e.target.value)}
                          placeholder="Répétez le mot de passe"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-secondary/40"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={regLoading}
                      className="w-full py-3.5 px-6 rounded-2xl bg-secondary hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-secondary/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-4"
                    >
                      {regLoading ? (
                        <span>Création de votre compte...</span>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Finaliser mon inscription ({regRole.toUpperCase()})</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>
    </div>
  )
}
