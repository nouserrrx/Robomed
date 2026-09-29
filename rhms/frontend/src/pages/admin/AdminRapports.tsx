import React, { useState, useEffect } from 'react'
import {
  FileText, Download, FileSpreadsheet, Activity,
  CheckCircle2, Clock, Loader2, Sparkles,
  BarChart3, ShieldCheck, Heart, Users, Package, RefreshCw
} from 'lucide-react'
import { reportsAPI, statsAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function AdminRapports() {
  const [stats, setStats] = useState<any>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [downloadingExcel, setDownloadingExcel] = useState(false)
  const { success, error: toastError } = useToast()

  const loadStats = async () => {
    setLoadingStats(true)
    try {
      const data = await statsAPI.getImpact()
      setStats(data)
    } catch {
      // Ignorer
    } finally {
      setLoadingStats(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true)
    try {
      await reportsAPI.downloadPdf()
      success('Téléchargement lancé', 'Le rapport d\'activité PDF officiel a été généré avec succès.')
    } catch {
      toastError('Erreur', 'Impossible de générer le rapport PDF.')
    } finally {
      setDownloadingPdf(false)
    }
  }

  const handleDownloadExcel = async () => {
    setDownloadingExcel(true)
    try {
      await reportsAPI.downloadExcel()
      success('Téléchargement lancé', 'Le classeur consolidé Excel multi-feuilles a été généré avec succès.')
    } catch {
      toastError('Erreur', 'Impossible de générer le fichier Excel.')
    } finally {
      setDownloadingExcel(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Centre de Rapports & Exports Décisionnels</h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Génération serveur de documents officiels PDF et classeurs Excel consolidés pour la transparence et les partenaires.
          </p>
        </div>
        <button
          onClick={loadStats}
          className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
          title="Rafraîchir les statistiques"
        >
          <RefreshCw className={`w-4 h-4 ${loadingStats ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Real-time Impact Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Bénéficiaires</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 dark:text-white">
            {stats?.beneficiaires ?? '—'}
          </div>
          <span className="text-[10px] text-gray-400">Total enregistré</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Dons Confirmés</span>
            <Heart className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 dark:text-white">
            {stats?.dons ?? '—'}
          </div>
          <span className="text-[10px] text-gray-400">Transparence financière</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Articles Distribués</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 dark:text-white">
            {stats?.articles_distribues ?? '—'}
          </div>
          <span className="text-[10px] text-gray-400">Kits & vivres</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Bénévoles Mobilisés</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 dark:text-white">
            {stats?.benevoles ?? '—'}
          </div>
          <span className="text-[10px] text-gray-400">Canada & Tchad</span>
        </div>
      </div>

      {/* Reports Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Activity Report */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-6 h-6 text-blue-300" />
            </div>
            <h2 className="text-lg font-bold">Rapport d'Activité & d'Impact Officiel (PDF)</h2>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Document officiel structuré au format A4 généré dynamiquement côté serveur. Comprend la synthèse des indicateurs d'impact, les projets prioritaires, le détail des distributions et le tampon de certification de l'ONG RoBomed.
            </p>
            <div className="space-y-1 text-xs text-blue-200/70 pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Synthèse exécutive et indicateurs clés
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tableau d'avancement des projets
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Récapitulatif des distributions terrain
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="w-full py-3 px-4 bg-white text-blue-900 font-bold text-xs rounded-xl hover:bg-blue-50 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {downloadingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-900" /> Génération du PDF en cours...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-blue-900" /> Télécharger le Rapport d'Activité (PDF)
              </>
            )}
          </button>
        </div>

        {/* Excel Multi-sheet Export */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FileSpreadsheet className="w-6 h-6 text-emerald-300" />
            </div>
            <h2 className="text-lg font-bold">Classeur Consolidé de Gestion (Excel .xlsx)</h2>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Export exhaustif multi-onglets au standard Microsoft Excel. Idéal pour l'audit financier, le contrôle logistique et la vérification des stocks et des familles bénéficiaires.
            </p>
            <div className="space-y-1 text-xs text-emerald-200/70 pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Onglet 1 : Synthèse & KPIs globaux
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Onglet 2 : Grand livre des dons & collectes
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Onglets 3, 4 & 5 : Distributions, Stocks et Bénéficiaires
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="w-full py-3 px-4 bg-white text-emerald-900 font-bold text-xs rounded-xl hover:bg-emerald-50 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {downloadingExcel ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-900" /> Préparation du classeur Excel...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-emerald-900" /> Exporter le Classeur Excel (.xlsx)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
