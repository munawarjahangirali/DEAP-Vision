// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const protocol = request.headers.get('x-forwarded-proto')

  if (protocol === 'http') {
    const url = request.nextUrl
    url.protocol = 'https'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Apply to all routes
export const config = {
  matcher: '/:path*',
}
