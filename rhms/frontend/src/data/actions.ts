export interface Action {
  id: number
  icon: string
  titre: { fr: string; en: string; ar: string }
  description: { fr: string; en: string; ar: string }
  couleur: string
  stat?: string
  statLabel?: { fr: string; en: string; ar: string }
}

export const actions: Action[] = [
  {
    id: 1,
    icon: 'Apple',
    titre: {
      fr: 'Aide alimentaire',
      en: 'Food Relief',
      ar: 'المساعدات الغذائية',
    },
    description: {
      fr: 'Distribution de vivres et renforcement de la sécurité alimentaire des familles vulnérables.',
      en: 'Distribution of food supplies and strengthening food security for vulnerable families.',
      ar: 'توزيع المؤن وتطوير الأمن الغذائي للعائلات المحتاجة.',
    },
    couleur: '#16A34A',
    stat: '12 540+',
    statLabel: {
      fr: 'bénéficiaires aidés',
      en: 'beneficiaries assisted',
      ar: 'مستفيد تمت مساعدتهم',
    },
  },
  {
    id: 2,
    icon: 'HeartPulse',
    titre: {
      fr: 'Santé',
      en: 'Healthcare',
      ar: 'الرعاية الصحية',
    },
    description: {
      fr: 'Soutien aux structures de santé, campagnes médicales et sensibilisation sanitaire.',
      en: 'Support for healthcare facilities, medical campaigns, and health awareness.',
      ar: 'دعم المرافق الصحية والحملات الطبية والتوعية الصحية.',
    },
    couleur: '#0B4F9C',
    stat: '8 320+',
    statLabel: {
      fr: 'personnes touchées',
      en: 'people reached',
      ar: 'شخص تم الوصول إليهم',
    },
  },
  {
    id: 3,
    icon: 'Droplet',
    titre: {
      fr: 'Eau & Assainissement',
      en: 'Water & Sanitation',
      ar: 'المياه والإصحاح البيئي',
    },
    description: {
      fr: "Construction de points d'eau, forages, latrines et actions pour l'hygiène et l'assainissement.",
      en: 'Construction of water points, boreholes, latrines, and hygiene awareness.',
      ar: 'بناء نقاط المياه، الآبار، والمراحيض بالإضافة إلى أنشطة النظافة الإصحاحية.',
    },
    couleur: '#0284C7',
    stat: '27',
    statLabel: {
      fr: "points d'eau construits",
      en: 'water points constructed',
      ar: 'نقطة مياه تم بناؤها',
    },
  },
  {
    id: 4,
    icon: 'Shirt',
    titre: {
      fr: 'Vêtements',
      en: 'Clothing Aid',
      ar: 'المساعدات الكسائية',
    },
    description: {
      fr: 'Collecte et distribution de vêtements pour protéger les plus démunis.',
      en: 'Collection and distribution of clothing to protect those in need.',
      ar: 'جمع وتوزيع الملابس لحماية الأسر المحتاجة.',
    },
    couleur: '#7C3AED',
    stat: '18 900+',
    statLabel: {
      fr: 'vêtements distribués',
      en: 'clothing items distributed',
      ar: 'قطعة ملابس تم توزيعها',
    },
  },
  {
    id: 5,
    icon: 'BookOpen',
    titre: {
      fr: 'Éducation',
      en: 'Education',
      ar: 'التعليم والتأهيل',
    },
    description: {
      fr: 'Soutien scolaire, fournitures, bourses et infrastructures éducatives.',
      en: 'Academic support, supplies, scholarships, and educational infrastructure.',
      ar: 'الدعم المدرسي، المستلزمات، المنح الدراسية والبنية التحتية التعليمية.',
    },
    couleur: '#1D4ED8',
    stat: '1 250+',
    statLabel: {
      fr: 'enfants soutenus',
      en: 'children supported',
      ar: 'طفل تم دعمهم',
    },
  },
  {
    id: 6,
    icon: 'Users',
    titre: {
      fr: 'Développement communautaire',
      en: 'Community Development',
      ar: 'التنمية المجتمعية',
    },
    description: {
      fr: 'Autonomisation des communautés, formations et projets générateurs de revenus.',
      en: 'Community empowerment, training, and income-generating projects.',
      ar: 'تمكين المجتمعات، التدريب، والمشاريع المدرة للدخل.',
    },
    couleur: '#D97706',
    stat: '320+',
    statLabel: {
      fr: 'initiatives accompagnées',
      en: 'initiatives supported',
      ar: 'مبادرة تم دعمها',
    },
  },
]
