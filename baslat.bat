@echo off
title BerberPanel - Satin Almaya Hazir
color 0B

echo.
echo  ============================================
echo      BERBERPANEL - PROFESYONEL YONETIM SISTEMI
echo  ============================================
echo.
echo  [SITE]       http://localhost:3000
echo  [ADMIN]      http://localhost:3000/login
echo  [RANDEVU]    http://localhost:3000/randevu-al
echo  [MUSTERI]    http://localhost:3000/musteri-giris
echo.
echo  ------------ YONETICI HESAPLARI ------------
echo  Admin:       admin / admin123
echo  Musteri:     mehmet@email.com / customer123
echo.
echo  ------------ OZELLIKLER --------------------
echo  + Online randevu sistemi
echo  + Musteri portali (gecmis, yorum, puan)
echo  + Promo kodu ve indirim yonetimi
echo  + Stok takibi
echo  + Personel ve komisyon yonetimi
echo  + Gelir-gider muhasebe raporlari
echo  + CSV veri disa aktarma
echo  + PWA mobil uyumlu
echo  + Online odeme (mock Iyzico)
echo  + Bildirim gonderimi
echo  + Sadakat programi
echo  ============================================
echo.

npx next dev

pause
