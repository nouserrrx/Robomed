import { Navigate, Outlet } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'

export default function RequireAuth() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  // Attend la fin de la vérification du token avant de rediriger
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1729] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-emerald-400 rounded-full animate-spin" />
          <p className="text-white/40 text-xs font-semibold tracking-wider">Vérification de la session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  // Vérification stricte des rôles administratifs (RBAC Frontend)
  const isAuthorizedRole = user?.role === 'administrateur' || user?.role === 'coordinateur'

  if (!isAuthorizedRole) {
    return (
      <div className="min-h-screen bg-[#0b1329] text-white flex items-center justify-center p-4">
        <div className="bg-[#131e3a] border border-red-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-bold font-serif text-white">Accès Restreint</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Votre compte actuel (<span className="text-amber-300 font-semibold">{user?.email}</span>) possède le rôle <span className="text-emerald-400 font-semibold">{user?.role || 'visiteur'}</span> et n'est pas autorisé à accéder au panneau d'administration.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => window.location.href = '/'}
              className="w-full justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
            </Button>
            
            <Button
              variant="outline"
              size="md"
              onClick={logout}
              className="w-full justify-center gap-2 text-gray-300 hover:text-white border-white/10 hover:bg-white/5"
            >
              <LogOut className="w-4 h-4" /> Changer de compte
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <Outlet />
}
