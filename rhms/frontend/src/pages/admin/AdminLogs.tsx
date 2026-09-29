import { useState, useEffect } from 'react'
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon, Info, 
  Trash2, RefreshCw, Search, Filter, CheckCircle2, Globe 
} from 'lucide-react'
import { logsAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

interface IncidentLog {
  id: number
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  message: string
  source: string
  created_at: string
  user_name?: string
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<IncidentLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('ALL')
  const [filterSource, setFilterSource] = useState<string>('ALL')
  
  const toast = useToast()

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const data = await logsAPI.getAll()
      if (data) {
        setLogs(data)
      } else {
        toast.error('Erreur', 'Impossible de récupérer l\'historique des incidents.')
      }
    } catch (error) {
      toast.error('Erreur', 'Une erreur est survenue lors du chargement des logs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  // Calculate statistics
  const total = logs.length
  const infos = logs.filter(l => l.level === 'INFO').length
  const warnings = logs.filter(l => l.level === 'WARNING').length
  const errors = logs.filter(l => l.level === 'ERROR' || l.level === 'CRITICAL').length

  // Filter list
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) || 
                          log.source.toLowerCase().includes(search.toLowerCase()) ||
                          (log.user_name && log.user_name.toLowerCase().includes(search.toLowerCase()))
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel
    const matchesSource = filterSource === 'ALL' || log.source === filterSource
    return matchesSearch && matchesLevel && matchesSource
  })

  // Get distinct sources
  const distinctSources = Array.from(new Set(logs.map(l => l.source)))

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'INFO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 dark:bg-blue-500/20">
            <Info className="w-3.5 h-3.5" /> INFO
          </span>
        )
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> WARNING
          </span>
        )
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 dark:bg-red-500/20">
            <ShieldAlert className="w-3.5 h-3.5" /> ERROR
          </span>
        )
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5" /> CRITICAL
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      
      {/* ── KPI Widgets ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Logs */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider block">Total Événements</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white mt-1 block">{total}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center border border-gray-100 dark:border-gray-600">
            <ShieldCheck className="w-6 h-6 text-gray-400 dark:text-gray-300" />
          </div>
        </div>

        {/* Info Logs */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider block">Infos & Audits</span>
            <span className="text-2xl font-black text-blue-500 mt-1 block">{infos}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Info className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        {/* Warning Logs */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider block">Avertissements</span>
            <span className="text-2xl font-black text-amber-500 mt-1 block">{warnings}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        {/* Error Logs */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider block">Erreurs & Alertes</span>
            <span className="text-2xl font-black text-red-500 mt-1 block">{errors}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>

      {/* ── Tools / Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Filter, Search & Logs list */}
        <div className="lg:col-span-12 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un incident..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-880 rounded-xl text-xs outline-none focus:border-secondary text-gray-800 dark:text-gray-150 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              
              {/* Level Filter */}
              <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-105 dark:border-gray-850 px-3 py-2 rounded-xl">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={filterLevel}
                  onChange={e => setFilterLevel(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-gray-600 dark:text-gray-300 outline-none cursor-pointer"
                >
                  <option value="ALL">Tous Niveaux</option>
                  <option value="INFO">INFO</option>
                  <option value="WARNING">WARNING</option>
                  <option value="ERROR">ERROR</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              {/* Source Filter */}
              <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-105 dark:border-gray-850 px-3 py-2 rounded-xl">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={filterSource}
                  onChange={e => setFilterSource(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-gray-600 dark:text-gray-300 outline-none cursor-pointer"
                >
                  <option value="ALL">Toutes Sources</option>
                  {distinctSources.map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={fetchLogs}
                className="p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-500 hover:text-secondary border border-gray-100 dark:border-gray-850 rounded-xl hover:bg-white transition-all cursor-pointer"
                title="Rafraîchir"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Logs List Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-gray-700/80">
              
              {loading ? (
                <div className="p-12 text-center text-gray-500">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-secondary mb-3" />
                  <span className="text-xs font-semibold">Chargement du journal d'incidents...</span>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Aucun incident détecté</h4>
                  <p className="text-xs mt-1">Tous les services fonctionnent nominalement.</p>
                </div>
              ) : (
                filteredLogs.map(log => (
                  <div key={log.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-gray-900/30 transition-colors">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {getLevelBadge(log.level)}
                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-950/80 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider border border-gray-200/50 dark:border-gray-800">
                          {log.source}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(log.created_at).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-700 dark:text-gray-255 leading-relaxed font-semibold">
                        {log.message}
                      </p>

                      {log.user_name && (
                        <span className="text-[10px] text-emerald-500 font-bold block">
                          Déclenché par: @{log.user_name}
                        </span>
                      )}
                    </div>

                    <span
                      className="p-1.5 text-gray-400 rounded-lg shrink-0"
                      title="Journal sécurisé et immuable"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500/60" />
                    </span>
                  </div>
                ))
              )}

            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
