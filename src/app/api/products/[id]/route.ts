import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, notFound, serverError } from '@/lib/api-response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!existing) return notFound();
    const product = await prisma.product.update({ where: { id: Number(id) }, data: body });
    return ok(product);
  } catch (e) { return serverError(e); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!existing) return notFound();
    await prisma.product.delete({ where: { id: Number(id) } });
    return ok({ deleted: true });
  } catch (e) { return serverError(e); }
}
