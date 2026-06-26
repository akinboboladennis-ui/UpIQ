'use client'

import { useEffect, useState } from 'react'
import { scoreColor } from '@/lib/report/grading'
import type { LetterGrade } from '@/lib/report/grading'

interface ScoreRingProps {
  score: number
  grade: LetterGrade
  size?: number
  strokeWidth?: number
  label?: string
}

export function ScoreRing({ score, grade, size = 160, strokeWidth = 10, label }: ScoreRingProps) {
  const [displayed, setDisplayed] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (displayed / 100) * circumference
  const color = scoreColor(score)

  // Animate score on mount
  useEffect(() => {
    const start = performance.now()
    const duration = 900
    function frame(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [score])

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Profile score: ${score} out of 100, grade ${grade}`}
    >
      {/* Track ring */}
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        {/* Glow effect */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ opacity: 0.15, transition: 'stroke-dashoffset 0.05s' }}
        />
        {/* Main progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.05s' }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-4xl font-bold tabular-nums" style={{ color }}>
          {displayed}
        </span>
        <span className="text-muted-foreground mt-1 text-xs font-medium uppercase tracking-widest">
          {label ?? 'Score'}
        </span>
        <span
          className="mt-2 rounded-md px-2 py-0.5 text-sm font-bold"
          style={{ color, border: `1px solid ${color}`, opacity: 0.9 }}
        >
          {grade}
        </span>
      </div>
    </div>
  )
}
