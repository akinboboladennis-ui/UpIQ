'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const NICHES = [
  'Software Development',
  'Design & Creative',
  'Writing & Content',
  'Marketing & SEO',
  'Data & Analytics',
  'Video & Audio',
  'Finance & Accounting',
  'Other',
]

const EXPERIENCE_LEVELS = [
  { value: 'new', label: 'New to Upwork', description: 'Less than 1 year' },
  { value: 'growing', label: 'Growing', description: '1–3 years' },
  { value: 'established', label: 'Established', description: '3–5 years' },
  { value: 'veteran', label: 'Veteran', description: '5+ years' },
]

const TOTAL_STEPS = 4

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [niche, setNiche] = useState('')
  const [experience, setExperience] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')

  function next() {
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
    else router.push('/dashboard')
  }

  function skip() {
    router.push('/dashboard')
  }

  const progress = (step / TOTAL_STEPS) * 100

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-bold">
            Up<span className="text-primary">IQ</span>
          </Link>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="text-muted-foreground mb-2 flex justify-between text-xs">
            <span>
              Step {step} of {TOTAL_STEPS}
            </span>
            <button onClick={skip} className="hover:text-foreground transition-colors">
              Skip setup
            </button>
          </div>
          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="border-border/50 bg-card/60 rounded-xl border p-8">
          {step === 1 && (
            <div>
              <h1 className="mb-2 text-xl font-bold">Welcome to UpIQ!</h1>
              <p className="text-muted-foreground mb-6 text-sm">
                Let&apos;s personalize your experience. What&apos;s your main freelancing niche on
                Upwork?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {NICHES.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNiche(n)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      niche === n
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/50 hover:border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="mb-2 text-xl font-bold">Your experience level</h1>
              <p className="text-muted-foreground mb-6 text-sm">
                How long have you been freelancing on Upwork?
              </p>
              <div className="space-y-2">
                {EXPERIENCE_LEVELS.map(({ value, label, description }) => (
                  <button
                    key={value}
                    onClick={() => setExperience(value)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                      experience === value
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 hover:border-border'
                    }`}
                  >
                    <div
                      className={`text-sm font-medium ${experience === value ? 'text-primary' : ''}`}
                    >
                      {label}
                    </div>
                    <div className="text-muted-foreground text-xs">{description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="mb-2 text-xl font-bold">Your hourly rate</h1>
              <p className="text-muted-foreground mb-6 text-sm">
                What&apos;s your current Upwork hourly rate? We use this to calibrate your rate
                alignment score.
              </p>
              <div className="relative">
                <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="85"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="pl-7"
                />
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                Enter 0 if you work on fixed-price projects only.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <div className="mb-4 text-4xl">🚀</div>
              <h1 className="mb-2 text-xl font-bold">You&apos;re all set!</h1>
              <p className="text-muted-foreground mb-6 text-sm">
                Head to your dashboard to run your first profile analysis. It takes under 60
                seconds.
              </p>
              <p className="text-muted-foreground text-xs">
                Tip: paste your complete Upwork overview for the most accurate score.
              </p>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && step < TOTAL_STEPS && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-1">
                Back
              </Button>
            )}
            <Button
              onClick={next}
              className="flex-1"
              disabled={(step === 1 && !niche) || (step === 2 && !experience)}
            >
              {step === TOTAL_STEPS ? 'Go to Dashboard' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
