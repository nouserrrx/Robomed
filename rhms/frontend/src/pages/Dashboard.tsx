import { useState, useEffect } from 'react'
import { 
  Users, Heart, GraduationCap, Mail,
  TrendingUp, CheckCircle, RefreshCw, 
  Search, ExternalLink, ShieldCheck, Sparkles, LayoutGrid
} from 'lucide-react'
import Button from '../components/ui/Button'
import { api } from '../services/api'

interface ContactMessage {
  id: number
  nom: string
  email: string
  categorie: string
  sujet: string
  message: string
  date_envoi: string
  lu: boolean
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'projects' | 'team'>('overview')
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch real messages from Django API
  const fetchMessages = async () => {
    setLoadingMessages(true)
    try {
      const res = await api.get('/contacts/')
      if (res.data) {
        setMessages(Array.isArray(res.data) ? res.data : res.data.results || [])
      }
    } catch (error) {
      console.log('Backend standard mode API:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const filteredMessages = messages.filter(
    (m) =>
      m.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sujet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.categorie?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ──────────────── DASHBOARD HEADER ──────────────── */}
        <div className="bg-[#0B2447] rounded-[32px] p-8 text-white mb-8 relative overflow-hidden shadow-xl">
          <div 
            className="absolute inset-0 opacity-10 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80')" }}
          />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Administrateur RoBomed
                </span>
                <span className="text-xs text-white/50">Fondée le 22 Avril 2025</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Tableau de bord</h1>
              <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-xl">
                Suivi des actions humanitaires, gestion des candidatures d'Ambassadeurs et messages reçus (Canada 🇨🇦 & Tchad 🇹🇩).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a 
                href="http://127.0.0.1:8000/admin/" 
                target="_blank" 
                rel="noreferrer"
              >
                <Button variant="secondary" size="md" className="gap-2">
                  <ExternalLink className="w-4 h-4" /> Admin Django
                </Button>
              </a>
              <Button 
                variant="outline" 
                size="md" 
                onClick={fetchMessages}
                className="text-white border-white/20 hover:bg-white/10"
              >
                <RefreshCw className={`w-4 h-4 ${loadingMessages ? 'animate-spin' : ''}`} /> Actualiser
              </Button>
            </div>
          </div>
        </div>

