import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { ok, created, bad, unauthorized, serverError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const { action, name, phone, email, password } = await req.json();

    if (action === 'login') {
      if ((!email && !phone) || !password) return bad('E-posta/telefon ve şifre gerekli');

      const customer = email
        ? await prisma.customer.findFirst({ where: { email } })
        : phone
          ? await prisma.customer.findFirst({ where: { phone } })
          : null;

      if (!customer || !customer.password) return unauthorized('E-posta/telefon veya şifre hatalı');

      const valid = await verifyPassword(password, customer.password);
      if (!valid) return unauthorized('E-posta/telefon veya şifre hatalı');

      return ok({
        id: customer.id, name: customer.name, phone: customer.phone,
        email: customer.email, points: customer.points, segment: customer.segment,
      });
    }

    if (!name || !phone || !email || !password) return bad('Tüm alanlar gerekli');
    if (password.length < 6) return bad('Şifre en az 6 karakter olmalıdır');

    const existingEmail = await prisma.customer.findFirst({ where: { email } });
    if (existingEmail) return bad('Bu e-posta zaten kayıtlı');

    const existingPhone = phone
      ? await prisma.customer.findFirst({ where: { phone } })
      : null;
    if (existingPhone) return bad('Bu telefon numarası zaten kayıtlı');

    const hashed = await hashPassword(password);

    const customer = await prisma.customer.create({
      data: { name, phone, email, password: hashed },
    });

    return created({ id: customer.id, name: customer.name, phone: customer.phone, email: customer.email });
  } catch (e) { return serverError(e); }
}
