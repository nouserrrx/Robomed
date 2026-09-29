import { motion } from 'framer-motion'
import { partners } from '../../data/partners'

export default function PartnerCarousel() {
  const duplicated = [...partners, ...partners, ...partners]

  return (
    <div className="overflow-hidden py-8">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
        className="flex gap-8"
      >
        {duplicated.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex-shrink-0 w-40 h-20 bg-white rounded-xl shadow-md flex items-center justify-center p-4 hover:shadow-lg transition-shadow"
          >
            <img
              src={partner.logo}
              alt={partner.nom}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
