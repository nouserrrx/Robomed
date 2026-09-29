import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, Home } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import Button from '../components/ui/Button'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-slate-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 flex justify-center"
        >
          {/* Glassmorphic glow background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-3xl rounded-full w-48 h-48 mx-auto -translate-y-6" />
          
          <div className="relative w-24 h-24 rounded-3xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-xl flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            {/* Pulsing small badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white font-bold items-center justify-center">404</span>
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {t('notFoundTitle')}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            {t('notFoundDesc')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link to="/">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto shadow-md hover:shadow-emerald-600/10 flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              {t('notFoundBtn')}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
