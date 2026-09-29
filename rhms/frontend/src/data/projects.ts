export interface Project {
  id: number
  titre: { fr: string; en: string; ar: string }
  description: { fr: string; en: string; ar: string }
  image: string
  lieu: { fr: string; en: string; ar: string }
  budget: number
  collecte: number
  statut: 'en-cours' | 'termine' | 'a-venir'
  progres: number
  beneficiaires: number
  benevoles: number
  categorie: 'Aide alimentaire' | 'Eau & Assainissement' | 'Éducation' | 'Santé' | 'Vêtements' | 'Environnement'
}

export const projects: Project[] = []
