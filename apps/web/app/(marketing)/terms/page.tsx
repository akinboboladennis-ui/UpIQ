export const metadata = {
  title: 'Terms of Service — UpIQ',
  description: 'Terms of service for UpIQ.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-4xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground mb-10 text-sm">Last updated: June 2025</p>

      <div className="text-muted-foreground space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">1. Acceptance</h2>
          <p>
            By using UpIQ you agree to these terms. If you don&apos;t agree, please don&apos;t use
            the service.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">2. What UpIQ provides</h2>
          <p>
            UpIQ is an AI-powered profile analysis tool for Upwork freelancers. We provide scored
            reports and recommendations. We do not guarantee any particular outcome — results depend
            on many factors outside our control.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">3. Your account</h2>
          <p>
            You must provide a valid email address to create an account. You are responsible for
            keeping your credentials secure. One person per account.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">4. Acceptable use</h2>
          <p>
            You may use UpIQ only for its intended purpose — analyzing your own Upwork profile. You
            may not use UpIQ for: automated scraping, reverse engineering, reselling reports without
            attribution, or any unlawful purpose.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">5. Content you submit</h2>
          <p>
            You retain ownership of the profile text you paste into UpIQ. By submitting it you grant
            us a license to process it to provide the service. You represent that you have the right
            to submit the content.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">6. Disclaimers</h2>
          <p>
            UpIQ is provided &ldquo;as is.&rdquo; AI-generated analysis may contain errors. We are
            not affiliated with or endorsed by Upwork. Scores and recommendations are informational
            only.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">
            7. Limitation of liability
          </h2>
          <p>
            To the maximum extent permitted by law, UpIQ is not liable for any indirect, incidental,
            or consequential damages arising from your use of the service.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">8. Termination</h2>
          <p>
            We may suspend or terminate accounts that violate these terms. You may delete your
            account at any time.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">9. Changes</h2>
          <p>
            We may update these terms as the product evolves. Continued use after changes
            constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-base font-semibold">10. Contact</h2>
          <p>Questions? Email hello@upiq.io.</p>
        </section>
      </div>
    </div>
  )
}
