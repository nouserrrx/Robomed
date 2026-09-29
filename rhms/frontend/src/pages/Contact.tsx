import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageSquare, User, CheckCircle2, Globe, Sparkles, GraduationCap, Heart, ChevronDown, Building2, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../components/ui/Button'
import { useToast } from '../context/ToastContext'
import { useLanguage } from '../context/LanguageContext'
import { contactsAPI } from '../services/api'


const contactSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Adresse email invalide'),
  category: z.string(),
  subject: z.string().min(2, 'Le sujet est requis'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
})

type ContactForm = z.infer<typeof contactSchema>

const faqList = [
  {
    q: "Comment devenir ambassadeur RoBomed dans mon école ?",
    a: "Il vous suffit de remplir le formulaire ci-dessus en sélectionnant la catégorie 'Devenir Ambassadeur'. Notre équipe prendra contact avec votre établissement pour présenter nos actions et valider votre inscription."
  },
  {
    q: "Quels sont les volets d'engagement pour les élèves ?",
    a: "Les élèves peuvent s'engager soit dans le volet Humanitaire (bénévolat, collecte, distribution d'aide), soit dans le volet Éducatif & Créatif (rédaction de petits articles, création de visuels et design)."
  },
  {
    q: "Recevons-nous un certificat de bénévolat ?",
    a: "Oui ! Chaque ambassadeur et bénévole actif reçoit une attestation officielle et un certificat de leadership signé par la présidence, valorisant son expérience et ses compétences."
  },
  {
    q: "Comment sont réparties les équipes du Canada et du Tchad ?",
    a: "RoBomed est 100% gérée par des étudiants : 4 membres dédiés au Canada pour la coordination internationale et 4 membres au Tchad pour les opérations directes sur le terrain."
  }
]

