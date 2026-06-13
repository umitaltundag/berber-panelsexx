import { prisma } from '@/lib/prisma';
import { ok, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      where: { isActive: true },
      select: { id: true, name: true, title: true, color: true },
      orderBy: { id: 'asc' },
    });
    return ok(staff);
  } catch (e) { return serverError(e); }
}
