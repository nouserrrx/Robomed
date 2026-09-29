import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authAPI } from '../services/api'

interface User {
  name: string
  email: string
  role: string
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  login: (email: string, password: string) => Promise<boolean | 'pending'>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const USER_KEY = 'robomed_user'
const TOKEN_KEY = 'robomed_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // démarre en chargement

  // Validation du token au montage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)

    if (!token || !savedUser) {
      setIsLoading(false)
      return
    }

    // Restaure l'utilisateur immédiatement depuis le cache
    try {
      setUser(JSON.parse(savedUser))
    } catch {
      // JSON invalide — on nettoie
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
      setIsLoading(false)
      return
    }

    // Valide le token auprès du serveur
    authAPI.me().then((data) => {
      if (data?.email) {
        // Token valide — on synchronise les données vérifiées du serveur
        const updated: User = {
          name: data.name || data.username || 'Administrateur',
          email: data.email,
          role: data.role || 'visiteur',
        }
        setUser(updated)
        localStorage.setItem(USER_KEY, JSON.stringify(updated))
      } else {
        // Token invalide, rejeté ou expiré côté serveur
        setUser(null)
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(TOKEN_KEY)
      }
      setIsLoading(false)
    })
  }, [])

  const login = async (email: string, password: string): Promise<boolean | 'pending'> => {
    try {
      const apiRes = await authAPI.login(email, password)

      if (apiRes?.error === 'pending_approval') return 'pending'

      if (apiRes?.user) {
        const userData: User = {
          name: apiRes.user.name || apiRes.user.username,
          email: apiRes.user.email,
          role: apiRes.user.role || 'visiteur',
        }
        setUser(userData)
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
        return true
      }
    } catch {
      // API injoignable
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
