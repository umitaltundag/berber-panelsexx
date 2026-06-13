import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, bad, notFound, serverError } from '@/lib/api-response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.giftCard.findUnique({ where: { id: Number(id) } });
    if (!existing) return notFound();
    if (body.balance !== undefined && body.balance < 0) return bad('Bakiye negatif olamaz');
    const giftCard = await prisma.giftCard.update({ where: { id: Number(id) }, data: body });
    return ok(giftCard);
  } catch (e) { return serverError(e); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await prisma.giftCard.findUnique({ where: { id: Number(id) } });
    if (!existing) return notFound();
    await prisma.giftCard.delete({ where: { id: Number(id) } });
    return ok({ deleted: true });
  } catch (e) { return serverError(e); }
}
