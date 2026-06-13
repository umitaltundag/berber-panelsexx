import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const tiers = await prisma.loyaltyTier.findMany({ orderBy: { id: 'asc' } });
    return ok(tiers);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) return bad('Ad gerekli');
    const tier = await prisma.loyaltyTier.create({ data: body });
    return created(tier);
  } catch (e) { return serverError(e); }
}
