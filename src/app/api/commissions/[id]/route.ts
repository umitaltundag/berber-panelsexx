import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, serverError, notFound } from '@/lib/api-response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const item = await prisma.commission.update({
      where: { id: Number(id) },
      data: body,
      include: { staff: true, service: true },
    });
    return ok(item);
  } catch (e: any) {
    if (e?.code === 'P2025') return notFound('Komisyon bulunamadı');
    return serverError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.commission.delete({ where: { id: Number(id) } });
    return ok({ deleted: true });
  } catch (e: any) {
    if (e?.code === 'P2025') return notFound('Komisyon bulunamadı');
    return serverError(e);
  }
}
