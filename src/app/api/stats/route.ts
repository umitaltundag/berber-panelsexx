import { prisma } from '@/lib/prisma';
import { ok, serverError } from '@/lib/api-response';

function todayStr(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

function isSameWeek(dateStr: string): boolean {
  const parts = dateStr.split('.');
  const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return diff >= 0 && diff < 7 * 24 * 60 * 60 * 1000;
}

function isThisMonth(dateStr: string): boolean {
  const parts = dateStr.split('.');
  const now = new Date();
  return Number(parts[1]) === now.getMonth() + 1 && Number(parts[2]) === now.getFullYear();
}

export async function GET() {
  try {
    const today = todayStr();
    const [todayAppointments, totalCustomers, totalStaff, payments, appointments] = await Promise.all([
      prisma.appointment.count({ where: { date: today } }),
      prisma.customer.count({ where: { isActive: true } }),
      prisma.staff.count({ where: { isActive: true } }),
      prisma.payment.findMany(),
      prisma.appointment.findMany(),
    ]);

    const weeklyAppointments = appointments.filter(a => isSameWeek(a.date)).length;
    const monthlyRevenue = payments.filter(p => isThisMonth(p.date)).reduce((sum, p) => sum + p.amount, 0);
    const completedCount = appointments.filter(a => a.status === 'Tamamlandı').length;
    const cancelledCount = appointments.filter(a => a.status === 'İptal').length;
    const pendingCount = appointments.filter(a => a.status === 'Beklemede' || a.status === 'Onaylandı').length;
    const monthlyAppointments = appointments.filter(a => isThisMonth(a.date)).length;

    return ok({
      todayAppointments,
      weeklyAppointments,
      monthlyRevenue,
      totalCustomers,
      totalStaff,
      completedCount,
      cancelledCount,
      pendingCount,
      totalAppointments: appointments.length,
      monthlyAppointments,
    });
  } catch (e) { return serverError(e); }
}
