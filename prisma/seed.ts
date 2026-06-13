import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';

const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('admin123', 12);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', email: 'admin@berber.com', password, name: 'Ahmet Demir', role: 'admin' },
  });

  // Clear all data in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.recurringAppointment.deleteMany();
  await prisma.waitingList.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.giftCard.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.leave.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.service.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.product.deleteMany();
  await prisma.loyaltyTier.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.setting.deleteMany();

  // Reset auto-increment counters
  const tables = ['Branch','Staff','Service','LoyaltyTier','Customer','Product','GiftCard','Appointment','Payment','Review','Campaign','Coupon','Referral','Notification','Setting','Leave','Commission'];
  for (const t of tables) {
    try { await prisma.$executeRawUnsafe(`DELETE FROM sqlite_sequence WHERE name='${t}'`); } catch {}
  }

  // Branch
  await prisma.branch.create({ data: { name: 'Merkez Şube', address: 'İstiklal Cad. No:42, Beyoğlu/İstanbul', phone: '+90 212 555 00 00', email: 'merkez@berberpanel.com', workingDays: 'Pzt-Cmt', startTime: '09:00', endTime: '19:00' } });

  // Staff
  await prisma.staff.createMany({ data: [
    { name: 'Ahmet Demir', title: 'Usta Berber', phone: '+90 532 111 22 33', email: 'ahmet@berber.com', color: '#4f46e5', workingDays: 'Pzt-Cmt', startTime: '09:00', endTime: '19:00', commissionRate: 40 },
    { name: 'Mehmet Yıldız', title: 'Kıdemli Berber', phone: '+90 533 222 33 44', email: 'mehmet@berber.com', color: '#059669', workingDays: 'Pzt-Cum', startTime: '10:00', endTime: '20:00', commissionRate: 35 },
    { name: 'Elif Korkmaz', title: 'Usta Kuaför', phone: '+90 534 333 44 55', email: 'elif@berber.com', color: '#d97706', workingDays: 'Sal-Cmt', startTime: '09:00', endTime: '18:00', commissionRate: 40 },
    { name: 'Can Aydın', title: 'Çırak', phone: '+90 535 444 55 66', email: 'can@berber.com', color: '#dc2626', workingDays: 'Pzt-Cmt', startTime: '08:00', endTime: '17:00', commissionRate: 15 },
    { name: 'Buse Yener', title: 'Kıdemli Kuaför', phone: '+90 536 555 66 77', email: 'buse@berber.com', color: '#7c3aed', workingDays: 'Pzt-Cum', startTime: '10:00', endTime: '19:00', commissionRate: 35 },
    { name: 'Kemal Aslan', title: 'Usta Berber', phone: '+90 537 666 77 88', email: 'kemal@berber.com', color: '#06b6d4', workingDays: 'Çar-Paz', startTime: '09:00', endTime: '19:00', commissionRate: 40 },
  ] });

  // Services
  await prisma.service.createMany({ data: [
    { name: 'Erkek Saç Kesimi', category: 'Saç Kesimi', price: 150, duration: 30 },
    { name: 'Çocuk Saç Kesimi', category: 'Saç Kesimi', price: 100, duration: 25 },
    { name: 'Sakal Kesimi & Düzeltme', category: 'Sakal', price: 80, duration: 20 },
    { name: 'Saç Boyama (Kısa)', category: 'Boya', price: 350, duration: 60 },
    { name: 'Saç Boyama (Uzun)', category: 'Boya', price: 550, duration: 90 },
    { name: 'Saç Derisi Bakımı', category: 'Cilt Bakım', price: 200, duration: 40 },
    { name: 'Fön Çekimi', category: 'Saç Kesimi', price: 120, duration: 25 },
    { name: 'Saç + Sakal + Maske Paketi', category: 'Paket', price: 320, duration: 60 },
  ] });

  // Loyalty Tiers
  await prisma.loyaltyTier.createMany({ data: [
    { name: 'Standart', minPoints: 0, discount: 0, color: '#94a3b8' },
    { name: 'Gümüş', minPoints: 500, discount: 5, color: '#94a3b8' },
    { name: 'Altın', minPoints: 1500, discount: 10, color: '#f59e0b' },
    { name: 'Platin', minPoints: 3000, discount: 15, color: '#8b5cf6' },
  ] });

  // Customers (with password: customer123)
  const customerPassword = await bcrypt.hash('customer123', 12);
  await prisma.customer.createMany({ data: [
    { name: 'Mehmet Yılmaz', phone: '+90 532 111 22 33', email: 'mehmet@email.com', password: customerPassword, segment: 'Sadık', points: 850, totalVisits: 24, lastVisit: '13.06.2026', notifySms: true, notifyWhatsapp: true },
    { name: 'Ali Kaya', phone: '+90 533 222 33 44', email: 'ali@email.com', password: customerPassword, segment: 'Aktif', points: 320, totalVisits: 12, lastVisit: '10.06.2026', notifySms: true },
    { name: 'Can Öz', phone: '+90 535 333 44 55', email: 'can@email.com', password: customerPassword, segment: 'Sadık', points: 1240, totalVisits: 36, lastVisit: '13.06.2026', notifyWhatsapp: true },
    { name: 'Zeynep Ak', phone: '+90 536 444 55 66', email: 'zeynep@email.com', password: customerPassword, segment: 'Aktif', points: 180, totalVisits: 8, lastVisit: '13.06.2026', notifySms: true },
    { name: 'Burak Şen', phone: '+90 537 555 66 77', email: 'burak@email.com', password: customerPassword, segment: 'Yeni', points: 45, totalVisits: 3, lastVisit: '05.06.2026' },
    { name: 'Demet Yalçın', phone: '+90 538 666 77 88', email: 'demet@email.com', password: customerPassword, segment: 'Sadık', points: 610, totalVisits: 18, lastVisit: '08.06.2026', notifySms: true, notifyEmail: true },
  ] });

  // Products
  await prisma.product.createMany({ data: [
    { name: 'Saç Jölesi', category: 'Şekillendirici', stock: 12, minStock: 5, price: 45, unit: 'adet' },
    { name: 'Şampuan 500ml', category: 'Temizlik', stock: 8, minStock: 5, price: 80, unit: 'adet' },
    { name: 'Saç Kremi', category: 'Bakım', stock: 6, minStock: 5, price: 65, unit: 'adet' },
    { name: 'Saç Boyası (Siyah)', category: 'Boya', stock: 3, minStock: 5, price: 120, unit: 'adet' },
    { name: 'Saç Spreyi', category: 'Şekillendirici', stock: 2, minStock: 5, price: 55, unit: 'adet' },
    { name: 'Jilet (50\'li)', category: 'Aksesuar', stock: 20, minStock: 10, price: 35, unit: 'paket' },
  ] });

  // Look up IDs dynamically
  const [s1, s2, s3, s4, s5, s6] = await Promise.all([
    prisma.staff.findFirst({ where: { name: 'Ahmet Demir' } }),
    prisma.staff.findFirst({ where: { name: 'Mehmet Yıldız' } }),
    prisma.staff.findFirst({ where: { name: 'Elif Korkmaz' } }),
    prisma.staff.findFirst({ where: { name: 'Can Aydın' } }),
    prisma.staff.findFirst({ where: { name: 'Buse Yener' } }),
    prisma.staff.findFirst({ where: { name: 'Kemal Aslan' } }),
  ]);
  const [sv1, sv2, sv3, sv4, sv5, sv6, sv7, sv8] = await Promise.all([
    prisma.service.findFirst({ where: { name: 'Erkek Saç Kesimi' } }),
    prisma.service.findFirst({ where: { name: 'Çocuk Saç Kesimi' } }),
    prisma.service.findFirst({ where: { name: 'Sakal Kesimi & Düzeltme' } }),
    prisma.service.findFirst({ where: { name: 'Saç Boyama (Kısa)' } }),
    prisma.service.findFirst({ where: { name: 'Saç Boyama (Uzun)' } }),
    prisma.service.findFirst({ where: { name: 'Saç Derisi Bakımı' } }),
    prisma.service.findFirst({ where: { name: 'Fön Çekimi' } }),
    prisma.service.findFirst({ where: { name: 'Saç + Sakal + Maske Paketi' } }),
  ]);
  const [c1, c2, c3, c4, c5, c6] = await Promise.all([
    prisma.customer.findFirst({ where: { phone: '+90 532 111 22 33' } }),
    prisma.customer.findFirst({ where: { phone: '+90 533 222 33 44' } }),
    prisma.customer.findFirst({ where: { phone: '+90 535 333 44 55' } }),
    prisma.customer.findFirst({ where: { phone: '+90 536 444 55 66' } }),
    prisma.customer.findFirst({ where: { phone: '+90 537 555 66 77' } }),
    prisma.customer.findFirst({ where: { phone: '+90 538 666 77 88' } }),
  ]);

  if (!s1 || !s2 || !s3 || !s4 || !s5 || !s6 || !sv1 || !sv2 || !sv3 || !sv4 || !sv5 || !sv6 || !sv7 || !sv8 || !c1 || !c2 || !c3 || !c4 || !c5 || !c6) {
    console.error('Failed to look up seed IDs');
    process.exit(1);
  }

  // Appointments
  await prisma.appointment.createMany({ data: [
    { date: '13.06.2026', time: '09:00', status: 'Onaylandı', customerId: c1.id, staffId: s1.id, serviceId: sv1.id },
    { date: '13.06.2026', time: '10:00', status: 'Beklemede', customerId: c2.id, staffId: s2.id, serviceId: sv3.id },
    { date: '13.06.2026', time: '10:30', status: 'Onaylandı', customerId: c3.id, staffId: s1.id, serviceId: sv4.id },
    { date: '13.06.2026', time: '11:30', status: 'Devam Ediyor', customerId: c4.id, staffId: s3.id, serviceId: sv6.id },
    { date: '13.06.2026', time: '13:00', status: 'Onaylandı', customerId: c5.id, staffId: s4.id, serviceId: sv1.id },
    { date: '13.06.2026', time: '14:00', status: 'İptal', customerId: c6.id, staffId: s3.id, serviceId: sv7.id },
  ] });

  // Get appointment IDs
  const [a1, a2, a3, a4, a5, a6] = await Promise.all([
    prisma.appointment.findFirst({ where: { time: '09:00', customerId: c1.id } }),
    prisma.appointment.findFirst({ where: { time: '10:00', customerId: c2.id } }),
    prisma.appointment.findFirst({ where: { time: '10:30', customerId: c3.id } }),
    prisma.appointment.findFirst({ where: { time: '11:30', customerId: c4.id } }),
    prisma.appointment.findFirst({ where: { time: '13:00', customerId: c5.id } }),
    prisma.appointment.findFirst({ where: { time: '14:00', customerId: c6.id } }),
  ]);

  // Payments
  if (a1 && a2 && a3 && a4 && a5 && a6) {
    await prisma.payment.createMany({ data: [
      { amount: 150, method: 'Kredi Kartı', status: 'Ödendi', date: '13.06.2026', customerId: c1.id, staffId: s1.id, appointmentId: a1.id },
      { amount: 200, method: 'Nakit', status: 'Ödendi', date: '13.06.2026', customerId: c3.id, staffId: s1.id, appointmentId: a3.id },
      { amount: 350, method: 'Kredi Kartı', status: 'Bekliyor', date: '13.06.2026', customerId: c4.id, staffId: s3.id, appointmentId: a4.id },
      { amount: 80, method: 'Nakit', status: 'Ödendi', date: '12.06.2026', customerId: c2.id, staffId: s2.id, appointmentId: a2.id },
      { amount: 120, method: 'Havale', status: 'Ödendi', date: '12.06.2026', customerId: c6.id, staffId: s3.id, appointmentId: a6.id },
    ] });
  }

  // Reviews
  await prisma.review.createMany({ data: [
    { rating: 5, comment: 'Harika bir hizmet! Ahmet usta çok ilgiliydi.', status: 'Onaylandı', customerId: c1.id, staffId: s1.id },
    { rating: 4, comment: 'Güzel kesim, memnun kaldım.', status: 'Onaylandı', customerId: c3.id, staffId: s1.id },
    { rating: 5, comment: 'Elif hanım muhteşem bir renk yakaladı, çok mutluyum!', status: 'Onaylandı', customerId: c4.id, staffId: s3.id },
    { rating: 3, comment: 'Ortalama bir hizmet.', status: 'Beklemede', customerId: c2.id, staffId: s2.id },
    { rating: 5, comment: 'Her zaman ki gibi mükemmel!', status: 'Onaylandı', customerId: c5.id, staffId: s4.id },
  ] });

  // Gift Cards
  await prisma.giftCard.createMany({ data: [
    { code: 'HEDİYE-001', amount: 200, balance: 200, message: 'Doğum günün kutlu olsun!', status: 'Aktif', expiresAt: '31.12.2026', senderId: c1.id, receiverId: c3.id },
    { code: 'HEDİYE-002', amount: 100, balance: 50, message: 'Yeni yıl hediyesi', status: 'Aktif', expiresAt: '31.12.2026', senderId: c5.id, receiverId: c4.id },
    { code: 'HEDİYE-003', amount: 300, balance: 0, message: '', status: 'Kullanıldı', expiresAt: '01.06.2026', senderId: c3.id, receiverId: c1.id },
  ] });

  // Campaigns
  await prisma.campaign.createMany({ data: [
    { title: 'Yaz İndirimi', description: 'Tüm hizmetlerde %15 indirim', discount: '%15', startDate: '01.06.2026', endDate: '31.08.2026', audience: 'Tüm müşterilere açık', status: 'Aktif', usedCount: 124 },
    { title: 'Sadakat Bonusu', description: 'Her 5. randevuda %20 indirim', discount: '%20', startDate: '01.01.2026', endDate: '31.12.2026', audience: 'Sadık müşterilere özel', status: 'Aktif', usedCount: 89 },
    { title: 'Öğrenciye Özel', description: 'Saç kesiminde 99 ₺', discount: '99 ₺', startDate: '15.06.2026', endDate: '15.09.2026', audience: 'Öğrencilere özel', status: 'Yakında', usedCount: 0 },
    { title: 'Paket Kampanyası', description: 'Saç + Sakal + Maske = 320 ₺', discount: '80 ₺', startDate: '01.06.2026', endDate: '30.06.2026', audience: 'Tüm müşterilere açık', status: 'Aktif', usedCount: 56 },
  ] });

  // Coupons
  await prisma.coupon.createMany({ data: [
    { code: 'YAZ15', discount: '%15', type: 'Çok Kullanımlık', usageLimit: 500, usedCount: 124, expiryDate: '31.08.2026', status: 'Aktif' },
    { code: 'HOŞGELDİN', discount: '50 ₺', type: 'Tek Kullanımlık', usageLimit: 100, usedCount: 45, expiryDate: '31.12.2026', status: 'Aktif' },
    { code: 'DOĞUMGÜNÜ', discount: '%20', type: 'Tek Kullanımlık', usageLimit: 50, usedCount: 12, expiryDate: '31.12.2026', status: 'Aktif' },
    { code: 'YILBAŞI', discount: '%25', type: 'Çok Kullanımlık', usageLimit: 200, usedCount: 0, expiryDate: '01.01.2027', status: 'Planlandı' },
  ] });

  // Referrals
  await prisma.referral.createMany({ data: [
    { code: 'DAVET-001', discount: '50 ₺', status: 'Aktif', giverId: c1.id },
    { code: 'DAVET-002', discount: '%10', status: 'Kullanıldı', giverId: c3.id, receiverId: c5.id },
    { code: 'DAVET-003', discount: '50 ₺', status: 'Aktif', giverId: c4.id },
  ] });

  // Notifications
  await prisma.notification.createMany({ data: [
    { type: 'randevu', icon: 'fa-calendar-check', iconBg: '#dbeafe', iconColor: '#2563eb', title: 'Mehmet Yılmaz - Randevu hatırlatma', message: '13.06.2026 09:00', time: '2 dakika önce' },
    { type: 'iptal', icon: 'fa-times-circle', iconBg: '#fee2e2', iconColor: '#dc2626', title: 'Ali Kaya - Randevu iptal edildi', message: 'WhatsApp gönderildi', time: '25 dakika önce' },
    { type: 'stok', icon: 'fa-exclamation-triangle', iconBg: '#fef3c7', iconColor: '#d97706', title: 'Stok uyarısı: Saç Spreyi', message: '2 adet kaldı', time: '1 saat önce' },
    { type: 'onay', icon: 'fa-check-circle', iconBg: '#ecfdf5', iconColor: '#16a34a', title: 'Can Öz randevusu onaylandı', message: 'SMS gönderildi', time: '2 saat önce' },
    { type: 'yorum', icon: 'fa-star', iconBg: '#f3e8ff', iconColor: '#9333ea', title: 'Mehmet Yılmaz 5 yıldızlı yorum bıraktı', message: '', time: '3 saat önce' },
    { type: 'dogumgunu', icon: 'fa-gift', iconBg: '#fce7f3', iconColor: '#ec4899', title: 'Doğum Günü: Mehmet Yılmaz', message: 'Hediye kuponu gönderildi', time: '5 saat önce' },
    { type: 'sadakat', icon: 'fa-crown', iconBg: '#fef3c7', iconColor: '#d97706', title: 'Can Öz Platin seviyeye ulaştı!', message: '', time: '1 gün önce' },
  ] });

  // Settings
  await prisma.setting.createMany({ data: [
    { key: 'work_mon_fri_start', value: '09:00' },
    { key: 'work_mon_fri_end', value: '19:00' },
    { key: 'work_sat_start', value: '09:00' },
    { key: 'work_sat_end', value: '18:00' },
    { key: 'work_sun', value: 'Kapalı' },
    { key: 'lang', value: 'tr' },
    { key: 'timezone', value: 'Europe/Istanbul' },
    { key: 'two_factor', value: 'false' },
    { key: 'auto_backup', value: 'true' },
  ] });

  // Leaves
  await prisma.leave.createMany({ data: [
    { staffId: s4.id, startDate: '20.06.2026', endDate: '25.06.2026', reason: 'Yıllık izin', status: 'Onaylandı' },
    { staffId: s3.id, startDate: '15.07.2026', endDate: '16.07.2026', reason: 'Kişisel', status: 'Beklemede' },
  ] });

  // Commissions
  await prisma.commission.createMany({ data: [
    { staffId: s1.id, serviceId: sv1.id, amount: 60, rate: 40, date: '13.06.2026' },
    { staffId: s1.id, serviceId: sv4.id, amount: 140, rate: 40, date: '13.06.2026' },
    { staffId: s2.id, serviceId: sv3.id, amount: 28, rate: 35, date: '13.06.2026' },
  ] });

  console.log('Seed completed successfully with all new models!');
}

main().catch((e) => { console.error(e); process.exit(1); });
