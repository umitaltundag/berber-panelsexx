import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { ok, bad, serverError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, staffId, date, time, customerName, customerPhone, notes, couponCode, password } = body;

    if (!serviceId || !staffId || !date || !time || !customerName || !customerPhone) {
      return bad('Lütfen tüm zorunlu alanları doldurun');
    }

    const service = await prisma.service.findUnique({ where: { id: Number(serviceId) } });
    if (!service) return bad('Hizmet bulunamadı');

    const staff = await prisma.staff.findUnique({ where: { id: Number(staffId) } });
    if (!staff) return bad('Personel bulunamadı');

    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (!coupon) return bad('Geçersiz promo kodu');
      if (coupon.status !== 'Aktif') return bad('Bu promo kodu artık geçerli değil');
      if (coupon.usedCount >= coupon.usageLimit) return bad('Bu promo kodunun kullanım limiti doldu');

      const today = new Date();
      const [d, m, y] = coupon.expiryDate.split('.');
      const expiry = new Date(Number(y), Number(m) - 1, Number(d));
      if (today > expiry) return bad('Bu promo kodunun süresi dolmuş');

      const numericDiscount = parseInt(coupon.discount.replace(/[^0-9]/g, ''));
      if (coupon.discount.includes('%')) {
        discountAmount = Math.round(service.price * numericDiscount / 100);
      } else {
        discountAmount = numericDiscount;
      }

      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });

      appliedCoupon = { code: coupon.code, discount: coupon.discount };
    }

    let customer = await prisma.customer.findFirst({ where: { phone: customerPhone } });

    if (customer) {
      const updateData: any = { name: customerName, totalVisits: { increment: 0 } };
      if (password && !customer.password) {
        updateData.password = await hashPassword(password);
      }
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: updateData,
      });
    } else {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone: customerPhone,
          segment: 'Yeni',
          points: 0,
          password: password ? await hashPassword(password) : null,
        },
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        date,
        time,
        status: 'Beklemede',
        note: notes || null,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        discountAmount,
        customerId: customer.id,
        staffId: Number(staffId),
        serviceId: Number(serviceId),
      },
      include: {
        customer: { select: { name: true, phone: true } },
        staff: { select: { name: true } },
        service: { select: { name: true, price: true, duration: true } },
      },
    });

    return ok({
      ...appointment,
      discountAmount,
      couponCode: appliedCoupon?.code || null,
      finalPrice: service.price - discountAmount,
    });
  } catch (e) { return serverError(e); }
}
