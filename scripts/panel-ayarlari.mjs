#!/usr/bin/env node
/**
 * Yönetim paneli (Sveltia CMS) ayar dosyasını üretir: public/admin/config.yml
 *
 *   npm run panel
 *
 * Sayfa metinlerinin alanları src/data/tr/*.json dosyalarının yapısından otomatik çıkarılır;
 * bu dosyada yalnızca alanların Türkçe etiketleri ve ipuçları tutulur. Bir JSON dosyasına yeni
 * anahtar eklediğinde buraya etiketini ekle ve `npm run panel` çalıştır (etiketi olmayan anahtar
 * panelde kendi adıyla görünür ve betik uyarı verir).
 * config.yml'i elle düzenleme; değişiklik bir sonraki üretimde kaybolur.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { stringify } from 'yaml';

const kok = new URL('../', import.meta.url);
const oku = (yol) => JSON.parse(readFileSync(new URL(yol, kok), 'utf8'));

// ───────────────────────── Etiketler ve ipuçları ─────────────────────────
// Anahtar: JSON içindeki yol (liste öğeleri için "liste[].alan"). Değer: etiket ya da [etiket, ipucu].
const SEO = 'Google ve paylaşımlarda görünen kısa açıklama (en fazla ~160 karakter).';
const E = {
  // genel.json
  site: 'Site', 'site.slogan': ['Slogan', 'Alt bilgide ve sekme başlıklarında görünür.'], 'site.aciklama': ['Site açıklaması', SEO],
  nav: 'Menü', 'nav.ana': 'Ana sayfa', 'nav.blog': 'Tarifler', 'nav.ekitap': 'E-kitap', 'nav.hakkimda': 'Hakkımda', 'nav.iletisim': 'İletişim',
  'nav.anaMenu': ['Menü adı (ekran okuyucu)', 'Görünmez; görme engelli ziyaretçiler için.'],
  'nav.menuAc': ['"Menüyü aç" düğmesi (ekran okuyucu)', 'Görünmez; görme engelli ziyaretçiler için.'],
  'nav.icerigeGec': ['"İçeriğe geç" bağlantısı', 'Klavyeyle gezenler için; normalde görünmez.'],
  'nav.anaSayfaya': ['Logo bağlantısının açıklaması', 'Görünmez; "Naif Mutfak ana sayfa" gibi okunur.'],
  'nav.dilSecimi': ['Dil seçici adı (ekran okuyucu)', 'Görünmez.'],
  altBilgi: 'Alt bilgi (sayfanın en altı)', 'altBilgi.metin': 'Kısa metin', 'altBilgi.sayfalar': '"Sayfalar" başlığı',
  'altBilgi.siteHaritasi': ['Site haritası adı (ekran okuyucu)', 'Görünmez.'], 'altBilgi.yasal': '"Yasal" başlığı', 'altBilgi.haklar': 'Telif satırı',
  yasalAdlar: 'Yasal sayfaların adları', 'yasalAdlar.kvkk': 'KVKK', 'yasalAdlar.mesafeli': 'Mesafeli satış sözleşmesi',
  'yasalAdlar.iade': 'İade koşulları', 'yasalAdlar.cerez': 'Çerez politikası',

  // anasayfa.json
  ana: 'Karşılama bölümü ve ana sayfa', 'ana.ustBaslik': 'Üst küçük başlık', 'ana.baslikOnce': ['Büyük başlık: başı', 'Başlık üç parçadır: baş + vurgulu kelime + son.'],
  'ana.baslikVurgu': ['Büyük başlık: vurgulu kelime', 'Terakota renkte ve italik görünür.'], 'ana.baslikSonra': 'Büyük başlık: son',
  'ana.giris': 'Giriş paragrafı', 'ana.tarifButon': 'Tarifler düğmesi', 'ana.ekitapButon': 'E-kitap düğmesi',
  'ana.heroGorsel': ['Karşılama fotoğrafı', 'Yatay, en az 1600 piksel genişlik. Tüm dillerde aynıdır.'],
  'ana.heroAlt': ['Fotoğrafın açıklaması', 'Görme engelliler ve Google için fotoğrafta ne olduğunu anlat.'],
  'ana.sonUst': '"Son tarifler" üst başlığı', 'ana.sonBaslik': '"Son tarifler" başlığı', 'ana.tumu': '"Tüm tarifler" bağlantısı',
  'ana.igBaslik': 'Instagram bölümü başlığı', 'ana.igMetin': 'Instagram bölümü metni', 'ana.igButon': 'Instagram düğmesi',
  vitrin: 'E-kitap tanıtım kutusu', 'vitrin.ust': 'Üst başlık', 'vitrin.ek': 'Ek açıklama', 'vitrin.incele': 'Düğme',

  // tarifler.json
  blog: 'Tarif listesi sayfası', 'blog.ust': 'Üst başlık', 'blog.baslik': 'Başlık', 'blog.giris': 'Giriş metni',
  'blog.seoBaslik': ['Sekme başlığı', 'Tarayıcı sekmesinde ve Google\'da görünür.'], 'blog.seoAciklama': ['Açıklama', SEO],
  'blog.tumu': '"Tümü" filtre düğmesi', 'blog.kategorilerEtiket': ['Kategori filtresi adı (ekran okuyucu)', 'Görünmez.'],
  'blog.bos': 'Boş kategori mesajı', 'blog.kategoriSeoBaslik': 'Kategori sayfası sekme başlığı', 'blog.kategoriSeoAciklama': ['Kategori sayfası açıklaması', SEO],
  'blog.kategoriGiris': 'Kategori sayfası giriş metni',
  tarif: 'Tarif sayfası', 'tarif.konum': ['Konum çubuğu adı (ekran okuyucu)', 'Görünmez.'], 'tarif.hazirlik': '"Hazırlık" etiketi',
  'tarif.pisirme': '"Pişirme" etiketi', 'tarif.toplam': '"Toplam" etiketi', 'tarif.porsiyon': '"Porsiyon" etiketi', 'tarif.malzemeler': '"Malzemeler" başlığı',
  'tarif.dk': 'Dakika kısaltması', 'tarif.paylas': 'Paylaşım çağrısı', 'tarif.paylasButon': 'Instagram düğmesi',
  'tarif.benzer': '"Benzer tarifler" başlığı', 'tarif.mutfak': ['Mutfak türü', 'Google tarif bilgisinde kullanılır.'], 'tarif.fotoKaynak': 'Fotoğraf kaynağı satırı',

  // ekitap.json
  ekitap: 'E-kitap sayfası', 'ekitap.baslik': 'Kitabın adı', 'ekitap.altBaslik': 'Alt başlık',
  'ekitap.kapak': ['Kapak görseli', 'Dikey (yaklaşık 1000×1400). Tüm dillerde aynıdır.'], 'ekitap.kapakAlt': 'Kapağın açıklaması',
  'ekitap.ust': 'Üst satır (format, sayfa)', 'ekitap.seoBaslik': 'Sekme başlığı', 'ekitap.seoAciklama': ['Açıklama', SEO],
  'ekitap.satinAl': 'Satın al düğmesi', 'ekitap.guvenli': 'Ödeme yönlendirme notu', 'ekitap.yakinda': 'Satış başlamadan önceki not',
  'ekitap.kisiyeOzel': 'Kişiye özel kopya notu', 'ekitap.digerKanal': 'Diğer ödeme seçeneği sorusu',
  'ekitap.digerKanal.turkiye': 'Türkiye\'den alanlara', 'ekitap.digerKanal.yurtdisi': 'Yurt dışından alanlara', 'ekitap.digerOde': 'Diğer ödeme bağlantısı',
  'ekitap.yasalNot': 'Yasal onay notu', 'ekitap.icindekilerUst': 'İçindekiler üst başlığı', 'ekitap.icindekiler': 'İçindekiler başlığı',
  'ekitap.bolumler': 'Kitabın bölümleri', 'ekitap.bolumler[]': 'Bölüm', 'ekitap.bolumler[].baslik': 'Bölüm adı', 'ekitap.bolumler[].aciklama': 'Kısa açıklama',
  'ekitap.sssBaslik': 'SSS başlığı', 'ekitap.sss': 'Sıkça sorulan sorular', 'ekitap.sss[]': 'Soru', 'ekitap.sss[].s': 'Soru', 'ekitap.sss[].c': 'Cevap',
  'ekitap.dilNotu': ['Kitabın dili notu', 'Kitap bu dilde değilse belirt; gerek yoksa boş bırak.'],

  // hakkimda.json
  hakkimda: 'Hakkımda sayfası', 'hakkimda.ust': 'Üst başlık', 'hakkimda.baslik': 'Başlık',
  'hakkimda.foto': ['Fotoğraf', 'Dikey fotoğraf; sayfada kemer şeklinde kırpılır. Tüm dillerde aynıdır.'], 'hakkimda.fotoAlt': 'Fotoğrafın açıklaması',
  'hakkimda.paragraflar': 'Hikâye (paragraflar)', 'hakkimda.paragraflar[]': 'Paragraf', 'hakkimda.alinti': 'Alıntı', 'hakkimda.kapanis': 'Kapanış cümlesi',
  'hakkimda.seoAciklama': ['Açıklama', SEO],

  // iletisim.json
  iletisim: 'İletişim sayfası', 'iletisim.ust': 'Üst başlık', 'iletisim.baslik': 'Başlık', 'iletisim.giris': 'Giriş metni',
  'iletisim.eposta': 'E-posta kutusu başlığı', 'iletisim.epostaNot': 'E-posta kutusu notu', 'iletisim.dm': 'Instagram kutusu başlığı',
  'iletisim.dmNot': 'Instagram kutusu notu', 'iletisim.yanit': 'Yanıt süresi notu', 'iletisim.seoAciklama': ['Açıklama', SEO],

  // yasal.json
  yasal: 'Yasal sayfaların ortak metinleri',
  'yasal.sablonUyarisi': ['"Şablon metin" uyarısını göster', 'Metinler hukukçu kontrolünden geçince kapat. Tüm dillerde aynıdır.'],
  'yasal.ust': 'Üst başlık', 'yasal.guncelleme': '"Son güncelleme" etiketi', 'yasal.uyariBaslik': 'Uyarı başlığı', 'yasal.uyari': 'Uyarı metni',
  'yasal.ceviriNotu': ['Çeviri notu', 'Türkçede boş bırak; diğer dillerde "bağlayıcı metin Türkçedir" notu.'], 'yasal.digerleri': '"Diğer yasal metinler" başlığı',
  yasalMetinler: 'Metinler', 'yasalMetinler.kvkk': 'KVKK aydınlatma metni', 'yasalMetinler.mesafeli': 'Mesafeli satış sözleşmesi',
  'yasalMetinler.iade': 'İade koşulları', 'yasalMetinler.cerez': 'Çerez politikası',
  'yasalMetinler.*.guncelleme': ['Son güncelleme tarihi', 'Metni değiştirdiğinde güncelle. Tüm dillerde aynıdır.'],
  'yasalMetinler.*.aciklama': ['Açıklama', SEO], 'yasalMetinler.*.bolumler': 'Maddeler', 'yasalMetinler.*.bolumler[]': 'Madde',
  'yasalMetinler.*.bolumler[].baslik': 'Madde başlığı', 'yasalMetinler.*.bolumler[].metin': 'Madde metni',
};

// Uzun metinler çok satırlı kutuda düzenlenir
const UZUN = /(^|\.)(giris|aciklama|seoAciklama|metin|uyari|paylas|kisiyeOzel|guvenli|yasalNot|igMetin|ek|c|alinti|kapanis|paragraflar\[\])$/;
const GORSEL = /(^|\.)(heroGorsel|foto|kapak)$/;
const TARIH = /^\d{4}-\d{2}-\d{2}$/;

const eksikEtiketler = new Set();
const etiket = (yol) => {
  const genel = yol.replace(/^yasalMetinler\.(kvkk|mesafeli|iade|cerez)\./, 'yasalMetinler.*.');
  const d = E[yol] ?? E[genel];
  if (d === undefined) { eksikEtiketler.add(yol); return { label: yol.split('.').pop() }; }
  return Array.isArray(d) ? { label: d[0], hint: d[1] } : { label: d };
};

/** JSON değerinden Sveltia alan tanımı üretir (Türkçe dosya kaynak yapıdır). */
const alan = (ad, deger, yol) => {
  const t = { name: ad, ...etiket(yol) };
  if (typeof deger === 'boolean') return { ...t, widget: 'boolean', i18n: 'duplicate' };
  if (typeof deger === 'number') return { ...t, widget: 'number', i18n: 'duplicate' };
  if (typeof deger === 'string') {
    if (GORSEL.test(yol)) return { ...t, widget: 'image', choose_url: false, i18n: 'duplicate' };
    if (TARIH.test(deger)) return { ...t, widget: 'datetime', type: 'date', picker_utc: true, i18n: 'duplicate' };
    const yerTutucular = [...deger.matchAll(/\{(\w+)\}/g)].map((m) => `{${m[1]}}`);
    if (yerTutucular.length) {
      const not = `${yerTutucular.join(', ')} kısmını silme ve çevirme; sitede otomatik değerle değişir.`;
      t.hint = t.hint ? `${t.hint} ${not}` : not;
    }
    const uzun = UZUN.test(yol) || deger.length > 90;
    return { ...t, widget: uzun ? 'text' : 'string', required: false, i18n: true };
  }
  if (Array.isArray(deger)) {
    const ilk = deger[0];
    if (typeof ilk === 'string') {
      return { ...t, label_singular: etiket(`${yol}[]`).label, widget: 'list', i18n: true, field: alan(ad, ilk, `${yol}[]`) };
    }
    const altAlanlar = Object.entries(ilk).map(([k, v]) => alan(k, v, `${yol}[].${k}`));
    return { ...t, label_singular: etiket(`${yol}[]`).label, widget: 'list', i18n: true, collapsed: 'auto', summary: `{{${altAlanlar[0].name}}}`, fields: altAlanlar };
  }
  return { ...t, widget: 'object', i18n: true, fields: Object.entries(deger).map(([k, v]) => alan(k, v, `${yol}.${k}`)) };
};

