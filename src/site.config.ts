/**
 * Sitenin tek ayar dosyası. Fiyat, ödeme linki, iletişim bilgileri burada değişir.
 * `[DOLDURULACAK]` yazan alanları gerçek bilgilerle değiştir.
 */
export const site = {
  ad: 'Naif Mutfak',
  url: 'https://naifmutfak.com', // astro.config.mjs ve public/robots.txt ile aynı olmalı
  slogan: 'Sade, samimi ev yemekleri',
  aciklama:
    'Naif Mutfak: evde kolayca yapabileceğiniz sade ve samimi ev yemekleri tarifleri, ipuçları ve e-kitap.',
  dil: 'tr',
  locale: 'tr_TR',
  instagram: {
    kullanici: 'naifmutfakk',
    url: 'https://www.instagram.com/naifmutfakk/',
  },
  eposta: 'merhaba@naifmutfak.com', // [DOLDURULACAK]
  varsayilanOgGorseli: '/og/varsayilan.jpg',
} as const;

export const ekitap = {
  baslik: 'Naif Mutfak: Evin Tadı', // [DOLDURULACAK]
  altBaslik: 'Her gün yapılabilecek 40 sade ev yemeği', // [DOLDURULACAK]
  fiyat: 249, // TL, [DOLDURULACAK]
  eskiFiyat: null as number | null, // indirim varsa eski fiyat, yoksa null
  sayfaSayisi: 96, // [DOLDURULACAK]
  format: 'PDF',
  // Ödeme sağlayıcısının (Shopier, iyzico linki vb.) linki gelince buraya yaz.
  odemeLinki: '#odeme-linki-yakinda',
} as const;

export const navigasyon = [
  { href: '/', etiket: 'Ana Sayfa' },
  { href: '/blog', etiket: 'Tarifler' },
  { href: '/e-kitap', etiket: 'E-Kitap' },
  { href: '/hakkimda', etiket: 'Hakkımda' },
  { href: '/iletisim', etiket: 'İletişim' },
] as const;

export const yasalSayfalar = [
  { href: '/kvkk', etiket: 'KVKK Aydınlatma Metni' },
  { href: '/mesafeli-satis-sozlesmesi', etiket: 'Mesafeli Satış Sözleşmesi' },
  { href: '/iade-kosullari', etiket: 'İade Koşulları' },
  { href: '/cerez-politikasi', etiket: 'Çerez Politikası' },
] as const;

export const kategoriler = ['corbalar', 'ana-yemekler', 'zeytinyaglilar', 'tatlilar', 'kahvaltilik', 'hamur-isleri'] as const;
export type Kategori = (typeof kategoriler)[number];

export const kategoriAdlari: Record<Kategori, string> = {
  corbalar: 'Çorbalar',
  'ana-yemekler': 'Ana Yemekler',
  zeytinyaglilar: 'Zeytinyağlılar',
  tatlilar: 'Tatlılar',
  kahvaltilik: 'Kahvaltılık',
  'hamur-isleri': 'Hamur İşleri',
};

export const fiyatBicimle = (tl: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(tl);

export const tarihBicimle = (d: Date) =>
  new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
