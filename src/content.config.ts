import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { kategoriler } from './site.config';

/**
 * Yönetim paneli boş bırakılan isteğe bağlı alanları '' / null / [] olarak yazar.
 * Bunları "alan yok" (undefined) sayarız; böylece elle yazılmış ve panelden kaydedilmiş dosyalar aynı davranır.
 */
const istegeBagli = <T extends z.ZodTypeAny>(sema: T) =>
  z.preprocess(
    (v) => (v === '' || v === null || (Array.isArray(v) && v.length === 0) ? undefined : v),
    sema.optional(),
  );

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      baslik: z.string().max(80),
      aciklama: z.string().max(170), // meta description olarak da kullanılır
      tarih: z.coerce.date(),
      guncelleme: istegeBagli(z.coerce.date()),
      kapak: image(),
      kapakAlt: z.string(),
      /** Kapak başkasının fotoğrafıysa (ör. CC BY-SA) kaynak bilgisi; tarif sayfasında görselin altında gösterilir.
       *  Kendi fotoğrafın için bu alanı hiç yazma. Panelde içi boş bırakılan blok da yok sayılır. */
      kapakKaynak: z.preprocess(
        (v) => (v && typeof v === 'object' && Object.values(v).every((x) => !x) ? undefined : v),
        istegeBagli(
          z.object({
            yazar: z.string(),
            url: z.string().url(), // fotoğrafın kaynak sayfası
            lisans: z.string(), // ör. 'CC BY-SA 4.0'
            lisansUrl: z.string().url(),
          }),
        ),
      ),
      kategori: z.enum(kategoriler as [string, ...string[]]), // src/data/kategoriler.json'daki anahtarlar
      hazirlamaSuresi: z.number().int().positive(), // dakika
      pisirmeSuresi: istegeBagli(z.number().int().nonnegative()), // dakika
      porsiyon: istegeBagli(z.string()),
      malzemeler: istegeBagli(z.array(z.string())), // JSON-LD Recipe için
      taslak: z.boolean().default(false),
      /** İsteğe bağlı URL adı (varsayılan: dosya adı). Örn. en/ için 'red-lentil-soup'.
       *  Not: 'slug' adı kullanılamaz, Astro onu kayıt kimliği olarak kullanır. */
      urlAdi: istegeBagli(z.string().regex(/^[a-z0-9-]+$/)),
    }),
});

export const collections = { blog };
