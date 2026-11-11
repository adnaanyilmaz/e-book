/**
 * Dilden bağımsız site ayarları: URL, Instagram, e-posta, e-kitap fiyatı ve ödeme linki.
 * Çevrilen metinler (slogan, menü, e-kitap başlığı vb.) src/i18n/ceviriler.ts içindedir.
 * `[DOLDURULACAK]` yazan alanları gerçek bilgilerle değiştir.
 */
export const site = {
  ad: 'Naif Mutfak',
  url: 'https://naifmutfak.com', // astro.config.mjs ve public/robots.txt ile aynı olmalı
  instagram: {
    kullanici: 'naifmutfakk',
    url: 'https://www.instagram.com/naifmutfakk/',
  },
  eposta: 'merhaba@naifmutfak.com', // [DOLDURULACAK]
  varsayilanOgGorseli: '/og/varsayilan.jpg',
} as const;

export const ekitap = {
  fiyat: 249, // TL, [DOLDURULACAK]
  eskiFiyat: null as number | null, // indirim varsa eski fiyat, yoksa null
  sayfaSayisi: 96, // [DOLDURULACAK]
  format: 'PDF',
  // Ödeme sağlayıcısının (Shopier, iyzico linki vb.) linki gelince buraya yaz.
  // `#` ile başladığı sürece "Satın Al" butonu pasif görünür.
  odemeLinki: '#odeme-linki-yakinda',
} as const;

export const kategoriler = ['corbalar', 'ana-yemekler', 'zeytinyaglilar', 'tatlilar', 'kahvaltilik', 'hamur-isleri'] as const;
export type Kategori = (typeof kategoriler)[number];
