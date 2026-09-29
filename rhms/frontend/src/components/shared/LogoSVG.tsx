export default function LogoSVG({ className = 'h-10 w-auto' }: { className?: string }) {
  return (
    <img
      src="/logo.jpeg"
      alt="RoBomed Logo"
      className={`${className} object-contain transition-transform duration-200`}
      style={{ 
        minHeight: '44px', 
        maxHeight: '62px', 
        width: 'auto'
      }}
    />
  )
}