const sayfaDosyasi = (ad, label, icon) => {
  const veri = oku(`src/data/tr/${ad}.json`);
  return {
    name: ad, label, icon, i18n: true,
    file: `src/data/{{locale}}/${ad}.json`,
    fields: Object.entries(veri).map(([k, v]) => ({ ...alan(k, v, k), collapsed: false })),
  };
};

// ───────────────────────── Panel ayarları ─────────────────────────
const kategoriSecenekleri = { collection: 'kategoriler', file: 'kategoriler' };

const config = {
  backend: {
    name: 'github',
    // GitHub deposu (panelde "Erişim Token'ı ile Giriş" bu depoya yazar).
    // Yerel çalışma ("Yerel Repo ile Çalış") için bu ad önemli değil.
    repo: 'adnaanyilmaz/e-book',
    branch: 'main',
    auth_methods: ['token'],
    commit_messages: {
      create: 'Panel: "{{slug}}" eklendi ({{collection}})',
      update: 'Panel: "{{slug}}" güncellendi ({{collection}})',
      delete: 'Panel: "{{slug}}" silindi ({{collection}})',
      uploadMedia: 'Panel: görsel yüklendi ({{path}})',
      deleteMedia: 'Panel: görsel silindi ({{path}})',
    },
  },
  app_title: 'Naif Mutfak · Yönetim',
  logo: { src: '/icon-192.png' },
  site_url: 'https://naifmutfak.com',
  media_folder: '/src/assets',
  public_folder: '@/assets',
  slug: { encoding: 'ascii', clean_accents: true, sanitize_replacement: '-', lowercase: true, trim: true },
  // Boş alanlar dosyada kalır ('' / null): sayfa metinlerinde anahtar kaybolursa build tip hatası verir.
  // Tarif şeması (src/content.config.ts) boş değerleri "yok" sayar.
  output: { omit_empty_optional_fields: false, json: { indent_size: 2 } },
  i18n: { structure: 'multiple_folders', locales: ['tr', 'en', 'ar'], default_locale: 'tr', initial_locales: 'all' },

  collections: [
    // ── Tarifler ──
    {
      name: 'tarifler', label: 'Tarifler', label_singular: 'Tarif', icon: 'restaurant_menu',
      description: 'Türkçe kaynak dildir. Dil sekmeleriyle İngilizce ve Arapça çeviriyi aynı ekranda doldur. '
        + 'Kapak, tarih, kategori ve süreler tüm dillerde ortaktır; yalnızca Türkçede değiştirilir.',
      folder: 'src/content/blog', format: 'yaml-frontmatter', extension: 'md', create: true, i18n: true,
      identifier_field: 'baslik',
      slug: { template: '{{baslik}}', editable: ['create'] },
      media_folder: '/src/assets/tarifler', public_folder: '@/assets/tarifler',
      thumbnail: 'kapak',
      summary: '{{baslik}}',
      sortable_fields: { fields: ['tarih', 'baslik', 'kategori'], default: { field: 'tarih', direction: 'descending' } },
      view_groups: [{ label: 'Kategori', field: 'kategori' }],
      view_filters: [{ label: 'Taslaklar', field: 'taslak', pattern: true }],
      fields: [
        { name: 'baslik', label: 'Başlık', widget: 'string', maxlength: 80, i18n: true },
        {
          name: 'urlAdi', label: 'Adres (URL) adı', widget: 'string', required: false, i18n: true,
          hint: 'İngilizce ve Arapça için önerilir (ör. red-lentil-soup). Boş bırakırsan dosya adı kullanılır. Yalnızca küçük harf, rakam ve tire.',
          pattern: ['^[a-z0-9-]+$', 'Yalnızca küçük harf (a-z), rakam ve tire kullan.'],
        },
        { name: 'aciklama', label: 'Kısa açıklama', widget: 'text', maxlength: 170, i18n: true, hint: 'Google\'da ve paylaşımlarda görünen tek cümlelik özet.' },
        { name: 'kapak', label: 'Kapak fotoğrafı', widget: 'image', choose_url: false, i18n: 'duplicate', hint: 'Yatay, en az 1200 piksel genişlik.' },
        { name: 'kapakAlt', label: 'Kapak fotoğrafının açıklaması', widget: 'string', i18n: true, hint: 'Görme engelliler ve Google için fotoğrafta ne olduğunu anlat.' },
        {
          name: 'kategori', label: 'Kategori', widget: 'relation', ...kategoriSecenekleri, i18n: 'duplicate',
          value_field: '{{liste.*.anahtar}}', display_fields: ['{{liste.*.tr}}'], search_fields: ['{{liste.*.tr}}'],
          hint: 'Yeni kategori için soldaki "Kategoriler" bölümünü kullan.',
        },
        { name: 'hazirlamaSuresi', label: 'Hazırlama süresi (dakika)', widget: 'number', value_type: 'int', min: 1, i18n: 'duplicate' },
        { name: 'pisirmeSuresi', label: 'Pişirme süresi (dakika)', widget: 'number', value_type: 'int', min: 0, required: false, i18n: 'duplicate' },
        { name: 'porsiyon', label: 'Porsiyon', widget: 'string', required: false, i18n: true, hint: 'ör. 4 kişilik / Serves 4' },
        {
          name: 'malzemeler', label: 'Malzemeler', label_singular: 'Malzeme', widget: 'list', required: false, i18n: true,
          hint: 'Her satıra bir malzeme. Tarif metninde malzemeleri tekrar yazma; sayfada otomatik gösterilir.',
        },
        {
          name: 'body', label: 'Tarif metni', widget: 'richtext', i18n: true,
          hint: 'Kısa bir hikâye, ardından "Hazırlanışı" başlığı altında numaralı adımlar, isteğe bağlı "Püf noktası".',
          buttons: ['bold', 'italic', 'link', 'heading-two', 'heading-three', 'bulleted-list', 'numbered-list', 'quote'],
          editor_components: [],
        },
        { name: 'tarih', label: 'Yayın tarihi', widget: 'datetime', type: 'date', picker_utc: true, i18n: 'duplicate' },
        { name: 'guncelleme', label: 'Güncelleme tarihi', widget: 'datetime', type: 'date', picker_utc: true, required: false, i18n: 'duplicate', hint: 'Tarifi sonradan önemli ölçüde değiştirdiysen.' },
        { name: 'taslak', label: 'Taslak (sitede gösterme)', widget: 'boolean', default: false, i18n: 'duplicate' },
        {
          name: 'kapakKaynak', label: 'Fotoğraf kaynağı', widget: 'object', required: false, collapsed: true, i18n: 'duplicate',
          hint: 'Yalnızca başkasının (ör. Wikimedia, CC lisanslı) fotoğrafını kullanıyorsan doldur. Kendi fotoğrafın için boş bırak.',
          fields: [
            { name: 'yazar', label: 'Fotoğrafçı', widget: 'string' },
            { name: 'url', label: 'Fotoğrafın kaynak sayfası', widget: 'string', pattern: ['^https://', 'https:// ile başlamalı.'] },
            { name: 'lisans', label: 'Lisans', widget: 'string', hint: 'ör. CC BY-SA 4.0' },
            { name: 'lisansUrl', label: 'Lisans sayfası', widget: 'string', pattern: ['^https://', 'https:// ile başlamalı.'] },
          ],
        },
      ],
    },
    { divider: true },

    // ── Sayfalar ──
    {
      name: 'sayfalar', label: 'Sayfalar', icon: 'web', i18n: true, editor: { preview: false },
      description: 'Sitenin sayfalarındaki tüm yazılar ve fotoğraflar. Her dil kendi sekmesinde.',
      files: [
        sayfaDosyasi('anasayfa', 'Ana sayfa', 'home'),
        sayfaDosyasi('hakkimda', 'Hakkımda', 'person'),
        sayfaDosyasi('iletisim', 'İletişim', 'mail'),
        sayfaDosyasi('tarifler', 'Tarif sayfaları (ortak yazılar)', 'menu_book'),
        sayfaDosyasi('genel', 'Menü ve alt bilgi', 'segment'),
      ],
    },

    // ── E-kitap ──
    {
      name: 'ekitap', label: 'E-kitap', icon: 'auto_stories', i18n: true, editor: { preview: false },
      description: 'E-kitap sayfasının yazıları, içindekiler ve SSS. Fiyat ve satış linkleri "Satış ve fiyatlar"da.',
      files: [sayfaDosyasi('ekitap', 'E-kitap sayfası', 'auto_stories')],
    },
    {
      name: 'satis', label: 'Satış ve fiyatlar', icon: 'payments', editor: { preview: false },
      description: 'E-kitabın fiyatları ve ödeme sayfası linkleri. Ayrıntılı kurulum: EKITAP-SATIS.md',
      files: [{
        name: 'satis', label: 'Satış ve fiyatlar', file: 'src/data/satis.json', icon: 'payments',
        fields: [
          { name: 'sayfaSayisi', label: 'Kitabın sayfa sayısı', widget: 'number', value_type: 'int', min: 1 },
          ...[['turkiye', 'Türkiye satışı (Shopier, TL)', 'Fiyat (₺)', 'Shopier ürün linki'], ['yurtdisi', 'Yurt dışı satışı (Gumroad, $)', 'Fiyat ($)', 'Gumroad ürün linki']]
            .map(([name, label, fiyat, link]) => ({
              name, label, widget: 'object', collapsed: false,
              fields: [
                { name: 'fiyat', label: fiyat, widget: 'number', value_type: 'float', step: 0.01, min: 0 },
                { name: 'eskiFiyat', label: 'Eski fiyat (indirim varsa)', widget: 'number', value_type: 'float', step: 0.01, min: 0, required: false, hint: 'Doldurursan sitede üstü çizili gösterilir. İndirim bitince boşalt.' },
                {
                  name: 'link', label: link, widget: 'string',
                  hint: 'Satış başlayana kadar # ile başlayan değeri bırak: buton pasif kalır ve "Satış çok yakında" yazar.',
                  pattern: ['^(https://|#)', 'https:// ile (ya da henüz hazır değilse # ile) başlamalı.'],
                },
              ],
            })),
        ],
      }],
    },

    // ── Yasal ──
    {
      name: 'yasal', label: 'Yasal metinler', icon: 'gavel', i18n: true, editor: { preview: false },
      description: 'KVKK, mesafeli satış, iade ve çerez metinleri. Bağlayıcı metin Türkçedir; değişiklikleri hukukçuna kontrol ettir.',
      files: [sayfaDosyasi('yasal', 'Yasal metinler', 'gavel')],
    },
    { divider: true },

    // ── Kategoriler ──
    {
      name: 'kategoriler', label: 'Kategoriler', icon: 'category', editor: { preview: false },
      description: 'Tarif kategorileri. Sıralama sitedeki filtre düğmelerinin sırasıdır.',
      files: [{
        name: 'kategoriler', label: 'Kategoriler', file: 'src/data/kategoriler.json', icon: 'category',
        fields: [{
          name: 'liste', label: 'Kategoriler', label_singular: 'Kategori', widget: 'list', collapsed: true, summary: '{{tr}} · {{en}} · {{ar}}',
          fields: [
            {
              name: 'anahtar', label: 'Anahtar (Türkçe adres)', widget: 'string',
              hint: 'Türkçe adres ve tariflerdeki kategori kodu, ör. "corbalar". Küçük harf, Türkçe karaktersiz, tireli. Tarif bağlıyken DEĞİŞTİRME.',
              pattern: ['^[a-z0-9-]+$', 'Yalnızca küçük harf (a-z), rakam ve tire kullan.'],
            },
            { name: 'tr', label: 'Türkçe adı', widget: 'string' },
            { name: 'en', label: 'İngilizce adı', widget: 'string' },
            { name: 'ar', label: 'Arapça adı', widget: 'string' },
            { name: 'urlEn', label: 'İngilizce/Arapça adres', widget: 'string', hint: 'ör. "soups". Latin harflerle.', pattern: ['^[a-z0-9-]+$', 'Yalnızca küçük harf (a-z), rakam ve tire kullan.'] },
          ],
        }],
      }],
    },

    // ── Site ayarları ──
    {
      name: 'ayarlar', label: 'Site ayarları', icon: 'settings', editor: { preview: false },
      files: [{
        name: 'ayarlar', label: 'İletişim ve sosyal medya', file: 'src/data/ayarlar.json', icon: 'contact_mail',
        fields: [
          { name: 'eposta', label: 'İletişim e-postası', widget: 'string', pattern: ['^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', 'Geçerli bir e-posta adresi yaz.'] },
          { name: 'instagram', label: 'Instagram kullanıcı adı', widget: 'string', hint: '@ işareti olmadan, ör. naifmutfakk', pattern: ['^[A-Za-z0-9._]+$', '@ olmadan, yalnızca harf, rakam, nokta ve alt çizgi.'] },
        ],
      }],
    },
  ],
};

const baslik = `# BU DOSYA OTOMATİK ÜRETİLİR: elle düzenleme.
# Kaynak: scripts/panel-ayarlari.mjs  ·  Yeniden üret: npm run panel
# Belgeler: https://sveltiacms.app/en/docs
`;
writeFileSync(new URL('public/admin/config.yml', kok), baslik + stringify(config, { lineWidth: 0 }));

console.log('public/admin/config.yml üretildi.');
if (eksikEtiketler.size) {
  console.warn(`Etiketi olmayan ${eksikEtiketler.size} alan var (panelde kendi adıyla görünür). scripts/panel-ayarlari.mjs → E içine ekle:`);
  for (const y of eksikEtiketler) console.warn(`  '${y}'`);
}
