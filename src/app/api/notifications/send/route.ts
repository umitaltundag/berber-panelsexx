import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, bad, serverError } from '@/lib/api-response';

const iconMap: Record<string, string> = {
  whatsapp: 'whatsapp',
  sms: 'sms',
  email: 'email',
};

export async function POST(req: NextRequest) {
  try {
    const { type, to, message, appointmentId } = await req.json();
    if (!type || !to || !message) return bad('Tür, alıcı ve mesaj gerekli');
    if (!['whatsapp', 'sms', 'email'].includes(type)) return bad('Geçersiz bildirim türü');

    console.log(`[Bildirim Gönderildi] Tür: ${type} -> ${to}: ${message}`);

    const notification = await prisma.notification.create({
      data: {
        type,
        icon: iconMap[type],
        iconBg: type === 'whatsapp' ? '#22c55e' : type === 'sms' ? '#3b82f6' : '#ef4444',
        iconColor: '#ffffff',
        title: type === 'whatsapp' ? 'WhatsApp Bildirimi' : type === 'sms' ? 'SMS Bildirimi' : 'E-posta Bildirimi',
        message: `[${to}] ${message}`,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      },
    });

    if (appointmentId) {
      await prisma.appointment.update({
        where: { id: Number(appointmentId) },
        data: { reminderSent: true },
      });
    }

    return ok(notification);
  } catch (e) { return serverError(e); }
}
