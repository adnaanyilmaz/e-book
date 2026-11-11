import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { kategoriler } from './site.config';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      baslik: z.string().max(80),
      aciklama: z.string().max(170), // meta description olarak da kullanılır
      tarih: z.coerce.date(),
      guncelleme: z.coerce.date().optional(),
      kapak: image(),
      kapakAlt: z.string(),
      kategori: z.enum(kategoriler),
      hazirlamaSuresi: z.number().int().positive(), // dakika
      pisirmeSuresi: z.number().int().nonnegative().optional(), // dakika
      porsiyon: z.string().optional(),
      malzemeler: z.array(z.string()).optional(), // JSON-LD Recipe için
      taslak: z.boolean().default(false),
      /** İsteğe bağlı URL adı (varsayılan: dosya adı). Örn. en/ için 'red-lentil-soup'.
       *  Not: 'slug' adı kullanılamaz, Astro onu kayıt kimliği olarak kullanır. */
      urlAdi: z.string().regex(/^[a-z0-9-]+$/).optional(),
    }),
});

export const collections = { blog };
