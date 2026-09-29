import { useState, useRef, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, MessageSquare, FolderHeart, Users,
  Heart, LogOut, Menu, ChevronRight, Bell, Settings,
  Globe, X, Package, UserCog, User, Shield, Palette,
  Sun, Moon, ExternalLink, Image, Newspaper, HeartHandshake,
  Truck, FileText, UserCheck, Coins
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import LogoSVG from '../../components/shared/LogoSVG'

const navItems = [
  { to: '/admin',               label: 'Vue d\'ensemble',     icon: LayoutDashboard, exact: true },
  { to: '/admin/campagnes',     label: 'Campagnes',           icon: Coins },
  { to: '/admin/projets',       label: 'Projets',             icon: FolderHeart },
  { to: '/admin/distributions', label: 'Distributions',       icon: Truck },
  { to: '/admin/stocks',        label: 'Stocks & Logistique', icon: Package },
  { to: '/admin/beneficiaires', label: 'Bénéficiaires',       icon: HeartHandshake },
  { to: '/admin/benevoles',     label: 'Bénévoles',           icon: UserCheck },
  { to: '/admin/dons',          label: 'Dons',                icon: Heart },
  { to: '/admin/rapports',      label: 'Rapports & Exports',  icon: FileText },
  { to: '/admin/actualites',    label: 'Actualités',          icon: Newspaper },
  { to: '/admin/messages',      label: 'Messages',            icon: MessageSquare },
  { to: '/admin/equipe',        label: 'Équipe',              icon: Users },
  { to: '/admin/galerie',       label: 'Galerie Média',       icon: Image },
  { to: '/admin/utilisateurs',  label: 'Utilisateurs',        icon: UserCog, adminOnly: true },
  { to: '/admin/logs',          label: 'Logs & Incidents',    icon: Shield, adminOnly: true },
]

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/admin':               { title: 'Vue d\'ensemble',         subtitle: 'Synthèse des activités & KPIs' },
  '/admin/campagnes':     { title: 'Campagnes de Collecte',   subtitle: 'Appels aux dons et objectifs financiers' },
  '/admin/projets':       { title: 'Projets Humanitaires',    subtitle: 'Suivi des actions terrain et missions' },
  '/admin/distributions': { title: 'Distributions',           subtitle: 'Dotations aux bénéficiaires et décompte des stocks' },
  '/admin/stocks':        { title: 'Stocks & Logistique',     subtitle: 'Suivi des fournitures & inventaires terrain' },
  '/admin/beneficiaires': { title: 'Bénéficiaires',           subtitle: 'Suivi des familles & personnes assistées' },
  '/admin/benevoles':     { title: 'Bénévoles & Candidatures',subtitle: 'Gestion des profils et missions bénévoles' },
  '/admin/dons':          { title: 'Dons & Collectes',        subtitle: 'Suivi des financements solidaires' },
  '/admin/rapports':      { title: 'Rapports & Exports',      subtitle: 'Génération de PDF officiels et exports Excel' },
  '/admin/actualites':    { title: 'Actualités & Articles',   subtitle: 'Gestion et publication des articles publicables' },
  '/admin/messages':      { title: 'Messages',                subtitle: 'Candidatures et demandes reçues' },
  '/admin/equipe':        { title: 'Équipe',                  subtitle: 'Membres & Conseil · Canada & Tchad' },
  '/admin/galerie':       { title: 'Galerie Média',           subtitle: 'Gestion des photos et vidéos publicables' },
  '/admin/utilisateurs':  { title: 'Utilisateurs',            subtitle: 'Gestion des comptes & rôles' },
  '/admin/logs':          { title: 'Logs & Incidents',        subtitle: 'Historique des événements et gestion des erreurs' },
  '/admin/profil':        { title: 'Mon Compte',              subtitle: 'Informations personnelles & sécurité' },
}


