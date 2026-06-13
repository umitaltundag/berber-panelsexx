import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: 'Onaylandı' },
      include: { customer: { select: { name: true } }, staff: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return ok(reviews);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerId || !body.staffId || !body.rating) return bad('Müşteri, çalışan ve puan gerekli');
    if (body.rating < 1 || body.rating > 5) return bad('Geçerli bir puan girin (1-5)');
    const review = await prisma.review.create({
      data: { customerId: Number(body.customerId), staffId: Number(body.staffId), rating: Number(body.rating), comment: body.comment || null, status: 'Beklemede' },
    });
    return created(review);
  } catch (e) { return serverError(e); }
}
