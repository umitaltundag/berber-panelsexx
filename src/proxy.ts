import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicPaths = ['/login', '/', '/randevu-al', '/musteri-giris'];
  if (publicPaths.includes(pathname) || pathname.startsWith('/musteri/')) return NextResponse.next();

  if (pathname.startsWith('/_next') || pathname.startsWith('/api/') || pathname.startsWith('/uploads') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
