import { prisma } from '@/lib/prisma';
import { ok, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return ok(logs);
  } catch (e) { return serverError(e); }
}
