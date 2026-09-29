import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck, FileText, Download, PieChart, Users,
  CheckCircle2, ArrowRight, Award, Lock, Sparkles, Building, Heart
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { generateTaxReceiptPDF } from '../utils/taxReceiptPdf'

export default function Transparence() {
  const [activeTab, setActiveTab] = useState<'budget' | 'governance' | 'ethics'>('budget')

  const budgetBreakdown = [
    { label: 'Projets Humanitaires Terrain (Puits, Écoles, Soins)', percentage: 87, color: '#10B981', amount: '87 000 € / 100 000 €' },
    { label: 'Logistique, Transport & Acheminement Matériel', percentage: 8, color: '#0284C7', amount: '8 000 € / 100 000 €' },
    { label: 'Frais de Gestion, Hébergement & Outils Numériques', percentage: 5, color: '#8B5CF6', amount: '5 000 € / 100 000 €' },
  ]

  const annualReports = [
    {
      year: '2025',
      title: 'Rapport Annuel d’Activité & Bilan Financier RoBomed 2025',
      size: '2.4 MB',
      date: 'Janvier 2026',
      status: 'Audité & Certifié',
    },
    {
      year: '2025 (S1)',
      title: 'Rapport Spécial : Campagne Puits d’Eau & Santé Tchad',
      size: '1.8 MB',
      date: 'Septembre 2025',
      status: 'Mission Validée',
    },
    {
      year: '2025 (S2)',
      title: 'Bilan d’Impact : Soins Palliatifs & Oncologie Pédiatrique Canada',
      size: '1.5 MB',
      date: 'Décembre 2025',
      status: 'Rapport Hôpitaux',
    },
  ]

  const handleDownloadFakeReport = (rep: typeof annualReports[0]) => {
    // Generate a formal summary report in new window / PDF print
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${rep.title}</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
          .header { border-bottom: 2px solid #10B981; padding-bottom: 10px; margin-bottom: 20px; }
          h1 { color: #0B2447; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RoBomed Humanitaire — ${rep.title}</h1>
          <p>Période : ${rep.year} · Statut : ${rep.status}</p>
        </div>
        <h3>1. Synthèse Financière</h3>
        <p>100% des fonds collectés via les ventes solidaires et dons privés ont été alloués conformément aux statuts de RoBomed.</p>
        <ul>
          <li>87% dédiés aux investissements de terrain (Puits à N'Djamena, kits scolaires, fournitures hospitalières).</li>
          <li>8% aux frais logistiques et acheminements certifiés.</li>
          <li>5% aux coûts administratifs et serveurs.</li>
        </ul>
        <h3>2. Certification de l'Équipe Fondatrice</h3>
        <p>Document officiel établi par l'organisation étudiante RoBomed (Canada 🇨🇦 & Tchad 🇹🇩).</p>
      </body>
      </html>
    `)
    w.document.close()
  }

  return (
    <div className="bg-slate-50 dark:bg-[#080D18] min-h-screen py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* ──────────────── HERO BANNER ──────────────── */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#061427] via-[#0B254A] to-[#041224] text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-white/10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" /> Transparence Totale & Éthique
          </div>
          <h1 className="text-3xl sm:text-5xl font-black max-w-3xl mx-auto tracking-tight">
            Chaque centime, chaque action vérifiable en toute clarté.
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
            Fondée le 22 Avril 2025 par 8 étudiants engagés, RoBomed fait de la transparence financière le socle absolu de son action humanitaire entre le Canada 🇨🇦 et le Tchad 🇹🇩.
          </p>
        </div>

        {/* ──────────────── FINANCIAL REPARTITION ──────────────── */}
        <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 sm:p-10 shadow-sm space-y-8">
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Allocation des Ressources
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
              Où va votre argent ?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
              Nous minimisons drastiquement les frais administratifs pour maximiser l’impact direct auprès des bénéficiaires.
            </p>
          </div>

          {/* Visual Percentage Bar */}
          <div className="space-y-4">
            <div className="w-full h-8 rounded-2xl overflow-hidden flex shadow-inner bg-gray-100 dark:bg-gray-800">
              <div
                style={{ width: '87%' }}
                className="bg-emerald-500 flex items-center justify-center text-xs font-black text-white"
                title="87% Terrain"
              >
                87% Terrain
              </div>
              <div
                style={{ width: '8%' }}
                className="bg-sky-500 flex items-center justify-center text-xs font-black text-white"
                title="8% Logistique"
              >
                8%
              </div>
              <div
                style={{ width: '5%' }}
                className="bg-purple-500 flex items-center justify-center text-xs font-black text-white"
                title="5% Gestion"
              >
                5%
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {budgetBreakdown.map((item) => (
                <div
                  key={item.label}
                  className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{item.percentage}%</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-snug">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-gray-400 font-mono">
                    Exemple : {item.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ──────────────── AUDITED REPORTS DOWNLOADS ──────────────── */}
        <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 sm:p-10 shadow-sm space-y-6">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Documents & Audits
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
              Rapports Annuels & Bilans Financiers
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
              Consultez et téléchargez librement nos bilans d’activité certifiés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {annualReports.map((r) => (
              <div
                key={r.title}
                className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      {r.year}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">{r.size}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                    {r.title}
                  </h3>
                  <p className="text-xs text-gray-500">Publié en {r.date} · {r.status}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadFakeReport(r)}
                  className="w-full gap-2 text-xs"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-500" /> Télécharger le PDF
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* ──────────────── ETHICAL CHARTER & GOVERNANCE ──────────────── */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0B2447] to-[#061224] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" /> Les 4 Engagements Inviolables de RoBomed
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">
                Notre Charte Éthique & Déontologique
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-white/80 leading-relaxed">
                    <strong>Gestion 100% bénévole :</strong> Aucun dirigeant ou étudiant fondateur ne perçoit de rémunération.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-white/80 leading-relaxed">
                    <strong>Achats locaux privilégiés :</strong> Tous les matériaux et denrées sont achetés localement au Tchad pour soutenir l'économie.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-white/80 leading-relaxed">
                    <strong>Respect de la dignité humaine :</strong> Protection stricte de l’image et des données des bénéficiaires et enfants soignés.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-white/80 leading-relaxed">
                    <strong>Reçus fiscaux conformes :</strong> Émission automatique de reçus valides pour déductions d'impôts.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-center space-y-3">
              <Building className="w-12 h-12 text-emerald-400" />
              <div className="text-sm font-bold text-white">Besoin d'un audit spécifique ?</div>
              <p className="text-xs text-white/70">
                Nos coordinateurs répondent aux demandes de fondations et partenaires institutionnels.
              </p>
              <Link to="/contact">
                <Button variant="secondary" size="sm" className="gap-2">
                  Nous Contacter <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
