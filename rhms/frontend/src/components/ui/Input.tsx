import type { InputHTMLAttributes, Ref } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  ref?: Ref<HTMLInputElement>
}

export default function Input({ label, error, className = '', id, ref, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
          error ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
