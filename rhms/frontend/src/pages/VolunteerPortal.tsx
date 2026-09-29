import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Award, Calendar, MapPin, Clock, CheckCircle2,
  Sparkles, FileText, Send, Heart, BookOpen, Droplets,
  PlusCircle, Download, ArrowRight, ShieldCheck
} from 'lucide-react'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import CertificateModal from '../components/CertificateModal'
import { api } from '../services/api'

interface Mission {
  id: string
  title: string
  location: string
  country: 'tchad' | 'canada' | 'remote'
  type: string
  commitment: string
  description: string
  spotsTotal: number
  spotsFilled: number
  status: 'open' | 'urgent' | 'completed'
  skills: string[]
}

const openMissions: Mission[] = [
  {
    id: 'm-1',
    title: 'Atelier de Crochet & Confection de Fleurs Solidares',
    location: 'Montréal (Campus & Résidences)',
    country: 'canada',
    type: 'Soins Palliatifs',
    commitment: '2 à 4h / semaine',
    description: 'Participez à la confection de fleurs en crochet et cartes d’encouragement destinées aux personnes hospitalisées en fin de vie.',
    spotsTotal: 15,
    spotsFilled: 11,
    status: 'open',
    skills: ['Créativité', 'Patience', 'Crochet'],
  },
  {
    id: 'm-2',
    title: 'Coordination Logistique Forage Puits Solaires',
    location: "N'Djamena & Région du Chari-Baguirmi",
    country: 'tchad',
    type: 'Eau Potable & Génie',
    commitment: 'Mission Terrain 2 semaines',
    description: 'Suivi de chantier avec les techniciens locaux, contrôle de la qualité de l’eau et sensibilisation de la population à l’entretien du forage.',
    spotsTotal: 4,
    spotsFilled: 2,
    status: 'urgent',
    skills: ['Logistique', 'Génie Civil', 'Gestion de projet'],
  },
  {
    id: 'm-3',
    title: 'Distribution de Kits Scolaires & Animation Jeunesse',
    location: 'Mongo (Région du Guéra)',
    country: 'tchad',
    type: 'Éducation',
    commitment: '1 semaine',
    description: 'Remise en mains propres des manuels, cahiers et cartables aux élèves des écoles primaires rurales et ateliers de lecture.',
    spotsTotal: 8,
    spotsFilled: 5,
    status: 'open',
    skills: ['Pédagogie', 'Animation', 'Arabe / Français'],
  },
  {
    id: 'm-4',
    title: 'Ambassadeur Campus & Campagne de Dons Digitale',
    location: 'Télétravail / Tout Campus (Canada & Tchad)',
    country: 'remote',
    type: 'Communication & Plaidoyer',
    commitment: 'Flexible (1 à 3h / semaine)',
    description: 'Représentez RoBomed dans votre université ou lycée, organisez des ventes de gâteaux solidaires et relayez nos campagnes sur les réseaux.',
    spotsTotal: 30,
    spotsFilled: 18,
    status: 'open',
    skills: ['Réseaux Sociaux', 'Prise de parole', 'Mobilisation'],
  },
]

