/**
 * Feature flag system.
 *
 * Flags are controlled by environment variables so they can be toggled at
 * deploy time without code changes. In the future this can be backed by
 * PostHog feature flags or LaunchDarkly for per-user/percentage rollouts.
 *
 * Convention: NEXT_PUBLIC_FF_<FLAG_NAME>=true|false
 *
 * Adding a new flag:
 *   1. Add it to the FEATURE_FLAGS map below.
 *   2. Add the corresponding env var to .env.example.
 *   3. Use isEnabled('flagName') in components/API routes.
 */

export type FeatureFlag =
  | 'marketInsights' // Sprint Market — market trend intelligence
  | 'proposalIntel' // Sprint Proposals — proposal optimizer
  | 'jobMatch' // Sprint Match — job matching engine
  | 'learningCenter' // Sprint Pulse — learning recommendations
  | 'compareAnalyses' // Side-by-side report comparison
  | 'shareReport' // Public report sharing links
  | 'exportPDF' // PDF export for reports
  | 'aiStreaming' // Streaming AI responses (reduces perceived latency)

/** Default values when env var is not set. All off by default. */
const DEFAULTS: Record<FeatureFlag, boolean> = {
  marketInsights: false,
  proposalIntel: false,
  jobMatch: false,
  learningCenter: false,
  compareAnalyses: false,
  shareReport: false,
  exportPDF: false,
  aiStreaming: false,
}

/** Map from flag name to env var key. */
const ENV_KEYS: Record<FeatureFlag, string> = {
  marketInsights: 'NEXT_PUBLIC_FF_MARKET_INSIGHTS',
  proposalIntel: 'NEXT_PUBLIC_FF_PROPOSAL_INTEL',
  jobMatch: 'NEXT_PUBLIC_FF_JOB_MATCH',
  learningCenter: 'NEXT_PUBLIC_FF_LEARNING_CENTER',
  compareAnalyses: 'NEXT_PUBLIC_FF_COMPARE_ANALYSES',
  shareReport: 'NEXT_PUBLIC_FF_SHARE_REPORT',
  exportPDF: 'NEXT_PUBLIC_FF_EXPORT_PDF',
  aiStreaming: 'NEXT_PUBLIC_FF_AI_STREAMING',
}

/**
 * Check if a feature flag is enabled.
 * Safe to call on both server and client.
 */
export function isEnabled(flag: FeatureFlag): boolean {
  const envKey = ENV_KEYS[flag]
  const envValue = process.env[envKey]

  if (envValue === undefined || envValue === '') {
    return DEFAULTS[flag]
  }

  return envValue.toLowerCase() === 'true' || envValue === '1'
}

/**
 * Return all feature flags and their current values.
 * Useful for debugging and admin dashboards.
 */
export function getAllFlags(): Record<FeatureFlag, boolean> {
  const flags = {} as Record<FeatureFlag, boolean>
  for (const flag of Object.keys(DEFAULTS) as FeatureFlag[]) {
    flags[flag] = isEnabled(flag)
  }
  return flags
}
