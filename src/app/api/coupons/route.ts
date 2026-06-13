import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { id: 'asc' } });
    return ok(coupons);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.code || !body.discount) return bad('Kod ve indirim gerekli');
    const coupon = await prisma.coupon.create({ data: body });
    return created(coupon);
  } catch (e: any) {
    if (e?.code === 'P2002') return bad('Bu kod zaten mevcut');
    return serverError(e);
  }
}
