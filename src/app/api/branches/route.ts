import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({ orderBy: { id: 'asc' } });
    return ok(branches);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) return bad('Şube adı gerekli');
    const branch = await prisma.branch.create({ data: body });
    return created(branch);
  } catch (e) { return serverError(e); }
}
