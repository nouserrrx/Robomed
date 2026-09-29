import { useRef } from 'react'
import { Award, Download, Printer, X, CheckCircle2, ShieldAlert } from 'lucide-react'

interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
  recipientName: string
  role: string
  location: string
  issueDate?: string
  certNumber?: string
}

export default function CertificateModal({
  isOpen,
  onClose,
  recipientName,
  role,
  location,
  issueDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  certNumber,
}: CertificateModalProps) {
  const certRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const stableCertId = certNumber || `RBM-CERT-${Math.abs((recipientName + role).split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0) % 90000 + 10000)}`

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-amber-200/50 my-8">
        {/* Header Actions */}
        <div className="bg-[#0B2447] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Certificat Officiel d'Engagement</h3>
              <p className="text-white/60 text-xs">RoBomed Humanitarian & Educational Network</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <Printer className="w-4 h-4" /> Imprimer / PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Area */}
        <div className="p-8 sm:p-12 bg-[#FFFDF9] min-h-[500px]" ref={certRef}>
          <div className="border-8 double border-amber-600/30 p-6 sm:p-10 rounded-2xl relative bg-white shadow-inner">
            {/* Top Seal / Logo Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0B2447] text-amber-400 mb-3 shadow-lg ring-4 ring-amber-100">
                <Award className="w-9 h-9" />
              </div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                Organisation Humanitaire & Éducative Internationale
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0B2447] tracking-tight mt-1">
                RoBomed (RHMS)
              </h1>
              <p className="text-[11px] text-gray-500 font-medium">Canada 🇨🇦 — 🇹🇩 Tchad</p>
            </div>

            {/* Certificate Title */}
            <div className="text-center my-6">
              <h2 className="text-xl sm:text-2xl font-serif italic text-gray-800 border-b border-amber-200 inline-block pb-1 px-8">
                ATTESTATION DE LEADERSHIP & D'ENGAGEMENT
              </h2>
            </div>

            {/* Body text */}
            <div className="text-center max-w-2xl mx-auto space-y-4 my-8">
              <p className="text-sm text-gray-600">
                Le Bureau Exécutif International de l'organisation <strong>RoBomed</strong> decerne la présente attestation à :
              </p>
              <div className="py-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0B2447] font-serif underline decoration-amber-400 decoration-2 underline-offset-8">
                  {recipientName || 'Nom du Bénévole'}
                </h3>
                <p className="text-xs text-amber-800 font-semibold mt-2">
                  {role || 'Ambassadeur Humanitaire'} — {location || 'Canada & Tchad'}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
                En reconnaissance officielle de son dévouement exceptionnel, de son esprit d'initiative et de son impact positif dans la réussite des missions médicales, éducatives et sociales menées sur le terrain.
              </p>
            </div>

            {/* Certificate Footer / Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-amber-100 mt-10 items-end">
              <div className="text-center">
                <div className="h-12 flex items-center justify-center font-serif italic text-lg text-blue-900 font-bold">
                  Co-présidence Canada
                </div>
                <div className="w-32 h-0.5 bg-gray-300 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-700">Direction Canada 🇨🇦</p>
                <p className="text-[9px] text-gray-400">Coordinateur International</p>
              </div>

              <div className="text-center">
                <div className="h-12 flex items-center justify-center font-serif italic text-lg text-emerald-900 font-bold">
                  Co-présidence Tchad
                </div>
                <div className="w-32 h-0.5 bg-gray-300 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-700">Direction Tchad 🇹🇩</p>
                <p className="text-[9px] text-gray-400">Opérations Terrain</p>
              </div>
            </div>

            {/* Metadata & Stamp */}
            <div className="mt-8 flex items-center justify-between text-[10px] text-gray-400 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Document Officiel Vérifié - Réf: {stableCertId}
              </div>
              <div>Fait le {issueDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
