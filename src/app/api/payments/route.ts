import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: { customer: true, staff: true },
      orderBy: { date: 'desc' },
    });
    return ok(payments);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerId || !body.amount) return bad('Müşteri ve tutar gerekli');
    const payment = await prisma.payment.create({
      data: body,
      include: { customer: true, staff: true },
    });
    return created(payment);
  } catch (e) { return serverError(e); }
}
