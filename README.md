# BerberPanel

Profesyonel berber dükkanı yönetim sistemi. Next.js 16 + Prisma 7 + Turso (SQLite).

## Özellikler

- Online randevu sistemi
- Müşteri portalı
- Yönetim paneli (randevu, personel, hizmet, müşteri, ödeme, stok)
- Promo kodu ve indirim yönetimi
- Gelir-gider muhasebe raporları
- Stok takibi, personel komisyon, sadakat programı
- CSV dışa aktarma, PWA

## Yerel Geliştirme

```bash
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Site: http://localhost:3000

## Kullanıcı Bilgileri

| Rol | Giriş | Şifre |
|-----|-------|-------|
| Admin | admin | admin123 |
| Müşteri | mehmet@email.com | customer123 |

## Turso + Vercel Deploy

### 1. Repoyu GitHub'a pushla

```bash
git init
git add -A
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/berber-panel.git
git push -u origin main
```

### 2. Schema'yı Turso'ya gönder

```bash
# Turso CLI kur
npm install -g turso

# Giriş yap
turso auth login

# Veritabanına bağlan ve şemayı uygula
turso db shell berber-panel < prisma/schema.sql
```

Eğer `schema.sql` yoksa, `prisma db push` ile çıktıyı al:

```bash
npx prisma db push --accept-data-loss > schema.sql
```

Veya manuel olarak Turso shell'de çalıştır:

```bash
turso db shell berber-panel
```

ve `prisma/schema.prisma`'daki CREATE TABLE komutlarını elle yapıştır.

### 3. Vercel'e Deploy

[vercel.com](https://vercel.com) → New Project → GitHub repo'yu seç

**Build Komutu:**
```
npx prisma generate && npm run build
```

**Environment Variables (Vercel'e ekle):**
- `DATABASE_URL` = `libsql://berber-umtaltndg.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...`
- `JWT_SECRET` = rastgele uzun bir değer

## Build

```bash
npm run build
```
