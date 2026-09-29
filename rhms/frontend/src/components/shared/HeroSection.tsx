import { motion } from 'framer-motion'
import Button from '../ui/Button'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

interface HeroSectionProps {
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  height?: 'full' | 'medium'
  bgColor?: string
}

export default function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  height = 'medium',
  bgColor = 'bg-primary',
}: HeroSectionProps) {
  return (
    <section
      className={`relative overflow-hidden ${bgColor} ${
        height === 'full' ? 'min-h-[80vh]' : 'min-h-[50vh]'
      } flex items-center`}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl">
              {subtitle}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            {ctaText && ctaLink && (
              <Link to={ctaLink}>
                <Button variant="secondary" size="lg">
                  {ctaText === 'Faire un don' && <Heart className="w-5 h-5" />}
                  {ctaText}
                </Button>
              </Link>
            )}
            {secondaryCtaText && secondaryCtaLink && (
              <Link to={secondaryCtaLink}>
                <Button variant="outline" size="lg" className="!border-white !text-white hover:!bg-white hover:!text-primary">
                  {secondaryCtaText}
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
