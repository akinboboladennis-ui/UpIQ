import Link from 'next/link'
import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot Password',
}

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <ForgotPasswordForm />

      {/* Footer */}
      <p className="text-muted-foreground text-center text-sm">
        Remembered it?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
