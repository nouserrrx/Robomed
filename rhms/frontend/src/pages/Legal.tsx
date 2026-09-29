import { useState } from 'react'
import { ShieldCheck, Lock, FileText, Globe, CheckCircle2 } from 'lucide-react'

export default function Legal() {
  const [activeSection, setActiveSection] = useState<'mentions' | 'privacy' | 'dons'>('mentions')

  return (
    <div className="bg-slate-50 dark:bg-[#080D18] min-h-screen py-10 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ──────────────── HEADER ──────────────── */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Cadre Juridique & Protection des Données
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
            Mentions Légales & Confidentialité
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
            Conformité aux exigences légales canadiennes (Loi 25), européennes (RGPD) et tchadiennes.
          </p>
        </div>

        {/* ──────────────── TABS ──────────────── */}
        <div className="flex justify-center border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSection('mentions')}
              className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeSection === 'mentions'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Mentions Légales
            </button>
            <button
              onClick={() => setActiveSection('privacy')}
              className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeSection === 'privacy'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Politique de Confidentialité (RGPD & Loi 25)
            </button>
            <button
              onClick={() => setActiveSection('dons')}
              className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeSection === 'dons'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Conditions des Dons & Reçus Fiscaux
            </button>
          </div>
        </div>

        {/* ──────────────── CONTENT BOX ──────────────── */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          
          {activeSection === 'mentions' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Éditeur de la Plateforme</h2>
              <p>
                Le site web et système de gestion <strong>RoBomed (RHMS)</strong> est édité par l’organisation étudiante humanitaire internationale <strong>RoBomed</strong>, fondée le 22 Avril 2025.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li><strong>Siège Canada :</strong> Montréal (Québec), Canada.</li>
                <li><strong>Coordination Tchad :</strong> N'Djamena, République du Tchad.</li>
                <li><strong>Contact officiel :</strong> contact@robomed.org / baradineaicha05@gmail.com</li>
                <li><strong>Direction de la publication :</strong> Équipe fondatrice RoBomed.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">2. Hébergement & Infrastructure</h2>
              <p>
                La plateforme et les API sont hébergées sur des infrastructures sécurisées conformes aux normes ISO 27001 et SOC 2, avec chiffrement SSL/TLS (HTTPS) de bout en bout.
              </p>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Collecte et Utilisation des Données</h2>
              <p>
                RoBomed s'engage à respecter la vie privée de ses donateurs, bénévoles et bénéficiaires conformément au <strong>Règlement Général sur la Protection des Données (RGPD)</strong> et à la <strong>Loi 25 du Québec (Canada)</strong> sur la protection des renseignements personnels.
              </p>
              
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Données collectées :</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li><strong>Donateurs :</strong> Nom, prénom, adresse e-mail, montant du don et historique des transactions nécessaires à la génération des reçus fiscaux.</li>
                <li><strong>Bénévoles :</strong> Coordonnées de contact, compétences déclarées et disponibilités pour les missions.</li>
                <li><strong>Bénéficiaires :</strong> Les données des personnes aidées font l’objet d’une protection stricte et ne sont jamais divulguées publiquement sans accord formel.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">2. Vos Droits d'Accès et de Rectification</h2>
              <p>
                Vous pouvez à tout moment demander l'accès, la modification ou la suppression intégrale de vos données personnelles en nous écrivant à <strong>privacy@robomed.org</strong>.
              </p>
            </div>
          )}

          {activeSection === 'dons' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Nature des Versements & Déductibilité Fiscale</h2>
              <p>
                Tous les dons réalisés sur RoBomed sont des contributions bénévoles et désintéressées destinées exclusivement au financement des actions d'aide humanitaire, d'accès à l'eau potable, de soutien aux enfants malades et d'éducation.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li><strong>France / Union Européenne :</strong> Déduction d'impôt estimative de 66% du montant du don dans la limite des plafonds légaux.</li>
                <li><strong>Canada :</strong> Crédit d'impôt pour don de bienfaisance admissible au fédéral et au provincial.</li>
                <li><strong>Reçu immédiat :</strong> Un reçu fiscal officiel avec numéro de référence unique est généré et téléchargeable dès validation du versement.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">2. Sécurité des Paiements</h2>
              <p>
                Les transactions sont sécurisées par chiffrement AES-256. RoBomed ne conserve aucun numéro de carte bancaire sur ses serveurs.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
