import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200/80 dark:bg-gray-800/80'

  const variantClasses = {
    text: 'h-4 rounded-md my-1',
    rectangular: 'rounded-2xl',
    circular: 'rounded-full',
  }

  const customStyle: React.CSSProperties = {
    ...style,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={customStyle}
      aria-hidden="true"
      {...props}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
      <Skeleton variant="rectangular" className="w-full h-48 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-5/6 h-4" />
      </div>
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <Skeleton variant="text" className="w-24 h-4" />
        <Skeleton variant="rectangular" className="w-28 h-9 rounded-xl" />
      </div>
    </div>
  )
}
