import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, serverError, notFound } from '@/lib/api-response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const campaign = await prisma.campaign.update({ where: { id: Number(id) }, data: body });
    return ok(campaign);
  } catch (e: any) {
    if (e?.code === 'P2025') return notFound('Kampanya bulunamadı');
    return serverError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.campaign.delete({ where: { id: Number(id) } });
    return ok({ deleted: true });
  } catch (e: any) {
    if (e?.code === 'P2025') return notFound('Kampanya bulunamadı');
    return serverError(e);
  }
}
