import { Skeleton } from '@/components/ui/skeleton'

export function ReportSkeleton() {
  return (
    <div className="space-y-8" aria-label="Loading report…" aria-busy>
      {/* Executive summary skeleton */}
      <div className="border-border bg-card rounded-xl border p-6">
        <Skeleton className="mb-4 h-6 w-48" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Skeleton className="mx-auto h-40 w-40 rounded-full sm:mx-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Score dashboard skeleton */}
      <div className="border-border bg-card rounded-xl border p-6">
        <Skeleton className="mb-4 h-6 w-36" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Section breakdown skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-44" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>

      {/* Recommendations skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-52" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function HistorySkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading history…" aria-busy>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border-border bg-card rounded-xl border p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <div className="flex shrink-0 gap-2">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
