'use client'

import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { captureError } from '@/lib/monitoring'

interface Props {
  children: ReactNode
  /** Optional fallback UI. Defaults to a generic error card. */
  fallback?: ReactNode
  /** Label shown on the retry button. */
  retryLabel?: string
  /** Called when the user clicks "Try again". */
  onReset?: () => void
}

interface State {
  error: Error | null
}

/**
 * React class-based Error Boundary.
 *
 * Wrap any subtree that may throw during render. Errors are forwarded to the
 * monitoring layer (Sentry when configured) and a user-friendly fallback is
 * shown instead of a blank screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: { componentStack: string }) {
    captureError(error, {
      extra: { componentStack: info.componentStack },
      tags: { source: 'react_error_boundary' },
    })
  }

  reset = () => {
    this.setState({ error: null })
    this.props.onReset?.()
  }

  override render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="border-border bg-card flex flex-col items-center gap-4 rounded-xl border p-8 text-center">
          <div className="bg-destructive/10 flex h-12 w-12 items-center justify-center rounded-full">
            <AlertTriangle className="text-destructive h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-foreground font-semibold">Something went wrong</p>
            <p className="text-muted-foreground mt-1 text-sm">
              This section encountered an error. Try refreshing it or reload the page.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={this.reset} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            {this.props.retryLabel ?? 'Try again'}
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
