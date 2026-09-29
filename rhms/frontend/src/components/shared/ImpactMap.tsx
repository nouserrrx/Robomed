import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Droplets, Heart, BookOpen, Sparkles, X, ArrowRight, CheckCircle2, Globe, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import { useLanguage } from '../../context/LanguageContext'

export interface ImpactLocation {
  id: string
  name: string
  region: string
  country: 'tchad' | 'canada'
  type: 'water' | 'health' | 'education' | 'food'
  title: string
  description: string
  beneficiaries: number
  statLabel: string
  image: string
  x: number // percentage on svg canvas
  y: number
  status: 'completed' | 'in_progress' | 'planned'
  year: string
}

export const impactLocations: ImpactLocation[] = [
  // ── TCHAD 🇹🇩 ──
  {
    id: 'tchad-1',
    name: "N'Djamena (Quartier Farcha)",
    region: 'Chari-Baguirmi',
    country: 'tchad',
    type: 'water',
    title: "Puits Solaire & Pompe d'Eau Potable",
    description: "Forage moderne équipé d'une pompe solaire et d'un réservoir de 5 000L alimentant plus de 450 familles du quartier défavorisé.",
    beneficiaries: 2800,
    statLabel: 'Litres/jour : 15 000L',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&q=80',
    x: 52,
    y: 58,
    status: 'completed',
    year: '2025',
  },
  {
    id: 'tchad-2',
    name: 'Région du Guéra (Mongo)',
    region: 'Guéra',
    country: 'tchad',
    type: 'education',
    title: 'Fournitures Scolaires & Réfection de Classes',
    description: 'Distribution de 600 cartables équipés et réfection des toitures de 3 salles de classe pour la rentrée scolaire.',
    beneficiaries: 600,
    statLabel: 'Élèves équipés : 600',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
    x: 58,
    y: 62,
    status: 'completed',
    year: '2025',
  },
  {
    id: 'tchad-3',
    name: 'Mao (Région du Kanem)',
    region: 'Kanem',
    country: 'tchad',
    type: 'food',
    title: 'Paniers Nutritionnels & Urgence Sécheresse',
    description: "Aide d'urgence avec distribution de sacs de céréales, d'huile fortifiée et de compléments nutritionnels pour les mères et nourrissons.",
    beneficiaries: 1200,
    statLabel: 'Familles soutenues : 240',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    x: 48,
    y: 50,
    status: 'in_progress',
    year: '2026',
  },
  // ── CANADA 🇨🇦 ──
  {
    id: 'canada-1',
    name: 'Montréal (CHU Sainte-Justine)',
    region: 'Québec',
    country: 'canada',
    type: 'health',
    title: 'Kits Réconfort Oncologie Pédiatrique',
    description: 'Distribution mensuelle de boîtes de douceurs, jeux d’éveil et mots d’encouragement personnalisés aux enfants hospitalisés en oncologie.',
    beneficiaries: 320,
    statLabel: 'Kits remis : 320',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80',
    x: 28,
    y: 35,
    status: 'completed',
    year: '2025-2026',
  },
  {
    id: 'canada-2',
    name: 'Québec (Maison Michel-Sarrazin)',
    region: 'Québec',
    country: 'canada',
    type: 'health',
    title: 'Fleurs au Crochet & Lettres en Soins Palliatifs',
    description: 'Confection manuelle par nos bénévoles étudiants de plus de 450 fleurs au crochet et cartes poétiques pour adoucir le quotidien des patients.',
    beneficiaries: 450,
    statLabel: 'Fleurs & lettres : 450+',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
    x: 32,
    y: 32,
    status: 'completed',
    year: '2025-2026',
  },
  {
    id: 'canada-3',
    name: 'Ottawa / Gatineau (Campus Universitaires)',
    region: 'Ontario / Québec',
    country: 'canada',
    type: 'education',
    title: 'Ventes Solidaires & Mobilisation Étudiante',
    description: 'Ateliers de sensibilisation et vente de pâtisseries et créations artisanales dont 100% des bénéfices financent les puits au Tchad.',
    beneficiaries: 1500,
    statLabel: 'Fonds collectés : 6 500 $CAD',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    x: 25,
    y: 38,
    status: 'in_progress',
    year: '2026',
  },
]

