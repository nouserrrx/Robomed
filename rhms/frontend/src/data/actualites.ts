export interface Actualite {
  id: number
  date: string
  titre: { fr: string; en: string; ar: string } | string
  resume: { fr: string; en: string; ar: string } | string
  contenu?: string
  image: string
  categorie: string
  vues: number
  commentaires: number
}

export const actualites: Actualite[] = []
export const articlesPopulaires: any[] = []
