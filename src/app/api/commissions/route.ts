import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const items = await prisma.commission.findMany({
      include: { staff: true, service: true },
      orderBy: { createdAt: 'desc' },
    });
    return ok(items);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.staffId || !body.serviceId || body.amount == null || !body.rate == null || !body.date) {
      return bad('Tüm alanlar gerekli');
    }
    const item = await prisma.commission.create({
      data: body,
      include: { staff: true, service: true },
    });
    return created(item);
  } catch (e) { return serverError(e); }
}
