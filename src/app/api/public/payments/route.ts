import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, bad, serverError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, amount, method, customerId } = await req.json();
    if (!appointmentId || !amount || !method) return bad('Randevu, tutar ve ödeme yöntemi gerekli');

    const appointment = await prisma.appointment.findUnique({ where: { id: Number(appointmentId) } });
    if (!appointment) return bad('Randevu bulunamadı');

    const payment = await prisma.payment.create({
      data: {
        amount: Number(amount),
        method,
        status: 'Ödendi',
        date: new Date().toLocaleDateString('tr-TR'),
        customerId: Number(customerId || appointment.customerId),
        staffId: appointment.staffId,
        appointmentId: appointment.id,
      },
    });

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'Onaylandı' },
    });

    return ok({ payment, message: 'Ödeme başarıyla alındı', transactionId: `IYZ-${Date.now()}` });
  } catch (e) { return serverError(e); }
}
