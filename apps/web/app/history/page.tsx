import type { Metadata } from 'next'
import { HistoryWorkspace } from '@/components/report/HistoryWorkspace'

export const metadata: Metadata = {
  title: 'Analysis History | UpIQ',
  description: 'View and manage all your LinkedIn profile analyses.',
}

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <HistoryWorkspace />
    </div>
  )
}
