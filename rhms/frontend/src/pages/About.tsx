import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, 
  Eye, 
  Diamond, 
  ArrowRight, 
  Users, 
  Heart, 
  Package, 
  Droplets, 
  Shirt, 
  GraduationCap, 
  UserCheck, 
  Globe, 
  BookOpen, 
  Shield, 
  PieChart, 
  Settings, 
  Award,
  Sparkles,
  Cpu
} from 'lucide-react'
import Counter from '../components/shared/Counter'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { loadTeamMembers, type TeamMember } from '../data/team'

import { useLanguage } from '../context/LanguageContext'
import { statsAPI, teamAPI } from '../services/api'



const pageTranslations = {
  fr: {
    heroBadge: "Alliance Humanitaire Internationale",
    heroBadgeSubtitle: "🇨🇦 Canada · 🇹🇩 Tchad",
    convictionLabel: "Notre conviction :",
    convictionText: "L'énergie de la jeunesse unie par la solidarité pour apporter des solutions concrètes sur le terrain.",
    // Piliers
    missionTitle: "Notre mission",
    missionDesc: "Apporter une assistance humanitaire efficace et promouvoir le développement durable à travers des programmes qui répondent aux besoins essentiels des communautés les plus vulnérables.",
    visionTitle: "Notre vision",
    visionDesc: "Un monde où chaque personne, en particulier les plus vulnérables, vit dans la dignité, en bonne santé et avec des opportunités pour construire un avenir meilleur.",
    valuesTitle: "Nos valeurs",
    values: [
      "Humanité et compassion",
      "Intégrité et transparence",
      "Solidarité et respect",
      "Engagement et responsabilité",
      "Innovation et durabilité"
    ],
    // Timeline
    timelineTitle: "Notre parcours",
    timelineSubtitle: "Notre histoire en quelques étapes clés",
    timeline: [
      {
        year: '22 Avril 2025',
        title: 'Fondation étudiante',
        description: 'Création de RoBomed par 8 étudiants engagés, 4 au Canada et 4 au Tchad, pour un impact direct.',
        color: '#16A34A',
        bg: '#DCFCE7'
      },
      {
        year: 'Soins palliatifs',
        title: 'Fleurs & Lettres',
        description: 'Confection artisanale de fleurs en crochet et rédaction de messages de réconfort pour les patients.',
        color: '#DC2626',
        bg: '#FEE2E2'
      },
      {
        year: 'Soutien Pédiatrique',
        title: 'Sourires aux enfants',
        description: 'Distribution de friandises et lettres chaleureuses aux enfants luttant contre le cancer.',
        color: '#0284C7',
        bg: '#DBEAFE'
      },
      {
        year: 'Ventes Solidaires',
        title: 'Gâteaux, biscuits & livres',
        description: 'Organisation de kermesses et ventes pour collecter les fonds nécessaires à nos projets.',
        color: '#7C3AED',
        bg: '#EDE9FE'
      },
      {
        year: 'Infrastructures au Tchad',
        title: 'Puits & Fournitures',
        description: "Financement réussi d'un puits d'eau potable et distribution de matériel scolaire sur le terrain.",
        color: '#0B4F9C',
        bg: '#DBEAFE'
      },
    ],
    // Stats
    statsTitle: "Des résultats concrets qui changent des vies",
    statsSubtitle: "Notre impact en chiffres",
    statsBtn: "Découvrir nos actions",
    stats: [
      { label: 'Bénéficiaires aidés', sub: 'depuis la création' },
      { label: 'Dons reçus', sub: 'grâce à votre confiance' },
      { label: 'Distributions réalisées', sub: 'sur le terrain' },
      { label: "Points d'eau construits", sub: 'accès durable' },
      { label: 'Vêtements distribués', sub: 'aide d\'urgence' },
      { label: 'Enfants soutenus', sub: 'éducation & kits' },
      { label: 'Bénévoles actifs', sub: 'dans notre réseau' },
    ],
    // Ambassador
    // 3 Branches
    branchesBadge: "Architecture & Piliers",
    branchesTitle: "Les 3 Branches d'Action de RoBomed",
    branchesSubtitle: "RoBomed structure ses interventions autour de 3 branches complémentaires pour maximiser son impact social, humain et technologique.",
    humanitarianTitle: "Branche Humanitaire",
    humanitarianDesc: "Interventions de bénévolat sur le terrain, distribution d'aide alimentaire et vestimentaire, soutien aux soins palliatifs, puits d'eau potable et secours pédiatrique.",
    eduTitle: "Branche Éducative",
    eduDesc: "Sensibilisation citoyenne, rédaction d'articles engagés, soutien scolaire, création de contenus pédagogiques et programmes d'ambassadeurs dans les écoles.",
    techTitle: "Branche Technique",
    techDesc: "Conception et développement de solutions technologiques innovantes, plateformes numériques, outils logiciels et dispositifs digitaux pour soutenir l'action humanitaire et médicale.",
    expLabel: "Expérience",
    expSub: "Valorise ton parcours",
    compLabel: "Compétences",
    compSub: "Design, rédaction & gestion",
    certLabel: "Certificat",
    certSub: "Engagement officiel",
    contactBtn: "Nous contacter",
    // Team
    teamTitle: "Notre équipe",
    teamHeading: "Une équipe engagée à vos côtés",
    teamSubtitle: "RoBomed, c'est une équipe passionnée de professionnels et de bénévoles qui travaillent chaque jour sur le terrain avec dévouement.",
    filterAll: "Tous les membres",
    filterCanada: "Canada 🇨🇦",
    filterTchad: "Tchad 🇹🇩",
    memberRoleKey: "RÔLE CLÉ",
    memberMissionKey: "MISSIONS CLÉS",
    memberBranchKey: "Branche",
    joinTeamBtn: "Rejoindre l'équipe",
    responsibleDedicated: "Responsable dédié",
  },
  en: {
    heroBadge: "International Humanitarian Alliance",
    heroBadgeSubtitle: "🇨🇦 Canada · 🇹🇩 Chad",
    convictionLabel: "Our conviction:",
    convictionText: "The energy of youth united by solidarity to bring concrete solutions on the ground.",
    // Pillars
    missionTitle: "Our Mission",
    missionDesc: "Provide effective humanitarian assistance and promote sustainable development through programs addressing the essential needs of the most vulnerable communities.",
    visionTitle: "Our Vision",
    visionDesc: "A world where every person, especially the most vulnerable, lives in dignity, good health, and with opportunities to build a better future.",
    valuesTitle: "Our Values",
    values: [
      "Humanity and compassion",
      "Integrity and transparency",
      "Solidarity and respect",
      "Commitment and responsibility",
      "Innovation and sustainability"
    ],
    // Timeline
    timelineTitle: "Our Journey",
    timelineSubtitle: "Our history in key milestones",
    timeline: [
      {
        year: 'April 22, 2025',
        title: 'Student Foundation',
        description: 'Creation of RoBomed by 8 committed students, 4 in Canada and 4 in Chad, for direct impact.',
        color: '#16A34A',
        bg: '#DCFCE7'
      },
      {
        year: 'Palliative Care',
        title: 'Flowers & Letters',
        description: 'Handmade crochet flowers and comfort letters written by students for palliative patients.',
        color: '#DC2626',
        bg: '#FEE2E2'
      },
      {
        year: 'Pediatric Support',
        title: 'Sourires aux enfants',
        description: 'Distribution of treats and warm letters to children fighting cancer.',
        color: '#0284C7',
        bg: '#DBEAFE'
      },
      {
        year: 'Solidarity Sales',
        title: 'Cakes, Cookies & Books',
        description: 'Organization of bake sales and book sales to raise the funds necessary for our projects.',
        color: '#7C3AED',
        bg: '#EDE9FE'
      },
      {
        year: 'Chad Infrastructure',
        title: 'Wells & Supplies',
        description: 'Successful financing of a drinking water well and school materials distribution on the ground.',
        color: '#0B4F9C',
        bg: '#DBEAFE'
      },
    ],
    // Stats
    statsTitle: "Concrete results changing lives",
    statsSubtitle: "Our impact in numbers",
    statsBtn: "Discover our actions",
    stats: [
      { label: 'Beneficiaries helped', sub: 'since foundation' },
      { label: 'Donations received', sub: 'thanks to your trust' },
      { label: 'Distributions completed', sub: 'on the ground' },
      { label: 'Clean water wells built', sub: 'sustainable access' },
      { label: 'Clothing items distributed', sub: 'emergency aid' },
      { label: 'Children supported', sub: 'education & kits' },
      { label: 'Active volunteers', sub: 'in our network' },
    ],
    // 3 Branches
    branchesBadge: "Architecture & Pillars",
    branchesTitle: "The 3 Branches of RoBomed",
    branchesSubtitle: "RoBomed structures its operations around 3 complementary branches to maximize its social, human, and technological impact.",
    humanitarianTitle: "Humanitarian Branch",
    humanitarianDesc: "Field volunteering, food and clothing distribution, clean water well construction, pediatric cancer support, and palliative care comfort.",
    eduTitle: "Educational Branch",
    eduDesc: "Community awareness, article writing, academic tutoring, educational content creation, and ambassador programs in schools.",
    techTitle: "Technical Branch",
    techDesc: "Design and development of innovative technological solutions, software tools, and digital platforms to empower and scale humanitarian and medical impact.",
    expLabel: "Experience",
    expSub: "Enhance your profile",
    compLabel: "Skills",
    compSub: "Design, writing & management",
    certLabel: "Certificate",
    certSub: "Official recognition",
    contactBtn: "Contact Us",
    // Team
    teamTitle: "Our Team",
    teamHeading: "A team committed by your side",
    teamSubtitle: "RoBomed is a passionate team of professionals and volunteers working each day with dedication on the ground.",
    filterAll: "All Members",
    filterCanada: "Canada 🇨🇦",
    filterTchad: "Chad 🇹🇩",
    memberRoleKey: "KEY ROLE",
    memberMissionKey: "KEY MISSIONS",
    memberBranchKey: "Branch",
    joinTeamBtn: "Join the Team",
    responsibleDedicated: "Dedicated representative",
  },
  ar: {
    heroBadge: "التحالف الإنساني الدولي",
    heroBadgeSubtitle: "🇨🇦 كندا · 🇹🇩 تشاد",
    convictionLabel: "قناعتنا:",
    convictionText: "طاقة الشباب المتحد بالتضامن لتقديم حلول ملموسة على أرض الواقع.",
    // Pillars
    missionTitle: "مهمتنا",
    missionDesc: "تقديم مساعدة إنسانية فعالة وتعزيز التنمية المستدامة من خلال برامج تلبي الاحتياجات الأساسية للمجتمعات الأكثر ضعفاً.",
    visionTitle: "رؤيتنا",
    visionDesc: "عالم يعيش فيه كل شخص، وخاصة الأكثر ضعفاً، بكرامة وصحة جيدة وفرص لبناء مستقبل أفضل.",
    valuesTitle: "قيمنا",
    values: [
      "الإنسانية والرحمة",
      "النزاهة والشفافية",
      "التضامن والاحترام",
      "الالتزام والمسؤولية",
      "الابتكار والاستدامة"
    ],
    // Timeline
    timelineTitle: "مسيرتنا",
    timelineSubtitle: "تاريخنا في خطوات رئيسية",
    timeline: [
      {
        year: '٢٢ أبريل ٢٠٢٥',
        title: 'تأسيس طلابي',
        description: 'تأسيس روبوميد من قبل ٨ طلاب ملتزمين، ٤ في كندا و٤ في تشاد، لإحداث تأثير مباشر.',
        color: '#16A34A',
        bg: '#DCFCE7'
      },
      {
        year: 'الرعاية التلطيفية',
        title: 'الزهور والرسائل',
        description: 'صناعة يدوية لزهور الكروشيه وكتابة رسائل دعم لمرضى الرعاية التلطيفية.',
        color: '#DC2626',
        bg: '#FEE2E2'
      },
      {
        year: 'دعم الأطفال',
        title: 'سعادة للأطفال',
        description: 'توزيع الحلوى والرسائل الدافئة على الأطفال المصابين بالسرطان.',
        color: '#0284C7',
        bg: '#DBEAFE'
      },
      {
        year: 'المبيعات التضامنية',
        title: 'كعك، بسكويت وكتب',
        description: 'تنظيم المبيعات الخيرية لجمع الأموال اللازمة لمشاريعنا.',
        color: '#7C3AED',
        bg: '#EDE9FE'
      },
      {
        year: 'البنية التحتية في تشاد',
        title: 'الآبار والمستلزمات',
        description: 'تمويل ناجح لبئر مياه شرب وتوزيع المستلزمات المدرسية على الأرض.',
        color: '#0B4F9C',
        bg: '#DBEAFE'
      },
    ],
    // Stats
    statsTitle: "نتائج ملموسة تغير الحياة",
    statsSubtitle: "تأثيرنا بالأرقام",
    statsBtn: "اكتشف مبادراتنا",
    stats: [
      { label: 'مستفيد تمت مساعدتهم', sub: 'منذ التأسيس' },
      { label: 'تبرعات تم استلامها', sub: 'بفضل ثقتكم' },
      { label: 'عمليات توزيع منجزة', sub: 'على الأرض' },
      { label: 'آبار مياه شرب تم بناؤها', sub: 'وصول مستدام' },
      { label: 'قطع ملابس تم توزيعها', sub: 'مساعدات طارئة' },
      { label: 'أطفال تم دعمهم', sub: 'تعليم وحقائب' },
      { label: 'متطوعون نشطون', sub: 'في شبكتنا' },
    ],
    // 3 Branches
    branchesBadge: "الهيكلية والركائز",
    branchesTitle: "فروع روبوميد الثلاثة",
    branchesSubtitle: "تجمع روبوميد بين ٣ فروع متكاملة لتعظيم تأثيرها الاجتماعي والإنساني والتكنولوجي.",
    humanitarianTitle: "الفرع الإنساني",
    humanitarianDesc: "التطوع الميداني، توزيع المساعدات الغذائية والملابس، بناء آبار مياه الشرب، ودعم الأطفال في أقسام السرطان ومرضى الرعاية التلطيفية.",
    eduTitle: "الفرع التعليمي",
    eduDesc: "التوعية المجتمعية، كتابة المقالات، الدعم المدرسي، إنشاء المحتوى التعليمي، وبرامج السفراء في المدارس والجامعات.",
    techTitle: "الفرع التقني",
    techDesc: "تصميم وتطوير الحلول التكنولوجية المبتكرة والأدوات البرمجية والمنصات الرقمية لتعزيز ومضاعفة أثر الجهود الإنسانية والطبية.",
    expLabel: "الخبرة",
    expSub: "عزز سيرتك الذاتية",
    compLabel: "المهارات",
    compSub: "التصميم، الكتابة والإدارة",
    certLabel: "الشهادة",
    certSub: "تقدير رسمي",
    contactBtn: "اتصل بنا",
    // Team
    teamTitle: "فريقنا",
    teamHeading: "فريق ملتزم بجانبكم",
    teamSubtitle: "روبوميد هي فريق شغوف من المهنيين والمتطوعين الذين يعملون كل يوم بتفانٍ على الأرض.",
    filterAll: "جميع الأعضاء",
    filterCanada: "كندا 🇨🇦",
    filterTchad: "تشاد 🇹🇩",
    memberRoleKey: "الدور الرئيسي",
    memberMissionKey: "المهام الرئيسية",
    memberBranchKey: "الفرع",
    joinTeamBtn: "انضم إلى الفريق",
    responsibleDedicated: "مسؤول مخصص",
  }
}

