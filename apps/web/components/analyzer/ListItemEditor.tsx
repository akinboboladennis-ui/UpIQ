'use client'

import { Trash2 } from 'lucide-react'
import type { ItemFieldDef } from '@/lib/analyzer/sections'
import { isValidUrl } from '@/lib/analyzer/validation'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CharacterCounter } from './CharacterCounter'

interface ListItemEditorProps {
  index: number
  fields: ItemFieldDef[]
  item: Record<string, string>
  onChange: (key: string, value: string) => void
  onRemove: () => void
  itemNoun: string
}

export function ListItemEditor({
  index,
  fields,
  item,
  onChange,
  onRemove,
  itemNoun,
}: ListItemEditorProps) {
  return (
    <div className="border-border bg-bg-surface relative rounded-lg border p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-text-tertiary text-xs font-medium uppercase tracking-wide">
          {itemNoun} {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
          aria-label={`Remove ${itemNoun} ${index + 1}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => {
          const value = item[field.key] ?? ''
          const fullWidth = field.type === 'textarea'
          const urlInvalid = field.type === 'url' && value.trim() !== '' && !isValidUrl(value)

          return (
            <div key={field.key} className={cn('space-y-1', fullWidth && 'sm:col-span-2')}>
              <div className="flex items-center justify-between">
                <Label className="text-xs">
                  {field.label}
                  {field.required && <span className="text-destructive ml-0.5">*</span>}
                </Label>
                {field.maxLength && <CharacterCounter count={value.length} max={field.maxLength} />}
              </div>

              {field.type === 'textarea' ? (
                <Textarea
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="min-h-16 text-sm"
                />
              ) : field.type === 'select' ? (
                <select
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="border-input bg-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 text-sm focus-visible:outline-none focus-visible:ring-1"
                >
                  <option value="">Select…</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  type={field.type === 'url' ? 'url' : 'text'}
                  className={cn('h-9 text-sm', urlInvalid && 'border-destructive')}
                  aria-invalid={urlInvalid}
                />
              )}
              {urlInvalid && (
                <p className="text-destructive text-xs">Enter a valid URL (https://…).</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
