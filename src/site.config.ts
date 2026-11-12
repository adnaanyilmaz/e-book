/**
 * Dilden bağımsız site ayarları.
 *
 * İçerik ve ayarların çoğu yönetim panelinden (/admin/index.html) düzenlenen JSON dosyalarındadır:
 * - src/data/ayarlar.json     iletişim e-postası, Instagram kullanıcı adı
 * - src/data/satis.json       e-kitap sayfa sayısı, fiyatlar, satış linkleri
 * - src/data/kategoriler.json tarif kategorileri (anahtar, 3 dilde ad, İngilizce/Arapça URL)
 * - src/data/<dil>/*.json     tüm arayüz ve sayfa metinleri (bkz. src/i18n/ceviriler.ts)
 * Burada yalnızca koda bağlı, sık değişmeyen ayarlar kalır.
 */
import ayarlar from './data/ayarlar.json';
import satis from './data/satis.json';
import kategoriVerisi from './data/kategoriler.json';

export const site = {
  ad: 'Naif Mutfak',
  url: 'https://naifmutfak.com', // astro.config.mjs ve public/robots.txt ile aynı olmalı
  instagram: {
    kullanici: ayarlar.instagram,
    url: `https://www.instagram.com/${ayarlar.instagram}/`,
  },
  eposta: ayarlar.eposta, // [DOLDURULACAK] panel → Site ayarları
  varsayilanOgGorseli: '/og/varsayilan.jpg',
};

/**
 * E-kitap iki kanaldan satılır (ayrıntılar: EKITAP-SATIS.md):
 * - turkiye: Shopier, TL. PDF'e alıcının e-postası `npm run damgala` ile elle basılır.
 * - yurtdisi: Gumroad, $. Gumroad PDF'e alıcının e-postasını kendisi basar ("Stamp PDFs" açık olmalı).
 * Sağlayıcı ve para birimi kodda sabittir; fiyat, eski fiyat ve link satis.json'dadır.
 * `link` `#` ile başladığı sürece o kanalın butonu pasif görünür ve "Satış çok yakında" yazar.
 */
export interface SatisKanali {
  saglayici: string;
  paraBirimi: 'TRY' | 'USD';
  fiyat: number;
  eskiFiyat: number | null; // indirim varsa eski fiyat, yoksa null
  link: string;
}
export type KanalAdi = 'turkiye' | 'yurtdisi';

type KanalVerisi = { fiyat: number; eskiFiyat?: number | null; link: string };
const kanal = (saglayici: string, paraBirimi: SatisKanali['paraBirimi'], k: KanalVerisi): SatisKanali => ({
  saglayici,
  paraBirimi,
  fiyat: k.fiyat,
  eskiFiyat: k.eskiFiyat || null, // panel boş alanı hiç yazmayabilir; 0 da "indirim yok" sayılır
  link: k.link,
});

export const ekitap = {
  sayfaSayisi: satis.sayfaSayisi, // [DOLDURULACAK] panel → E-kitap → Satış ve fiyat
  format: 'PDF',
  satis: {
    turkiye: kanal('Shopier', 'TRY', satis.turkiye),
    yurtdisi: kanal('Gumroad', 'USD', satis.yurtdisi),
  } satisfies Record<KanalAdi, SatisKanali>,
  /** Her dilin sayfası önce hangi kanalı gösterir; diğer kanal altta küçük link olarak çıkar. */
  dilKanali: { tr: 'turkiye', en: 'yurtdisi', ar: 'yurtdisi' } as Record<'tr' | 'en' | 'ar', KanalAdi>,
};

export const satisHazir = (k: SatisKanali) => !k.link.startsWith('#');

/** Tarif kategorileri (panel → Kategoriler). Sıra, sitedeki filtre butonlarının sırasıdır. */
export const kategoriListesi = kategoriVerisi.liste;
export const kategoriler = kategoriListesi.map((k) => k.anahtar);
export type Kategori = string;
