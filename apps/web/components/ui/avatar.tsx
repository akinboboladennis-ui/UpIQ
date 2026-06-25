import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  name?: string | null
  src?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-7 w-7 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'User avatar'}
        className={cn('shrink-0 rounded-full object-cover', sizeMap[size], className)}
      />
    )
  }

  const initials = name ? getInitials(name) : '?'

  return (
    <div
      role="img"
      aria-label={name ?? 'User avatar'}
      className={cn(
        'bg-brand-subtle text-primary flex shrink-0 select-none items-center justify-center rounded-full font-semibold',
        sizeMap[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
