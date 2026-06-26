import { isEnabled } from '@/lib/feature-flags'

/**
 * Displays a "Beta" badge.
 * Controlled by the `betaBadge` feature flag — set FF_BETA_BADGE=false to hide it.
 */
export function BetaBadge({ className }: { className?: string }) {
  if (!isEnabled('betaBadge')) return null

  return (
    <span
      className={
        className ??
        'bg-primary/15 text-primary border-primary/30 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider'
      }
      aria-label="This product is in beta"
    >
      Beta
    </span>
  )
}
