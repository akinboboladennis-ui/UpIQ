import Link from 'next/link'
import type { Metadata } from 'next'
import { SignUpForm } from '@/components/auth/SignUpForm'

export const metadata: Metadata = {
  title: 'Create Account',
}

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm">
          Start optimizing your freelance career with AI.
        </p>
      </div>

      <SignUpForm />

      {/* Footer */}
      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>

      <p className="text-muted-foreground text-center text-xs">
        By creating an account you agree to our{' '}
        <Link href="/terms" className="hover:text-foreground underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="hover:text-foreground underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
