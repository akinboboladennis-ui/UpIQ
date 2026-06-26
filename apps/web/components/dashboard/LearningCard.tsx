import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface LearningCardProps {
  title: string
  description: string
  category?: string
  readTime?: string
  href?: string
  className?: string
}

export function LearningCard({
  title,
  description,
  category,
  readTime,
  href = '#',
  className,
}: LearningCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'bg-card border-border hover:border-brand/40 group flex flex-col gap-2 rounded-xl border p-4 transition-all',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {category && (
          <Badge variant="secondary" className="text-[10px]">
            {category}
          </Badge>
        )}
        {readTime && <span className="text-text-tertiary text-[10px]">{readTime}</span>}
      </div>
      <h3 className="text-foreground group-hover:text-primary text-sm font-semibold leading-snug transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
      <div className="text-muted-foreground mt-auto flex items-center gap-1 text-xs font-medium">
        <span>Read article</span>
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}
