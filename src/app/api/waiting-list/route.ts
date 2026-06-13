import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const items = await prisma.waitingList.findMany({
      include: { customer: true, service: true },
      orderBy: { createdAt: 'desc' },
    });
    return ok(items);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerId || !body.serviceId || !body.date || !body.time) {
      return bad('Müşteri, hizmet, tarih ve saat gerekli');
    }
    const item = await prisma.waitingList.create({
      data: body,
      include: { customer: true, service: true },
    });
    return created(item);
  } catch (e) { return serverError(e); }
}
