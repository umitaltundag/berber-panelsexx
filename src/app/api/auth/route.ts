import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken, verifyToken } from '@/lib/auth';
import { ok, bad, unauthorized, serverError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) return bad('Kullanıcı adı ve şifre gerekli');

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return unauthorized('Kullanıcı adı veya şifre hatalı');

    const valid = await verifyPassword(password, user.password);
    if (!valid) return unauthorized('Kullanıcı adı veya şifre hatalı');

    const token = signToken({ id: user.id, username: user.username, role: user.role });

    const res = ok({ user: { id: user.id, username: user.username, name: user.name, role: user.role } });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    return res;
  } catch (e) {
    return serverError(e);
  }
}

export async function GET() {
  try {
    const token = await requireAuth();
    if (!token) return unauthorized();
    return ok(token);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE() {
  try {
    const res = NextResponse.json({ success: true, data: { loggedOut: true } });
    res.cookies.set('token', '', { httpOnly: true, maxAge: 0, path: '/' });
    return res;
  } catch (e) {
    return serverError(e);
  }
}

async function requireAuth() {
  const { cookies } = await import('next/headers');
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
