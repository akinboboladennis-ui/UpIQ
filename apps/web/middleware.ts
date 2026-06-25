import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/signup', '/forgot-password', '/reset-password']
const AUTH_PATHS = ['/login', '/signup', '/forgot-password']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            supabaseResponse.cookies.set(name, value, options as any)
          )
        },
      },
    }
  )

  // Must use getUser() — not getSession() — for secure server-side auth checks
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Authenticated user on auth pages → send to dashboard
  if (user && AUTH_PATHS.some((path) => pathname === path)) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Unauthenticated user on protected route → send to login
  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon')

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
