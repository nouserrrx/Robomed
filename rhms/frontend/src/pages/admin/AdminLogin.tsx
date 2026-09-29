import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Lock, Mail, AlertCircle, Shield } from 'lucide-react'
import LogoSVG from '../../components/shared/LogoSVG'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setLoading(true)
    setError('')
    const ok = await login(email, password)
    setLoading(false)
    if (ok) {
      navigate('/admin', { replace: true })
    } else {
      setError('Email ou mot de passe incorrect. Vérifiez vos identifiants.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0B2447] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.02] rounded-full border border-white/5" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8 flex flex-col items-center">
          <LogoSVG className="h-12 w-auto text-white mb-2" />
          <p className="text-white/70 text-sm font-semibold">Espace Administrateur</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-white font-bold text-xl">Connexion Administrateur</h2>
            <p className="text-white/70 text-xs mt-1">Espace réservé à la direction et aux coordinateurs RoBomed.</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-400/30 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-xs">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-white/70 text-xs font-medium mb-1.5">Adresse email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email ou nom d'utilisateur"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/25 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-secondary/60 focus:bg-white/10 transition-all"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/70 text-xs font-medium mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/25 rounded-xl pl-10 pr-12 py-3 text-sm outline-none focus:border-secondary/60 focus:bg-white/10 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <a href="/" className="text-white/40 hover:text-white/70 text-xs transition-colors">
              ← Retour au site public RoBomed
            </a>
          </div>
        </div>

        {/* Security badge */}
        <div className="text-center mt-5">
          <p className="text-white/25 text-[10px] flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3" /> Connexion sécurisée · RoBomed Admin Panel © 2025
          </p>
        </div>
      </div>
    </div>
  )
}
