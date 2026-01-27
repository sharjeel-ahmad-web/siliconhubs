import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Cache for redirects (refreshed periodically)
let redirectsCache: Array<{
  source: string;
  destination: string;
  type: number;
}> = [];
let lastFetch = 0;
const CACHE_DURATION = 300000; // 5 minutes - reduces API calls significantly

async function getRedirects(baseUrl: string) {
  const now = Date.now();
  if (now - lastFetch < CACHE_DURATION && redirectsCache.length > 0) {
    return redirectsCache;
  }

  try {
    // Fetch redirects from internal API
    const res = await fetch(`${baseUrl}/api/redirects`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      redirectsCache = data;
      lastFetch = now;
    }
  } catch (error) {
    // Use cached data on error
  }
  return redirectsCache;
}

function matchRedirect(pathname: string, redirects: typeof redirectsCache) {
  for (const redirect of redirects) {
    // Exact match
    if (redirect.source === pathname) {
      return redirect;
    }
    // Wildcard match
    if (redirect.source.includes('*')) {
      const pattern = redirect.source.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(pathname)) {
        return redirect;
      }
    }
  }
  return null;
}

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'admin';
    const isEditor = token?.role === 'editor';
    const pathname = req.nextUrl.pathname;

    // Skip redirects check for static assets and API routes (major performance boost)
    const isStaticAsset =
      pathname.startsWith('/_next') ||
      pathname.startsWith('/static') ||
      pathname.startsWith('/media') ||
      pathname.startsWith('/public') ||
      (pathname.includes('.') && !pathname.endsWith('.html')); // Files with extensions except .html

    const isApiRoute = pathname.startsWith('/api');
    const isAdminRoute = pathname.startsWith('/admin');

    // Check for redirects (only for actual page requests, not static files)
    if (!isAdminRoute && !isApiRoute && !isStaticAsset) {
      const baseUrl = req.nextUrl.origin;
      const redirects = await getRedirects(baseUrl);
      const redirect = matchRedirect(pathname, redirects);

      if (redirect) {
        const destination = redirect.destination.startsWith('http')
          ? redirect.destination
          : new URL(redirect.destination, req.url).toString();

        return NextResponse.redirect(destination, {
          status: redirect.type,
        });
      }
    }

    // Admin-only routes
    if (pathname.startsWith('/admin/users') && !isAdmin) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // Admin and Editor routes
    if (pathname.startsWith('/admin') && !isAdmin && !isEditor) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public routes without auth
        const pathname = req.nextUrl.pathname;
        if (!pathname.startsWith('/admin')) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    // Add paths that might have redirects
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
