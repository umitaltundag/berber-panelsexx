import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({ orderBy: { id: 'asc' } });
    return ok(customers);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) return bad('Ad gerekli');
    const customer = await prisma.customer.create({ data: body });
    return created(customer);
  } catch (e) { return serverError(e); }
}
