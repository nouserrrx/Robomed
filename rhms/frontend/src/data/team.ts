export interface TeamMember {
  id: number
  nom: string
  name?: string
  role: string | { fr: string; en: string; ar: string }
  branch: 'Canada' | 'Tchad' | '🇨🇦 Canada' | '🇹🇩 Tchad'
  photo: string | null
  email?: string
  tags?: string[]
  bio?: string | { fr: string; en: string; ar: string }
  missions?: string[] | { fr: string[]; en: string[]; ar: string[] }
  iconType?: 'globe' | 'book' | 'shield' | 'pie' | 'target' | 'settings'
  colorTheme?: 'green' | 'blue' | 'yellow'
  color?: string
}

export const TEAM_STORAGE_KEY = 'robomed_team'

export const defaultTeam: TeamMember[] = [
  {
    id: 1,
    nom: 'Aïcha Baradine',
    name: 'Aïcha Baradine',
    role: 'Présidente & Fondatrice',
    branch: '🇨🇦 Canada',
    photo: '/aicha.jpeg',
    email: 'aicha@robomed.org',
    tags: ['Leadership', 'Humanitaire'],
    color: 'bg-amber-50 border-amber-200',
    iconType: 'shield',
    colorTheme: 'yellow',
    bio: 'Piloter la vision globale et représenter RoBomed auprès des institutions (écoles, partenaires).',
    missions: [
      'Prendre les décisions stratégiques.',
      'Signer les certificats de leadership des ambassadeurs.',
      'Assurer la cohésion internationale Canada-Tchad.',
    ],
  },
  {
    id: 2,
    nom: 'Khatera Amiri',
    name: 'Khatera Amiri',
    role: 'Rédactrice & Communication',
    branch: '🇨🇦 Canada',
    photo: '/khatera.jpeg',
    email: 'khatera@robomed.org',
    tags: ['Rédaction', 'Communication'],
    color: 'bg-purple-50 border-purple-200',
    iconType: 'book',
    colorTheme: 'yellow',
    bio: 'Produire du contenu écrit et des documents stratégiques pour RoBomed.',
    missions: [
      'Rédaction des documents stratégiques et institutionnels.',
      'Coordination avec les équipes pour les reportages terrain.',
      'Amélioration continue de la communication écrite de l\'organisation.',
    ],
  },
  {
    id: 3,
    nom: 'Fatime Salim Ossou',
    name: 'Fatime Salim Ossou',
    role: 'Marketing et gestion des réseaux sociaux',
    branch: '🇨🇦 Canada',
    photo: '/fatime.jpeg',
    email: 'salimossoufatime@gmail.com',
    tags: ['Marketing', 'Gestion'],
    color: 'bg-emerald-50 border-emerald-200',
    iconType: 'pie',
    colorTheme: 'yellow',
    bio: 'Garantir la gestion saine et honnête des fonds et la gestion de la communication.',
    missions: [
      'Suivi rigoureux des entrées et sorties de fonds.',
      'Production des rapports de transparence.',
      'Gestion et animation des réseaux sociaux de l\'organisation.',
    ],
  },
  {
    id: 4,
    nom: 'Zamra Mohammed Thassim',
    name: 'Zamra Mohammed Thassim',
    role: 'Designer Graphique',
    branch: '🇨🇦 Canada',
    photo: null,
    email: 'zamra@robomed.org',
    tags: ['Design', 'Créativité'],
    color: 'bg-pink-50 border-pink-200',
    iconType: 'settings',
    colorTheme: 'green',
    bio: 'Créer une identité visuelle cohérente et attrayante pour RoBomed.',
    missions: [
      'Conception des visuels et illustrations pour les réseaux sociaux.',
      'Design des supports de communication (affiches, newsletter).',
      'Création des éléments visuels pour le site web et les campagnes.',
    ],
  },
  {
    id: 5,
    nom: 'Nouradine Zakaria Mahamat',
    name: 'Nouradine Zakaria Mahamat',
    role: 'Responsable Technique & Digital',
    branch: '🇹🇩 Tchad',
    photo: '/nour.jpeg',
    email: 'nouradinezakariamahamat18@gmail.com',
    tags: ['Tech', 'Digital'],
    color: 'bg-blue-50 border-blue-200',
    iconType: 'globe',
    colorTheme: 'blue',
    bio: 'Développer et maintenir les outils numériques de l\'organisation.',
    missions: [
      'Maintenance et Gestion du site web.',
      'Optimisation des formulaires de dons.',
      'Gestion des outils collaboratifs (GitHub, Notion) et les réseaux sociaux.',
    ],
  },
  {
    id: 6,
    nom: 'Oumarou Billy',
    name: 'Oumarou Billy',
    role: 'Responsable Support & Technique',
    branch: '🇹🇩 Tchad',
    photo: '/billy.jpeg',
    email: 'billy@robomed.org',
    tags: ['Logistique', 'Terrain'],
    color: 'bg-cyan-50 border-cyan-200',
    iconType: 'shield',
    colorTheme: 'green',
    bio: 'Assurer le support technique et la maintenance des outils et équipements.',
    missions: [
      'Support technique pour les utilisateurs et membres.',
      'Maintenance des serveurs et infrastructure numérique.',
      'Gestion des problèmes techniques et mise à jour des systèmes.',
    ],
  },
  {
    id: 7,
    nom: 'Ahmat Fawas',
    name: 'Ahmat Fawas',
    role: 'Coordinateur des événements',
    branch: '🇹🇩 Tchad',
    photo: null,
    email: 'ahmat@robomed.org',
    tags: ['Terrain', 'Coordination'],
    color: 'bg-indigo-50 border-indigo-200',
    iconType: 'target',
    colorTheme: 'green',
    bio: 'Piloter la vision globale et coordonner les événements terrain de RoBomed.',
    missions: [
      'Coordination des événements et actions terrain.',
      'Développement des partenariats locaux.',
      'Mobilisation des équipes sur le terrain.',
    ],
  },
  {
    id: 8,
    nom: 'Zenaba',
    name: 'Zenaba',
    role: 'Responsable de la Communication',
    branch: '🇨🇦 Canada',
    photo: null,
    email: 'zenaba@robomed.org',
    tags: ['Communication'],
    color: 'bg-purple-50 border-purple-200',
    iconType: 'book',
    colorTheme: 'yellow',
    bio: 'Piloter la stratégie de communication globale et la relation publique.',
    missions: [
      'Gestion de la communication externe.',
      'Coordination des campagnes d\'information.',
      'Relations presse et partenariats médias.',
    ],
  },
]

export function loadTeamMembers(): TeamMember[] {
  try {
    const saved = localStorage.getItem(TEAM_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((m: any) => ({
          ...m,
          nom: m.nom || m.name || 'Membre RoBomed',
          name: m.name || m.nom || 'Membre RoBomed',
        }))
      }
    }
  } catch (err) {
    console.warn('Erreur de chargement de l\'équipe depuis localStorage:', err)
  }
  return defaultTeam
}

export function saveTeamMembers(members: TeamMember[]) {
  try {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(members))
    window.dispatchEvent(new CustomEvent('robomed_team_updated', { detail: members }))
    window.dispatchEvent(new Event('storage'))
  } catch (err) {
    console.error('Erreur lors de la sauvegarde de l\'équipe:', err)
  }
}

export const team = defaultTeam
