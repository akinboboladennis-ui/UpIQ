export const metadata = {
  title: 'About — UpIQ',
  description: 'UpIQ is AI career intelligence built for serious Upwork freelancers.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-4xl font-bold">About UpIQ</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        We build AI-powered career intelligence tools for freelancers who take their craft
        seriously.
      </p>

      <div className="prose prose-invert max-w-none">
        <h2 className="mb-4 text-xl font-semibold">Why we built UpIQ</h2>
        <p className="text-muted-foreground mb-6">
          Upwork is one of the world&apos;s largest freelance marketplaces, but winning on it is
          harder than it should be. Most freelancers spend years guessing what to fix, relying on
          vague advice that doesn&apos;t translate to action. We thought there had to be a better
          way.
        </p>
        <p className="text-muted-foreground mb-6">
          UpIQ applies modern AI to the problem of profile optimization — not just to generate
          generic feedback, but to produce scored, prioritized, actionable intelligence calibrated
          to what actually drives results on Upwork.
        </p>

        <h2 className="mb-4 mt-10 text-xl font-semibold">Our approach</h2>
        <p className="text-muted-foreground mb-6">
          Every analysis produces a multi-dimensional scored report. We evaluate positioning,
          overview quality, keyword coverage, social proof signals, profile completeness, and rate
          alignment — and turn those into a prioritized action plan you can execute today.
        </p>
        <p className="text-muted-foreground mb-6">
          We&apos;re a small team obsessed with helping freelancers compete smarter. UpIQ is
          currently in beta, free to use, and improving every week based on feedback from our
          community.
        </p>

        <h2 className="mb-4 mt-10 text-xl font-semibold">Our values</h2>
        <ul className="text-muted-foreground mb-6 space-y-3">
          <li>
            <strong className="text-foreground">Actionable over decorative.</strong> Every insight
            we surface should lead to a concrete next step.
          </li>
          <li>
            <strong className="text-foreground">Honest over flattering.</strong> We tell you what
            needs improving, not what you want to hear.
          </li>
          <li>
            <strong className="text-foreground">Freelancer-first.</strong> Everything we build
            starts with what makes a real difference for independent professionals.
          </li>
        </ul>
      </div>
    </div>
  )
}
