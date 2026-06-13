import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, bad, serverError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code');
    if (!code) return bad('Kod gerekli');

    const card = await prisma.giftCard.findUnique({ where: { code } });
    if (!card) return bad('Geçersiz hediye kartı kodu');
    if (card.status !== 'Aktif') return bad('Bu hediye kartı artık geçerli değil');

    return ok({ code: card.code, amount: card.amount, balance: card.balance, message: card.message, expiresAt: card.expiresAt });
  } catch (e) { return serverError(e); }
}
