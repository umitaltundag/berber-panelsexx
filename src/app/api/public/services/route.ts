import { prisma } from '@/lib/prisma';
import { ok, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      select: { id: true, name: true, category: true, price: true, duration: true },
      orderBy: { id: 'asc' },
    });
    return ok(services);
  } catch (e) { return serverError(e); }
}
