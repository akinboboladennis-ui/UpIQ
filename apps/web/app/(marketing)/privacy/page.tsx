export const metadata = {
  title: 'Privacy Policy — UpIQ',
  description: 'How UpIQ collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-4xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground mb-10 text-sm">Last updated: June 2025</p>

      <div className="text-muted-foreground space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">1. What we collect</h2>
          <p>
            When you create an account we collect your email address. When you run an analysis we
            store the profile text you paste, the generated report, and your account ID to associate
            results with your account.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">2. How we use your data</h2>
          <p>
            Your profile text is sent to an AI model to generate your report and is then stored so
            you can revisit past analyses. We do not use your profile text to train AI models. We do
            not sell your data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">
            3. Data storage and security
          </h2>
          <p>
            Data is stored in Supabase (hosted in the EU by default) with row-level security. All
            traffic is encrypted in transit using TLS. We apply security headers and follow OWASP
            best practices.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">4. Cookies and analytics</h2>
          <p>
            We use anonymous usage analytics (PostHog) to understand how UpIQ is used in aggregate.
            No personally identifiable information is attached to analytics events. We use minimal
            cookies required for authentication.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">5. Your rights</h2>
          <p>
            You can delete your account and all associated data at any time from your account
            settings. To request a data export or exercise other privacy rights, email
            privacy@upiq.io.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">
            6. Changes to this policy
          </h2>
          <p>
            We may update this policy as the product evolves. We will notify users of material
            changes via email.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">7. Contact</h2>
          <p>Questions about this policy? Email privacy@upiq.io.</p>
        </section>
      </div>
    </div>
  )
}
