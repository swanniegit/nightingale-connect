'use client'

// CATEGORY: UI Utilities
// CONTEXT: Client
interface LogoProps {
  variant?: 'circle' | 'full'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Logo({ variant = 'circle', size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const logoSrc = variant === 'circle' 
    ? '/assets/nightingale-logo-small.jpg'
    : '/assets/nightingale-logo-hd.jpg'
  
  // Fallback to placeholder if images don't exist
  const fallbackSrc = '/assets/placeholder-logo.svg'

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img
        src={logoSrc}
        alt="Nightingale Connect Logo"
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to placeholder SVG if image fails to load
          const target = e.target as HTMLImageElement
          if (target.src !== fallbackSrc) {
            target.src = fallbackSrc
          }
        }}
      />
    </div>
  )
}
