import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
    return ok(products);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) return bad('Ürün adı gerekli');
    const product = await prisma.product.create({ data: body });
    return created(product);
  } catch (e) { return serverError(e); }
}
