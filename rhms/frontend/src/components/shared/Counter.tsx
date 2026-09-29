import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface CounterProps {
  from?: number
  to: number
  duration?: number
  suffix?: string
}

export default function Counter({ from = 0, to, duration = 2, suffix = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [count, setCount] = useState(from)

  useEffect(() => {
    if (!isInView) return

    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(from + (to - from) * ease))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, from, to, duration])

  // Format with French locale spacing (space as thousands separator)
  const display = count >= 1000
    ? count.toLocaleString('fr-FR')
    : count.toString()

  return <span ref={ref}>{display}{suffix}</span>
}
