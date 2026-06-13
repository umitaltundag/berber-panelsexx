import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({ orderBy: { id: 'asc' } });
    return ok(staff);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.title) return bad('Ad ve unvan gerekli');
    const staff = await prisma.staff.create({ data: body });
    return created(staff);
  } catch (e) { return serverError(e); }
}
