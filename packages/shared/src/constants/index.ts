export const APP_NAME = 'UpIQ'
export const APP_DESCRIPTION = 'AI-powered career intelligence platform for freelancers.'

export const ROUTES = {
  home: '/',
  login: '/login',
  signUp: '/signup',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  authCallback: '/auth/callback',
  dashboard: '/dashboard',
  profile: '/profile',
  proposals: '/proposals',
  market: '/market',
  growth: '/growth',
  settings: '/settings',
} as const

export const RATE_LIMITS = {
  profileAnalysisPerDay: 5,
  proposalOptimizationPerDay: 10,
} as const

export const ERROR_CODES = {
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  AI_UNAVAILABLE: 'AI_UNAVAILABLE',
  PROFILE_NOT_FOUND: 'PROFILE_NOT_FOUND',
} as const
