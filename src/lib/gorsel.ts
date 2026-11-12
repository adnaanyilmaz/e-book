import type { ImageMetadata } from 'astro';

/**
 * JSON içeriğinde (panelden seçilen) "@/assets/hero.jpg" gibi görsel yollarını
 * astro:assets'in optimize edebileceği görsele çevirir.
 */
const gorseller = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

export const gorsel = (yol: string): ImageMetadata => {
  const anahtar = yol.replace(/^@\//, '/src/').replace(/^src\//, '/src/');
  const bulunan = gorseller[anahtar];
  if (!bulunan) throw new Error(`Görsel bulunamadı: "${yol}". Dosya src/assets/ altında olmalı.`);
  return bulunan.default;
};