export default function ImpactMap() {
  const { t } = useLanguage()
  const [selectedCountry, setSelectedCountry] = useState<'all' | 'tchad' | 'canada'>('all')
  const [selectedType, setSelectedType] = useState<'all' | 'water' | 'health' | 'education' | 'food'>('all')
  const [activePin, setActivePin] = useState<ImpactLocation | null>(null)

  const filteredLocations = impactLocations.filter(loc => {
    if (selectedCountry !== 'all' && loc.country !== selectedCountry) return false
    if (selectedType !== 'all' && loc.type !== selectedType) return false
    return true
  })

  const totalBeneficiaries = impactLocations.reduce((sum, item) => sum + item.beneficiaries, 0)

  return (
    <div className="relative bg-gradient-to-br from-[#061224] via-[#091D3A] to-[#040C18] text-white rounded-3xl p-6 sm:p-10 border border-white/10 overflow-hidden shadow-2xl">
      {/* Background radial highlights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header section */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            Cartographie Terrain en Direct
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Nos Zones d'Intervention & Impact
          </h2>
          <p className="text-white/70 text-sm sm:text-base mt-2 max-w-2xl">
            Explorez les projets concrets déployés par RoBomed au <strong>Tchad 🇹🇩</strong> et au <strong>Canada 🇨🇦</strong>. Cliquez sur un point pour découvrir les détails et indicateurs de terrain.
          </p>
        </div>

        {/* Aggregate KPI */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalBeneficiaries.toLocaleString('fr-FR')}+</div>
            <div className="text-xs text-white/60 font-semibold uppercase tracking-wider">Vies impactées au total</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-white/60 uppercase mr-1">Pays :</span>
          <button
            onClick={() => setSelectedCountry('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCountry === 'all'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            Tous ({impactLocations.length})
          </button>
          <button
            onClick={() => setSelectedCountry('tchad')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedCountry === 'tchad'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            🇹🇩 Tchad (3)
          </button>
          <button
            onClick={() => setSelectedCountry('canada')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedCountry === 'canada'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            🇨🇦 Canada (3)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-white/60 uppercase mr-1">Domaine :</span>
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${selectedType === 'all' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
          >
            Tous
          </button>
          <button
            onClick={() => setSelectedType('water')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 ${selectedType === 'water' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40' : 'text-white/60 hover:text-white'}`}
          >
            <Droplets className="w-3.5 h-3.5" /> Eau
          </button>
          <button
            onClick={() => setSelectedType('health')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 ${selectedType === 'health' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40' : 'text-white/60 hover:text-white'}`}
          >
            <Heart className="w-3.5 h-3.5" /> Santé
          </button>
          <button
            onClick={() => setSelectedType('education')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 ${selectedType === 'education' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'text-white/60 hover:text-white'}`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Éducation
          </button>
        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div className="relative z-10 w-full min-h-[380px] sm:min-h-[460px] rounded-2xl bg-[#040C1A]/90 border border-white/10 overflow-hidden flex items-center justify-center p-4">
        
        {/* World Grid Lines Background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Stylized Vector World Silhouette */}
        <svg viewBox="0 0 1000 500" className="w-full h-full max-h-[440px] select-none opacity-40">
          <defs>
            <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          {/* North America */}
          <path d="M150,80 Q250,60 300,100 Q320,180 260,240 Q180,260 140,180 Z" fill="url(#mapGrad)" stroke="#334155" strokeWidth="1.5" />
          {/* Africa */}
          <path d="M480,180 Q560,170 580,240 Q570,360 500,420 Q440,320 450,230 Z" fill="url(#mapGrad)" stroke="#334155" strokeWidth="1.5" />
          {/* Europe */}
          <path d="M470,80 Q550,70 560,140 Q490,160 460,120 Z" fill="url(#mapGrad)" stroke="#334155" strokeWidth="1.5" />
          {/* Connection Arc Line Canada <-> Chad */}
          <path
            d="M 280 160 Q 380 40 520 280"
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="animate-pulse"
            opacity="0.7"
          />
        </svg>

        {/* Bridge Label */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-lg pointer-events-none flex items-center gap-2">
          <span>🇨🇦 Canada</span>
          <span className="text-white/50">⇄ Pont Solidaire ⇄</span>
          <span>🇹🇩 Tchad</span>
        </div>

        {/* Location Markers */}
        {filteredLocations.map((loc) => {
          const isSelected = activePin?.id === loc.id
          return (
            <motion.div
              key={loc.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.25 }}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              onClick={() => setActivePin(loc)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
            >
              {/* Pulse Ring */}
              <span className="absolute -inset-2 rounded-full bg-emerald-400/30 animate-ping" />
              
              {/* Pin Icon Bubble */}
              <div
                className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-xl transition-all ${
                  isSelected
                    ? 'bg-emerald-400 text-[#061224] ring-4 ring-white shadow-emerald-400/50 scale-110'
                    : loc.country === 'tchad'
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400 ring-2 ring-white/60'
                    : 'bg-blue-500 text-white hover:bg-blue-400 ring-2 ring-white/60'
                }`}
              >
                {loc.type === 'water' && <Droplets className="w-4 h-4" />}
                {loc.type === 'health' && <Heart className="w-4 h-4" />}
                {loc.type === 'education' && <BookOpen className="w-4 h-4" />}
                {loc.type === 'food' && <Sparkles className="w-4 h-4" />}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                <div className="px-3 py-1.5 rounded-xl bg-gray-900/95 text-white text-xs font-bold whitespace-nowrap shadow-2xl border border-white/15 backdrop-blur-md">
                  {loc.name} · <span className="text-emerald-400">{loc.beneficiaries}+ aidés</span>
                </div>
                <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Detail Modal / Panel when a Pin is selected */}
      <AnimatePresence>
        {activePin && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 relative z-20 shadow-2xl"
          >
            <button
              onClick={() => setActivePin(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Photo */}
              <div className="md:col-span-4 rounded-xl overflow-hidden h-48 md:h-full min-h-[180px] relative">
                <img src={activePin.image} alt={activePin.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {activePin.name}
                </div>
              </div>

              {/* Text & Stats */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase">
                    {activePin.country === 'tchad' ? '🇹🇩 Tchad' : '🇨🇦 Canada'} · {activePin.year}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-medium">
                    {activePin.statLabel}
                  </span>
                  <span className="ml-auto text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Projet Déployé
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">{activePin.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{activePin.description}</p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link to="/faire-un-don">
                    <Button variant="secondary" size="sm" className="gap-2">
                      Soutenir ce projet <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/projets">
                    <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                      Voir tous les projets
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
