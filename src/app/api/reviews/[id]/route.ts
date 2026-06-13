import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, bad, notFound, serverError } from '@/lib/api-response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (body.rating !== undefined && (body.rating < 1 || body.rating > 5)) return bad('Geçerli bir puan girin (1-5)');
    const existing = await prisma.review.findUnique({ where: { id: Number(id) } });
    if (!existing) return notFound();
    const review = await prisma.review.update({ where: { id: Number(id) }, data: body });
    return ok(review);
  } catch (e) { return serverError(e); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await prisma.review.findUnique({ where: { id: Number(id) } });
    if (!existing) return notFound();
    await prisma.review.delete({ where: { id: Number(id) } });
    return ok({ deleted: true });
  } catch (e) { return serverError(e); }
}
