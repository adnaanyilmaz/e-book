import { dilOneki, type Dil } from './diller';
import { kategoriListesi, type Kategori } from '@/site.config';

/**
 * Her sayfanın her dildeki adresi. URL'ler burada tanımlanır; başka yerde elle yazılmaz.
 * Arapça adresler bilerek Latin harfli: Instagram'da ve paylaşımlarda bozulmadan görünürler.
 */
export const sayfaSluglari = {
  ana: { tr: '', en: '', ar: '' },
  blog: { tr: 'blog', en: 'blog', ar: 'blog' },
  ekitap: { tr: 'e-kitap', en: 'ebook', ar: 'ebook' },
  hakkimda: { tr: 'hakkimda', en: 'about', ar: 'about' },
  iletisim: { tr: 'iletisim', en: 'contact', ar: 'contact' },
  kvkk: { tr: 'kvkk', en: 'privacy-notice', ar: 'privacy-notice' },
  mesafeli: { tr: 'mesafeli-satis-sozlesmesi', en: 'distance-sales-agreement', ar: 'distance-sales-agreement' },
  iade: { tr: 'iade-kosullari', en: 'refund-policy', ar: 'refund-policy' },
  cerez: { tr: 'cerez-politikasi', en: 'cookie-policy', ar: 'cookie-policy' },
} as const satisfies Record<string, Record<Dil, string>>;

export type SayfaAnahtari = keyof typeof sayfaSluglari;
export const yasalAnahtarlar = ['kvkk', 'mesafeli', 'iade', 'cerez'] as const satisfies readonly SayfaAnahtari[];
export type YasalAnahtar = (typeof yasalAnahtarlar)[number];

const kategoriBolumu: Record<Dil, string> = { tr: 'kategori', en: 'category', ar: 'category' };

/** Kategori adresleri src/data/kategoriler.json'dan: tr = anahtar, en/ar = urlEn (Latin harfli) */
export const kategoriSluglari: Record<Kategori, Record<Dil, string>> = Object.fromEntries(
  kategoriListesi.map((k) => [k.anahtar, { tr: k.anahtar, en: k.urlEn, ar: k.urlEn }]),
);

const birlestir = (dil: Dil, ...parcalar: string[]) => {
  const yol = [dilOneki(dil), ...parcalar.filter(Boolean)].join('/').replace(/\/+/g, '/');
  return yol === '' ? '/' : yol.startsWith('/') ? yol : `/${yol}`;
};

export const sayfaYolu = (dil: Dil, sayfa: SayfaAnahtari) => birlestir(dil, sayfaSluglari[sayfa][dil]);
export const kategoriYolu = (dil: Dil, kategori: Kategori) =>
  birlestir(dil, 'blog', kategoriBolumu[dil], kategoriSluglari[kategori][dil]);
export const tarifYolu = (dil: Dil, slug: string) => birlestir(dil, 'blog', slug);

/**
 * Astro.url.pathname'i sitedeki gerçek adrese çevirir. Build (format: 'file') sırasında
 * pathname "/en/about.html" gelir; canonical ve aktif menü için "/en/about" gerekir.
 */
export const temizYol = (pathname: string) =>
  pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1') || '/';

/** getStaticPaths için: "/en/about" → "en/about", "/" → undefined */
export const parametreye = (yol: string) => yol.replace(/^\//, '') || undefined;

/** Dil seçici ve hreflang için: bir sayfanın tüm dillerdeki adresleri */
export type Alternatifler = Partial<Record<Dil, string>>;
