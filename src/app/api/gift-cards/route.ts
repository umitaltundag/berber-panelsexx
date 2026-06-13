import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const giftCards = await prisma.giftCard.findMany({ orderBy: { id: 'asc' } });
    return ok(giftCards);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.code || !body.amount) return bad('Kod ve tutar gerekli');
    if (!body.senderId) return bad('Gönderen müşteri gerekli');
    const giftCard = await prisma.giftCard.create({ data: { ...body, balance: body.amount } });
    return created(giftCard);
  } catch (e) { return serverError(e); }
}
