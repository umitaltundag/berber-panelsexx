import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, bad, serverError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const appointmentId = req.nextUrl.searchParams.get('appointmentId');
    if (!appointmentId) return bad('Randevu ID gerekli');

    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(appointmentId) },
      include: { customer: true, staff: true, service: true, payment: true },
    });
    if (!appointment) return bad('Randevu bulunamadı');

    const invoiceNumber = `INV-${appointment.id.toString().padStart(6, '0')}-${new Date().getFullYear()}`;

    return ok({
      invoiceNumber,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      customer: { name: appointment.customer.name, phone: appointment.customer.phone, email: appointment.customer.email },
      staff: { name: appointment.staff.name, title: appointment.staff.title },
      service: { name: appointment.service.name, price: appointment.service.price, duration: appointment.service.duration },
      payment: appointment.payment ? { amount: appointment.payment.amount, method: appointment.payment.method, status: appointment.payment.status } : null,
      couponCode: appointment.couponCode,
      discountAmount: appointment.discountAmount,
      note: appointment.note,
    });
  } catch (e) { return serverError(e); }
}
