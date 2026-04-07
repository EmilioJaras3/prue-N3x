import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders } from '@/restructurado/backend/infrastructure/security/headers';

const PUBLIC_ROUTES = ['/', '/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  // 1. Redirecciones de Autenticación
  if (!token && !PUBLIC_ROUTES.includes(pathname) && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Aplicación de Cabeceras (Solo las básicas)
  const response = NextResponse.next();
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.mp4$|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.webp$|.*\\.ico$).*)'],
};
