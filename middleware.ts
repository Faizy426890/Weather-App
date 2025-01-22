import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken');
  const url = request.nextUrl.clone();
  console.log('Middleware triggered, token:', token);  

  const protectedRoutes = ['/'];

  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    if (!token) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'], 
};
