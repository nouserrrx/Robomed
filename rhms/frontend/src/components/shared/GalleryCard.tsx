import { motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import { useState } from 'react'
import type { GalleryItem } from '../../data/gallery'
import { useLanguage } from '../../context/LanguageContext'

interface GalleryCardProps {
  item: GalleryItem
  index: number
}

export default function GalleryCard({ item, index }: GalleryCardProps) {
  const [open, setOpen] = useState(false)
  const { language } = useLanguage()
  const langKey = (language || 'fr') as 'fr' | 'en' | 'ar'

  const titleStr = typeof item.titre === 'object' ? item.titre[langKey] || item.titre.fr : item.titre
  const catStr = typeof item.categorie === 'object' ? item.categorie[langKey] || item.categorie.fr : item.categorie

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg"
        onClick={() => setOpen(true)}
      >
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={item.url}
            alt={titleStr}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
          <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-sm font-medium">{titleStr}</p>
          <span className="text-white/70 text-xs">{catStr}</span>
        </div>
      </motion.div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl"
            aria-label="Fermer"
          >
            &times;
          </button>
          <img
            src={item.url}
            alt={titleStr}
            className="max-w-full max-h-[90vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
