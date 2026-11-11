import { getCollection, type CollectionEntry } from 'astro:content';
import { diller, dilMi, type Dil } from '@/i18n/diller';
import { tarifYolu, type Alternatifler } from '@/i18n/yollar';

export type Tarif = CollectionEntry<'blog'>;

/**
 * Dosya düzeni: src/content/blog/<dil>/<anahtar>.md
 * Aynı <anahtar> adını taşıyan dosyalar birbirinin çevirisidir.
 */
export const tarifDili = (t: Tarif): Dil => {
  const d = t.id.split('/')[0];
  if (!dilMi(d)) throw new Error(`Tarif "${t.id}" bir dil klasöründe değil (tr/, en/ veya ar/ olmalı).`);
  return d;
};
export const tarifAnahtari = (t: Tarif) => t.id.split('/').slice(1).join('/');
/** URL'deki ad: frontmatter'da `urlAdi` varsa o, yoksa dosya adı */
export const tarifSlug = (t: Tarif) => t.data.urlAdi ?? tarifAnahtari(t);
export const tarifUrl = (t: Tarif) => tarifYolu(tarifDili(t), tarifSlug(t));

const tumYayindakiler = async () =>
  (await getCollection('blog', ({ data }) => !data.taslak)).sort((a, b) => b.data.tarih.valueOf() - a.data.tarih.valueOf());

/** Bir dildeki yayındaki (taslak olmayan) tarifler, en yeniden eskiye. */
export async function yayindakiTarifler(dil: Dil) {
  return (await tumYayindakiler()).filter((t) => tarifDili(t) === dil);
}

/** Bir tarifin diğer dillerdeki çevirilerinin adresleri */
export async function tarifAlternatifleri(tarif: Tarif): Promise<Alternatifler> {
  const anahtar = tarifAnahtari(tarif);
  const hepsi = await tumYayindakiler();
  const sonuc: Alternatifler = {};
  for (const d of diller) {
    const c = hepsi.find((t) => tarifDili(t) === d && tarifAnahtari(t) === anahtar);
    if (c) sonuc[d] = tarifUrl(c);
  }
  return sonuc;
}
