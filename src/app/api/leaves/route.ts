import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const items = await prisma.leave.findMany({
      include: { staff: true },
      orderBy: { createdAt: 'desc' },
    });
    return ok(items);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.staffId || !body.startDate || !body.endDate) {
      return bad('Personel, başlangıç ve bitiş tarihi gerekli');
    }
    const item = await prisma.leave.create({
      data: body,
      include: { staff: true },
    });
    return created(item);
  } catch (e) { return serverError(e); }
}
