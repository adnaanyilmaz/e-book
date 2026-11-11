import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '@/site.config';
import { yayindakiTarifler } from '@/lib/tarifler';

export async function GET(context: APIContext) {
  const tarifler = await yayindakiTarifler();
  return rss({
    title: `${site.ad} Tarifleri`,
    description: site.aciklama,
    site: context.site!,
    customData: '<language>tr-tr</language>',
    items: tarifler.map((t) => ({
      title: t.data.baslik,
      description: t.data.aciklama,
      pubDate: t.data.tarih,
      link: `/blog/${t.id}`,
      categories: [t.data.kategori],
    })),
  });
}
