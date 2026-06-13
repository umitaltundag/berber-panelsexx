import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, bad, serverError, notFound } from '@/lib/api-response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const staff = await prisma.staff.update({ where: { id: Number(id) }, data: body });
    return ok(staff);
  } catch (e: any) {
    if (e?.code === 'P2025') return notFound('Personel bulunamadı');
    return serverError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.staff.delete({ where: { id: Number(id) } });
    return ok({ deleted: true });
  } catch (e: any) {
    if (e?.code === 'P2025') return notFound('Personel bulunamadı');
    return serverError(e);
  }
}
