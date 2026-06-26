'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagInputProps {
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (index: number) => void
  placeholder?: string
  /** Indices that are duplicates, highlighted as invalid. */
  duplicateIndices?: number[]
}

export function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder = 'Type a skill and press Enter',
  duplicateIndices = [],
}: TagInputProps) {
  const [value, setValue] = useState('')

  function commit() {
    const trimmed = value.trim()
    if (trimmed) {
      onAdd(trimmed)
      setValue('')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && !value && tags.length > 0) {
      onRemove(tags.length - 1)
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text')
    if (/[,\n]/.test(text)) {
      e.preventDefault()
      text
        .split(/[,\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach(onAdd)
      setValue('')
    }
  }

  return (
    <div
      className={cn(
        'border-input bg-background focus-within:ring-ring flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border p-2 transition-colors focus-within:ring-1'
      )}
    >
      {tags.map((tag, i) => {
        const isDup = duplicateIndices.includes(i)
        return (
          <span
            key={`${tag}-${i}`}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
              isDup ? 'bg-destructive/15 text-destructive' : 'bg-brand-subtle text-primary'
            )}
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="hover:text-foreground transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )
      })}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        onPaste={handlePaste}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="text-foreground placeholder:text-muted-foreground min-w-[120px] flex-1 bg-transparent text-sm outline-none"
        aria-label="Add skill"
      />
    </div>
  )
}
