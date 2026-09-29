export interface GalleryItem {
  id: number
  type: 'image' | 'video'
  url: string
  titre: string | { fr: string; en: string; ar: string }
  categorie: string | { fr: string; en: string; ar: string }
  count?: number
}

export const gallery: GalleryItem[] = []
export const albums: any[] = []
