import Link from 'next/link'
import { FileQuestion, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <FileQuestion className="text-muted-foreground h-8 w-8" aria-hidden />
        </div>

        <div>
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">404</p>
          <h1 className="text-foreground mt-2 text-2xl font-bold">Page not found</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            The page you're looking for doesn't exist or has been moved. Check the URL or navigate
            back to a known page.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="gap-2">
            <Link href="/dashboard">
              <Home className="h-4 w-4" aria-hidden />
              Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/history">
              <Search className="h-4 w-4" aria-hidden />
              Analysis History
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
