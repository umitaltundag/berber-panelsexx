import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { id: 'asc' },
      include: { customer: true, staff: true },
    });
    return ok(reviews);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.rating || body.rating < 1 || body.rating > 5) return bad('Geçerli bir puan girin (1-5)');
    if (!body.customerId || !body.staffId) return bad('Müşteri ve çalışan gerekli');
    const review = await prisma.review.create({ data: body });
    return created(review);
  } catch (e) { return serverError(e); }
}