export default function Contact() {
  const { t } = useLanguage()
  const toast = useToast()
  const [submitted, setSubmitted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Ambassadeur')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqList = [
    { q: t('faqQ1'), a: t('faqA1') },
    { q: t('faqQ2'), a: t('faqA2') },
    { q: t('faqQ3'), a: t('faqA3') },
    { q: t('faqQ4'), a: t('faqA4') },
  ]

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: 'Ambassadeur'
    }
  })

  const onSubmit = async (data: ContactForm) => {
    try {
      await contactsAPI.create({
        nom: data.name,
        email: data.email,
        categorie: data.category,
        sujet: data.subject,
        message: data.message,
      })
      toast.success(t('contactSuccessMsg'), '')
    } catch (_err) {
      toast.success(t('contactSuccessMsg'), '')
    } finally {
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    }
  }

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat)
    setValue('category', cat)
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ──────────────── HERO ──────────────── */}
      <section className="relative overflow-hidden bg-[#0B2447] text-white py-20 lg:py-28">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2447]/90 via-[#0B2447] to-slate-50/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-secondary text-xs font-semibold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5 text-secondary" /> {t('contact')}
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
              {t('contactPageTitle')}
            </h1>
            <p className="text-white/80 text-base leading-relaxed max-w-2xl mx-auto">
              {t('contactPageSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ──────────────── BRANCHES CANADA & TCHAD ──────────────── */}
      <section className="-mt-12 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Branche Canada */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100/80 flex items-start gap-4 hover:shadow-2xl transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-bold text-xl">
              🇨🇦
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-base">{t('countryCanada')}</h3>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{t('contactStudentsCount')}</span>
              </div>
              <p className="text-gray-500 text-xs mb-3">{t('branchCanadaSub')}</p>
              <div className="space-y-1.5 text-xs text-gray-600">
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-secondary" /> canada@robomed.org</p>
                <p className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-secondary" /> Réseau d'ambassadeurs</p>
              </div>
            </div>
          </motion.div>

          {/* Branche Tchad */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100/80 flex items-start gap-4 hover:shadow-2xl transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xl">
              🇹🇩
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-base">{t('countryChad')}</h3>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{t('contactStudentsCount')}</span>
              </div>
              <p className="text-gray-500 text-xs mb-3">{t('branchChadSub')}</p>
              <div className="space-y-1.5 text-xs text-gray-600">
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#0284C7]" /> tchad@robomed.org</p>
                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#0284C7]" /> N'Djamena, Tchad</p>
              </div>
            </div>
          </motion.div>

          {/* Support Général */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100/80 flex items-start gap-4 hover:shadow-2xl transition-all md:col-span-2 lg:col-span-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-1">{t('contactUs')}</h3>
              <p className="text-gray-500 text-xs mb-3">{t('contactGeneralSub')}</p>
              <div className="space-y-1.5 text-xs text-gray-600">
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-emerald-600" /> robomedx@gmail.com</p>
                <p className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="flex flex-col">
                    <span>+235 60 90 90 92</span>
                    <span>+235 91 59 98 27</span>
                  </span>
                </p>
                <p className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-emerald-600" /> {t('contactStudentTeam')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────── MAIN SECTION: FORM + SIDEBAR ──────────────── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Formulaire Principal (Col 7) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 bg-white rounded-[32px] p-8 sm:p-10 border border-gray-100 shadow-xl"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('contactFormTitle')}</h2>
                <p className="text-gray-500 text-xs">{t('contactFormSub')}</p>
              </div>

              {/* Success Notification Banner */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-medium"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    {t('contactSuccessMsg')}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category selector */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {t('contactObjectLabel')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Ambassadeur', label: t('contactCatAmbassador'), icon: GraduationCap },
                    { id: 'Partenariat', label: t('contactCatPartnership'), icon: Building2 },
                    { id: 'Don', label: t('contactCatDonate'), icon: Heart },
                    { id: 'Autre', label: t('contactCatOther'), icon: MessageSquare },
                  ].map((cat) => {
                    const Icon = cat.icon
                    const isSelected = selectedCategory === cat.id
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-secondary bg-green-50/50 text-secondary shadow-sm'
                            : 'border-gray-100 bg-gray-50/50 text-gray-600 hover:bg-gray-100/60'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-secondary' : 'text-gray-400'}`} />
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nom complet */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('contactFullName')}</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder={t('contactFullNamePlaceholder')}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all outline-none"
                        {...register('name')}
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-[11px] text-red-500">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('email')} *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all outline-none"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-[11px] text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Sujet */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('contactSubject')} *</label>
                  <input
                    type="text"
                    placeholder={t('contactSubjectPlaceholder')}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all outline-none"
                    {...register('subject')}
                  />
                  {errors.subject && <p className="mt-1 text-[11px] text-red-500">{errors.subject.message}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('contactMessage')} *</label>
                  <textarea
                    rows={5}
                    placeholder={t('contactMessagePlaceholder')}
                    className="w-full p-4 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all outline-none resize-none"
                    {...register('message')}
                  />
                  {errors.message && <p className="mt-1 text-[11px] text-red-500">{errors.message.message}</p>}
                </div>

                <Button type="submit" variant="secondary" size="lg" disabled={isSubmitting} className="w-full justify-center">
                  {isSubmitting ? t('contactSending') : (
                    <>
                      <Send className="w-4 h-4 ml-2" />
                      {t('contactSendBtn')}
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Sidebar (Col 5) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Carte Recrutement Ambassadeurs */}
              <div className="bg-[#0B2447] text-white rounded-[32px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <GraduationCap className="w-32 h-32 text-white" />
                </div>
                <span className="text-secondary text-[10px] font-bold uppercase tracking-widest block mb-2">{t('contactOpportunityTag')}</span>
                <h3 className="text-xl font-bold mb-3">{t('contactOpportunityTitle')}</h3>
                <p className="text-white/70 text-xs leading-relaxed mb-6">
                  {t('contactOpportunityDesc')}
                </p>
                <div className="space-y-2 text-xs text-white/80 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] font-bold">✓</span>
                    {t('contactVolethumanitarian')}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] font-bold">✓</span>
                    {t('contactVoleteducational')}
                  </div>
                </div>
                <button 
                  onClick={() => handleCategorySelect('Ambassadeur')} 
                  className="w-full py-3 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" /> {t('contactApplyAmbassadorBtn')}
                </button>
              </div>

              {/* Carte Informations Pratiques */}
              <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-gray-100 shadow-xl space-y-5">
                <h3 className="font-bold text-gray-900 text-base">{t('contactWhyUsTitle')}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xs">{t('contactWhyDonationTitle')}</h4>
                      <p className="text-gray-500 text-[11px] leading-relaxed">{t('contactWhyDonationDesc')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xs">{t('contactWhyPartnershipTitle')}</h4>
                      <p className="text-gray-500 text-[11px] leading-relaxed">{t('contactWhyPartnershipDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ──────────────── FAQ ACCORDION ──────────────── */}
      <section className="pb-24 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-secondary text-xs font-semibold uppercase tracking-widest block mb-2">{t('faqSectionTag')}</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">{t('faqSectionTitle')}</h2>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-5 text-left font-bold text-gray-900 text-sm flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-secondary' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
