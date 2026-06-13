import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, created, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const items = await prisma.referral.findMany({
      include: { giver: true, receiver: true },
      orderBy: { createdAt: 'desc' },
    });
    return ok(items);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.giverId || !body.code || !body.discount) {
      return bad('Veren müşteri, kod ve indirim gerekli');
    }
    const item = await prisma.referral.create({
      data: body,
      include: { giver: true, receiver: true },
    });
    return created(item);
  } catch (e) { return serverError(e); }
}
