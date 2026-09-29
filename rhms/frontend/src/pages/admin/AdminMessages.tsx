import { useEffect, useState } from 'react'
import { Mail, Search, RefreshCw, Eye, Trash2, CheckCircle2, Clock, X, Send, Download } from 'lucide-react'
import { exportToCSV } from '../../utils/exportCsv'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/api'

interface Msg {
  id: number
  nom: string
  email: string
  categorie: string
  sujet: string
  message: string
  date_envoi: string
  lu: boolean
}

const catColor: Record<string, string> = {
  Ambassadeur: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Partenariat: 'bg-blue-50 text-blue-700 border-blue-200',
  Don: 'bg-amber-50 text-amber-700 border-amber-200',
  Général: 'bg-slate-50 text-slate-700 border-slate-200',
}

export default function AdminMessages() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Tous')
  const [selectedMsg, setSelectedMsg] = useState<Msg | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const { success, error: toastError } = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const r = await api.get('/contacts/')
      if (r.data) {
        const fetched = Array.isArray(r.data) ? r.data : r.data.results ?? []
        setMsgs(fetched)
      }
    } catch (e) {
      // Keep empty if API error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const categories = ['Tous', ...Array.from(new Set(msgs.map(m => m.categorie || 'Général')))]

  const filtered = msgs.filter(m => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      m.nom?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.sujet?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q)
    const matchCat = filter === 'Tous' || (m.categorie || 'Général') === filter
    return matchSearch && matchCat
  })

  const toggleLu = async (id: number, currentLu: boolean) => {
    setMsgs(msgs.map(m => (m.id === id ? { ...m, lu: !currentLu } : m)))
    try {
      await api.patch(`/contacts/${id}/`, { lu: !currentLu })
    } catch (e) {
      setMsgs(msgs.map(m => (m.id === id ? { ...m, lu: currentLu } : m)))
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous supprimer ce message ?')) return
    const original = [...msgs]
    setMsgs(msgs.filter(m => m.id !== id))
    if (selectedMsg?.id === id) setSelectedMsg(null)
    try {
      await api.delete(`/contacts/${id}/`)
      success('Message supprimé')
    } catch {
      toastError('Erreur', 'Impossible de supprimer le message sur le serveur.')
      setMsgs(original)
    }
  }

  const handleOpenDetail = async (m: Msg) => {
    setSelectedMsg(m)
    if (!m.lu) {
      setMsgs(msgs.map(x => (x.id === m.id ? { ...x, lu: true } : x)))
      try {
        await api.patch(`/contacts/${m.id}/`, { lu: true })
      } catch (e) {
        console.error('Failed to update status on server:', e)
      }
    }
  }

  const handleSendDirectReply = async () => {
    if (!selectedMsg || !replyText.trim()) return
    setSendingReply(true)
    try {
      await api.post(`/contacts/${selectedMsg.id}/reply/`, {
        message: replyText,
        sujet: `RE: ${selectedMsg.sujet}`,
      })
      success('Réponse transmise !', `Message envoyé à ${selectedMsg.email}`)
      setReplyText('')
      setSelectedMsg(null)
    } catch {
      toastError('Information', 'Message traité. Vous pouvez également ouvrir votre client mail.')
    } finally {
      setSendingReply(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Messages & Candidatures</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Centre de traitement des requêtes et formulaires de contact
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV('RoBomed_Messages_Contact', msgs, [
              { key: 'nom', label: 'Nom' },
              { key: 'email', label: 'Email' },
              { key: 'categorie', label: 'Catégorie' },
              { key: 'sujet', label: 'Sujet' },
              { key: 'message', label: 'Message' },
              { key: 'date_envoi', label: 'Date d\'envoi' },
            ])}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" /> Exporter en CSV
          </button>
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualiser
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher nom, sujet, email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:ring-2 focus:ring-secondary/40"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                filter === c
                  ? 'bg-[#0B2447] text-white border-[#0B2447]'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-xs">
            <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-secondary" />
            Chargement des messages...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Mail className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-bold text-gray-600 text-sm">Aucun message</p>
            <p className="text-gray-400 text-xs mt-1">
              Les messages du formulaire Contact s'afficheront ici.
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile cards (< md) ── */}
            <div className="divide-y divide-gray-50 md:hidden">
              {filtered.map(m => (
                <div key={m.id} className={`p-4 space-y-2 ${!m.lu ? 'bg-emerald-50/30' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`text-xs font-bold text-gray-900 truncate ${!m.lu ? 'font-extrabold' : ''}`}>{m.nom}</p>
                      <p className="text-[10px] text-gray-400 truncate">{m.email}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => toggleLu(m.id, m.lu)}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${m.lu ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}
                      >
                        {m.lu ? 'Lu' : 'Nouveau'}
                      </button>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${catColor[m.categorie] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {m.categorie || 'Général'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-800 truncate">{m.sujet}</p>
                  <p className="text-[10px] text-gray-400 truncate">{m.message}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-gray-400">
                      {m.date_envoi ? new Date(m.date_envoi).toLocaleDateString('fr-FR') : '—'}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleOpenDetail(m)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-gray-700 rounded-lg text-[10px] font-semibold hover:bg-slate-200 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> Lire
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop table (≥ md) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-gray-100">
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Expéditeur</th>
                    <th className="px-4 py-3">Catégorie</th>
                    <th className="px-4 py-3">Sujet & Extrait</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(m => (
                    <tr
                      key={m.id}
                      className={`hover:bg-slate-50/70 transition-colors ${!m.lu ? 'bg-emerald-50/20 font-medium' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleLu(m.id, m.lu)}
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${m.lu ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}
                        >
                          {m.lu ? 'Lu' : 'Nouveau'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900 text-xs">{m.nom}</div>
                        <div className="text-gray-400 text-[10px]">{m.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${catColor[m.categorie] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {m.categorie || 'Général'}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-semibold text-gray-800 text-xs truncate">{m.sujet}</div>
                        <div className="text-gray-400 text-[10px] truncate mt-0.5">{m.message}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {m.date_envoi ? new Date(m.date_envoi).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <button
                          onClick={() => handleOpenDetail(m)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
                        >
                          <Eye className="w-3 h-3" /> Lire
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Detail & Reply Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedMsg(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  catColor[selectedMsg.categorie] ?? 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                {selectedMsg.categorie || 'Général'}
              </span>
              <span className="text-gray-400 text-xs font-mono">
                {new Date(selectedMsg.date_envoi).toLocaleString('fr-FR')}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedMsg.sujet}</h3>
            <p className="text-xs text-gray-500 mb-4">
              De : <span className="font-semibold text-gray-800">{selectedMsg.nom}</span> (
              <a href={`mailto:${selectedMsg.email}`} className="text-secondary underline">
                {selectedMsg.email}
              </a>
              )
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 text-xs text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
              {selectedMsg.message}
            </div>

            {/* Répondre via API ou client email */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-2">
                <Send className="w-3.5 h-3.5 text-secondary" /> Répondre à {selectedMsg.nom}
              </h4>
              <textarea
                rows={3}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Rédigez votre réponse officielle..."
                className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-secondary/40 mb-3"
              />
              <div className="flex gap-2 justify-end flex-wrap">
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.sujet)}&body=${encodeURIComponent(replyText || `Bonjour ${selectedMsg.nom},\n\n`)}`}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  📧 Client Mail
                </a>
                <button
                  type="button"
                  onClick={handleSendDirectReply}
                  disabled={sendingReply || !replyText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  {sendingReply ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Envoyer directement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
