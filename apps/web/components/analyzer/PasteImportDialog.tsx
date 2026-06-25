'use client'

import { useState } from 'react'
import { ClipboardPaste } from 'lucide-react'
import { toast } from 'sonner'
import type { ProfileDraft } from '@upiq/shared'
import { parseFullProfile } from '@/lib/analyzer/parse'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface PasteImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (partial: Partial<ProfileDraft>) => void
}

export function PasteImportDialog({ open, onOpenChange, onImport }: PasteImportDialogProps) {
  const [text, setText] = useState('')

  function handleImport() {
    if (!text.trim()) {
      toast.error('Paste your profile text first.')
      return
    }
    const { partial, matchedSections } = parseFullProfile(text)
    if (matchedSections.length === 0) {
      toast.error('Could not detect any sections. Try pasting into sections directly.')
      return
    }
    onImport(partial)
    toast.success(
      `Imported ${matchedSections.length} section${matchedSections.length === 1 ? '' : 's'}.`
    )
    setText('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardPaste className="text-primary h-4 w-4" />
            Paste your full profile
          </DialogTitle>
          <DialogDescription>
            Paste your entire Upwork profile and we&apos;ll split it into sections. Label sections
            with headings like &ldquo;Overview&rdquo;, &ldquo;Skills&rdquo;, or &ldquo;Hourly
            Rate&rdquo; for best results. You can fix anything afterwards.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            'Title\nSenior Full-Stack Engineer…\n\nOverview\nI help startups…\n\nSkills\nReact, Node.js, AWS'
          }
          rows={12}
          className="font-mono text-xs"
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Import sections</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