const timelineIcons = [Users, Heart, GraduationCap, Shirt, Droplets]

export default function About() {
  const { t, language, dir } = useLanguage()
  const [selectedBranch, setSelectedBranch] = useState<'All' | 'Canada' | 'Tchad'>('All')
  const [realStats, setRealStats] = useState<any>(null)
  const [teamList, setTeamList] = useState<TeamMember[]>(loadTeamMembers)

  useEffect(() => {
    statsAPI.getImpact()
      .then(data => {
        if (data) setRealStats(data)
      })
      .catch(() => {})

    teamAPI.getAll()
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.results || [])
        if (list.length > 0) {
          setTeamList(list)
        }
      })
      .catch(() => {})

    const handleUpdate = () => {
      teamAPI.getAll()
        .then(data => {
          const list = Array.isArray(data) ? data : (data?.results || [])
          if (list.length > 0) setTeamList(list)
          else setTeamList(loadTeamMembers())
        })
        .catch(() => setTeamList(loadTeamMembers()))
    }

    window.addEventListener('robomed_team_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('robomed_team_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const currentLang = pageTranslations[language] || pageTranslations['fr']
  const isRTL = dir === 'rtl'

  // Filter team dynamically based on admin team state
  const filteredTeam = teamList.filter((member) => {
    const isTchad = member.branch?.includes('Tchad') || member.branch?.includes('TD')
    const branchNorm = isTchad ? 'Tchad' : 'Canada'
    if (selectedBranch === 'All') return true
    return branchNorm === selectedBranch
  })


  // Setup stats data mapping with current translated labels and real DB values
  const statsData = [
    { icon: Users, chiffre: realStats ? realStats.beneficiaires : 0, suffixe: (realStats?.beneficiaires ?? 0) > 0 ? '+' : '', color: '#16A34A', bg: '#DCFCE7', text: currentLang.stats[0] },
    { icon: Heart, chiffre: realStats ? realStats.dons : 0, suffixe: (realStats?.dons ?? 0) > 0 ? '+' : '', color: '#DC2626', bg: '#FEE2E2', text: currentLang.stats[1] },
    { icon: Package, chiffre: realStats ? realStats.distributions : 0, suffixe: (realStats?.distributions ?? 0) > 0 ? '+' : '', color: '#D97706', bg: '#FEF3C7', text: currentLang.stats[2] },
    { icon: Droplets, chiffre: realStats ? realStats.points_eau : 0, suffixe: '', color: '#0284C7', bg: '#DBEAFE', text: currentLang.stats[3] },
    { icon: Shirt, chiffre: realStats ? realStats.vetements : 0, suffixe: (realStats?.vetements ?? 0) > 0 ? '+' : '', color: '#7C3AED', bg: '#EDE9FE', text: currentLang.stats[4] },
    { icon: GraduationCap, chiffre: realStats ? realStats.enfants : 0, suffixe: (realStats?.enfants ?? 0) > 0 ? '+' : '', color: '#1D4ED8', bg: '#DBEAFE', text: currentLang.stats[5] },
    { icon: UserCheck, chiffre: realStats ? realStats.benevoles : 0, suffixe: (realStats?.benevoles ?? 0) > 0 ? '+' : '', color: '#16A34A', bg: '#DCFCE7', text: currentLang.stats[6] },
  ]


  const getIcon = (type: string, theme: 'green' | 'blue' | 'yellow') => {
    const colorClass = theme === 'green' ? 'text-emerald-600 dark:text-emerald-400' : theme === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400';
    switch (type) {
      case 'globe': return <Globe className={`w-4 h-4 ${colorClass}`} />
      case 'book': return <BookOpen className={`w-4 h-4 ${colorClass}`} />
      case 'shield': return <Shield className={`w-4 h-4 ${colorClass}`} />
      case 'pie': return <PieChart className={`w-4 h-4 ${colorClass}`} />
      case 'target': return <Target className={`w-4 h-4 ${colorClass}`} />
      case 'settings': return <Settings className={`w-4 h-4 ${colorClass}`} />
      default: return <Users className={`w-4 h-4 ${colorClass}`} />
    }
  }

  const getHeaderIconBg = (theme: 'green' | 'blue' | 'yellow') => {
    switch (theme) {
      case 'green': return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
      case 'blue': return 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
      case 'yellow': return 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
    }
  }

  const getCheckColor = (theme: 'green' | 'blue' | 'yellow') => {
    switch (theme) {
      case 'green': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
      case 'blue': return 'text-blue-500 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900'
      case 'yellow': return 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* ──────────────── HERO SECTION ──────────────── */}
      <section className="relative overflow-hidden bg-[#0F172A] text-white py-20 lg:py-28">
        {/* Background image & gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent" />
        
        {/* Glow effect */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-secondary/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
                <Sparkles className="w-3.5 h-3.5 text-secondary-light animate-pulse" />
                <span>{currentLang.heroBadge}</span>
              </div>

              {/* Main title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-serif">
                {t('aboutPageTitle')}
              </h1>

              {/* Subtitle location badge */}
              <p className="text-secondary-light font-bold text-lg">
                {currentLang.heroBadgeSubtitle}
              </p>

              {/* Description */}
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                {t('aboutPageDesc')}
              </p>

              {/* Action area */}
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <Link to="/faire-un-don">
                  <Button variant="secondary" size="lg" className="shadow-lg hover:shadow-secondary/20">
                    {t('donate')}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                    {currentLang.contactBtn} <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Conviction card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <div className="relative group max-w-sm w-full bg-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:border-white/25 hover:bg-white/10">
                <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-secondary flex items-center justify-center shadow-lg animate-bounce">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="space-y-4">
                  <span className="text-xs uppercase tracking-widest text-secondary font-bold">
                    {currentLang.convictionLabel}
                  </span>
                  <p className="text-white text-base leading-relaxed font-medium italic">
                    "{currentLang.convictionText}"
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ──────────────── MISSION / VISION / VALEURS ──────────────── */}
      <section className="py-20 lg:py-28 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-secondary text-xs uppercase tracking-widest font-bold block">
              {t('aboutPageTag')}
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white font-serif">
              {t('missionVisionTitle')}
            </h2>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card: Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group bg-slate-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 hover:border-secondary dark:hover:border-secondary shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-serif">
                  {currentLang.missionTitle}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {currentLang.missionDesc}
                </p>
              </div>
            </motion.div>

            {/* Card: Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group bg-slate-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 hover:border-[#0284C7] dark:hover:border-[#0284C7] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-7 h-7 text-[#0284C7]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-serif">
                  {currentLang.visionTitle}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {currentLang.visionDesc}
                </p>
              </div>
            </motion.div>

            {/* Card: Valeurs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group bg-slate-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Diamond className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-serif">
                {currentLang.valuesTitle}
              </h3>
              <ul className="space-y-3">
                {currentLang.values.map((v, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-secondary font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-medium">{v}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ──────────────── LES 3 BRANCHES DE ROBOMED ──────────────── */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-900 to-[#0F172A] text-white relative overflow-hidden">
        {/* Glow background effects */}
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-secondary text-xs uppercase tracking-widest font-bold block bg-secondary/10 px-3 py-1 rounded-full w-fit mx-auto border border-secondary/20">
              {currentLang.branchesBadge}
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold font-serif leading-tight">
              {currentLang.branchesTitle}
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {currentLang.branchesSubtitle}
            </p>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. Branche Humanitaire */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-emerald-400 fill-emerald-400" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-3">
                  Pôle 01 · Terrain & Urgence
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 font-serif">
                  {currentLang.humanitarianTitle}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {currentLang.humanitarianDesc}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Actions directes Canada & Tchad
              </div>
            </motion.div>

            {/* 2. Branche Éducative */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7 text-blue-400" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-3">
                  Pôle 02 · Sensibilisation & Formation
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 font-serif">
                  {currentLang.eduTitle}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {currentLang.eduDesc}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                Réseau d'Ambassadeurs scolaires
              </div>
            </motion.div>

            {/* 3. Branche Technique */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-amber-500/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="w-7 h-7 text-amber-400" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-3">
                  Pôle 03 · Solutions Technologiques
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 font-serif">
                  {currentLang.techTitle}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {currentLang.techDesc}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Innovation & Outils Digitaux
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ──────────────── INTERACTIVE TIMELINE ──────────────── */}
      <section className="py-20 lg:py-28 bg-slate-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <span className="text-secondary text-xs uppercase tracking-widest font-bold block">
              {t('historyTitle')}
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white font-serif">
              {currentLang.timelineTitle}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {currentLang.timelineSubtitle}
            </p>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="relative">
            {/* Center / Side Line */}
            <div className={`absolute top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 ${
              isRTL ? 'right-9 md:right-1/2 md:translate-x-1/2' : 'left-9 md:left-1/2 md:-translate-x-1/2'
            }`} />

            {/* Timeline steps */}
            <div className="space-y-12 relative">
              {currentLang.timeline.map((item, i) => {
                const TIcon = timelineIcons[i] ?? Heart
                const isLeft = isRTL ? (i % 2 !== 0) : (i % 2 === 0)
                
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`flex flex-col md:flex-row items-center justify-between relative ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    } ${isRTL ? 'pr-16 md:pr-0' : 'pl-16 md:pl-0'}`}
                  >
                    
                    {/* Content Card */}
                    <div className={`w-full md:w-[45%] ${
                      isLeft ? 'md:text-right' : 'md:text-left'
                    }`}>
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative group">
                        {/* Dot indicator inside card */}
                        <div 
                          className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full hidden md:block ${
                            isLeft ? '-right-1.5' : '-left-1.5'
                          }`}
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3" style={{ backgroundColor: item.bg, color: item.color }}>
                          {item.year}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-serif" style={{ color: item.color }}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Central Glowing Icon Node */}
                    <div
                      className={`absolute w-12 h-12 rounded-full flex items-center justify-center z-10 border-4 bg-white dark:bg-gray-900 shadow-md ${
                        isRTL 
                          ? 'right-3 md:right-auto md:left-1/2 md:-translate-x-1/2' 
                          : 'left-3 md:left-1/2 md:-translate-x-1/2'
                      }`}
                      style={{ borderColor: item.color }}
                    >
                      <TIcon className="w-5 h-5" style={{ color: item.color }} />
                    </div>

                    {/* Desktop spacer */}
                    <div className="hidden md:block w-[45%]" />

                  </motion.div>
                )
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────── IMPACT STATS ──────────────── */}
      <section className="py-20 lg:py-28 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-2">
              <span className="text-secondary text-xs uppercase tracking-widest font-bold block">
                {currentLang.statsSubtitle}
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white font-serif max-w-2xl leading-tight">
                {currentLang.statsTitle}
              </h2>
            </div>
            <Link to="/nos-actions">
              <Button variant="outline" size="md" className="shrink-0 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700">
                {currentLang.statsBtn} <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {statsData.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-slate-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-850 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Decorative corner glow */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 blur-xl transition-opacity duration-300" style={{ backgroundColor: s.color }} />
                  
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: s.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight font-serif mb-1">
                    <Counter to={s.chiffre} suffix={s.suffixe} />
                  </div>
                  
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">{s.text.label}</p>
                  {s.text.sub && <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{s.text.sub}</p>}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ──────────────── PROGRAMME AMBASSADEURS ──────────────── */}
      <section className="py-20 lg:py-28 bg-white dark:bg-gray-850 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[32px] overflow-hidden text-white p-8 lg:p-14 relative shadow-2xl">
            {/* Blurry decorations */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
            <div className="absolute left-1/3 bottom-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-cover bg-center hidden lg:block" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80')" }} />
            
            <div className="max-w-3xl relative z-10 space-y-8">
              <div>
                <span className="text-secondary text-xs font-semibold uppercase tracking-widest block mb-2">
                  {t('ambassadorTag')}
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold font-serif leading-tight">
                  {t('ambassadorTitle')}
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mt-4 max-w-2xl">
                  {t('ambassadorDesc')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Branche Humanitaire */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-300">
                  <h3 className="font-bold text-secondary text-base mb-2.5 flex items-center gap-2 font-serif">
                    <Heart className="w-5 h-5 text-secondary fill-secondary" /> 
                    {currentLang.humanitarianTitle}
                  </h3>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {currentLang.humanitarianDesc}
                  </p>
                </div>
                
                {/* 2. Branche Éducative */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-500/40 transition-all duration-300">
                  <h3 className="font-bold text-[#0284C7] text-base mb-2.5 flex items-center gap-2 font-serif">
                    <GraduationCap className="w-5 h-5 text-[#0284C7]" /> 
                    {currentLang.eduTitle}
                  </h3>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {currentLang.eduDesc}
                  </p>
                </div>

                {/* 3. Branche Technique */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-amber-500/40 transition-all duration-300">
                  <h3 className="font-bold text-amber-400 text-base mb-2.5 flex items-center gap-2 font-serif">
                    <Cpu className="w-5 h-5 text-amber-400" /> 
                    {currentLang.techTitle}
                  </h3>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {currentLang.techDesc}
                  </p>
                </div>

              </div>

              {/* Badges and CTA */}
              <div className="flex flex-wrap items-center justify-between gap-8 pt-6 border-t border-white/10">
                <div className="flex flex-wrap gap-6">
                  
                  <div className="text-left">
                    <div className="text-base font-bold text-secondary">{currentLang.expLabel}</div>
                    <div className="text-[10px] text-gray-400">{currentLang.expSub}</div>
                  </div>
                  
                  <div className="w-px h-8 bg-white/20 hidden sm:block" />
                  
                  <div className="text-left">
                    <div className="text-base font-bold text-[#0284C7]">{currentLang.compLabel}</div>
                    <div className="text-[10px] text-gray-400">{currentLang.compSub}</div>
                  </div>
                  
                  <div className="w-px h-8 bg-white/20 hidden sm:block" />
                  
                  <div className="text-left">
                    <div className="text-base font-bold text-emerald-400">{currentLang.certLabel}</div>
                    <div className="text-[10px] text-gray-400">{currentLang.certSub}</div>
                  </div>

                </div>
                
                <Link to="/contact">
                  <Button variant="secondary" size="lg" className="shadow-lg hover:shadow-secondary/20">
                    {currentLang.contactBtn} <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── TEAM SECTION ──────────────── */}
      <section className="py-20 lg:py-28 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <span className="text-secondary text-xs uppercase tracking-widest font-bold block">
                {currentLang.teamTitle}
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white font-serif">
                {currentLang.teamHeading}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-2xl">
                {currentLang.teamSubtitle}
              </p>
            </div>
            
            <Link to="/contact">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 transition-all shadow-sm">
                <Users className="w-4 h-4" />
                {currentLang.joinTeamBtn}
              </button>
            </Link>
          </div>

          {/* Filtering tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-gray-250/20">
            {[
              { id: 'All', label: currentLang.filterAll },
              { id: 'Canada', label: currentLang.filterCanada },
              { id: 'Tchad', label: currentLang.filterTchad }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedBranch(tab.id as 'All' | 'Canada' | 'Tchad')}
                className={`relative px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedBranch === tab.id
                    ? 'bg-[#0B4F9C] text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 border border-gray-150 dark:border-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Members Grid with Motion layout animation */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredTeam.map((member) => {
                const langKey = (language === 'en' ? 'en' : language === 'ar' ? 'ar' : 'fr') as 'fr' | 'en' | 'ar'
                const name = member.nom || member.name || 'Membre RoBomed'
                const role = typeof member.role === 'object' ? (member.role[langKey] || member.role.fr) : (member.role || 'Membre de l\'équipe')
                const bio = typeof member.bio === 'object' ? (member.bio[langKey] || member.bio.fr) : (member.bio || `Membre engagé au sein de l'organisation RoBomed.`)
                
                let missionsList: string[] = []
                if (Array.isArray(member.missions)) {
                  missionsList = member.missions
                } else if (member.missions && typeof member.missions === 'object' && Array.isArray((member.missions as any)[langKey])) {
                  missionsList = (member.missions as any)[langKey]
                } else if (Array.isArray(member.tags) && member.tags.length > 0) {
                  missionsList = member.tags.map(t => `Expertise : ${t}`)
                } else {
                  missionsList = ['Engagement terrain', 'Coordination des actions']
                }

                const isTchad = member.branch?.includes('Tchad') || member.branch?.includes('TD')
                const branchLabel = isTchad ? '🇹🇩 TD' : '🇨🇦 CA'
                const colorTheme = member.colorTheme || (isTchad ? 'blue' : 'yellow')
                const iconType = member.iconType || 'shield'
                const photoSrc = member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`

                return (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col group overflow-hidden relative"
                  >
                    {/* Highlight bar for branch */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                      isTchad ? 'bg-blue-600' : 'bg-amber-500'
                    }`} />
                    
                    <div>
                      {/* Header: Role Title & Custom Icon */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getHeaderIconBg(colorTheme)}`}>
                          {getIcon(iconType, colorTheme)}
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold block leading-none mb-1">
                            {currentLang.memberRoleKey}
                          </span>
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug">
                            {role}
                          </h3>
                        </div>
                      </div>

                      {/* Member Capsule (Avatar + Name + Flag) */}
                      <div className="bg-slate-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-3 flex items-center justify-between gap-3 mb-4 group-hover:bg-slate-100 dark:group-hover:bg-gray-900 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={photoSrc}
                            alt={name}
                            className="w-11 h-11 rounded-full object-cover shrink-0 border-2 border-white dark:border-gray-800 shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
                            }}
                          />
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-gray-900 dark:text-white text-xs leading-tight truncate">
                              {name}
                            </h4>
                            <p className="text-[10px] text-gray-400 leading-none mt-1">
                              {currentLang.responsibleDedicated}
                            </p>
                          </div>
                        </div>
                        
                        {/* Branch Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                          !isTchad 
                            ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900' 
                            : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900'
                        }`}>
                          {branchLabel}
                        </span>
                      </div>

                      {/* Bio Description */}
                      <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mb-0">
                        {bio}
                      </p>
                    </div>

                     {/* Missions Clés Section */}
                     <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-700 mt-3">
                      <h5 className="text-[9px] font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                        {currentLang.memberMissionKey}
                      </h5>
                      <ul className="space-y-2">
                        {missionsList.map((mission, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-400">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${getCheckColor(colorTheme)}`}>
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            <span className="leading-tight text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">
                              {mission}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>


                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

    </div>
  )
}
