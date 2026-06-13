import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const items = await prisma.recurringAppointment.findMany({
      include: { customer: true, staff: true, service: true },
      orderBy: { createdAt: 'desc' },
    });
    return ok(items);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerId || !body.staffId || !body.serviceId || !body.frequency || !body.startDate || !body.time) {
      return bad('Tüm alanlar gerekli');
    }
    const item = await prisma.recurringAppointment.create({
      data: body,
      include: { customer: true, staff: true, service: true },
    });
    return created(item);
  } catch (e) { return serverError(e); }
}
