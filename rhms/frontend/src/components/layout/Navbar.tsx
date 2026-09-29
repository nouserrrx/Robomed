import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart, Sun, Moon, ChevronDown, User, Sparkles } from 'lucide-react'
import Button from '../ui/Button'
import LogoSVG from '../shared/LogoSVG'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage, type Language } from '../../context/LanguageContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [langDropdown, setLangDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  // Close dropdowns on route change
  useEffect(() => {
    setMenuOpen(false)
    setLangDropdown(false)
  }, [location.pathname])

  // Add glass shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/', label: t('home') },
    { to: '/a-propos', label: t('about') },
    { to: '/nos-actions', label: t('actions') },
    { to: '/projets', label: t('projects') },
    { to: '/transparence', label: t('transparencyNav') },
    { to: '/actualites', label: t('news') },
    { to: '/galerie', label: t('gallery') },
    { to: '/contact', label: t('contact') },
  ]

  const languages: { id: Language; flag: string; label: string }[] = [
    { id: 'fr', flag: '🇫🇷', label: 'FR' },
    { id: 'en', flag: '🇬🇧', label: 'EN' },
    { id: 'ar', flag: '🇸🇦', label: 'AR' },
  ]

  const currentLang = languages.find(l => l.id === language) ?? languages[0]

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 glass-header border-b ${
        scrolled
          ? 'border-gray-200/80 dark:border-gray-800/80 shadow-lg shadow-black/5'
          : 'border-gray-100/60 dark:border-gray-800/40'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* ── Main bar ── */}
        <div className="flex items-center h-16 sm:h-20 gap-4">

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center group">
            <LogoSVG className="h-10 sm:h-12 w-auto group-hover:scale-105 transition-transform duration-200" />
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {links.map(link => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative whitespace-nowrap px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-secondary bg-secondary/10 dark:bg-secondary/20 font-bold'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/60'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-secondary rounded-full"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* ── Desktop action controls ── */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0 ml-auto">

            {/* Language pill dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdown(v => !v)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-100/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all border border-gray-200/60 dark:border-gray-700/60"
              >
                <span>{currentLang.flag}</span>
                <span>{currentLang.label}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              <AnimatePresence>
                {langDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-1.5 z-50"
                  >
                    {languages.map(l => (
                      <button
                        key={l.id}
                        onClick={() => { setLanguage(l.id); setLangDropdown(false) }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          language === l.id
                            ? 'bg-secondary text-white font-bold'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Basculer le thème"
              className="p-2.5 rounded-xl bg-gray-100/90 dark:bg-gray-800/90 text-gray-600 dark:text-amber-400 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all border border-gray-200/60 dark:border-gray-700/60"
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-gray-600" />}
            </button>

            {/* Donate Button */}
            <Link to="/faire-un-don">
              <Button
                variant="secondary"
                size="sm"
                className="text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:scale-105 transition-transform"
              >
                <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
                <span>{t('donate')}</span>
              </Button>
            </Link>

            {/* Login / Auth Button */}
            <Link to="/connexion">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-[#0B2447] text-white hover:bg-emerald-600 border border-[#0B2447] hover:border-emerald-600 shadow-md hover:shadow-emerald-500/20 transition-all duration-200 cursor-pointer shrink-0">
                <User className="w-3.5 h-3.5" />
                <span>{t('login')}</span>
              </button>
            </Link>

          </div>

          {/* ── Mobile row controls ── */}
          <div className="flex items-center gap-2 ml-auto lg:hidden">
            {/* Quick lang switch */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-0.5 border border-gray-200 dark:border-gray-700">
              {languages.map(l => (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                    language === l.id
                      ? 'bg-secondary text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-amber-400 border border-gray-200 dark:border-gray-700"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Burger toggle */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menu"
              className="p-2 rounded-xl text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800"
          >
            <div className="max-w-screen-xl mx-auto px-4 py-5 space-y-1.5">
              {links.map(link => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-secondary/10 text-secondary'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2.5">
                <Link to="/faire-un-don" onClick={() => setMenuOpen(false)}>
                  <Button variant="secondary" size="md" className="w-full flex items-center justify-center gap-2 font-extrabold shadow-md">
                    <Heart className="w-4 h-4 fill-current animate-pulse" />
                    <span>{t('donate')}</span>
                  </Button>
                </Link>
                <Link to="/connexion" onClick={() => setMenuOpen(false)}>
                  <button className="w-full py-3 rounded-2xl text-xs font-extrabold bg-[#0B2447] text-white hover:bg-secondary transition-all flex items-center justify-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{t('login')}</span>
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
