import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, bad, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return ok(map);
  } catch (e) { return serverError(e); }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.key || body.value === undefined) return bad('Anahtar ve değer gerekli');
    const setting = await prisma.setting.upsert({
      where: { key: body.key },
      update: { value: String(body.value) },
      create: { key: body.key, value: String(body.value) },
    });
    return ok(setting);
  } catch (e) { return serverError(e); }
}
