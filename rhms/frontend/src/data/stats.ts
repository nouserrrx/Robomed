export interface Stat {
  id: number
  icon: string
  chiffre: number
  label: string
  suffixe: string
  sousTitre?: string
}

export const stats: Stat[] = [
  { id: 1, icon: 'Users', chiffre: 12540, label: 'Bénéficiaires aidés', suffixe: '+', sousTitre: 'depuis 2020' },
  { id: 2, icon: 'Heart', chiffre: 8320, label: 'Dons reçus', suffixe: '+', sousTitre: 'grâce à vous' },
  { id: 3, icon: 'GitMerge', chiffre: 56, label: 'Projets réalisés', suffixe: '+', sousTitre: 'avec succès' },
  { id: 4, icon: 'UserCheck', chiffre: 320, label: 'Bénévoles actifs', suffixe: '+', sousTitre: 'à nos côtés' },
]

export const aboutStats: Stat[] = [
  { id: 1, icon: 'Users', chiffre: 12540, label: 'Bénéficiaires aidés', suffixe: '+', sousTitre: 'depuis 2018' },
  { id: 2, icon: 'Heart', chiffre: 8320, label: 'Dons reçus', suffixe: '+', sousTitre: 'grâce à vous' },
  { id: 3, icon: 'Package', chiffre: 3680, label: 'Distributions réalisées', suffixe: '+', sousTitre: '' },
  { id: 4, icon: 'Droplets', chiffre: 27, label: "Points d'eau construits", suffixe: '', sousTitre: '' },
  { id: 5, icon: 'Shirt', chiffre: 18900, label: 'Vêtements distribués', suffixe: '+', sousTitre: '' },
  { id: 6, icon: 'GraduationCap', chiffre: 1250, label: 'Enfants soutenus (éducation)', suffixe: '+', sousTitre: '' },
  { id: 7, icon: 'UserCheck', chiffre: 320, label: 'Bénévoles actifs dans le réseau', suffixe: '+', sousTitre: '' },
]
