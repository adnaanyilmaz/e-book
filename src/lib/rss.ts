import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '@/site.config';
import { dilBilgisi, type Dil } from '@/i18n/diller';
import { ceviri } from '@/i18n/ceviriler';
import { tarifUrl, yayindakiTarifler } from './tarifler';

export async function rssUret(dil: Dil, context: APIContext) {
  const t = ceviri(dil);
  const tarifler = await yayindakiTarifler(dil);
  return rss({
    title: `${site.ad} · ${t.nav.blog}`,
    description: t.site.aciklama,
    site: context.site!,
    customData: `<language>${dilBilgisi[dil].bcp47}</language>`,
    items: tarifler.map((tarif) => ({
      title: tarif.data.baslik,
      description: tarif.data.aciklama,
      pubDate: tarif.data.tarih,
      link: tarifUrl(tarif),
      categories: [t.kategoriler[tarif.data.kategori]],
    })),
  });
}
