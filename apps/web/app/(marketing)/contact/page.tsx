export const metadata = {
  title: 'Contact — UpIQ',
  description: 'Get in touch with the UpIQ team.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-4xl font-bold">Contact us</h1>
      <p className="text-muted-foreground mb-10 text-lg">
        We&apos;re a small team and we read every message.
      </p>

      <div className="space-y-8">
        <div className="border-border/50 bg-card/60 rounded-xl border p-6">
          <h2 className="mb-2 font-semibold">General enquiries</h2>
          <p className="text-muted-foreground text-sm">
            For questions, feedback, or partnership enquiries, email us at{' '}
            <a href="mailto:hello@upiq.io" className="text-primary hover:underline">
              hello@upiq.io
            </a>
          </p>
        </div>

        <div className="border-border/50 bg-card/60 rounded-xl border p-6">
          <h2 className="mb-2 font-semibold">Bug reports & feature requests</h2>
          <p className="text-muted-foreground text-sm">
            Use the feedback widget inside the app (bottom right corner of any page when logged in).
            You can report bugs, request features, or rate your experience.
          </p>
        </div>

        <div className="border-border/50 bg-card/60 rounded-xl border p-6">
          <h2 className="mb-2 font-semibold">Privacy & data requests</h2>
          <p className="text-muted-foreground text-sm">
            To request deletion of your data or exercise your privacy rights, email{' '}
            <a href="mailto:privacy@upiq.io" className="text-primary hover:underline">
              privacy@upiq.io
            </a>
          </p>
        </div>
      </div>

      <p className="text-muted-foreground mt-10 text-sm">
        We aim to respond within 2 business days.
      </p>
    </div>
  )
}
