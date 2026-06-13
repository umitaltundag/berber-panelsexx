import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const services = await prisma.service.findMany({ orderBy: { id: 'asc' } });
    return ok(services);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.price) return bad('Ad ve fiyat gerekli');
    const service = await prisma.service.create({ data: body });
    return created(service);
  } catch (e) { return serverError(e); }
}
