// middleware.js
// Next.js middleware that centralizes locale-aware redirects and adds useful headers.
// It determines a user's preferred language, ensures URLs include a locale prefix,
// bypasses static assets, and sets diagnostic and SEO-related headers.
import { NextResponse } from 'next/server';

const LOCALES = ['en', 'zh'];

function getPreferredLocale(request) {
  // Read the user's explicit locale choice from the cookie first.
  // The cookie name `NEXT_LOCALE` mirrors Next.js i18n conventions.
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie && LOCALES.includes(localeCookie)) {
    return localeCookie;
  }

  // Fall back to the `Accept-Language` header (e.g., "en-US,en;q=0.9").
  // We only use the primary language subtag (e.g., "en" from "en-US").
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage.split(',')[0].split('-')[0];
    if (LOCALES.includes(preferredLocale)) {
      return preferredLocale;
    }
  }

  // Default to Simplified Chinese if no preference matched.
  return 'zh';
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Short-circuit static asset requests to avoid unnecessary work.
  // These paths should not be redirected or modified.
  if (
    pathname.endsWith('.xml') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.json') ||
    pathname.endsWith('.csv') ||
    pathname.endsWith('.xlsx') ||
    pathname.endsWith('.docx') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.ico') || 
    pathname.endsWith('.png')
  ) {
    // For static files, continue the request without changes.
    return NextResponse.next();
  }

  let response;
  // If the user visits the site root, redirect them to a locale-prefixed landing route.
  if (pathname === '/') {
    const preferredLocale = getPreferredLocale(request);
    response = NextResponse.redirect(new URL(`/${preferredLocale}/algorithms`, request.url));
  } else {
    // For non-root paths, check if the URL is missing a recognized locale prefix.
    const pathnameIsMissingLocale = LOCALES.every(
      (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );
    if (pathnameIsMissingLocale) {
      const preferredLocale = getPreferredLocale(request);
      // Redirect to the same path under the user's preferred locale.
      // We add a trailing slash to normalize paths consistently.
      response = NextResponse.redirect(new URL(`/${preferredLocale}${pathname}/`, request.url));
    } else {
      response = NextResponse.next();
    }
  }

  // Attach diagnostic headers to help with debugging and analytics.
  if (response) {
    response.headers.set('x-pathname', pathname);
  } else {
    response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
  }

  // Encourage search engines to index these pages.
  response.headers.set('X-Robots-Tag', 'index,follow');
  return response;
}

export const config = {
  matcher: [
    /*
     * Run middleware for all paths except those that should be ignored:
     * - api: Next.js API routes
     * - _next/static: build output and static assets
     * - _next/image: Next.js image optimization endpoints
     * - robots.txt: explicitly served SEO directives
     */
    '/((?!api|_next/static|_next/image|robots.txt).*)',
  ],
};
