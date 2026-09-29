import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Language = 'fr' | 'en' | 'ar'

interface Translations {
  [key: string]: {
    fr: string
    en: string
    ar: string
  }
}

export const translations: Translations = {
  // ─── Navigation ───
  home: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' },
  about: { fr: 'À propos', en: 'About Us', ar: 'من نحن' },
  actions: { fr: 'Nos actions', en: 'Our Actions', ar: 'مبادراتنا' },
  projects: { fr: 'Projets', en: 'Projects', ar: 'المشاريع' },
  news: { fr: 'Actualités', en: 'News', ar: 'الأخبار' },
  gallery: { fr: 'Galerie', en: 'Gallery', ar: 'المعرض' },
  contact: { fr: 'Contact', en: 'Contact', ar: 'اتصل بنا' },
  login: { fr: 'Se connecter', en: 'Login', ar: 'تسجيل الدخول' },
  donate: { fr: 'Faire un don', en: 'Donate Now', ar: 'تبرع الآن' },
  impactMapNav: { fr: "Carte d'Impact", en: 'Impact Map', ar: 'خريطة الأثر' },
  donorPortalNav: { fr: 'Espace Donateur', en: 'Donor Portal', ar: 'بوابة المتبرعين' },
  volunteerPortalNav: { fr: 'Espace Bénévole', en: 'Volunteer Portal', ar: 'بوابة المتطوعين' },
  transparencyNav: { fr: 'Transparence', en: 'Transparency', ar: 'الشفافية' },
  legalNav: { fr: 'Mentions Légales', en: 'Legal Notice', ar: 'الإشعار القانوني' },
  learnMore: { fr: 'En savoir plus', en: 'Learn More', ar: 'اعرف أكثر' },
  seeAll: { fr: 'Voir tout', en: 'See All', ar: 'عرض الكل' },
  readMore: { fr: 'Lire la suite', en: 'Read More', ar: 'اقرأ المزيد' },

  // ─── Home Hero ───
  heroBadge: {
    fr: 'Organisation Étudiante Humanitaire',
    en: 'Student Humanitarian Organization',
    ar: 'منظمة طلابية إنسانية',
  },
  heroBadgeCountry: {
    fr: '🇨🇦 Canada & 🇹🇩 Tchad',
    en: '🇨🇦 Canada & 🇹🇩 Chad',
    ar: '🇨🇦 كندا و 🇹🇩 تشاد',
  },
  heroTitle: {
    fr: 'Changer des vies par la solidarité internationale',
    en: 'Changing lives through international solidarity',
    ar: 'تغيير الحياة من خلال التضامن الدولي',
  },
  heroDesc: {
    fr: "Fondée le 22 Avril 2025, RoBomed réunit 8 étudiants engagés entre le Canada et le Tchad pour construire des puits d'eau potable, financer l'éducation et apporter du réconfort aux enfants hospitalisés.",
    en: 'Founded on April 22, 2025, RoBomed unites 8 committed students across Canada and Chad to build drinking water wells, support education, and bring comfort to hospitalized children.',
    ar: 'تأسست في 22 أبريل 2025، وتجمع روبوميد 8 طلاب ملتزمين بين كندا وتشاد لبناء آبار مياه الشرب ودعم التعليم وتقديم الدعم للأطفال المرضى.',
  },
  heroCta: { fr: 'Faire un don', en: 'Make a Donation', ar: 'تبرع الآن' },
  heroCta2: { fr: 'Devenir Ambassadeur', en: 'Become an Ambassador', ar: 'كن سفيراً' },
  heroCheck1: { fr: '100% Gestion Étudiante', en: '100% Student-run', ar: '100% إدارة طلابية' },
  heroCheck2: { fr: 'Impact direct sur le terrain', en: 'Direct field impact', ar: 'تأثير مباشر على أرض الواقع' },
  heroCheck3: { fr: 'Transparence financière', en: 'Financial transparency', ar: 'الشفافية المالية' },
  heroActionTitle: { fr: 'Action Phare 2025', en: 'Flagship Action 2025', ar: 'المبادرة الرئيسية 2025' },
  heroActionLabel: {
    fr: "Puits d'Eau Potable au Tchad",
    en: 'Drinking Water Wells in Chad',
    ar: 'آبار مياه الشرب في تشاد',
  },
  heroActionSub: {
    fr: 'Financé par les ventes solidaires au Canada',
    en: 'Funded by solidarity sales in Canada',
    ar: 'ممول من المبيعات التضامنية في كندا',
  },
  heroStatLabel1: { fr: 'Budget Puits Collecté', en: 'Well Budget Raised', ar: 'ميزانية البئر المجمعة' },
  heroStatLabel2: { fr: 'Canada (4) & Tchad (4)', en: 'Canada (4) & Chad (4)', ar: 'كندا (4) و تشاد (4)' },
  heroStatValue1: { fr: '~1 200 CAD', en: '~1,200 CAD', ar: '~١٢٠٠ دولار كندي' },
  heroStatValue2: { fr: '8 Membres', en: '8 Members', ar: '٨ أعضاء' },

  // ─── Quick Nav Cards ───
  quickNav1Title: { fr: 'Qui sommes-nous ?', en: 'Who Are We?', ar: 'من نحن؟' },
  quickNav1Desc: {
    fr: 'Organisation étudiante fondée le 22 Avril 2025 au Canada et au Tchad.',
    en: 'Student organization founded on April 22, 2025 in Canada and Chad.',
    ar: 'منظمة طلابية تأسست في 22 أبريل 2025 في كندا وتشاد.',
  },
  quickNav1Link: { fr: 'Notre histoire', en: 'Our Story', ar: 'قصتنا' },

  // ─── 404 Page ───
  notFoundTitle: { fr: 'Page Introuvable', en: 'Page Not Found', ar: 'الصفحة غير موجودة' },
  notFoundDesc: {
    fr: "La page que vous recherchez n'existe pas ou a été déplacée.",
    en: "The page you are looking for does not exist or has been moved.",
    ar: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
  },
  notFoundBtn: { fr: "Retour à l'accueil", en: 'Back to Home', ar: 'العودة إلى الرئيسية' },

  quickNav2Title: { fr: 'Nos actions terrain', en: 'Our Field Actions', ar: 'أعمالنا الميدانية' },
  quickNav2Desc: {
    fr: "Puits d'eau potable, fournitures scolaires et réconfort hospitalier.",
    en: 'Drinking water wells, school supplies and hospital comfort.',
    ar: 'آبار مياه الشرب واللوازم المدرسية والراحة في المستشفيات.',
  },
  quickNav2Link: { fr: 'Découvrir les actions', en: 'Discover Actions', ar: 'اكتشف الأعمال' },

  quickNav3Title: { fr: 'Devenir Ambassadeur', en: 'Become an Ambassador', ar: 'كن سفيراً' },
  quickNav3Desc: {
    fr: 'Représentez RoBomed dans votre établissement scolaire ou universitaire.',
    en: 'Represent RoBomed in your school or university.',
    ar: 'مثّل روبوميد في مدرستك أو جامعتك.',
  },
  quickNav3Link: { fr: 'Rejoindre le réseau', en: 'Join the Network', ar: 'انضم إلى الشبكة' },

  quickNav4Title: { fr: 'Faire un don solidaire', en: 'Make a Solidarity Donation', ar: 'تبرع بتضامن' },
  quickNav4Desc: {
    fr: "Financez directement nos projets à N'Djamena et au Canada.",
    en: "Directly fund our projects in N'Djamena and Canada.",
    ar: 'موّل مشاريعنا مباشرة في نجامينا وكندا.',
  },
  quickNav4Link: { fr: 'Soutenir RoBomed', en: 'Support RoBomed', ar: 'ادعم روبوميد' },

  // ─── Featured Projects Section ───
  projectsTitle: { fr: 'Projets Phares RoBomed', en: 'RoBomed Flagship Projects', ar: 'مشاريع روبوميد الرئيسية' },
  projectsSubtitle: {
    fr: 'Nos Réalisations & Engagements',
    en: 'Our Achievements & Commitments',
    ar: 'إنجازاتنا والتزاماتنا',
  },
  seeAllProjects: { fr: 'Voir tous les projets', en: 'See all projects', ar: 'عرض كل المشاريع' },
  supportBtn: { fr: 'Soutenir', en: 'Support', ar: 'ادعم' },
  budgetLabel: { fr: 'Impact / Budget', en: 'Impact / Budget', ar: 'التأثير / الميزانية' },

  // Project titles & descriptions
  proj1Title: { fr: "Puits d'eau potable", en: 'Drinking Water Wells', ar: 'آبار مياه الشرب' },
  proj1Tag: { fr: 'Eau & Santé', en: 'Water & Health', ar: 'المياه والصحة' },
  proj1Desc: {
    fr: "Construction de puits d'eau potable financés par nos ventes solidaires de gâteaux et livres au Canada. Accès durable à l'eau potable pour les villages.",
    en: 'Construction of drinking water wells funded by our solidarity sales of cakes and books in Canada. Sustainable access to drinking water for villages.',
    ar: 'بناء آبار مياه الشرب المموّلة من مبيعاتنا التضامنية من الكعك والكتب في كندا. وصول مستدام إلى مياه الشرب للقرى.',
  },

  proj2Title: { fr: 'Fournitures Scolaires', en: 'School Supplies', ar: 'اللوازم المدرسية' },
  proj2Tag: { fr: 'Éducation', en: 'Education', ar: 'التعليم' },
  proj2Desc: {
    fr: 'Distribution de kits scolaires complets (cahiers, stylos, trousses) aux enfants défavorisés des zones rurales pour lutter contre le décrochage scolaire.',
    en: 'Distribution of complete school kits (notebooks, pens, pencil cases) to underprivileged children in rural areas to combat school dropout.',
    ar: 'توزيع حقائب مدرسية كاملة (دفاتر وأقلام ومقلمة) على الأطفال المحرومين في المناطق الريفية لمكافحة التسرب المدرسي.',
  },

  proj3Title: { fr: 'Fleurs Crochet & Lettres', en: 'Crochet Flowers & Letters', ar: 'زهور الكروشيه والرسائل' },
  proj3Tag: { fr: 'Soins Palliatifs', en: 'Palliative Care', ar: 'الرعاية التلطيفية' },
  proj3Desc: {
    fr: "Création artisanale de fleurs en crochet associées à des lettres de réconfort écrites par des étudiants pour les patients en soins palliatifs.",
    en: "Handmade crochet flowers combined with comfort letters written by students for palliative care patients.",
    ar: 'زهور كروشيه مصنوعة يدوياً مع رسائل مواساة كتبها طلاب لمرضى الرعاية التلطيفية.',
  },

  proj4Title: { fr: 'Soutien Enfants Oncologie', en: 'Pediatric Oncology Support', ar: 'دعم أطفال أورام الأطفال' },
  proj4Tag: { fr: 'Pédiatrie', en: 'Pediatrics', ar: 'طب الأطفال' },
  proj4Desc: {
    fr: "Distribution de friandises, peluches et messages d'encouragement aux enfants hospitalisés en oncologie pédiatrique.",
    en: 'Distribution of sweets, stuffed animals and encouraging messages to hospitalized children in pediatric oncology.',
    ar: 'توزيع الحلوى والدمى ورسائل التشجيع على الأطفال المرضى في أقسام أورام الأطفال.',
  },

  branchesBadge: {
    fr: "Piliers d'Engagement",
    en: "Engagement Pillars",
    ar: "ركائز الالتزام",
  },
  branchesTitle: {
    fr: "Les 3 Branches de RoBomed",
    en: "The 3 Branches of RoBomed",
    ar: "فروع روبوميد الثلاثة",
  },
  branchesDesc: {
    fr: "Une organisation structurée autour de 3 piliers complémentaires pour un impact global et durable.",
    en: "An organization structured around 3 complementary pillars for global and sustainable impact.",
    ar: "منظمة مهيكلة حول 3 ركائز متكاملة لتأثير عالمي ومستدام.",
  },
  branchLabel: {
    fr: "Branche",
    en: "Branch",
    ar: "فرع",
  },
  branch1Title: {
    fr: "Branche Humanitaire",
    en: "Humanitarian Branch",
    ar: "الفرع الإنساني",
  },
  branch1Desc: {
    fr: "Bénévolat sur le terrain, aides alimentaires & vestimentaires, puits d'eau potable, secours pédiatrique et soutien aux soins palliatifs.",
    en: "Field volunteering, food & clothing aid, clean water wells, pediatric rescue and palliative care support.",
    ar: "التطوع الميداني، المساعدات الغذائية والملابس، آبار مياه الشرب، إنقاذ الأطفال ودعم الرعاية التلطيفية.",
  },
  branch2Title: {
    fr: "Branche Éducative",
    en: "Educational Branch",
    ar: "الفرع التعليمي",
  },
  branch2Desc: {
    fr: "Sensibilisation des communautés, soutien à la scolarisation, rédaction d'articles engagés et animation du réseau d'ambassadeurs.",
    en: "Community awareness, enrollment support, writing committed articles and leading the ambassador network.",
    ar: "توعية المجتمعات، دعم التعليم، كتابة المقالات الملتزمة وتنشيط شبكة السفراء.",
  },
  branch3Title: {
    fr: "Branche Technique",
    en: "Technical Branch",
    ar: "الفرع التقني",
  },
  branch3Desc: {
    fr: "Développement de solutions technologiques innovantes, outils informatiques, plateformes digitales pour soutenir les actions médicales et humanitaires.",
    en: "Development of innovative technological solutions, IT tools, digital platforms to support medical and humanitarian actions.",
    ar: "تطوير حلول تكنولوجية مبتكرة، أدوات معلوماتية، ومنصات رقمية لدعم الأعمال الطبية والإنسانية.",
  },
  countryChad: {
    fr: "🇹🇩 Tchad",
    en: "🇹🇩 Chad",
    ar: "🇹🇩 تشاد",
  },
  countryCanada: {
    fr: "🇨🇦 Canada",
    en: "🇨🇦 Canada",
    ar: "🇨🇦 كندا",
  },
  budgetVal1: {
    fr: "1 200 CAD",
    en: "1,200 CAD",
    ar: "١٢٠٠ دولار كندي",
  },
  budgetVal2: {
    fr: "Action continue",
    en: "Ongoing action",
    ar: "عمل مستمر",
  },
  budgetVal3: {
    fr: "Projet permanent",
    en: "Permanent project",
    ar: "مشروع دائم",
  },
  budgetVal4: {
    fr: "Action récurrente",
    en: "Recurring action",
    ar: "عمل متكرر",
  },
  progressLabel: {
    fr: "Progression",
    en: "Progress",
    ar: "التقدم",
  },

  // ─── Founders Quote ───
  quoteText: {
    fr: "« RoBomed est née d'une conviction simple : l'engagement étudiant peut traverser les océans. De la fabrication de fleurs en crochet pour réconforter les malades au Canada jusqu'au forage de puits au Tchad, chaque action compte. »",
    en: '"RoBomed was born from a simple conviction: student commitment can cross oceans. From making crochet flowers to comfort the sick in Canada to drilling wells in Chad, every action matters."',
    ar: '«ولدت روبوميد من قناعة بسيطة: التزام الطلاب يمكن أن يعبر المحيطات. من صنع زهور الكروشيه لتعزية المرضى في كندا إلى حفر الآبار في تشاد، كل عمل له أثر.»',
  },
  quoteAuthor: {
    fr: "Aïcha Baradine & l'Équipe Fondatrice",
    en: 'Aïcha Baradine & the Founding Team',
    ar: 'عائشة برادين وفريق المؤسسين',
  },
  quoteRole: {
    fr: 'Présidence RoBomed · Fondée le 22 Avril 2025',
    en: 'RoBomed Presidency · Founded April 22, 2025',
    ar: 'رئاسة روبوميد · تأسست في 22 أبريل 2025',
  },

  // ─── Ambassador Section ───
  ambassadorTag: {
    fr: "Réseau d'Écoles & Universités",
    en: 'School & University Network',
    ar: 'شبكة المدارس والجامعات',
  },
  ambassadorTitle: {
    fr: 'Deviens Ambassadeur RoBomed dans ton établissement !',
    en: 'Become a RoBomed Ambassador at your institution!',
    ar: 'كن سفير روبوميد في مؤسستك!',
  },
  ambassadorDesc: {
    fr: "Représente RoBomed dans ton école, organise des collectes ou crée du contenu. Reçois une attestation officielle et un certificat de leadership valorisant ton engagement.",
    en: "Represent RoBomed at your school, organize fundraisers or create content. Receive an official certificate and a leadership certificate recognizing your commitment.",
    ar: 'مثّل روبوميد في مدرستك، ونظّم جمع التبرعات أو أنشئ محتوى. احصل على شهادة رسمية وشهادة قيادية تُقدّر التزامك.',
  },
  ambassadorBtn: { fr: 'Postuler maintenant', en: 'Apply Now', ar: 'تقدم الآن' },

  // ─── Domains Section ───
  domainsTitle: {
    fr: "Nos piliers d'action humanitaire & éducative",
    en: 'Our humanitarian & educational action pillars',
    ar: 'ركائز عملنا الإنساني والتعليمي',
  },
  domainWater: { fr: 'Eau Potable', en: 'Drinking Water', ar: 'مياه الشرب' },
  domainEducation: { fr: 'Éducation', en: 'Education', ar: 'التعليم' },
  domainPalliative: { fr: 'Soins Palliatifs', en: 'Palliative Care', ar: 'الرعاية التلطيفية' },
  domainPediatric: { fr: 'Soutien Pédiatrique', en: 'Pediatric Support', ar: 'دعم الأطفال' },
  domainSales: { fr: 'Ventes Solidaires', en: 'Solidarity Sales', ar: 'المبيعات التضامنية' },
  domainAmbassadors: { fr: 'Réseau Ambassadeurs', en: 'Ambassador Network', ar: 'شبكة السفراء' },

  // ─── Donation page ───
  donatePageTitle: { fr: 'Faire un don solidaire', en: 'Make a Solidarity Donation', ar: 'قدم تبرعاً تضامنياً' },
  donatePageSubtitle: {
    fr: 'Chaque contribution finance directement nos actions au Tchad et au Canada.',
    en: 'Every contribution directly funds our actions in Chad and Canada.',
    ar: 'كل مساهمة تموّل مباشرة أعمالنا في تشاد وكندا.',
  },
  donateFormTitle: { fr: 'Soutenir les actions de RoBomed', en: 'Support RoBomed Actions', ar: 'ادعم أعمال روبوميد' },
  donateFormSubtitle: {
    fr: 'Choisissez votre montant et le projet qui vous tient à cœur',
    en: 'Choose your amount and the project you care about',
    ar: 'اختر مبلغك والمشروع الذي تهتم به',
  },
  donateCurrencyLabel: { fr: 'Devise de contribution', en: 'Contribution Currency', ar: 'عملة المساهمة' },
  donateProjectLabel: { fr: 'Projet attribué', en: 'Assigned Project', ar: 'المشروع المحدد' },
  donateCustomLabel: { fr: 'Montant personnalisé', en: 'Custom Amount', ar: 'مبلغ مخصص' },
  donateCustomPlaceholder: { fr: 'Autre montant', en: 'Other amount', ar: 'مبلغ آخر' },
  donateTotalLabel: { fr: 'Montant de votre don', en: 'Your donation amount', ar: 'مبلغ تبرعك' },
  donateDest: { fr: 'Destination :', en: 'Destination:', ar: 'الوجهة:' },
  donateConfirmBtn: {
    fr: 'Confirmer le don de',
    en: 'Confirm donation of',
    ar: 'تأكيد التبرع بمبلغ',
  },
  donateSuccessMsg: {
    fr: 'Un grand MERCI pour votre générosité ! Votre don a été enregistré avec succès.',
    en: 'A huge THANK YOU for your generosity! Your donation has been successfully recorded.',
    ar: 'شكراً جزيلاً على كرمكم! تم تسجيل تبرعكم بنجاح.',
  },
  donateSecure: {
    fr: 'Paiement 100% sécurisé · Attestation de reçu disponible',
    en: '100% secure payment · Receipt available upon request',
    ar: 'دفع آمن 100% · إيصال متاح عند الطلب',
  },
  donateThankYou: { fr: 'Merci pour votre générosité', en: 'Thank you for your generosity', ar: 'شكراً على كرمكم' },
  donateThankDesc: {
    fr: "Grâce à vos dons, nos 8 étudiants bénévoles au Canada et au Tchad construisent des puits d'eau potable et distribuent des kits scolaires.",
    en: 'Thanks to your donations, our 8 volunteer students in Canada and Chad build drinking water wells and distribute school kits.',
    ar: 'بفضل تبرعاتكم، يقوم 8 طلاب متطوعون في كندا وتشاد ببناء آبار مياه الشرب وتوزيع حقائب مدرسية.',
  },

  // Form fields
  firstName: { fr: 'Prénom', en: 'First Name', ar: 'الاسم الأول' },
  lastName: { fr: 'Nom', en: 'Last Name', ar: 'اسم العائلة' },
  email: { fr: 'Email', en: 'Email', ar: 'البريد الإلكتروني' },
  phone: { fr: 'Téléphone (optionnel)', en: 'Phone (optional)', ar: 'الهاتف (اختياري)' },
  firstNamePlaceholder: { fr: 'Votre prénom', en: 'Your first name', ar: 'اسمك الأول' },
  lastNamePlaceholder: { fr: 'Votre nom', en: 'Your last name', ar: 'اسم عائلتك' },
  emailPlaceholder: { fr: 'votre@email.com', en: 'your@email.com', ar: 'بريدك@الإلكتروني.com' },
  phonePlaceholder: { fr: 'Votre téléphone', en: 'Your phone', ar: 'هاتفك' },
  processing: { fr: 'Traitement du don en cours...', en: 'Processing donation...', ar: 'جار معالجة التبرع...' },

  // ─── Gallery ───
  galleryTitle: { fr: 'Galerie Photos & Actions', en: 'Photo Gallery & Actions', ar: 'معرض الصور والأعمال' },
  gallerySubtitle: {
    fr: 'Découvrez en images nos actions sur le terrain au Tchad et au Canada',
    en: 'Discover our field actions in Chad and Canada through images',
    ar: 'اكتشف أعمالنا الميدانية في تشاد وكندا من خلال الصور',
  },
  galleryAlbums: { fr: 'Albums photos des missions', en: 'Mission Photo Albums', ar: 'ألبومات صور المهام' },
  gallerySidebar: { fr: 'Albums principaux', en: 'Main Albums', ar: 'الألبومات الرئيسية' },
  gallerySupportBtn: { fr: 'Soutenir cette action', en: 'Support this action', ar: 'ادعم هذا العمل' },
  galleryPhotoCount: { fr: 'clichés', en: 'shots', ar: 'صور' },

  // ─── Contact ───
  contactTitle: { fr: 'Contactez-nous', en: 'Contact Us', ar: 'اتصل بنا' },
  contactSubtitle: {
    fr: "Posez vos questions ou postulez pour rejoindre l'équipe",
    en: 'Ask your questions or apply to join the team',
    ar: 'اطرح أسئلتك أو تقدم للانضمام إلى الفريق',
  },

  // ─── Admin ───
  dashboard: { fr: 'Tableau de bord', en: 'Dashboard', ar: 'لوحة التحكم' },
  messages: { fr: 'Messages', en: 'Messages', ar: 'الرسائل' },
  team: { fr: 'Équipe', en: 'Team', ar: 'الفريق' },
  donations: { fr: 'Dons & Collectes', en: 'Donations', ar: 'التبرعات' },
  stocks: { fr: 'Stocks & Logistique', en: 'Inventory', ar: 'المخزون واللوجستيات' },
  logout: { fr: 'Déconnexion', en: 'Logout', ar: 'تسجيل الخروج' },

  // ─── Footer ───
  footerSlogan: {
    fr: "L'Alliance étudiante binationale (Canada - Tchad) au service de l'action humanitaire, éducative et technologique.",
    en: 'Binational student alliance (Canada - Chad) serving humanitarian, educational, and technological action.',
    ar: 'التحالف الطلابي بين كندا وتشاد في خدمة العمل الإنساني والتعليمي والتكنولوجي.',
  },
  usefulLinks: { fr: 'Liens utiles', en: 'Useful Links', ar: 'روابط مفيدة' },
  ourActionsFooter: { fr: 'Nos actions', en: 'Our Actions', ar: 'مبادراتنا' },
  contactUs: { fr: 'Contactez-nous', en: 'Contact Us', ar: 'اتصل بنا' },
  newsletter: { fr: 'Newsletter', en: 'Newsletter', ar: 'النشرة الإخبارية' },
  newsletterDesc: {
    fr: 'Abonnez-vous à notre newsletter pour recevoir nos dernières actualités et impacts.',
    en: 'Subscribe to our newsletter to receive our latest news and impacts.',
    ar: 'اشترك في نشرتنا الإخبارية لتلقي أحدث أخبارنا ونتائج أعمالنا.',
  },
  newsletterSuccess: {
    fr: 'Inscrit avec succès ! Merci pour votre confiance.',
    en: 'Subscribed successfully! Thank you for your trust.',
    ar: 'تم الاشتراك بنجاح! شكراً لثقتكم.',
  },
  emailFooterPlaceholder: { fr: 'Votre email', en: 'Your email', ar: 'بريدك الإلكتروني' },
  rightsReserved: { fr: 'Tous droits réservés.', en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' },
  legalNotice: { fr: 'Mentions légales', en: 'Legal Notice', ar: 'إشعار قانوني' },
  privacyPolicy: { fr: 'Politique de confidentialité', en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  termsOfUse: { fr: "Conditions d'utilisation", en: 'Terms of Use', ar: 'شروط الاستخدام' },

  actionFoodAid: { fr: 'Aide alimentaire', en: 'Food Aid', ar: 'المساعدات الغذائية' },
  actionHealth: { fr: 'Santé', en: 'Health', ar: 'الصحة' },
  actionWater: { fr: 'Eau & Assainissement', en: 'Water & Sanitation', ar: 'المياه والإصحاح' },
  actionEducation: { fr: 'Éducation', en: 'Education', ar: 'التعليم' },
  actionClothing: { fr: 'Vêtements', en: 'Clothing', ar: 'الملابس' },
  actionCommunityDev: { fr: 'Développement communautaire', en: 'Community Development', ar: 'التنمية المجتمعية' },

  // ─── About Page ───
  aboutPageTag: { fr: 'Notre engagement', en: 'Our Commitment', ar: 'التزامنا' },
  aboutPageTitle: { fr: 'À propos de RoBomed', en: 'About RoBomed', ar: 'عن روبوميد' },
  aboutPageDesc: {
    fr: 'Fondée le 22 avril 2025, RoBomed est une organisation internationale à vocation humanitaire et éducative, 100% dirigée par des étudiants répartis entre le Canada (4 étudiants) et le Tchad (4 étudiants).',
    en: 'Founded on April 22, 2025, RoBomed is an international humanitarian and educational organization, 100% run by students split between Canada (4 students) and Chad (4 students).',
    ar: 'تأسست في 22 أبريل 2025، وتعتبر روبوميد منظمة إنسانية وتعليمية دولية يدريرها طلاب بنسبة 100% مقسمين بين كندا (4 طلاب) وتشاد (4 طلاب).',
  },
  aboutConvictionLabel: { fr: 'Notre conviction :', en: 'Our conviction:', ar: 'قناعتنا:' },
  aboutConvictionText: {
    fr: "L'énergie de la jeunesse unie par la solidarité pour apporter des solutions concrètes sur le terrain.",
    en: 'The energy of youth united by solidarity to bring concrete solutions on the ground.',
    ar: 'طاقة الشباب المتحد بالتضامن لتقديم حلول ملموسة على أرض الواقع.',
  },
  missionVisionTitle: { fr: 'Notre mission, notre vision, nos valeurs', en: 'Our mission, vision & values', ar: 'مهمتنا ورؤيتنا وقيمنا' },
  missionTitle: { fr: 'Notre mission', en: 'Our Mission', ar: 'مهمتنا' },
  missionDesc: {
    fr: 'Apporter une assistance humanitaire efficace et promouvoir le développement durable à travers des programmes qui répondent aux besoins essentiels des communautés les plus vulnérables.',
    en: 'Provide effective humanitarian assistance and promote sustainable development through programs addressing essential needs of vulnerable communities.',
    ar: 'تقديم مساعدة إنسانية فعالة وتعزيز التنمية المستدامة من خلال برامج تلبي الاحتياجات الأساسية للمجتمعات الأكثر ضعفاً.',
  },
  visionTitle: { fr: 'Notre vision', en: 'Our Vision', ar: 'رؤيتنا' },
  visionDesc: {
    fr: 'Un monde où chaque personne, en particulier les plus vulnérables, vit dans la dignité, en bonne santé et avec des opportunités pour construire un avenir meilleur.',
    en: 'A world where every person, especially the most vulnerable, lives with dignity, good health, and opportunities to build a better future.',
    ar: 'عالم يعيش فيه كل شخص، وخاصة الأكثر ضعفاً، بكرامة وصحة جيدة وفرص لبناء مستقبل أفضل.',
  },
  valuesTitle: { fr: 'Nos valeurs', en: 'Our Values', ar: 'قيمنا' },
  historyTitle: { fr: 'Notre parcours & histoire', en: 'Our journey & history', ar: 'مسيرتنا وتاريخنا' },
  teamTitle: { fr: 'Une équipe engagée à vos côtés', en: 'A committed team by your side', ar: 'فريق ملتزم بجانبكم' },
  teamSubtitle: {
    fr: "RoBomed, c'est une équipe passionnée d'étudiants et bénévoles qui travaillent chaque jour avec dévouement.",
    en: 'RoBomed is a passionate team of students and volunteers working each day with dedication.',
    ar: 'روبوميد هي فريق شغوف من الطلاب والمتطوعين الذين يعملون كل يوم بتفانٍ.',
  },
  joinTeamBtn: { fr: "Rejoindre l'équipe", en: 'Join the Team', ar: 'انضم إلى الفريق' },

  // ─── Actions Page ───
  actionsPageTitle: { fr: 'Nos Actions sur le Terrain', en: 'Our Field Actions', ar: 'أعمالنا الميدانية' },
  actionsPageSubtitle: {
    fr: "Découvrez nos initiatives concrètes au Canada et au Tchad pour améliorer la vie des communautés.",
    en: 'Discover our concrete initiatives in Canada and Chad to improve community lives.',
    ar: 'اكتشف مبادراتنا الملموسة في كندا وتشاد لتحسين حياة المجتمعات.',
  },

  // ─── Projects Page ───
  projectsPageTitle: { fr: 'Nos Projets Humanitaires', en: 'Our Humanitarian Projects', ar: 'مشاريعنا الإنسانية' },
  projectsPageSubtitle: {
    fr: 'Projets d\'eau potable, kits scolaires, soins palliatifs et soutien oncologique.',
    en: 'Drinking water projects, school kits, palliative care and oncology support.',
    ar: 'مشاريع مياه الشرب والحقائب المدرسية والرعاية التلطيفية ودعم أورام الأطفال.',
  },

  // ─── News Page ───
  newsPageTitle: { fr: 'Actualités & Impact', en: 'News & Impact', ar: 'الأخبار والتأثير' },
  newsPageSubtitle: {
    fr: 'Suivez les dernières nouvelles de nos missions au Tchad et au Canada.',
    en: 'Follow the latest news of our missions in Chad and Canada.',
    ar: 'تابع أحدث أخبار مهامنا في تشاد وكندا.',
  },

  // ─── Contact Page ───
  contactPageTitle: { fr: 'Contactez RoBomed', en: 'Contact RoBomed', ar: 'اتصل بروبوميد' },
  contactPageSubtitle: {
    fr: 'Une question, un partenariat ou envie de rejoindre notre réseau ? Écrivez-nous !',
    en: 'A question, partnership or want to join our network? Write to us!',
    ar: 'سؤال، شراكة، أو رغبة في الانضمام إلى شبكتنا؟ اكتب لنا!',
  },
  contactFormTitle: { fr: 'Envoyez-nous un message', en: 'Send us a message', ar: 'أرسل لنا رسالة' },
  contactFormSub: {
    fr: 'Remplissez ce formulaire et notre équipe prendra directement contact avec vous.',
    en: 'Fill out this form and our team will get back to you directly.',
    ar: 'املأ هذا النموذج وسيتواصل معك فريقنا مباشرة.',
  },
  contactObjectLabel: {
    fr: 'QUEL EST L\'OBJET DE VOTRE DEMANDE ?',
    en: 'WHAT IS THE PURPOSE OF YOUR REQUEST?',
    ar: 'ما هو غرض طلبك؟',
  },
  contactCatAmbassador: { fr: 'Ambassadeur', en: 'Ambassador', ar: 'سفير' },
  contactCatPartnership: { fr: 'Partenariat', en: 'Partnership', ar: 'شراكة' },
  contactCatDonate: { fr: 'Faire un don', en: 'Make a donation', ar: 'تبرع' },
  contactCatOther: { fr: 'Autre question', en: 'Other question', ar: 'سؤال آخر' },
  contactFullName: { fr: 'Nom complet *', en: 'Full name *', ar: 'الاسم الكامل *' },
  contactFullNamePlaceholder: { fr: 'Votre nom et prénom', en: 'Your full name', ar: 'اسمك الكامل' },
  contactSubjectPlaceholder: {
    fr: 'Ex: Candidature ambassadeur, Proposition de projet...',
    en: 'Ex: Ambassador application, Project proposal...',
    ar: 'مثال: طلب سفير، اقتراح مشروع...',
  },
  contactMessagePlaceholder: {
    fr: 'Expliquez-nous votre demande en détail...',
    en: 'Tell us about your request in detail...',
    ar: 'اشرح لنا طلبك بالتفصيل...',
  },
  contactSending: { fr: 'Envoi en cours...', en: 'Sending...', ar: 'جاري الإرسال...' },
  contactOpportunityTag: { fr: 'OPPORTUNITÉ ÉTUDIANTS', en: 'STUDENT OPPORTUNITY', ar: 'فرصة للطلاب' },
  contactOpportunityTitle: {
    fr: 'Rejoins le réseau Ambassadeurs',
    en: 'Join the Ambassador Network',
    ar: 'انضم إلى شبكة السفراء',
  },
  contactOpportunityDesc: {
    fr: "Vous étudiez dans un établissement partenaire ou souhaitez présenter RoBomed dans votre école ? Intégrez notre équipe et bénéficiez d'une expérience valorisante et d'un certificat d'engagement.",
    en: 'Studying in a partner institution or want to present RoBomed in your school? Join our team and benefit from a rewarding experience and a certificate of engagement.',
    ar: 'هل تدرس في مؤسسة شريكة أو ترغب في تقديم روبوميد في مدرستك؟ انضم إلى فريقنا واستفد من تجربة قيمة وشهادة التزام.',
  },
  contactVolethumanitarian: {
    fr: 'Volet Humanitaire (Bénévolat)',
    en: 'Humanitarian Stream (Volunteering)',
    ar: 'الجانب الإنساني (التطوع)',
  },
  contactVoleteducational: {
    fr: 'Volet Éducatif (Rédaction & Design)',
    en: 'Educational Stream (Writing & Design)',
    ar: 'الجانب التعليمي (الكتابة والتصميم)',
  },
  contactApplyAmbassadorBtn: {
    fr: "Postuler en tant qu'Ambassadeur",
    en: 'Apply as an Ambassador',
    ar: 'التقدم كـ سفير',
  },
  contactWhyUsTitle: { fr: 'Pourquoi nous contacter ?', en: 'Why contact us?', ar: 'لماذا تتصل بنا؟' },
  contactWhyDonationTitle: { fr: 'Donation & Parrainage', en: 'Donation & Sponsorship', ar: 'التبرع والرعاية' },
  contactWhyDonationDesc: {
    fr: "Découvrez l'impact direct de vos dons sur les puits et fournitures au Tchad.",
    en: 'Discover the direct impact of your donations on wells and supplies in Chad.',
    ar: 'اكتشف الأثر المباشر لتبرعاتك على الآبار والمستلزمات في تشاد.',
  },
  contactWhyPartnershipTitle: {
    fr: 'Partenariats Écoles & Entreprises',
    en: 'School & Business Partnerships',
    ar: 'شراكات المدارس والشركات',
  },
  contactWhyPartnershipDesc: {
    fr: 'Organisons ensemble des kermesses solidaires ou des présentations scolaires.',
    en: "Let's organize solidarity fairs or school presentations together.",
    ar: 'لننظم معاً فعاليات تضامنية أو عروضاً تقديمية مدرسية.',
  },
  faqSectionTag: { fr: 'DES RÉPONSES À VOS QUESTIONS', en: 'ANSWERS TO YOUR QUESTIONS', ar: 'إجابات على أسئلتك' },
  faqSectionTitle: {
    fr: 'Questions Fréquentes (FAQ)',
    en: 'Frequently Asked Questions (FAQ)',
    ar: 'الأسئلة الشائعة',
  },
  faqQ1: {
    fr: 'Comment devenir ambassadeur RoBomed dans mon école ?',
    en: 'How do I become a RoBomed ambassador at my school?',
    ar: 'كيف أصبح سفيراً لـ روبوميد في مدرستي؟',
  },
  faqA1: {
    fr: "Il vous suffit de remplir le formulaire ci-dessus en sélectionnant la catégorie 'Devenir Ambassadeur'. Notre équipe prendra contact avec votre établissement pour présenter nos actions et valider votre inscription.",
    en: "Simply fill out the form above by selecting the 'Become an Ambassador' category. Our team will contact your institution to present our actions and validate your registration.",
    ar: "ما عليك سوى ملء النموذج أعلاه واختيار فئة 'كن سفيراً'. سيتصل فريقنا بمؤسستك لتقديم أعمالنا وتأكيد تسجيلك.",
  },
  faqQ2: {
    fr: "Quels sont les volets d'engagement pour les élèves ?",
    en: 'What are the engagement streams for students?',
    ar: 'ما هي مجالات المشاركة للطلاب؟',
  },
  faqA2: {
    fr: "Les élèves peuvent s'engager soit dans le volet Humanitaire (bénévolat, collecte, distribution d'aide), soit dans le volet Éducatif & Créatif (rédaction de petits articles, création de visuels et design).",
    en: 'Students can get involved either in the Humanitarian stream (volunteering, fundraising, aid distribution) or in the Educational & Creative stream (writing short articles, graphic design).',
    ar: 'يمكن للطلاب المشاركة إما في الجانب الإنساني (التطوع، جمع التبرعات، توزيع المساعدات) أو في الجانب التعليمي والإبداعي (كتابة المقالات والتصميم).',
  },
  faqQ3: {
    fr: 'Recevons-nous un certificat de bénévolat ?',
    en: 'Do we receive a volunteer certificate?',
    ar: 'هل نحصل على شهادة تطوع؟',
  },
  faqA3: {
    fr: 'Oui ! Chaque ambassadeur et bénévole actif reçoit une attestation officielle et un certificat de leadership signé par la présidence, valorisant son expérience et ses compétences.',
    en: 'Yes! Every active ambassador and volunteer receives an official certificate and a leadership certificate signed by the presidency, highlighting their experience and skills.',
    ar: 'نعم! يحصل كل سفير ومتطوع نشط على شهادة رسمية وشهادة قيادية موقعة من الرئاسة تبرز خبرته ومهاراته.',
  },
  faqQ4: {
    fr: 'Comment sont réparties les équipes du Canada et du Tchad ?',
    en: 'How are the Canada and Chad teams divided?',
    ar: 'كيف يتم توزيع فريقي كندا وتشاد؟',
  },
  faqA4: {
    fr: 'RoBomed est 100% gérée par des étudiants : 4 membres dédiés au Canada pour la coordination internationale et 4 membres au Tchad pour les opérations directes sur le terrain.',
    en: 'RoBomed is 100% student-managed: 4 members dedicated in Canada for international coordination and 4 members in Chad for direct field operations.',
    ar: 'تدار روبوميد بنسبة 100% من قبل الطلاب: 4 أعضاء مخصصون في كندا للتنسيق الدولي و4 أعضاء في تشاد للعمليات الميدانية المباشرة.',
  },
  branchCanadaSub: {
    fr: 'Coordination internationale & Réseau des écoles',
    en: 'International coordination & School network',
    ar: 'التنسيق الدولي وشبكة المدارس',
  },
  branchChadSub: {
    fr: 'Coordination des projets terrain & distributions',
    en: 'Field project coordination & distributions',
    ar: 'تنسيق المشاريع الميدانية والتوزيع',
  },
  contactGeneralSub: {
    fr: 'Réponse garantie sous 24h à 48h',
    en: 'Guaranteed response within 24h to 48h',
    ar: 'رد مضمون خلال 24 إلى 48 ساعة',
  },
  contactStudentTeam: { fr: '100% Équipe Étudiante', en: '100% Student Team', ar: '100% فريق طلابي' },
  contactStudentsCount: { fr: '4 Étudiants', en: '4 Students', ar: '4 طلاب' },
  contactSubject: { fr: 'Sujet', en: 'Subject', ar: 'الموضوع' },
  contactMessage: { fr: 'Message', en: 'Message', ar: 'الرسالة' },
  contactSendBtn: { fr: 'Envoyer le message', en: 'Send Message', ar: 'إرسال الرسالة' },
  contactSuccessMsg: {
    fr: 'Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.',
    en: 'Your message has been sent successfully! We will get back to you shortly.',
    ar: 'تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.',
  },

  // ─── News Extra ───
  allArticlesFilter: { fr: 'Tous les articles', en: 'All articles', ar: 'جميع المقالات' },
  newsFilter: { fr: 'Actualités', en: 'News', ar: 'الأخبار' },
  pressFilter: { fr: 'Communiqués', en: 'Press releases', ar: 'بيانات صحفية' },
  eventsFilter: { fr: 'Événements', en: 'Events', ar: 'الفعاليات' },
  testimonialsFilter: { fr: 'Témoignages', en: 'Testimonials', ar: 'شهادات' },
  reportsFilter: { fr: 'Rapports', en: 'Reports', ar: 'التقارير' },
  searchArticlePlaceholder: { fr: 'Rechercher un article...', en: 'Search an article...', ar: 'ابحث عن مقال...' },
  filterBtn: { fr: 'Filtres', en: 'Filters', ar: 'تصفية' },
  readMoreBtn: { fr: 'Lire la suite', en: 'Read more', ar: 'اقرأ المزيد' },
  viewsLabel: { fr: 'vues', en: 'views', ar: 'مشاهدات' },
  commentsLabel: { fr: 'commentaires', en: 'comments', ar: 'تعليقات' },
  categoriesTitle: { fr: 'Catégories', en: 'Categories', ar: 'الفئات' },
  popularArticlesTitle: { fr: 'Articles populaires', en: 'Popular Articles', ar: 'المقالات الشائعة' },
  viewAllArticlesBtn: { fr: 'Voir tous les articles →', en: 'View all articles →', ar: 'عرض جميع المقالات ←' },
  dontMissNewsTitle: { fr: 'Ne manquez rien de nos actualités !', en: "Don't miss any of our news!", ar: 'لا تفوت أي من أخبارنا!' },
  dontMissNewsSub: {
    fr: 'Abonnez-vous pour recevoir nos dernières nouvelles et rester informé de nos actions sur le terrain.',
    en: 'Subscribe to receive our latest news and stay informed about our field actions.',
    ar: 'اشترك لتلقي أحدث أخبارنا والبقاء على اطلاع بأعمالنا الميدانية.',
  },

  // ─── Projects Extra ───
  allProjectsFilter: { fr: 'Tous les projets', en: 'All projects', ar: 'جميع المشاريع' },
  inProgressFilter: { fr: 'En cours', en: 'In progress', ar: 'قيد التنفيذ' },
  completedFilter: { fr: 'Terminés', en: 'Completed', ar: 'مكتملة' },
  upcomingFilter: { fr: 'À venir', en: 'Upcoming', ar: 'قادمة' },
  healthCategory: { fr: 'Santé', en: 'Health', ar: 'الصحة' },
  waterCategory: { fr: 'Eau & Assainissement', en: 'Water & Sanitation', ar: 'الماء والإصحاح' },
  educationCategory: { fr: 'Éducation', en: 'Education', ar: 'التعليم' },
  foodCategory: { fr: 'Aide alimentaire', en: 'Food Aid', ar: 'المساعدات الغذائية' },
  moreFilters: { fr: 'Plus', en: 'More', ar: 'المزيد' },
  searchProjectPlaceholder: { fr: 'Rechercher un projet...', en: 'Search a project...', ar: 'ابحث عن مشروع...' },
  sortByRecent: { fr: 'Trier par : Plus récents', en: 'Sort by: Most recent', ar: 'الفرز حسب: الأحدث' },
  beneficiariesLabel: { fr: 'Bénéficiaires', en: 'Beneficiaries', ar: 'مستفيد' },
  volunteersLabel: { fr: 'Bénévoles', en: 'Volunteers', ar: 'متطوع' },
  viewDetailsBtn: { fr: 'Voir les détails →', en: 'View details →', ar: 'عرض التفاصيل ←' },
  noProjectFound: { fr: 'Aucun projet trouvé', en: 'No project found', ar: 'لم يتم العثور على أي مشروع' },
  ourGlobalImpactTitle: { fr: 'Notre impact global', en: 'Our Global Impact', ar: 'تأثيرنا العالمي' },
  completedProjectsCount: { fr: 'Projets réalisés', en: 'Completed Projects', ar: 'المشاريع المنجزة' },
  impactedLocations: { fr: 'Localités impactées', en: 'Impacted locations', ar: 'المناطق المتأثرة' },
  activeVolunteers: { fr: 'Bénévoles actifs', en: 'Active volunteers', ar: 'متطوعون نشطون' },
  interventionZonesTitle: { fr: 'Zones d\'intervention', en: 'Intervention Zones', ar: 'مناطق التدخل' },
  seeOnMapBtn: { fr: 'Voir sur la carte', en: 'See on map', ar: 'عرض على الخريطة' },
  mapOfChad: { fr: 'Carte du Tchad & Canada', en: 'Map of Chad & Canada', ar: 'خريطة تشاد وكندا' },
  contributeToProjectsTitle: { fr: 'Vous aussi, contribuez à nos projets', en: 'You too, contribute to our projects', ar: 'أنت أيضاً، ساهم في مشاريعنا' },
  contributeToProjectsSub: {
    fr: 'Chaque geste compte pour transformer des vies et construire un avenir meilleur.',
    en: 'Every action counts to transform lives and build a better future.',
    ar: 'كل لفتة كفيلة بتغيير الحياة وبناء مستقبل أفضل.',
  },
  donateNowBtn: { fr: 'Faire un don maintenant', en: 'Donate now', ar: 'تبرع الآن' },
  becomeVolunteerBtn: { fr: 'Devenir bénévole', en: 'Become a volunteer', ar: 'كن متطوعاً' },

  // ─── Actions Extra ───
  actionsSubtitle: {
    fr: 'Apporter une aide immédiate et construire des solutions durables aux populations vulnérables.',
    en: 'Provide immediate aid and build sustainable solutions for vulnerable populations.',
    ar: 'تقديم المساعدات الفورية وبناء حلول مستدامة للفئات الأكثر ضعفاً.',
  },
  ourFieldsTitle: { fr: 'Nos domaines d\'intervention', en: 'Our Fields of Action', ar: 'مجالات تدخلنا' },
  ourFieldsSub: {
    fr: 'Chaque action que nous menons répond à un besoin réel et contribue à améliorer durablement les conditions de vie.',
    en: 'Every action we take meets a real need and helps sustainably improve living conditions.',
    ar: 'كل عمل نقوم به يلبي حاجة حقيقية ويساعد في تحسين ظروف المعيشة بشكل مستدام.',
  },
  ourImpactTogetherTitle: { fr: 'Notre impact, ensemble', en: 'Our impact, together', ar: 'تأثيرنا معاً' },
  ourImpactTogetherSub: {
    fr: 'Grâce à la solidarité de nos donateurs, bénévoles et partenaires, nous transformons des vies chaque jour.',
    en: 'Thanks to the solidarity of our donors, volunteers, and partners, we transform lives every day.',
    ar: 'بفضل تضامن متبرعينا ومتطوعينا وشركائنا، نغير الحياة يومياً.',
  },
  viewOurProjectsBtn: { fr: 'Voir nos projets →', en: 'View our projects →', ar: 'عرض مشاريعنا ←' },
  actWithUsTitle: { fr: 'Vous aussi, agissez avec nous !', en: 'You too, take action with us!', ar: 'أنت أيضاً، تحرك معنا!' },
  actWithUsSub: {
    fr: 'Chaque geste compte. Rejoignez notre mission et faites la différence.',
    en: 'Every action counts. Join our mission and make a difference.',
    ar: 'كل لفتة تهم. انضم إلى مهمتنا واصنع الفارق.',
  },

  // ─── Galerie Extra ───
  photosFilter: { fr: 'Photos', en: 'Photos', ar: 'صور' },
  videosFilter: { fr: 'Vidéos', en: 'Videos', ar: 'فيديوهات' },
  albumsFilter: { fr: 'Albums', en: 'Albums', ar: 'ألبومات' },
  searchGalleryPlaceholder: { fr: 'Rechercher dans la galerie...', en: 'Search in gallery...', ar: 'ابحث في المعرض...' },
  missionAlbumsTitle: { fr: 'Albums photos des missions', en: 'Mission photo albums', ar: 'ألبومات صور المهام' },
  mainAlbumsTitle: { fr: 'Albums principaux', en: 'Main albums', ar: 'الألبومات الرئيسية' },
  photosCountSuffix: { fr: 'photos', en: 'photos', ar: 'صور' },
  supportActionBtn: { fr: 'Soutenir cette action', en: 'Support this action', ar: 'دعم هذا العمل' },

  // ─── Donation Page ───
  donateHeroBadge: {
    fr: '100% Transparence & Impact Direct sur le Terrain',
    en: '100% Transparency & Direct Field Impact',
    ar: '١٠٠٪ شفافية وتأثير مباشر على أرض الواقع',
  },
  donateHeroTitle1: { fr: 'Faire un don', en: 'Make a', ar: 'قدّم تبرعاً' },
  donateHeroTitleAccent: { fr: 'solidaire', en: 'donation', ar: 'للتضامن' },
  donateHeroDesc: {
    fr: "Chaque contribution finance directement nos programmes d'accès à l'eau, d'éducation et de santé d'urgence au Tchad et au Canada.",
    en: 'Every contribution directly funds our water access, education and emergency health programs in Chad and Canada.',
    ar: 'كل مساهمة تموّل مباشرةً برامجنا في مجال الوصول إلى المياه والتعليم والرعاية الصحية الطارئة في تشاد وكندا.',
  },
  donateStat1Value: { fr: '85%', en: '85%', ar: '٨٥٪' },
  donateStat1Label: {
    fr: 'Affecté directement aux actions terrain',
    en: 'Directly allocated to field actions',
    ar: 'مخصص مباشرة للعمليات الميدانية',
  },
  donateStat2Value: { fr: '100%', en: '100%', ar: '١٠٠٪' },
  donateStat2Label: {
    fr: 'Reçu fiscal officiel disponible',
    en: 'Official tax receipt available',
    ar: 'إيصال ضريبي رسمي متاح',
  },
  donateStat3Label: {
    fr: 'Réseau binationaux engagés',
    en: 'Engaged binational network',
    ar: 'شبكة ثنائية الجنسية ملتزمة',
  },
  donateImpactBadge: {
    fr: "Impact concret de votre don",
    en: "Concrete impact of your donation",
    ar: "الأثر الملموس لتبرعك",
  },
  donateImpactProjectLabel: {
    fr: 'Projet sélectionné :',
    en: 'Selected project:',
    ar: 'المشروع المختار:',
  },
  donateTaxTitle: {
    fr: "Réduction d'impôt immédiate !",
    en: "Immediate tax deduction!",
    ar: "خصم ضريبي فوري!",
  },
  donateTaxDesc1: {
    fr: "Après déduction fiscale (66%), votre don de",
    en: "After tax deduction (66%), your donation of",
    ar: "بعد الخصم الضريبي (٦٦٪)، تبرعك بمبلغ",
  },
  donateTaxDesc2: {
    fr: "ne vous coûte en réalité que",
    en: "actually only costs you",
    ar: "لا يكلفك في الواقع سوى",
  },
  donateGuaranteesTitle: {
    fr: 'Vos garanties en toute confiance',
    en: 'Your guarantees with full trust',
    ar: 'ضماناتك بكل ثقة',
  },
  donateGuarantee1Title: { fr: 'Cryptage SSL 256 bits', en: 'SSL 256-bit Encryption', ar: 'تشفير SSL 256 بت' },
  donateGuarantee1Desc: { fr: 'Paiements 100% sécurisés', en: '100% Secure Payments', ar: 'مدفوعات آمنة ١٠٠٪' },
  donateGuarantee2Title: { fr: 'Reçu Fiscal Envoyé', en: 'Tax Receipt Sent', ar: 'إيصال ضريبي مرسل' },
  donateGuarantee2Desc: { fr: 'Par email immédiatement', en: 'By email immediately', ar: 'بالبريد الإلكتروني فوراً' },
  donateGuarantee3Title: { fr: "Suivi d'impact", en: 'Impact Tracking', ar: 'تتبع الأثر' },
  donateGuarantee3Desc: { fr: 'Rapports de projets réguliers', en: 'Regular project reports', ar: 'تقارير مشاريع منتظمة' },
  donateGuarantee4Title: { fr: '100% Dédié', en: '100% Dedicated', ar: '١٠٠٪ مخصص' },
  donateGuarantee4Desc: { fr: 'Aux missions bénévole-santé', en: 'To volunteer health missions', ar: 'لمهام الصحة التطوعية' },
  donateTestimonialQuote: {
    fr: "« Grâce au soutien des donateurs de RoBomed, notre école a enfin accès à l'eau potable au quotidien. Cela change totalement la vie de nos enfants ! »",
    en: '"Thanks to RoBomed donors, our school finally has daily access to clean water. It completely changes the lives of our children!"',
    ar: '«بفضل دعم متبرعي روبوميد، أصبح لمدرستنا أخيراً وصول يومي إلى الماء الصالح للشرب. هذا يغيّر حياة أطفالنا تماماً!»',
  },
  donateTestimonialAuthor: {
    fr: '— Mahamat A., Directeur d\'école au Tchad',
    en: "— Mahamat A., School Principal in Chad",
    ar: '— محمد أ.، مدير مدرسة في تشاد',
  },
  donateFormTitle2: {
    fr: 'Formulaire de Contribution',
    en: 'Contribution Form',
    ar: 'نموذج المساهمة',
  },
  donateFormSubtitle2: {
    fr: 'Sélectionnez votre montant, devise et mode de règlement',
    en: 'Select your amount, currency and payment method',
    ar: 'اختر المبلغ والعملة وطريقة الدفع',
  },
  donateCurrencyStep: {
    fr: '1. Devise de contribution',
    en: '1. Contribution currency',
    ar: '١. عملة المساهمة',
  },
  donateProjectStep: {
    fr: '2. Affectation du don',
    en: '2. Donation allocation',
    ar: '٢. توجيه التبرع',
  },
  donateAmountStep: {
    fr: '3. Choisissez un montant',
    en: '3. Choose an amount',
    ar: '٣. اختر المبلغ',
  },
  donatePaymentStep: {
    fr: '4. Mode de règlement',
    en: '4. Payment method',
    ar: '٤. طريقة الدفع',
  },
  donateCustomPlaceholder2: {
    fr: 'Ou saisissez un montant personnalisé...',
    en: 'Or enter a custom amount...',
    ar: 'أو أدخل مبلغاً مخصصاً...',
  },
  donateMethodCard: { fr: 'Carte / Stripe / PayPal', en: 'Card / Stripe / PayPal', ar: 'بطاقة / ستريب / باي بال' },
  donateMethodCardDesc: { fr: 'Instantané', en: 'Instant', ar: 'فوري' },
  donateMethodMobile: { fr: 'Mobile Money 🇹🇩', en: 'Mobile Money 🇹🇩', ar: 'موبايل موني 🇹🇩' },
  donateMethodMobileDesc: { fr: 'Airtel / Moov', en: 'Airtel / Moov', ar: 'ايرتل / موف' },
  donateMethodBank: { fr: 'Virement RIB 🇨🇦 / 🇹🇩', en: 'Bank Transfer 🇨🇦 / 🇹🇩', ar: 'تحويل بنكي 🇨🇦 / 🇹🇩' },
  donateMethodBankDesc: { fr: 'Institutionnel', en: 'Institutional', ar: 'مؤسسي' },
  donateCardGuide: {
    fr: 'Redirection sécurisée vers votre moyen préféré :',
    en: 'Secure redirect to your preferred method:',
    ar: 'إعادة توجيه آمنة إلى وسيلتك المفضلة:',
  },
  donateMobileGuide: {
    fr: 'Instructions Mobile Money (Tchad) :',
    en: 'Mobile Money Instructions (Chad):',
    ar: 'تعليمات موبايل موني (تشاد):',
  },
  donateBankGuide: {
    fr: 'Coordonnées Bancaires Officielles :',
    en: 'Official Bank Details:',
    ar: 'التفاصيل المصرفية الرسمية:',
  },
  donateAllocatedTo: {
    fr: 'Affecté à :',
    en: 'Allocated to:',
    ar: 'مخصص لـ:',
  },
  donateSubmitBtn: {
    fr: 'Confirmer mon don de',
    en: 'Confirm my donation of',
    ar: 'تأكيد تبرعي بمبلغ',
  },
  donateSubmitProcessing: {
    fr: 'Enregistrement du don...',
    en: 'Processing donation...',
    ar: 'جاري تسجيل التبرع...',
  },
  donateSecureNote: {
    fr: 'Transaction 100% sécurisée — Vos données restent confidentielles',
    en: '100% Secure Transaction — Your data stays private',
    ar: 'معاملة آمنة ١٠٠٪ — تظل بياناتك سرية',
  },
  donateImpactKits: {
    fr: "Kit d'études & hygiène",
    en: "Study & hygiene kit",
    ar: "مجموعة دراسة وصحة",
  },
  donateImpactKitsDesc: {
    fr: "Offre des fournitures scolaires complètes et des manuels d'apprentissage à 2 élèves.",
    en: "Provides complete school supplies and learning materials to 2 students.",
    ar: "يوفر لوازم مدرسية كاملة ومواد تعليمية لطالبين.",
  },
  donateImpactFood: {
    fr: "Nourriture & Santé",
    en: "Food & Health",
    ar: "غذاء وصحة",
  },
  donateImpactFoodDesc: {
    fr: "Assure 1 semaine de repas chauds et des soins de santé de base pour une famille vulnérable.",
    en: "Ensures 1 week of hot meals and basic health care for a vulnerable family.",
    ar: "يضمن أسبوعاً من الوجبات الساخنة والرعاية الصحية الأساسية لعائلة محتاجة.",
  },
  donateImpactWater: {
    fr: "Eau potable & Filtration",
    en: "Clean water & Filtration",
    ar: "مياه شرب ومرشحات",
  },
  donateImpactWaterDesc: {
    fr: "Finance les filtres et la maintenance d'une station d'eau potable au Tchad.",
    en: "Funds the filters and maintenance of a clean water station in Chad.",
    ar: "يموّل المرشحات وصيانة محطة مياه صالحة للشرب في تشاد.",
  },
  donateImpactMedical: {
    fr: "Équipement Médical Pédiatrique",
    en: "Pediatric Medical Equipment",
    ar: "معدات طبية للأطفال",
  },
  donateImpactMedicalDesc: {
    fr: "Permet de distribuer des kits médicaux d'urgence et matériels de premiers soins.",
    en: "Enables distribution of emergency medical kits and first aid materials.",
    ar: "يتيح توزيع حقائب طبية طارئة ومواد إسعافات أولية.",
  },
  donateImpactMajor: {
    fr: "Impact Majeur & Infrastructure",
    en: "Major Impact & Infrastructure",
    ar: "أثر كبير وبنية تحتية",
  },
  donateImpactMajorDesc: {
    fr: "Contribue au forage d'un nouveau puits ou au parrainage annuel d'une classe complète.",
    en: "Contributes to drilling a new well or sponsoring a full class for a year.",
    ar: "يساهم في حفر بئر جديدة أو رعاية فصل دراسي كامل لمدة عام.",
  },

  // ─── Donation Projects ───
  donateProj1: {
    fr: "🚰 Puits d'eau potable & Filtration (Tchad 🇹🇩)",
    en: "🚰 Drinking Water Wells & Filtration (Chad 🇹🇩)",
    ar: "🚰 آبار مياه شرب وتصفية (تشاد 🇹🇩)",
  },
  donateProj2: {
    fr: "📚 Kits d'études & Cantines scolaires (Tchad 🇹🇩)",
    en: "📚 Study Kits & School Canteens (Chad 🇹🇩)",
    ar: "📚 حقائب دراسية ومطابخ مدرسية (تشاد 🇹🇩)",
  },
  donateProj3: {
    fr: "🌸 Fleurs crochet & Lettres de réconfort (Canada 🇨🇦)",
    en: "🌸 Crochet Flowers & Comfort Letters (Canada 🇨🇦)",
    ar: "🌸 زهور كروشيه ورسائل دعم (كندا 🇨🇦)",
  },
  donateProj4: {
    fr: "🍬 Soutien aux enfants atteints de cancer (Canada 🇨🇦)",
    en: "🍬 Support for children with cancer (Canada 🇨🇦)",
    ar: "🍬 دعم الأطفال المصابين بالسرطان (كندا 🇨🇦)",
  },

  // ─── Impact Switcher Section ───
  impactSwitcherTag: {
    fr: "Cartographie d'Impact Bi-National",
    en: "Bi-National Impact Mapping",
    ar: "خريطة التأثير ثنائي الجنسية",
  },
  impactSwitcherTitle: {
    fr: "Deux pays, une seule mission solidaire",
    en: "Two countries, one single solidarity mission",
    ar: "بلدان، مهمة تضامنية واحدة",
  },
  impactSwitcherDesc: {
    fr: "Découvrez nos initiatives spécifiques déployées simultanément au Canada et au Tchad.",
    en: "Discover our specific initiatives deployed simultaneously in Canada and Chad.",
    ar: "اكتشف مبادراتنا المحددة التي يتم تنفيذها بالتزامن في كندا وتشاد.",
  },
  impactTabChad: {
    fr: "🇹🇩 Tchad (N'Djamena)",
    en: "🇹🇩 Chad (N'Djamena)",
    ar: "🇹🇩 تشاد (نجامينا)",
  },
  impactTabCanada: {
    fr: "🇨🇦 Canada (Montréal)",
    en: "🇨🇦 Canada (Montreal)",
    ar: "🇨🇦 كندا (مونتريال)",
  },
  impactChadBranchBadge: {
    fr: "🇹🇩 Branche Tchad — N'Djamena & Régions",
    en: "🇹🇩 Chad Branch — N'Djamena & Regions",
    ar: "🇹🇩 فرع تشاد — نجامينا والمناطق",
  },
  impactChadTitle: {
    fr: "Eau Potable, Éducation & Kits Scolaires Solidaires",
    en: "Drinking Water, Education & Solidarity School Kits",
    ar: "مياه الشرب، التعليم والحقائب المدرسية التضامنية",
  },
  impactChadText: {
    fr: "Au Tchad, RoBomed concentre ses efforts sur l'accès à l'eau potable via la construction de puits durables et le soutien direct aux écoles partenaires. Les ventes de gâteaux et de livres réalisées par nos ambassadeurs financent l'achat de matériels scolaires.",
    en: "In Chad, RoBomed focuses its efforts on access to drinking water through the construction of sustainable wells and direct support to partner schools. Cake and book sales by our ambassadors fund the purchase of school materials.",
    ar: "في تشاد، تركز روبوميد جهودها على الوصول إلى مياه الشرب من خلال بناء آبار مستدامة والدعم المباشر للمدارس الشريكة. تموّل مبيعات الكعك والكتب التي يجريها سفراؤنا شراء المستلزمات المدرسية.",
  },
  impactChadStat1Label: {
    fr: "Bénéficiaires eau",
    en: "Water beneficiaries",
    ar: "المستفيدون من المياه",
  },
  impactChadStat2Label: {
    fr: "Construits & Suivis",
    en: "Built & Monitored",
    ar: "مبنية ومتابعة",
  },
  impactChadStat3Label: {
    fr: "Kits scolaires",
    en: "School kits",
    ar: "حقائب مدرسية",
  },
  impactCanadaBranchBadge: {
    fr: "🇨🇦 Branche Canada — Montréal & Québec",
    en: "🇨🇦 Canada Branch — Montreal & Quebec",
    ar: "🇨🇦 فرع كندا — مونتريال وكيبك",
  },
  impactCanadaTitle: {
    fr: "Soins Palliatifs & Oncologie Pédiatrique",
    en: "Palliative Care & Pediatric Oncology",
    ar: "الرعاية التلطيفية وأورام الأطفال",
  },
  impactCanadaText: {
    fr: "Au Canada, nous offrons un accompagnement chaleureux aux patients en soins palliatifs et aux enfants hospitalisés en oncologie pédiatrique. Nos bénévoles distribuent des fleurs faites en crochet, des friandises et des lettres de réconfort écrites par les élèves ambassadeurs.",
    en: "In Canada, we offer warm support to palliative care patients and children hospitalized in pediatric oncology. Our volunteers distribute handmade crochet flowers, treats, and comfort letters written by student ambassadors.",
    ar: "في كندا، نقدم دفقاً دافئاً من الدعم لمرضى الرعاية التلطيفية والأطفال المقيمين في أقسام أورام الأطفال. يوزع متطوعونا زهور الكروشيه المصنوعة يدوياً والحلوى ورسائل المواساة التي كتبها السفراء الطلاب.",
  },
  impactCanadaStat1Label: {
    fr: "Élèves ambassadeurs",
    en: "Student ambassadors",
    ar: "سفراء طلاب",
  },
  impactCanadaStat2Label: {
    fr: "Fleurs & Lettres",
    en: "Flowers & Letters",
    ar: "زهور ورسائل",
  },
  impactCanadaStat3Label: {
    fr: "Hôpitaux visités",
    en: "Hospitals visited",
    ar: "مستشفيات تمت زيارتها",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('robomed_lang') as Language
    return saved || 'fr'
  })

  const dir = language === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    localStorage.setItem('robomed_lang', language)
    document.documentElement.lang = language
    document.documentElement.dir = dir
  }, [language, dir])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language]
    }
    return key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
