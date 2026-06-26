'use client'

import { useEffect, useRef, useState } from 'react'

export type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved'

interface UseAutoSaveOptions {
  /** Serializable value to watch. Changes trigger a debounced save. */
  value: unknown
  /** Called when a save should be committed. */
  onSave: () => void
  /** Debounce delay in ms. */
  delay?: number
  /** Warn the user before leaving with unsaved changes. */
  warnOnUnload?: boolean
}

/**
 * Debounced auto-save with dirty tracking and an optional beforeunload guard.
 * The Profile Analyzer persists to localStorage via the store; this hook
 * surfaces the visible save status and prevents accidental data loss.
 */
export function useAutoSave({
  value,
  onSave,
  delay = 1200,
  warnOnUnload = true,
}: UseAutoSaveOptions): { status: SaveStatus; saveNow: () => void } {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirst = useRef(true)
  const savedRevert = useRef<ReturnType<typeof setTimeout> | null>(null)

  const commit = () => {
    setStatus('saving')
    onSave()
    setStatus('saved')
    if (savedRevert.current) clearTimeout(savedRevert.current)
    savedRevert.current = setTimeout(() => setStatus('idle'), 2500)
  }

  useEffect(() => {
    // Skip the initial mount so a freshly-loaded draft isn't marked dirty.
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    setStatus('unsaved')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(commit, delay)

    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay])

  useEffect(() => {
    if (!warnOnUnload) return
    const handler = (e: BeforeUnloadEvent) => {
      if (status === 'unsaved' || status === 'saving') {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [status, warnOnUnload])

  const saveNow = () => {
    if (timer.current) clearTimeout(timer.current)
    commit()
  }

  return { status, saveNow }
}
