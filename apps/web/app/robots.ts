import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://upiq.io'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/history', '/report/', '/profile-analyzer', '/onboarding', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
