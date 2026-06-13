import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, bad, serverError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code');
    if (!code) return bad('Kod gerekli');

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon) return bad('Geçersiz promo kodu');

    if (coupon.status !== 'Aktif') return bad('Bu promo kodu artık geçerli değil');

    if (coupon.usedCount >= coupon.usageLimit) return bad('Bu promo kodunun kullanım limiti doldu');

    const today = new Date();
    const [d, m, y] = coupon.expiryDate.split('.');
    const expiry = new Date(Number(y), Number(m) - 1, Number(d));
    if (today > expiry) return bad('Bu promo kodunun süresi dolmuş');

    const numericDiscount = parseInt(coupon.discount.replace(/[^0-9]/g, ''));
    const isPercent = coupon.discount.includes('%');

    return ok({
      code: coupon.code,
      discount: coupon.discount,
      isPercent,
      numericDiscount,
      type: coupon.type,
    });
  } catch (e) { return serverError(e); }
}