        {/* ──────────────── KPI CARDS GRID ──────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Dons */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 fill-emerald-600/20" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">Dons Collectés</span>
              <h3 className="text-2xl font-bold text-gray-900">8 320 €</h3>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +15% ce mois
              </p>
            </div>
          </div>

          {/* Card 2: Bénéficiaires */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">Bénéficiaires Impactés</span>
              <h3 className="text-2xl font-bold text-gray-900">12 540+</h3>
              <p className="text-[11px] text-blue-600 font-medium mt-0.5">Canada & Tchad</p>
            </div>
          </div>

          {/* Card 3: Ambassadeurs */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">Ambassadeurs Écoles</span>
              <h3 className="text-2xl font-bold text-gray-900">45 Éléves</h3>
              <p className="text-[11px] text-amber-600 font-medium mt-0.5">En cours de recrutement</p>
            </div>
          </div>

          {/* Card 4: Messages Backend */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">Messages Reçus</span>
              <h3 className="text-2xl font-bold text-gray-900">{messages.length}</h3>
              <p className="text-[11px] text-purple-600 font-medium mt-0.5">Base de données Django</p>
            </div>
          </div>
        </div>

        {/* ──────────────── TABBED NAVIGATION ──────────────── */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: Sparkles },
            { id: 'messages', label: `Messages (${messages.length})`, icon: Mail },
            { id: 'projects', label: 'Projets & Puits', icon: Heart },
            { id: 'team', label: 'Équipe (Canada/Tchad)', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-secondary text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* ──────────────── TAB 1: OVERVIEW ──────────────── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Actions récentes */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-secondary" /> Dernières réalisations terrain
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-sm">
                      🇹🇩
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Construction d'un puits d'eau potable</h4>
                      <p className="text-gray-500 text-xs mt-0.5">Financé par la vente solidaire de gâteaux et livres. Installation au Tchad.</p>
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium mt-2 inline-block">Terminé & Ininterrompu</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-sm">
                      🇨🇦
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Fleurs en crochet & Lettres de réconfort</h4>
                      <p className="text-gray-500 text-xs mt-0.5">Visite aux patients en soins palliatifs et enfants atteints de cancer.</p>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium mt-2 inline-block">Action Continue</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Visual Analytics & Progress Charts ── */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Évolution des Dons & Activités 2026</h3>
                    <p className="text-gray-400 text-xs mt-0.5">Statistiques mensuelles consolidées (Canada & Tchad)</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                    +24% Croissance
                  </span>
                </div>

                {/* SVG Bar Visual Chart */}
                <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-gray-100">
                  {[
                    { month: 'Jan', val: 45, amount: '1,200$' },
                    { month: 'Fév', val: 60, amount: '1,850$' },
                    { month: 'Mar', val: 50, amount: '1,500$' },
                    { month: 'Avr', val: 80, amount: '2,400$' },
                    { month: 'Mai', val: 70, amount: '2,100$' },
                    { month: 'Juin', val: 95, amount: '3,100$' },
                    { month: 'Juil', val: 85, amount: '2,800$' },
                    { month: 'Août', val: 100, amount: '3,450$' },
                  ].map(bar => (
                    <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group relative">
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#0B2447] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow pointer-events-none whitespace-nowrap z-10">
                        {bar.amount}
                      </div>
                      <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-32 flex items-end">
                        <div
                          className="w-full bg-gradient-to-t from-[#0B2447] to-secondary rounded-t-xl group-hover:brightness-110 transition-all duration-300"
                          style={{ height: `${bar.val}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500">{bar.month}</span>
                    </div>
                  ))}
                </div>

                {/* Distribution Canada vs Tchad Breakdown */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-red-50/50 rounded-2xl border border-red-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-red-900">🇨🇦 Canada (Soins & Pédiatrie)</span>
                    <span className="text-xs font-extrabold text-red-700">42%</span>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900">🇹🇩 Tchad (Eau & Éducation)</span>
                    <span className="text-xs font-extrabold text-blue-700">58%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Récents messages sidebar */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-base">Derniers messages</h3>
                <button 
                  onClick={() => setActiveTab('messages')} 
                  className="text-xs text-secondary font-semibold hover:underline"
                >
                  Tout voir
                </button>
              </div>
              
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  Aucun message reçu pour le moment.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.slice(0, 4).map((msg) => (
                    <div key={msg.id} className="p-3 rounded-2xl bg-slate-50 border border-gray-100 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900">{msg.nom}</span>
                        <span className="text-[9px] bg-secondary/10 text-secondary font-semibold px-2 py-0.5 rounded-full">
                          {msg.categorie || 'Contact'}
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium text-[11px] truncate">{msg.sujet}</p>
                      <p className="text-gray-400 text-[10px] truncate mt-1">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──────────────── TAB 2: MESSAGES (REAL DJANGO API) ──────────────── */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Messages & Demandes d'Ambassadeurs</h2>
                <p className="text-gray-500 text-xs">Données en direct depuis l'API Django (`/api/contacts/`).</p>
              </div>

              {/* Search input */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, sujet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>
            </div>

            {filteredMessages.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
                <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h4 className="font-bold text-gray-700 text-sm">Aucun message trouvé</h4>
                <p className="text-gray-400 text-xs mt-1">Les messages envoyés depuis la page Contact s'afficheront automatiquement ici.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-slate-50 text-gray-400 uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">Expéditeur</th>
                      <th className="p-3">Catégorie</th>
                      <th className="p-3">Sujet & Message</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 rounded-r-xl text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMessages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-gray-900">{msg.nom}</div>
                          <div className="text-gray-400 text-[11px]">{msg.email}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            msg.categorie === 'Ambassadeur'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : msg.categorie === 'Don'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {msg.categorie || 'Général'}
                          </span>
                        </td>
                        <td className="p-3 max-w-md">
                          <div className="font-semibold text-gray-900">{msg.sujet}</div>
                          <div className="text-gray-500 text-[11px] truncate mt-0.5">{msg.message}</div>
                        </td>
                        <td className="p-3 text-gray-400 whitespace-nowrap">
                          {msg.date_envoi ? new Date(msg.date_envoi).toLocaleDateString('fr-FR') : 'Récemment'}
                        </td>
                        <td className="p-3 text-right">
                          <a 
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.sujet)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-white rounded-lg font-semibold text-[11px] hover:bg-emerald-600 transition-colors"
                          >
                            <Mail className="w-3 h-3" /> Répondre
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ──────────────── TAB 3: PROJECTS ──────────────── */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Projets & Infrastructures</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-100 rounded-2xl p-5 bg-slate-50">
                <div className="text-secondary font-bold text-sm mb-1">🚰 Puits d'eau au Tchad</div>
                <p className="text-gray-500 text-xs">Financement réussi d'un puits d'eau potable de proximité.</p>
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-xs">
                  <span className="text-gray-400">Statut</span>
                  <span className="font-bold text-emerald-600">Actif</span>
                </div>
              </div>

              <div className="border border-gray-100 rounded-2xl p-5 bg-slate-50">
                <div className="text-[#0284C7] font-bold text-sm mb-1">📚 Fournitures Scolaires</div>
                <p className="text-gray-500 text-xs">Kits scolaires distribués aux élèves défavorisés.</p>
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-xs">
                  <span className="text-gray-400">Statut</span>
                  <span className="font-bold text-blue-600">En distribution</span>
                </div>
              </div>

              <div className="border border-gray-100 rounded-2xl p-5 bg-slate-50">
                <div className="text-amber-600 font-bold text-sm mb-1">🧁 Ventes Solidaires</div>
                <p className="text-gray-500 text-xs">Ventes de gâteaux, biscuits et livres pour financer nos projets.</p>
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-xs">
                  <span className="text-gray-400">Statut</span>
                  <span className="font-bold text-amber-600">Permanent</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────────────── TAB 4: TEAM ──────────────── */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Équipe RoBomed (8 Membres)</h2>
                  <p className="text-gray-500 text-xs mt-1">100% Étudiant · Fondée le 22 Avril 2025</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-100">🇨🇦 Canada · 4</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">🇹🇩 Tchad · 4</span>
                </div>
              </div>

              {/* Canada Branch */}
              <div className="mb-8">
                <h3 className="font-bold text-red-900 text-sm mb-4 flex items-center gap-2 border-b border-red-100 pb-2">
                  🇨🇦 Branche Canada — Coordination Internationale & Réseau Ambassadeurs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: "Aïcha Baradine", role: "Présidente & Fondatrice", emoji: "👑", photo: "/aicha.jpeg", color: "bg-amber-50 border-amber-200", text: "text-amber-800" },
                    { name: "Khatera Amiri", role: "Rédactrice & Communication", emoji: "✍️", photo: "/khatera.jpeg", color: "bg-purple-50 border-purple-200", text: "text-purple-800" },
                    { name: "Zamra Mohammed Thassim", role: "Designer Graphique", emoji: "🎨", photo: null, color: "bg-pink-50 border-pink-200", text: "text-pink-800" },
                    { name: "Fatime Salim Ossou", role: "Trésorière", emoji: "💰", photo: "/fatime.jpeg", color: "bg-emerald-50 border-emerald-200", text: "text-emerald-800" },
                  ].map((member) => (
                    <div key={member.name} className={`rounded-2xl border p-4 ${member.color} flex flex-col items-center text-center gap-2`}>
                      {member.photo ? (
                        <img 
                          src={member.photo} 
                          alt={member.name} 
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white/60 border-2 border-white shadow-md flex items-center justify-center text-2xl">
                          {member.emoji}
                        </div>
                      )}
                      <div>
                        <div className={`font-bold text-xs ${member.text}`}>{member.name}</div>
                        <div className="text-gray-500 text-[10px] mt-0.5">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tchad Branch */}
              <div>
                <h3 className="font-bold text-blue-900 text-sm mb-4 flex items-center gap-2 border-b border-blue-100 pb-2">
                  🇹🇩 Branche Tchad — Opérations Terrain & Projets Humanitaires
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: "Nouradine Zakaria Mahamat", role: "Technique & Digital", emoji: "💻", photo: "/nour.jpeg", color: "bg-blue-50 border-blue-200", text: "text-blue-800" },
                    { name: "Oumarou Billy", role: "Support & Logistique", emoji: "🤝", photo: "/billy.jpeg", color: "bg-cyan-50 border-cyan-200", text: "text-cyan-800" },
                    { name: "Ahmat", role: "—", emoji: "⭐", photo: null, color: "bg-indigo-50 border-indigo-200", text: "text-indigo-800" },
                    { name: "Membre #8", role: "Équipe Tchad", emoji: "🌍", photo: null, color: "bg-slate-50 border-slate-200", text: "text-slate-700" },
                  ].map((member) => (
                    <div key={member.name} className={`rounded-2xl border p-4 ${member.color} flex flex-col items-center text-center gap-2`}>
                      {member.photo ? (
                        <img 
                          src={member.photo} 
                          alt={member.name} 
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white/60 border-2 border-white shadow-md flex items-center justify-center text-2xl">
                          {member.emoji}
                        </div>
                      )}
                      <div>
                        <div className={`font-bold text-xs ${member.text}`}>{member.name}</div>
                        <div className="text-gray-500 text-[10px] mt-0.5">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
