/** Sitenin desteklediği diller. Yeni dil eklemek için CLAUDE.md → "Çoklu dil" bölümüne bak. */
export const diller = ['tr', 'en', 'ar'] as const;
export type Dil = (typeof diller)[number];
export const varsayilanDil: Dil = 'tr';

interface DilBilgisi {
  /** Dil seçicide görünen ad (kendi dilinde) */
  ad: string;
  /** Dil seçicideki kısa etiket */
  kisa: string;
  yon: 'ltr' | 'rtl';
  /** <html lang> ve hreflang değeri */
  bcp47: string;
  ogLocale: string;
  /** Tarih ve fiyat biçimlendirme için Intl yereli */
  intl: string;
}

export const dilBilgisi: Record<Dil, DilBilgisi> = {
  tr: { ad: 'Türkçe', kisa: 'TR', yon: 'ltr', bcp47: 'tr', ogLocale: 'tr_TR', intl: 'tr-TR' },
  en: { ad: 'English', kisa: 'EN', yon: 'ltr', bcp47: 'en', ogLocale: 'en_US', intl: 'en-GB' },
  // Arapça rakamlar yerine Batı rakamları (nu-latn): fiyat ve süreler Instagram'daki gibi okunur.
  ar: { ad: 'العربية', kisa: 'ع', yon: 'rtl', bcp47: 'ar', ogLocale: 'ar_AR', intl: 'ar-u-nu-latn' },
};

export const dilMi = (d: string | undefined): d is Dil => !!d && (diller as readonly string[]).includes(d);

/** Varsayılan dil (tr) önek almaz: /hakkimda, /en/about, /ar/about */
export const dilOneki = (dil: Dil) => (dil === varsayilanDil ? '' : `/${dil}`);

export const tarihBicimle = (dil: Dil, d: Date) =>
  new Intl.DateTimeFormat(dilBilgisi[dil].intl, { day: 'numeric', month: 'long', year: 'numeric' }).format(d);

export const fiyatBicimle = (dil: Dil, tl: number) =>
  new Intl.NumberFormat(dilBilgisi[dil].intl, {
    style: 'currency',
    currency: 'TRY',
    currencyDisplay: 'narrowSymbol', // her dilde ₺ (Arapçada aksi halde "TRY" yazar)
    maximumFractionDigits: 0,
  }).format(tl);
