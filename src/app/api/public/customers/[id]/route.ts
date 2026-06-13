import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, bad, notFound, serverError } from '@/lib/api-response';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const customerId = Number(id);
    if (!customerId) return bad('Geçersiz müşteri ID');

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        appointments: {
          include: {
            staff: { select: { name: true } },
            service: { select: { name: true, price: true, duration: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        reviews: {
          include: {
            staff: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        loyaltyTier: true,
        giftCardsSent: true,
        giftCardsUsed: true,
        referralsGiven: true,
        referralsUsed: true,
        waitingList: true,
        payments: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) return notFound('Müşteri bulunamadı');

    const { password, ...safe } = customer;
    return ok(safe);
  } catch (e) { return serverError(e); }
}
