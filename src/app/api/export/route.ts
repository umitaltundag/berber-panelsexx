import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bad, serverError } from '@/lib/api-response';

const models: Record<string, string> = {
  appointments: 'appointment',
  customers: 'customer',
  payments: 'payment',
  staff: 'staff',
  services: 'service',
  products: 'product',
  branches: 'branch',
  reviews: 'review',
  coupons: 'coupon',
  campaigns: 'campaign',
  notifications: 'notification',
  commissions: 'commission',
  leaves: 'leave',
};

function toCSV(records: any[]): string {
  if (!records.length) return '';
  const keys = Object.keys(records[0]).filter(k => !['id', 'password', 'avatar'].includes(k));
  const header = keys.join(',');
  const rows = records.map(r =>
    keys.map(k => {
      const v = r[k];
      if (v === null || v === undefined) return '';
      const s = String(v).replace(/"/g, '""');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
    }).join(',')
  );
  return [header, ...rows].join('\n');
}

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get('type');
    if (!type || !models[type]) return bad('Geçersiz export türü');

    const model = (prisma as any)[models[type]];
    const records = await model.findMany({ orderBy: { id: 'asc' } });
    const csv = toCSV(records);
    const filename = `${type}_${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (e) { return serverError(e); }
}
