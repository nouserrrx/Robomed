import { useEffect, useState } from 'react'
import { Heart, Users, Mail, GraduationCap, TrendingUp, CheckCircle, ArrowRight, PlusCircle, Package, Calendar, Clock, DollarSign, Activity, UserCog } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'

// Simple SVG bar chart component
function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map(d => d.value))
  return (
    <div className="flex items-end gap-3 h-32 mt-4 px-2">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
          <span className="text-[10px] text-gray-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-0.5">{d.value}</span>
          <div
            className="w-full rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-sm"
            style={{ height: `${(d.value / max) * 100}px`, backgroundColor: d.color }}
          />
          <span className="text-[9px] text-gray-400 text-center leading-tight mt-1">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

// Simple SVG donut chart
function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, d) => s + d.value, 0)
  let cumulative = 0
  const r = 40, cx = 56, cy = 56, strokeWidth = 16
  const circumference = 2 * Math.PI * r

  return (
    <div className="flex items-center gap-6 justify-center sm:justify-start">
      <div className="relative w-28 h-28">
        <svg width="112" height="112" viewBox="0 0 112 112" className="transform -rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
          {segments.map((seg) => {
            const pct = seg.value / total
            const offset = circumference - pct * circumference
            const rotation = (cumulative / total) * 360
            cumulative += seg.value
            return (
              <circle
                key={seg.label}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${pct * circumference} ${circumference}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                transform={`rotate(${rotation} ${cx} ${cy})`}
                className="transition-all duration-700 hover:stroke-[18px] cursor-pointer"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-extrabold text-gray-900 dark:text-white leading-none">{total}</span>
          <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">total</span>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-gray-500 font-medium">{seg.label}</span>
            <span className="font-extrabold text-gray-900 dark:text-white ml-auto pl-4">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const actionsRecentes = [
  { icon: '🇹🇩', title: 'Puits d\'eau potable financé', detail: 'Tchad · Ventes solidaires', status: 'Actif', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { icon: '🇨🇦', title: 'Fleurs crochet & lettres', detail: 'Soins palliatifs · Canada', status: 'Continu', color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { icon: '🏫', title: 'Fournitures scolaires', detail: 'Distribution · Tchad', status: 'En cours', color: 'text-amber-600 bg-amber-50 border-amber-100' },
  { icon: '🩺', title: 'Friandises enfants cancer', detail: 'Oncologie pédiatrique · Canada', status: 'Continu', color: 'text-purple-600 bg-purple-50 border-purple-100' },
]

export default function AdminOverview() {
  const { user } = useAuth()
  const [msgCount, setMsgCount] = useState(0)
  const [donationsTotal, setDonationsTotal] = useState(0)
  const [beneficiaryCount, setBeneficiaryCount] = useState(0)
  const [volunteerCount, setVolunteerCount] = useState(0)
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [recentDonations, setRecentDonations] = useState<any[]>([])
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [userCount, setUserCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    const ctrl = new AbortController()

    const safe = (fn: (data: any) => void) => (data: any) => {
      if (!ctrl.signal.aborted) fn(data)
    }

    // 1. Contacts
    api.get('/contacts/').then(r => {
      const list = Array.isArray(r.data) ? r.data : (r.data?.results ?? [])
      safe((l: any[]) => { setMsgCount(l.length); setRecentMessages(l.slice(0, 2)) })(list)
    }).catch(() => {})

    // 2. Donations
    api.get('/donations/').then(r => {
      const list = Array.isArray(r.data) ? r.data : (r.data?.results ?? [])
      const total = list.filter((i: any) => i.statut === 'confirme').reduce((s: number, i: any) => s + parseFloat(i.montant || 0), 0)
      safe((l: any[]) => { setDonationsTotal(total); setRecentDonations(l.slice(0, 3)) })(list)
    }).catch(() => {})

    // 3. Bénéficiaires
    api.get('/beneficiaries/').then(r => {
      const list = Array.isArray(r.data) ? r.data : (r.data?.results ?? [])
      safe((l: any[]) => setBeneficiaryCount(l.length))(list)
    }).catch(() => {})

    // 4. Bénévoles / Ambassadeurs
    api.get('/volunteers/').then(r => {
      const list = Array.isArray(r.data) ? r.data : (r.data?.results ?? [])
      safe((l: any[]) => setVolunteerCount(l.length))(list)
    }).catch(() => {})

    // 5. Projets
    api.get('/projects/').then(r => {
      const list = Array.isArray(r.data) ? r.data : (r.data?.results ?? [])
      safe((l: any[]) => setRecentProjects(l.slice(0, 4)))(list)
    }).catch(() => {})

    // 6. Utilisateurs
    api.get('/accounts/users/').then(r => {
      const list = Array.isArray(r.data) ? r.data : (r.data?.results ?? [])
      safe((l: any[]) => setUserCount(l.length))(list)
    }).catch(() => {})

    return () => { clearInterval(timer); ctrl.abort() }
  }, [])

  const kpis = [
    { label: 'Dons collectés', value: `${donationsTotal.toLocaleString()}`, sub: 'Total confirmé', icon: Heart, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100/50', trend: true, to: '/admin/dons' },
    { label: 'Messages reçus', value: msgCount.toString(), sub: 'Via le formulaire contact', icon: Mail, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100/50', trend: false, to: '/admin/messages' },
    { label: 'Bénéficiaires', value: `${beneficiaryCount.toLocaleString()}+`, sub: 'Canada & Tchad', icon: Users, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100/50', trend: false, to: '/admin' },
    { label: 'Ambassadeurs', value: volunteerCount.toString(), sub: 'En cours de recrutement', icon: GraduationCap, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100/50', trend: true, to: '/admin/equipe' },
    { label: 'Utilisateurs', value: userCount.toString(), sub: 'Comptes sur la plateforme', icon: UserCog, color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100/50', trend: false, to: '/admin/utilisateurs' },
  ]

  const barData = [
    { label: 'Avr', value: 2, color: '#22c55e' },
    { label: 'Mai', value: 5, color: '#22c55e' },
    { label: 'Juin', value: 8, color: '#22c55e' },
    { label: 'Juil', value: 14, color: '#10b981' },
  ]

  const donutData = [
    { value: 4, color: '#ef4444', label: '🇨🇦 Canada' },
    { value: 4, color: '#3b82f6', label: '🇹🇩 Tchad' },
  ]

  const projectsToDisplay = recentProjects.length > 0
    ? recentProjects.map(p => ({
        icon: p.statut === 'termine' ? '🇹🇩' : '🇨🇦',
        title: p.titre,
        detail: p.description,
        status: p.statut === 'en_cours' ? 'En cours' : p.statut === 'termine' ? 'Terminé' : 'À venir',
        color: p.statut === 'en_cours' ? 'text-amber-600 bg-amber-50 border-amber-100' : p.statut === 'termine' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-blue-600 bg-blue-50 border-blue-100'
      }))
    : actionsRecentes

  // Format date in French
  const formattedDate = currentTime.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Format time
  const formattedTime = currentTime.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#0B2447] to-[#19376D] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg border border-white/5">
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400')] bg-cover bg-center" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500 text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm shadow-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Live
              </span>
              <p className="text-secondary text-xs font-bold uppercase tracking-widest">Tableau de bord RoBomed</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">Bonjour, {user?.name || 'Administrateur'}</h1>
            <p className="text-white/60 text-xs max-w-lg leading-relaxed">
              Bienvenue sur votre espace de pilotage humanitaire. Suivez l'impact de nos actions entre le Canada et le Tchad.
            </p>
          </div>
          
          {/* Glassmorphic Date Clock Widget */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl shrink-0 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
              <Calendar className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="text-xs font-bold text-white capitalize leading-tight">{formattedDate}</div>
              <div className="text-[10px] text-white/60 flex items-center gap-1 mt-0.5 font-semibold">
                <Clock className="w-3 h-3 text-secondary" /> {formattedTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <Link
              to={k.to}
              key={k.label}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 block cursor-pointer group`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors ${k.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{k.value}</div>
              <div className="text-xs text-gray-400 dark:text-gray-400 mt-0.5 font-medium">{k.label}</div>
              {k.trend ? (
                <div className="flex items-center gap-1 mt-2 text-emerald-600 text-[11px] font-bold">
                  <TrendingUp className="w-3.5 h-3.5" /> {k.sub}
                </div>
              ) : (
                <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-medium">
                  {k.sub}
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {/* Quick Action Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="font-extrabold text-gray-900 dark:text-white text-sm mb-3.5 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-secondary" /> Raccourcis d'administration
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/admin/projets"
            className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 border border-emerald-500/10 hover:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 transition-all group font-bold text-xs"
          >
            <span className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform"><PlusCircle className="w-4 h-4" /></span>
            Nouveau Projet
          </Link>
          
          <Link
            to="/admin/messages"
            className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/50 hover:bg-purple-50 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 border border-purple-500/10 hover:border-purple-500/20 text-purple-800 dark:text-purple-300 transition-all group font-bold text-xs"
          >
            <span className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-md shadow-purple-500/10 group-hover:scale-105 transition-transform"><Mail className="w-4 h-4" /></span>
            Voir Messages
          </Link>

          <Link
            to="/admin/dons"
            className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFE4C4]/20 hover:bg-[#FFE4C4]/35 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 border border-[#D2691E]/10 hover:border-[#D2691E]/20 text-[#8B4513] dark:text-amber-200 transition-all group font-bold text-xs"
          >
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform"><DollarSign className="w-4 h-4" /></span>
            Enregistrer Don
          </Link>

          <Link
            to="/admin/stocks"
            className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/50 hover:bg-blue-50 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 border border-blue-500/10 hover:border-blue-500/20 text-blue-800 dark:text-blue-300 transition-all group font-bold text-xs"
          >
            <span className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform"><Package className="w-4 h-4" /></span>
            Gérer les Stocks
          </Link>
        </div>
      </div>

      {/* Charts + Actions row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">Ambassadeurs recrutés</h3>
          </div>
          <p className="text-gray-400 text-xs">Évolution par mois (2025)</p>
          <BarChart data={barData} />
        </div>

        {/* Donut chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-extrabold text-gray-900 dark:text-white text-sm mb-1">Répartition équipe</h3>
          <p className="text-gray-400 text-xs mb-4">8 membres • 2 branches</p>
          <DonutChart segments={donutData} />
        </div>

        {/* Dernières actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">Actions terrain</h3>
            <Link to="/admin/projets" className="text-xs text-secondary font-bold flex items-center gap-1">
              Tout voir <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {projectsToDisplay.map((a) => (
              <div key={a.title} className="flex items-start gap-3 border border-gray-50 dark:border-gray-700/30 p-2 rounded-xl">
                <span className="text-lg shrink-0 mt-0.5">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white text-xs truncate">{a.title}</p>
                  <p className="text-gray-400 text-[10px] truncate mt-0.5">{a.detail}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${a.color}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unified Timeline Log Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-extrabold text-gray-900 dark:text-white text-sm flex items-center gap-2">
            <CheckCircle className="w-4.5 h-4.5 text-secondary" /> Journal d'activité récent
          </h3>
          <span className="text-[10px] text-gray-400 font-bold bg-slate-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
            Temps réel
          </span>
        </div>
        
        <div className="space-y-0 divide-y divide-gray-50">
          {/* Messages récents */}
          {recentMessages.length === 0 && recentDonations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-400 text-xs">Aucune activité enregistrée pour le moment.</p>
              <p className="text-gray-300 text-[10px] mt-1">Les nouveaux dons et messages apparaîtront ici dès qu'ils seront enregistrés.</p>
            </div>
          ) : (
            <>
              {recentMessages.slice(0, 2).map((m: any) => (
                <div key={`msg-${m.id}`} className="flex gap-3 items-start py-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="text-gray-800">
                      Nouveau message de <span className="font-bold text-purple-700">{m.nom}</span> : « {m.sujet} »
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(m.date_envoi).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Link to="/admin/messages" className="text-[10px] text-secondary font-bold underline shrink-0">Lire</Link>
                </div>
              ))}
              {recentDonations.slice(0, 3).map((d: any) => (
                <div key={`don-${d.id}`} className="flex gap-3 items-start py-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="text-gray-800">
                      Don enregistré : <span className="font-bold text-emerald-700">{parseFloat(d.montant).toLocaleString('fr-FR')}</span>
                      {d.message ? ` — ${d.message.substring(0, 50)}${d.message.length > 50 ? '...' : ''}` : ''}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Réf. {d.reference} · {new Date(d.date_don).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <Link to="/admin/dons" className="text-[10px] text-secondary font-bold underline shrink-0">Voir</Link>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
