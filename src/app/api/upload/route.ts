import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { ok, bad, serverError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return bad('Dosya gerekli');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');

    try { await mkdir(uploadDir, { recursive: true }); } catch {}

    await writeFile(join(uploadDir, filename), buffer);
    return ok({ url: `/uploads/${filename}` });
  } catch (e) { return serverError(e); }
}
