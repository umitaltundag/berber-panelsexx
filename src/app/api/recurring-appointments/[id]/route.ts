import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, serverError, notFound } from '@/lib/api-response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const item = await prisma.recurringAppointment.update({
      where: { id: Number(id) },
      data: body,
      include: { customer: true, staff: true, service: true },
    });
    return ok(item);
  } catch (e: any) {
    if (e?.code === 'P2025') return notFound('Tekrarlanan randevu bulunamadı');
    return serverError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.recurringAppointment.delete({ where: { id: Number(id) } });
    return ok({ deleted: true });
  } catch (e: any) {
    if (e?.code === 'P2025') return notFound('Tekrarlanan randevu bulunamadı');
    return serverError(e);
  }
}
