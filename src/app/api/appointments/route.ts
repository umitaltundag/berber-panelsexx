import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { customer: true, staff: true, service: true },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });
    return ok(appointments);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerId || !body.staffId || !body.serviceId || !body.date || !body.time) {
      return bad('Tüm alanlar gerekli');
    }
    const appointment = await prisma.appointment.create({
      data: body,
      include: { customer: true, staff: true, service: true },
    });
    await prisma.customer.update({
      where: { id: body.customerId },
      data: { totalVisits: { increment: 1 }, lastVisit: body.date, points: { increment: 10 } },
    });
    return created(appointment);
  } catch (e) { return serverError(e); }
}
