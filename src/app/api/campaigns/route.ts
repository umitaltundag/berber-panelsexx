import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({ orderBy: { id: 'asc' } });
    return ok(campaigns);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title) return bad('Başlık gerekli');
    const campaign = await prisma.campaign.create({ data: body });
    return created(campaign);
  } catch (e) { return serverError(e); }
}