export default function AdminLayout() {
  // Desktop: sidebar collapsed/expanded | Mobile: drawer open/closed
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const { theme, toggleTheme } = useTheme()
  const darkMode = theme === 'dark'

  const settingsRef = useRef<HTMLDivElement>(null)
  const profileRef  = useRef<HTMLDivElement>(null)

  const location = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuth()

  const isActive = (path: string, exact = false) =>
    exact ? location.pathname === path : location.pathname === path

  const currentPage = pageTitles[location.pathname] ?? pageTitles['/admin']

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/admin/login') }

  const initials = user?.name
    ? user.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'AD'

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false)
      if (profileRef.current  && !profileRef.current.contains(e.target as Node))  setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Shared Sidebar Content ──────────────────────────────────────────────────
  const SidebarContent = ({ showLabels }: { showLabels: boolean }) => (
    <>
      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-white/[0.07] px-4 ${showLabels ? 'justify-between' : 'justify-center'}`}>
        {showLabels ? (
          <>
            <div className="flex items-center gap-2">
              <LogoSVG className="h-7 w-auto text-white" />
              <span className="text-[9px] bg-secondary/20 text-secondary border border-secondary/30 px-1.5 py-0.5 rounded-full font-bold">ADMIN</span>
            </div>
            {/* Desktop collapse button — hidden on mobile */}
            <button
              onClick={() => setDesktopCollapsed(true)}
              className="hidden lg:flex text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="flex lg:hidden text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button onClick={() => setDesktopCollapsed(false)} className="text-white/30 hover:text-white/60 transition-colors">
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {showLabels && (
          <p className="text-white/25 text-[9px] font-bold uppercase tracking-widest px-2 pb-2">Navigation</p>
        )}
        {navItems
          .filter((item) => !item.adminOnly || (user?.role !== 'coordinateur'))
          .map((item) => {
          const Icon = item.icon
          const active = isActive(item.to, item.exact)
          return (
            <Link
              key={item.to}
              to={item.to}
              title={!showLabels ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all relative ${
                active ? 'bg-white/10 text-white' : 'text-white/45 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-secondary' : ''}`} />
              {showLabels && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {active && <ChevronRight className="w-3 h-3 opacity-40" />}
                </>
              )}
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-secondary rounded-r-full" />}
            </Link>
          )
        })}
      </nav>

      {/* User info + Logout */}
      <div className="p-3 border-t border-white/[0.07] space-y-1">
        {showLabels && user && (
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-secondary/30 shrink-0">
              {(() => {
                const photo = localStorage.getItem('robomed_admin_photo')
                return photo ? (
                  <img src={photo} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary/20 flex items-center justify-center text-secondary text-[11px] font-bold">
                    {initials}
                  </div>
                )
              })()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{user.name}</p>
              <p className="text-white/35 text-[10px] truncate capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/35 hover:text-red-400 hover:bg-red-400/10 transition-all w-full text-[13px] font-medium ${!showLabels ? 'justify-center' : ''}`}
          title="Déconnexion"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {showLabels && <span>Déconnexion</span>}
        </button>
      </div>
    </>
  )
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Mobile Overlay Backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── (slide in from left, above content) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#0f1729] flex flex-col
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:hidden
      `}>
        <SidebarContent showLabels={true} />
      </aside>

      {/* ── Desktop Sidebar ── (static, shrinks/expands) */}
      <aside className={`
        hidden lg:flex flex-col shrink-0 bg-[#0f1729]
        transition-all duration-300 ease-in-out
        ${desktopCollapsed ? 'w-[72px]' : 'w-60'}
      `}>
        <SidebarContent showLabels={!desktopCollapsed} />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100/80 flex items-center px-4 sm:px-6 shrink-0 gap-3">

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-gray-900 truncate">{currentPage.title}</h2>
            <p className="text-[11px] text-gray-400 truncate hidden sm:block">{currentPage.subtitle}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* Voir le site — hidden label on very small screens */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 border border-gray-200 hover:border-secondary/50 hover:text-secondary transition-all"
              title="Voir le site public"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Voir le site</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
            {/* Icon-only on mobile */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="sm:hidden p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Voir le site public"
            >
              <Globe className="w-4 h-4" />
            </a>

            {/* Bell → Messages */}
            <Link
              to="/admin/messages"
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Messages & Candidatures"
            >
              <Bell className="w-4 h-4" />
            </Link>

            {/* Settings dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => { setSettingsOpen(p => !p); setProfileOpen(false) }}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                title="Paramètres"
              >
                <Settings className="w-4 h-4" />
              </button>
              {settingsOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-2">Préférences</p>
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs text-gray-700 font-medium transition-colors"
                  >
                    {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                    {darkMode ? 'Mode clair' : 'Mode sombre'}
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs text-gray-700 font-medium transition-colors">
                    <Palette className="w-4 h-4 text-purple-400" />
                    Thème couleur
                  </button>
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button
                      onClick={() => { navigate('/admin/utilisateurs'); setSettingsOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs text-gray-700 font-medium transition-colors"
                    >
                      <Shield className="w-4 h-4 text-emerald-500" />
                      Gérer les accès
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile avatar dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setProfileOpen(p => !p); setSettingsOpen(false) }}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-secondary/40 transition-all"
                title="Mon profil"
              >
                {(() => {
                  const photo = localStorage.getItem('robomed_admin_photo')
                  return photo ? (
                    <img src={photo} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#0f1729] flex items-center justify-center text-white text-[11px] font-bold">
                      {initials}
                    </div>
                  )
                })()}
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-11 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-4 bg-gradient-to-br from-[#0f1729] to-[#0B4F9C] text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary/40 shrink-0">
                        {(() => {
                          const photo = localStorage.getItem('robomed_admin_photo')
                          return photo ? (
                            <img src={photo} alt="Profil" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-secondary/20 flex items-center justify-center text-secondary text-sm font-bold">
                              {initials}
                            </div>
                          )
                        })()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">{user?.name || 'Administrateur'}</p>
                        <p className="text-[11px] text-white/60 capitalize">{user?.role || 'admin'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { navigate('/admin/profil'); setProfileOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs text-gray-700 font-medium transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      Mon compte
                    </button>
                    <a
                      href="/"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs text-gray-700 font-medium transition-colors"
                    >
                      <Globe className="w-4 h-4 text-gray-400" />
                      Voir le site public
                    </a>
                    <div className="border-t border-gray-50 mt-1 pt-1">
                      <button
                        onClick={() => { handleLogout(); setProfileOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-xs text-red-600 font-semibold transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
