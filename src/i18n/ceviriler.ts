import type { Dil } from './diller';
import { kategoriListesi } from '@/site.config';

/**
 * Arayüz ve sayfa metinleri src/data/<dil>/*.json dosyalarındadır; yönetim panelinden düzenlenir.
 * Kaynak dil Türkçe (`tr`); `en` ve `ar` aynı yapıyı birebir izlemek zorunda
 * (TypeScript eksik anahtarı build sırasında hata olarak gösterir).
 * Metin içinde {suslu} ile yazılan yerlere bileşen tarafından link vb. yerleştirilir.
 */
import trGenel from '@/data/tr/genel.json';
import trAnasayfa from '@/data/tr/anasayfa.json';
import trTarifler from '@/data/tr/tarifler.json';
import trEkitap from '@/data/tr/ekitap.json';
import trHakkimda from '@/data/tr/hakkimda.json';
import trIletisim from '@/data/tr/iletisim.json';
import trYasal from '@/data/tr/yasal.json';
import enGenel from '@/data/en/genel.json';
import enAnasayfa from '@/data/en/anasayfa.json';
import enTarifler from '@/data/en/tarifler.json';
import enEkitap from '@/data/en/ekitap.json';
import enHakkimda from '@/data/en/hakkimda.json';
import enIletisim from '@/data/en/iletisim.json';
import enYasal from '@/data/en/yasal.json';
import arGenel from '@/data/ar/genel.json';
import arAnasayfa from '@/data/ar/anasayfa.json';
import arTarifler from '@/data/ar/tarifler.json';
import arEkitap from '@/data/ar/ekitap.json';
import arHakkimda from '@/data/ar/hakkimda.json';
import arIletisim from '@/data/ar/iletisim.json';
import arYasal from '@/data/ar/yasal.json';

/** Kategori adları kategoriler.json'da üç dil yan yana durur: { corbalar: 'Çorbalar', ... } */
const kategoriAdlari = (dil: Dil): Record<string, string> =>
  Object.fromEntries(kategoriListesi.map((k) => [k.anahtar, k[dil]]));

const tr = {
  ...trGenel,
  ...trAnasayfa,
  ...trTarifler,
  ...trEkitap,
  ...trHakkimda,
  ...trIletisim,
  ...trYasal,
  kategoriler: kategoriAdlari('tr'),
};

export type Ceviri = typeof tr;

const en: Ceviri = {
  ...enGenel,
  ...enAnasayfa,
  ...enTarifler,
  ...enEkitap,
  ...enHakkimda,
  ...enIletisim,
  ...enYasal,
  kategoriler: kategoriAdlari('en'),
};

const ar: Ceviri = {
  ...arGenel,
  ...arAnasayfa,
  ...arTarifler,
  ...arEkitap,
  ...arHakkimda,
  ...arIletisim,
  ...arYasal,
  kategoriler: kategoriAdlari('ar'),
};

const ceviriler: Record<Dil, Ceviri> = { tr, en, ar };

export const ceviri = (dil: Dil): Ceviri => ceviriler[dil];

/** "Merhaba {ad}" + { ad: 'Ayşe' } → "Merhaba Ayşe" */
export const doldur = (sablon: string, degerler: Record<string, string | number>) =>
  sablon.replace(/\{(\w+)\}/g, (_, k: string) => String(degerler[k] ?? `{${k}}`));

/** Şablonu düz metin ve {yer tutucu} parçalarına ayırır; bileşenler yer tutucuya link koyar. */
export const parcala = (sablon: string) =>
  sablon.split(/(\{\w+\})/).filter(Boolean).map((p) => {
    const m = p.match(/^\{(\w+)\}$/);
    return m ? { anahtar: m[1] } : { metin: p };
  });
