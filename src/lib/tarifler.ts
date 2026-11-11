import { getCollection } from 'astro:content';

/** Yayındaki (taslak olmayan) tarifleri en yeniden eskiye sıralı döndürür. */
export async function yayindakiTarifler() {
  const tarifler = await getCollection('blog', ({ data }) => !data.taslak);
  return tarifler.sort((a, b) => b.data.tarih.valueOf() - a.data.tarih.valueOf());
}