export default function VolunteerPortal() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const toast = useToast()

  const [missionsList, setMissionsList] = useState<Mission[]>(openMissions)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'tchad' | 'canada' | 'remote'>('all')
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [showCertModal, setShowCertModal] = useState(false)
  const [appliedMissions, setAppliedMissions] = useState<string[]>([])
  const [submittingApply, setSubmittingApply] = useState(false)

  const [formData, setFormData] = useState({
    motivation: '',
    phone: '',
    availability: 'weekends',
  })

  // Charger les missions créées sur le backend en temps réel
  useEffect(() => {
    api.get('/projects/missions/')
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.results || [])
        if (list.length > 0) {
          const mapped: Mission[] = list.map((m: any) => ({
            id: String(m.id),
            title: m.titre,
            location: m.projet_titre || m.lieu || "Canada / Tchad",
            country: (m.description?.toLowerCase().includes('tchad') || m.titre?.toLowerCase().includes('tchad')) ? 'tchad' : 'canada',
            type: m.statut === 'en_cours' ? 'Mission Active' : 'Action Terrain',
            commitment: 'Flexible',
            description: m.description || 'Action humanitaire et engagement terrain.',
            spotsTotal: 10,
            spotsFilled: 4,
            status: m.statut === 'en_cours' ? 'urgent' : 'open',
            skills: ['Solidarité', 'Engagement'],
          }))
          setMissionsList(mapped)
        }
      })
      .catch(() => {})
  }, [])

  const filteredMissions = missionsList.filter(m => {
    if (selectedFilter === 'all') return true
    return m.country === selectedFilter
  })

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMission) return

    setSubmittingApply(true)
    try {
      await api.post('/volunteers/', {
        competences: `Candidature pour la mission : ${selectedMission.title}. Motivation : ${formData.motivation}`,
        disponibilites: formData.availability,
        applicant_name: user?.name || '',
        applicant_email: user?.email || '',
        applicant_phone: formData.phone,
      })
      setAppliedMissions(prev => [...prev, selectedMission.id])
      toast.success('Candidature transmise avec succès !', `Votre inscription à la mission "${selectedMission.title}" a été enregistrée en base de données et transmise au coordinateur.`)
      setSelectedMission(null)
      setFormData({ motivation: '', phone: '', availability: 'weekends' })
    } catch {
      toast.error('Erreur', 'Impossible de transmettre la candidature. Vérifiez votre connexion.')
    } finally {
      setSubmittingApply(false)
    }
  }

  const handleCertificateClick = () => {
    if (!user) {
      toast.error('Connexion requise', 'Connectez-vous à votre espace bénévole pour générer votre certificat officiel.')
      return
    }
    setShowCertModal(true)
  }

  return (
    <div className="bg-slate-50 dark:bg-[#080D18] min-h-screen py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ──────────────── PORTAL HERO BANNER ──────────────── */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#061B36] via-[#092B54] to-[#04162C] text-white p-8 sm:p-10 overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" /> Portail Ambassadeurs & Bénévoles
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Rejoignez le Mouvement RoBomed
              </h1>
              <p className="text-white/70 text-sm sm:text-base max-w-xl">
                Mettez vos compétences et votre énergie au service des populations vulnérables entre le Canada et le Tchad.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={handleCertificateClick}
                className="gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Award className="w-4 h-4" /> Générer mon Certificat Officiel
              </Button>
            </div>
          </div>
        </div>

        {/* ──────────────── VOLUNTEER METRICS ──────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-1">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bénévoles Engagés</div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">45+ Étudiants</div>
            <div className="text-xs text-emerald-600 font-semibold">Canada 🇨🇦 & Tchad 🇹🇩</div>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-1">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Heures de Bénévolat</div>
            <div className="text-3xl font-black text-blue-600">1 420 Heures</div>
            <div className="text-xs text-gray-500">Comptabilisées en 2025-2026</div>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-1">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Missions Réalisées</div>
            <div className="text-3xl font-black text-emerald-600">18 Missions</div>
            <div className="text-xs text-gray-500">100% à impact direct</div>
          </div>
        </div>

        {/* ──────────────── MISSIONS CATALOG ──────────────── */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                Missions Ouvertes aux Bénévoles
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                Sélectionnez une mission et postulez en quelques clics.
              </p>
            </div>

            {/* Country Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                Toutes ({openMissions.length})
              </button>
              <button
                onClick={() => setSelectedFilter('tchad')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === 'tchad'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                🇹🇩 Tchad (2)
              </button>
              <button
                onClick={() => setSelectedFilter('canada')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === 'canada'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                🇨🇦 Canada (1)
              </button>
              <button
                onClick={() => setSelectedFilter('remote')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === 'remote'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                🌐 Campus / Distance (1)
              </button>
            </div>
          </div>

          {/* Missions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMissions.map((m) => {
              const isApplied = appliedMissions.includes(m.id)
              return (
                <div
                  key={m.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        {m.type}
                      </span>
                      {m.status === 'urgent' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950 text-red-600 text-xs font-bold animate-pulse">
                          Recrutement Urgent
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {m.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                      {m.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400 pt-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{m.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                        <span>Engagement : <strong>{m.commitment}</strong></span>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {m.skills.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                          #{s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      Places : <strong>{m.spotsFilled}/{m.spotsTotal}</strong>
                    </span>
                    {isApplied ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Candidature transmise
                      </span>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedMission(m)}
                        className="gap-1.5"
                      >
                        Rejoindre cette mission <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ──────────────── APPLICATION MODAL ──────────────── */}
        <AnimatePresence>
          {selectedMission && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-800 space-y-5"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Candidature Bénévole</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    {selectedMission.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedMission.location} · {selectedMission.commitment}
                  </p>
                </div>

                <form onSubmit={handleApply} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      Vos disponibilités
                    </label>
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                    >
                      <option value="weekends">Fins de semaine (Samedi / Dimanche)</option>
                      <option value="evenings">En soirée après les cours (17h - 20h)</option>
                      <option value="fulltime">Plein temps lors des vacances académiques</option>
                      <option value="flexible">Quelques heures flexibles par semaine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      Numéro de téléphone / WhatsApp (Optionnel)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (Canada) ou +235 (Tchad)"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      Pourquoi souhaitez-vous rejoindre cette mission ?
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Vos motivations, compétences utiles..."
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => setSelectedMission(null)}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      variant="secondary"
                      size="md"
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" /> Envoyer ma candidature
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ──────────────── OFFICIAL CERTIFICATE MODAL ──────────────── */}
        <CertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          recipientName={user?.name || 'Ambassadeur RoBomed'}
          role="Bénévole & Ambassadeur Solidaire"
          location="Canada 🇨🇦 & Tchad 🇹🇩"
        />

      </div>
    </div>
  )
}
