import { motion } from 'framer-motion'

interface TimelineItem {
  date: string
  title: string
  description: string
}

interface TimelineProps {
  items: TimelineItem[]
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-8 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
              <div className={`bg-white p-6 rounded-xl shadow-lg ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                <span className="text-sm font-semibold text-secondary">{item.date}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-secondary border-4 border-white shadow z-10" />

            <div className="flex-1 hidden md:block" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
