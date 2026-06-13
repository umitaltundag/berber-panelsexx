import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, bad, serverError, notFound } from '@/lib/api-response';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const branch = await prisma.branch.findUnique({ where: { id: Number(id) } });
    if (!branch) return notFound('Şube bulunamadı');
    return ok(branch);
  } catch (e) { return serverError(e); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const branch = await prisma.branch.update({ where: { id: Number(id) }, data: body });
    return ok(branch);
  } catch (e: any) {
    if (e?.code === 'P2025') return notFound('Şube bulunamadı');
    return serverError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.branch.delete({ where: { id: Number(id) } });
    return ok({ deleted: true });
  } catch (e: any) {
    if (e?.code === 'P2025') return notFound('Şube bulunamadı');
    return serverError(e);
  }
}
