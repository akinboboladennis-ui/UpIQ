export const metadata = {
  title: 'FAQ — UpIQ',
  description: 'Frequently asked questions about UpIQ.',
}

const FAQS = [
  {
    q: 'Is UpIQ free?',
    a: 'Yes — UpIQ is completely free during the beta period. No credit card required. We will give you plenty of advance notice before introducing paid plans.',
  },
  {
    q: 'Do you need access to my Upwork account?',
    a: 'No. Just paste your profile overview text into the analyzer. We never ask for your Upwork credentials or OAuth access.',
  },
  {
    q: 'How long does an analysis take?',
    a: 'Most analyses complete in under 60 seconds. Our AI processes your profile text and returns a full scored report.',
  },
  {
    q: 'How many analyses can I run?',
    a: 'You can run up to 5 analyses every 10 minutes. Re-analyze as often as you like after making profile changes.',
  },
  {
    q: 'What does UpIQ actually analyze?',
    a: 'UpIQ scores six dimensions: positioning clarity, overview quality, keyword coverage, social proof signals, profile completeness, and rate alignment. Each dimension gets a score and a written rationale.',
  },
  {
    q: 'Is my profile text stored or shared?',
    a: 'Your profile text is used only to generate your report and is stored securely under your account. It is never sold or shared with third parties.',
  },
  {
    q: 'What makes UpIQ different from ChatGPT?',
    a: 'UpIQ is purpose-built for Upwork. Our scoring model is calibrated to what actually drives Upwork profile visibility and client conversions — not general writing quality.',
  },
  {
    q: 'Can I analyze profiles in niches other than software development?',
    a: 'Yes. UpIQ works for any Upwork niche — design, writing, marketing, consulting, and more. The AI adapts its analysis based on the niche you specify.',
  },
  {
    q: 'How do I give feedback?',
    a: 'Use the feedback widget inside the app (bottom right corner). We read every submission and use it to improve UpIQ.',
  },
  {
    q: 'Is there a mobile app?',
    a: 'Not yet. UpIQ is a web app optimized for mobile browsers. A native app may come after the beta.',
  },
]

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-4xl font-bold">Frequently asked questions</h1>
      <p className="text-muted-foreground mb-10 text-lg">Everything you want to know about UpIQ.</p>

      <div className="divide-border/50 divide-y">
        {FAQS.map(({ q, a }) => (
          <details key={q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              {q}
              <span className="text-muted-foreground ml-4 flex-shrink-0 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="text-muted-foreground mt-3 text-sm">{a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
