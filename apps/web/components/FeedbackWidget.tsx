'use client'

import { useState } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FeedbackType = 'bug' | 'feature' | 'general'

export function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<FeedbackType>('general')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (!message.trim()) return
    setSubmitting(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message, rating }),
      })
      setSubmitted(true)
    } catch {
      // fail silently — feedback is best-effort
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setOpen(false)
    setTimeout(() => {
      setSubmitted(false)
      setMessage('')
      setRating(0)
      setType('general')
    }, 300)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="border-border/50 bg-card mb-3 w-80 rounded-xl border shadow-xl">
          <div className="border-border/40 flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-semibold">Share feedback</p>
            <button onClick={reset} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          {submitted ? (
            <div className="p-6 text-center">
              <div className="mb-2 text-2xl">🙏</div>
              <p className="text-sm font-medium">Thanks for your feedback!</p>
              <p className="text-muted-foreground mt-1 text-xs">We read every submission.</p>
              <Button size="sm" variant="outline" className="mt-4" onClick={reset}>
                Close
              </Button>
            </div>
          ) : (
            <div className="p-4">
              {/* Type */}
              <div className="mb-3 flex gap-2">
                {(['bug', 'feature', 'general'] as FeedbackType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 rounded-md border px-2 py-1.5 text-xs capitalize transition-colors ${
                      type === t
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/50 text-muted-foreground hover:border-border'
                    }`}
                  >
                    {t === 'bug' ? '🐛 Bug' : t === 'feature' ? '✨ Feature' : '💬 General'}
                  </button>
                ))}
              </div>

              {/* Rating */}
              <div className="mb-3">
                <p className="text-muted-foreground mb-1.5 text-xs">How&apos;s your experience?</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-lg transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-muted-foreground/40'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  type === 'bug'
                    ? 'Describe what happened…'
                    : type === 'feature'
                      ? 'What would you like to see?'
                      : 'Share your thoughts…'
                }
                rows={3}
                className="border-border/50 bg-background placeholder:text-muted-foreground/60 focus:border-primary w-full resize-none rounded-md border px-3 py-2 text-sm focus:outline-none"
              />

              <Button
                onClick={handleSubmit}
                disabled={!message.trim() || submitting}
                size="sm"
                className="mt-2 w-full"
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                {submitting ? 'Sending…' : 'Send Feedback'}
              </Button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Open feedback widget"
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>
    </div>
  )
}
