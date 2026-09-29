import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, CreditCard, CheckCircle2, ShieldCheck,
  Sparkles, FileText, Droplets, BookOpen, Stethoscope,
  Award, Lock, ArrowRight, HelpCircle, Download, Smartphone, Building, RefreshCw
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useLanguage } from '../context/LanguageContext'
import { generateTaxReceiptPDF } from '../utils/taxReceiptPdf'
import { api, campaignsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const presetAmountsEUR = [10, 25, 50, 100, 250, 500]
const presetAmountsFCFA = [1000, 2500, 5000, 10000, 25000, 50000]

const donSchema = z.object({
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  telephone: z.string().optional(),
})

type DonForm = z.infer<typeof donSchema>

export default function Don() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once')
  const [currency, setCurrency] = useState('€')
  const [amount, setAmount] = useState<number>(50)
  const [customAmount, setCustomAmount] = useState('')
  const [project, setProject] = useState("Puits d'eau potable Tchad")
  const [liveCampaigns, setLiveCampaigns] = useState<any[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile' | 'bank'>('card')
  const [submitted, setSubmitted] = useState(false)
  const [simulatedCardNumber, setSimulatedCardNumber] = useState('')
  const [simulatedMobileOperator, setSimulatedMobileOperator] = useState<'airtel' | 'moov' | 'wave'>('airtel')
  const [lastSubmission, setLastSubmission] = useState<{
    ref: string
    name: string
    email: string
    amount: number
    currency: string
    project: string
    frequency: string
  } | null>(null)

  const activePresets = currency === 'FCFA' ? presetAmountsFCFA : presetAmountsEUR

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)
    setCustomAmount('')
    setAmount(newCurrency === 'FCFA' ? 5000 : 50)
  }

  useEffect(() => {
    campaignsAPI.getAll().then(res => {
      const list = Array.isArray(res) ? res : (res?.results || [])
      if (list && list.length > 0) {
        const active = list.filter((c: any) => c.statut === 'active')
        if (active.length > 0) {
          setLiveCampaigns(active)
          setProject(active[0].titre)
        }
      }
    }).catch(() => {})
  }, [])

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<DonForm>({
    resolver: zodResolver(donSchema),
    defaultValues: {
      prenom: user?.name?.split(' ')[0] || '',
      nom: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
    }
  })

  const onSubmit = async (data: DonForm) => {
    const ref = `RBM-${Date.now().toString().slice(-8)}`
    setLastSubmission({
      ref,
      name: `${data.prenom} ${data.nom}`,
      email: data.email,
      amount,
      currency,
      project,
      frequency: frequency === 'monthly' ? 'Mensuel' : 'Ponctuel',
    })

    const matchedCampagne = liveCampaigns.find((c: any) => c.titre === project)
    const payload: any = {
      montant: amount,
      message: `Don ${frequency === 'monthly' ? '[MENSUEL]' : '[UNIQUE]'} de ${data.prenom} ${data.nom} (${data.email}${data.telephone ? ', Tel: ' + data.telephone : ''}) — ${project} [${currency}] via ${paymentMethod}`,
      statut: 'confirme',
      reference: ref,
    }
    if (matchedCampagne) {
      payload.campagne = matchedCampagne.id
    }

    try {
      await api.post('/donations/', payload)
    } catch (_e) {
      // Fallback si l'API est indisponible
    } finally {
      setSubmitted(true)
      reset()
    }
  }

  const getImpactDescription = (amt: number, curr: string) => {
    const valueEUR = curr === 'FCFA' ? amt / 650 : curr === 'CAD' ? amt * 0.68 : amt
    if (valueEUR < 20) {
      return { title: t('donateImpactKits'), text: t('donateImpactKitsDesc') }
    } else if (valueEUR < 40) {
      return { title: t('donateImpactFood'), text: t('donateImpactFoodDesc') }
    } else if (valueEUR < 80) {
      return { title: t('donateImpactWater'), text: t('donateImpactWaterDesc') }
    } else if (valueEUR < 180) {
      return { title: t('donateImpactMedical'), text: t('donateImpactMedicalDesc') }
    } else {
      return { title: t('donateImpactMajor'), text: t('donateImpactMajorDesc') }
    }
  }

  const currentImpact = getImpactDescription(amount, currency)
  const afterTaxCost = currency === '€' ? Math.round(amount * 0.34) : currency === 'CAD' ? Math.round(amount * 0.5) : null

  return (
    <div className="bg-slate-50 dark:bg-[#080D18] transition-colors min-h-screen">
      
      {/* ──────────────── HERO BANNER ──────────────── */}
      <section className="relative bg-gradient-to-br from-[#0B2447] via-[#0A3663] to-[#041D3B] text-white py-16 lg:py-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-emerald-300 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{t('donateHeroBadge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {t('donateHeroTitle1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{t('donateHeroTitleAccent')}</span>
            </h1>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              {t('donateHeroDesc')}
            </p>

            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto text-left">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                <p className="text-2xl font-extrabold text-emerald-400">{t('donateStat1Value')}</p>
                <p className="text-[11px] text-white/70 font-medium">{t('donateStat1Label')}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                <p className="text-2xl font-extrabold text-teal-300">{t('donateStat2Value')}</p>
                <p className="text-[11px] text-white/70 font-medium">{t('donateStat2Label')}</p>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                <p className="text-2xl font-extrabold text-amber-300">🇨🇦 🇹🇩</p>
                <p className="text-[11px] text-white/70 font-medium">{t('donateStat3Label')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── MAIN SECTION ──────────────── */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ── LEFT COLUMN: Impact & Transparency ── */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              
              {/* Dynamic Impact Statement Box */}
              <motion.div
                key={`${amount}-${currency}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-xl shadow-emerald-600/10 space-y-3 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
                  <Heart className="w-32 h-32 text-white" />
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-emerald-200 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>{t('donateImpactBadge')}</span>
                </div>

                <h3 className="text-xl font-extrabold text-white">
                  {currentImpact.title}
                </h3>

                <p className="text-white/90 text-sm leading-relaxed">
                  {currentImpact.text}
                </p>

                <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100 font-medium">
                  <span>{t('donateImpactProjectLabel')}</span>
                  <span className="font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg">
                    {project}
                  </span>
                </div>
              </motion.div>

              {/* Fiscal Deduction Pill */}
              {afterTaxCost !== null && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs">
                  <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">{t('donateTaxTitle')}</p>
                    <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                      {t('donateTaxDesc1')} <strong>{amount} {currency}</strong> {t('donateTaxDesc2')} <strong>{afterTaxCost} {currency}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Link to Donor Portal */}
              <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                    Déjà donateur RoBomed ?
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                    Accédez à votre historique et téléchargez vos reçus.
                  </p>
                </div>
                <Link to="/espace-donateur">
                  <Button variant="secondary" size="sm" className="whitespace-nowrap gap-1 text-xs">
                    Mon Espace <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              {/* Guarantees & Transparency Grid */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  {t('donateGuaranteesTitle')}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 dark:text-white font-semibold">{t('donateGuarantee1Title')}</strong>
                      <span className="text-gray-500 dark:text-gray-400 text-[11px]">{t('donateGuarantee1Desc')}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 dark:text-white font-semibold">{t('donateGuarantee2Title')}</strong>
                      <span className="text-gray-500 dark:text-gray-400 text-[11px]">{t('donateGuarantee2Desc')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Interactive Donation Form ── */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800"
              >
                
                {/* Form Header */}
                <div className="mb-6 pb-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                      <Heart className="w-5 h-5 text-secondary fill-secondary" />
                      {t('donateFormTitle2')}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                      {t('donateFormSubtitle2')}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 hidden sm:inline-block">
                    🔒 SSL Chiffré 256-bit
                  </span>
                </div>

                {/* Submitted Banner */}
                <AnimatePresence>
                  {submitted && lastSubmission && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="mb-6 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-emerald-900 dark:text-emerald-100 font-bold text-sm">
                            {t('donateSuccessMsg')} {lastSubmission.amount.toLocaleString('fr-FR')} {lastSubmission.currency} ({lastSubmission.frequency}) !
                          </p>
                          <p className="text-emerald-700 dark:text-emerald-300 text-xs">
                            Votre soutien a été validé avec succès. Votre reçu fiscal est prêt.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl px-3 py-2 font-mono">
                        <span>Réf : {lastSubmission.ref}</span>
                        <button
                          type="button"
                          onClick={() => generateTaxReceiptPDF({
                            reference: lastSubmission.ref,
                            donorName: lastSubmission.name,
                            donorEmail: lastSubmission.email,
                            amount: lastSubmission.amount,
                            currency: lastSubmission.currency,
                            project: lastSubmission.project,
                            date: new Date().toISOString(),
                          })}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg font-bold font-sans hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Télécharger mon Reçu Fiscal (PDF)
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 0. Frequency Toggle (Unique vs Mensuel) */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setFrequency('once')}
                      className={`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                        frequency === 'once'
                          ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                      }`}
                    >
                      <span>💝 Don Unique</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('monthly')}
                      className={`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                        frequency === 'monthly'
                          ? 'bg-secondary text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>🔄 Don Mensuel (Régulier)</span>
                    </button>
                  </div>
                </div>

                {/* 1. Currency & Project Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6">
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                      {t('donateCurrencyStep')}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                      {[
                        { id: '€', label: 'EUR (€)' },
                        { id: 'CAD', label: 'CAD ($)' },
                        { id: 'FCFA', label: 'FCFA' },
                      ].map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleCurrencyChange(c.id)}
                          className={`py-2 rounded-xl font-bold text-xs transition-all ${
                            currency === c.id
                              ? 'bg-secondary text-white shadow-sm'
                              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-7">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                      {t('donateProjectStep')}
                    </label>
                    <select
                      value={project}
                      onChange={e => setProject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs font-semibold outline-none bg-slate-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-secondary/40 transition-all"
                    >
                      {liveCampaigns.length > 0 ? (
                        liveCampaigns.map((c: any) => (
                          <option key={c.id} value={c.titre}>
                            {c.titre} {c.objectif ? `(Objectif : ${Number(c.objectif).toLocaleString()} €/FCFA)` : ''}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Puits d'eau potable Tchad">{t('donateProj1')}</option>
                          <option value="Fournitures scolaires Tchad">{t('donateProj2')}</option>
                          <option value="Fleurs crochet & lettres Canada">{t('donateProj3')}</option>
                          <option value="Soutien enfants cancer Canada">{t('donateProj4')}</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* 2. Amount Selection */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                    {t('donateAmountStep')}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                    {activePresets.map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => { setAmount(preset); setCustomAmount('') }}
                        className={`py-3 px-2 rounded-2xl font-extrabold text-xs transition-all duration-200 cursor-pointer border ${
                          amount === preset && !customAmount
                            ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/25 scale-[1.02]'
                            : 'bg-slate-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-slate-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {preset.toLocaleString('fr-FR')} {currency}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      placeholder={t('donateCustomPlaceholder2')}
                      value={customAmount}
                      onChange={e => {
                        setCustomAmount(e.target.value)
                        const p = parseFloat(e.target.value)
                        if (!isNaN(p) && p > 0) setAmount(p)
                      }}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-secondary/40 text-sm font-bold transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-extrabold text-sm">
                      {currency}
                    </span>
                  </div>
                </div>

                {/* 3. Payment Method Tabs */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                    Moyen de Règlement Sécurisé
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'card' as const, name: 'Carte Bancaire / Stripe', icon: '💳', desc: 'Visa, Mastercard, Amex' },
                      { id: 'mobile' as const, name: 'Mobile Money (Afrique)', icon: '📱', desc: 'Airtel, Moov, Wave' },
                      { id: 'bank' as const, name: 'Virement / Interac', icon: '🏛️', desc: 'Canada & Europe' },
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between ${
                          paymentMethod === method.id
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold'
                            : 'bg-slate-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg">{method.icon}</span>
                          <span className="text-[10px] font-semibold text-gray-400 bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded-md">
                            {method.desc}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold leading-snug">{method.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Realistic Simulator per Payment Method */}
                {paymentMethod === 'card' && (
                  <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs space-y-3">
                    <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 font-bold">
                      <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-emerald-500" /> Numéro de carte bancaire</span>
                      <span className="text-[10px] text-gray-400">Chiffrement SSL 3D-Secure</span>
                    </div>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8921"
                      maxLength={19}
                      value={simulatedCardNumber}
                      onChange={(e) => setSimulatedCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-sm"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="MM/AA" maxLength={5} className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-mono" />
                      <input type="password" placeholder="CVC (3 chiffres)" maxLength={4} className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-mono" />
                    </div>
                  </div>
                )}

                {paymentMethod === 'mobile' && (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-3">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-amber-600" /> Opérateur Mobile Money (Tchad & Afrique)</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSimulatedMobileOperator('airtel')}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border ${simulatedMobileOperator === 'airtel' ? 'bg-red-600 text-white border-red-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                      >
                        Airtel Money (+235)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulatedMobileOperator('moov')}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border ${simulatedMobileOperator === 'moov' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                      >
                        Moov Money (+235)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulatedMobileOperator('wave')}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border ${simulatedMobileOperator === 'wave' ? 'bg-sky-500 text-white border-sky-500' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                      >
                        Wave
                      </button>
                    </div>
                    <div className="text-[11px] text-amber-800 dark:text-amber-300 font-mono bg-white/60 dark:bg-gray-900/60 p-2 rounded-xl border border-amber-200/60 dark:border-amber-800/60">
                      Numéro officiel RoBomed : <strong>{simulatedMobileOperator === 'airtel' ? '+235 60 90 90 92' : simulatedMobileOperator === 'moov' ? '+235 91 59 98 27' : 'Scan QR Wave disponible'}</strong>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="mb-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 space-y-2">
                    <p className="font-bold flex items-center gap-1.5">
                      <Building className="w-4 h-4" /> Virement Bancaire & Virement Interac (Canada)
                    </p>
                    <p className="text-[11px] text-blue-700 dark:text-blue-300">
                      Pour le Canada, envoyez votre virement Interac à <strong>don@robomed.org</strong> (Dépôt direct sans question de sécurité). Le reçu fiscal officiel vous sera transmis instantanément.
                    </p>
                  </div>
                )}

                {/* 4. Total Summary Box */}
                <div className="text-center mb-6 bg-gradient-to-r from-slate-900 to-[#0B2447] text-white p-5 rounded-2xl shadow-inner space-y-1">
                  <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">{t('donateTotalLabel')}</span>
                  <div className="text-3xl font-extrabold text-emerald-400">
                    {amount.toLocaleString('fr-FR')} <span className="text-xl text-white font-bold">{currency}</span> {frequency === 'monthly' && <span className="text-xs text-emerald-300 font-normal">/ mois</span>}
                  </div>
                  <p className="text-xs text-white/80">
                    {t('donateAllocatedTo')} <span className="font-bold text-white underline">{project}</span>
                  </p>
                </div>

                {/* 5. Contact Form Fields */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label={t('firstName')} placeholder={t('firstNamePlaceholder')} error={errors.prenom?.message} {...register('prenom')} />
                    <Input label={t('lastName')} placeholder={t('lastNamePlaceholder')} error={errors.nom?.message} {...register('nom')} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label={t('email')} type="email" placeholder={t('emailPlaceholder')} error={errors.email?.message} {...register('email')} />
                    <Input label={t('phone')} type="tel" placeholder={t('phonePlaceholder')} error={errors.telephone?.message} {...register('telephone')} />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-secondary hover:bg-secondary-dark text-white font-extrabold text-base shadow-xl shadow-secondary/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>{t('donateSubmitProcessing')}</span>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 fill-white" />
                        <span>Valider mon Don {frequency === 'monthly' ? 'Mensuel' : ''} de {amount.toLocaleString('fr-FR')} {currency}</span>
                        <ArrowRight className="w-5 h-5 ml-1" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 pt-2 flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-secondary" />
                    <span>{t('donateSecureNote')}</span>
                  </p>
                </form>

              </motion.div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
