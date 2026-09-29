import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5)
    const newToast: ToastMessage = { id, type, title, message }
    setToasts(prev => [...prev.slice(-4), newToast]) // keep max 5

    setTimeout(() => {
      removeToast(id)
    }, 4500)
  }, [removeToast])

  const success = useCallback((title: string, message?: string) => showToast('success', title, message), [showToast])
  const error = useCallback((title: string, message?: string) => showToast('error', title, message), [showToast])
  const info = useCallback((title: string, message?: string) => showToast('info', title, message), [showToast])
  const warning = useCallback((title: string, message?: string) => showToast('warning', title, message), [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      
      {/* Floating Toast Portal */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map(t => {
            const config = {
              success: {
                bg: 'bg-[#0B2447] border-emerald-500/50 text-white',
                iconBg: 'bg-emerald-500/20 text-emerald-400',
                icon: CheckCircle2,
              },
              error: {
                bg: 'bg-[#0B2447] border-rose-500/50 text-white',
                iconBg: 'bg-rose-500/20 text-rose-400',
                icon: AlertCircle,
              },
              info: {
                bg: 'bg-[#0B2447] border-blue-500/50 text-white',
                iconBg: 'bg-blue-500/20 text-blue-400',
                icon: Info,
              },
              warning: {
                bg: 'bg-[#0B2447] border-amber-500/50 text-white',
                iconBg: 'bg-amber-500/20 text-amber-400',
                icon: AlertTriangle,
              },
            }[t.type]

            const Icon = config.icon

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3.5 ${config.bg}`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${config.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h4 className="font-extrabold text-xs sm:text-sm tracking-tight leading-snug">{t.title}</h4>
                  {t.message && <p className="text-white/70 text-[11px] mt-0.5 leading-relaxed">{t.message}</p>}
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-white/40 hover:text-white transition-colors p-1 rounded-lg shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
