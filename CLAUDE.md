# Naif Mutfak — proje kuralları

Instagram'daki @naifmutfakk yemek hesabının web sitesi. Astro ile üretilen, tamamen statik,
**üç dilli (Türkçe, İngilizce, Arapça)** bir site.
Ziyaretçilerin çoğu Instagram'dan telefonla geliyor: **her değişiklik önce mobilde (360–375px) doğru görünmeli,
ve Arapça (sağdan sola) sayfada da kontrol edilmeli.**

## Komutlar

```bash
npm run dev       # geliştirme sunucusu → http://localhost:4321
npm run build     # astro check (tip kontrolü) + üretim build'i → dist/
npm run preview   # dist/ çıktısını yerelde sun
```

`npm run build` hatasız geçmeden iş bitmiş sayılmaz.

## Sürüm notu (önemli)

- Astro **5.18** kullanılıyor çünkü makinede Node 20 var; Astro 7 Node 22 istiyor.
- `npm audit`, Astro 5 / sharp / esbuild için kritik açıklar raporluyor; düzeltmeleri Astro 7'de.
  **Yayına almadan önce Node 22'ye geçip Astro 7'ye yükselt** ve build'i tekrar doğrula.
- Kod, Astro 5 content layer API'sini kullanıyor (`src/content.config.ts`, `glob` loader, `render()`);
  yükseltirken değişenleri Astro'nun yükseltme rehberinden kontrol et.

## Klasör yapısı

```
src/
  site.config.ts        koda bağlı ayarlar (site URL'si, satış kanalları); panel verilerini okur
  data/                 PANELDEN DÜZENLENEN İÇERİK (yönetim paneli bu dosyaları yazar)
    tr/ en/ ar/         her dilin metinleri: genel (menü, alt bilgi), anasayfa, tarifler, ekitap,
                        hakkimda, iletisim, yasal (yasal sayfaların maddeleri dahil); sayfa fotoğraflarının yolları da burada
    ayarlar.json        iletişim e-postası, Instagram kullanıcı adı
    satis.json          e-kitap sayfa sayısı, fiyatlar, satış linkleri
    kategoriler.json    tarif kategorileri (anahtar, 3 dilde ad, en/ar adresi)
  i18n/
    diller.ts           desteklenen diller, yön (ltr/rtl), tarih + fiyat biçimleyiciler
    yollar.ts           HER SAYFANIN HER DİLDEKİ ADRESİ (sayfaYolu, kategoriYolu, tarifYolu)
    ceviriler.ts        data/<dil>/*.json'u birleştirir (tip denetimiyle), doldur() ve parcala() yardımcıları
  pages/
    [...yol].astro      TEK YÖNLENDİRİCİ: tüm sayfaları tüm dillerde üretir (getStaticPaths)
    404.astro           tek 404 sayfası (3 dilde kısa mesaj)
    rss.xml.ts, en/rss.xml.ts, ar/rss.xml.ts
  views/                sayfaların içeriği (AnaSayfa, BlogListe, TarifSayfasi, Ekitap, Hakkimda, Iletisim)
  layouts/              TemelLayout (her sayfa: <html lang dir>, SEO, header, footer), YasalLayout
  components/           Header, DilSecici, Footer, SEO, TarifKarti, TarifListesi, EkitapVitrin
  content/blog/<dil>/   tarifler: tr/, en/, ar/
  content.config.ts     blog koleksiyonu şeması (Zod)
  lib/tarifler.ts       tarif yardımcıları (dil, çeviri eşleştirme, URL)
  lib/gorsel.ts         JSON'daki "@/assets/x.jpg" yolunu astro:assets görseline çevirir
  assets/               logo, hero, e-kitap kapağı, tarif görselleri (astro:assets ile optimize edilir)
  styles/global.css     tasarım değerleri (CSS değişkenleri) + ortak sınıflar + Arapça ayarları
public/                 favicon-48.png, icon-192/512.png, apple-touch-icon.png, site.webmanifest, robots.txt, og/varsayilan.jpg
  admin/                yönetim paneli: index.html, config.yml (ÜRETİLİR: npm run panel), onizleme.css
scripts/                panel-ayarlari.mjs (config.yml üretir), pdf-damgala.mjs
```

## Çoklu dil

- Türkçe varsayılan dildir ve önek almaz: `/hakkimda`. İngilizce `/en/about`, Arapça `/ar/about`.
- **Adresleri asla elle yazma**; daima `sayfaYolu(dil, 'hakkimda')`, `kategoriYolu(...)`, `tarifUrl(tarif)` kullan.
  Adres değiştirmek için yalnızca `src/i18n/yollar.ts`'i düzenle.
- **Arayüzde sabit metin yazma**; metni `src/data/{tr,en,ar}/<bolum>.json` dosyalarına üç dile birden ekle,
  bileşende `ceviri(dil).bolum.anahtar` ile kullan. `tr` kaynak yapıdır; `en`/`ar`'da eksik anahtar
  build'de tip hatası verir. Yeni anahtarın panelde Türkçe etiketle görünmesi için
  `scripts/panel-ayarlari.mjs → E` içine etiketini ekle ve `npm run panel` çalıştır.
- Yeni bir JSON dosyası (bölüm) eklersen: `ceviriler.ts`'te üç dil için import et ve
  `panel-ayarlari.mjs` içinde `sayfaDosyasi(...)` ile panele ekle.
- Metin içine link/değer gerekiyorsa `{yer_tutucu}` kullan: düz metin için `doldur()`, link için `parcala()`.
- Her sayfa `TemelLayout`'a `dil` ve `alternatifler` (diğer dillerdeki adresleri) verir; dil seçici ve
  `hreflang` etiketleri buradan üretilir.
- Yeni sayfa: `yollar.ts → sayfaSluglari` + `src/views/` altında görünüm + `[...yol].astro` içinde ekle.
- Yeni dil: `diller.ts` (diller + dilBilgisi), `yollar.ts` (tüm slug tabloları), `src/data/<dil>/` (tr'nin kopyası,
  çevrilmiş), `ceviriler.ts` (importlar), `kategoriler.json` (yeni dil sütunu), `src/content/blog/<dil>/`,
  `src/pages/<dil>/rss.xml.ts`, `panel-ayarlari.mjs → i18n.locales`.

### Arapça (RTL) kuralları

- `<html dir="rtl">` otomatik gelir. CSS'te **yön bildiren özellik kullanma**:
  `margin-left` → `margin-inline-start`, `padding-right` → `padding-inline-end`,
  `left: 0` → `inset-inline-start: 0`, `text-align: left` → `text-align: start`, `border-left` → `border-inline-start`.
- Arapça metin içindeki Latin parçaları (e-posta, `@kullanici`) `dir="ltr"` ile sarılır.
- Arapça yazı tipleri: Noto Naskh Arabic (başlık), Noto Sans Arabic (metin); `:lang(ar)` ile devreye girer.
  `unicode-range` sayesinde Türkçe/İngilizce sayfalarda indirilmezler.
- Arapça'da italik ve büyük harf yoktur; `em` ve `.ust-baslik` için `:lang(ar)` istisnaları var.
- Arapça metinlerde marka adı Latin harfle **"Naif Mutfak"** yazılır.
- Site sahibinden bahseden Arapça metinler cinsiyet belirtmeyecek şekilde yazılır.

## Yeni tarif ekleme

1. Kapak görselini `src/assets/tarifler/<anahtar>.jpg` olarak koy (yatay, en az 1200px genişlik).
2. `src/content/blog/tr/<anahtar>.md` oluştur. Çevirileri **aynı dosya adıyla** `en/` ve `ar/` altına koy;
   aynı adı taşıyan dosyalar birbirinin çevirisi sayılır ve dil seçici aralarında geçiş yapar.
   Çevirisi olmayan tarif yalnızca kendi dilinde listelenir.
3. Frontmatter alanları:

```yaml
---
baslik: Mercimek Çorbası            # zorunlu, en fazla 80 karakter
urlAdi: red-lentil-soup             # isteğe bağlı; URL'deki ad (varsayılan: dosya adı). en/ar için önerilir.
                                    # DİKKAT: `slug` adı kullanılamaz (Astro onu kayıt kimliği yapar).
aciklama: Tek cümlelik özet.        # zorunlu, en fazla 170 karakter (meta description)
tarih: 2026-11-04                   # zorunlu
guncelleme: 2026-11-20              # isteğe bağlı
kapak: "@/assets/tarifler/<anahtar>.jpg"       # zorunlu, tırnak içinde, @/ = src/ (panel de böyle yazar)
kapakAlt: Görselin açıklaması       # zorunlu (erişilebilirlik + SEO)
kapakKaynak:                        # YALNIZCA başkasının fotoğrafı (CC lisanslı vb.) kullanılıyorsa;
  yazar: E4024                      # tarif sayfasında görselin altında "Fotoğraf: … · lisans" olarak çıkar.
  url: https://commons.wikimedia.org/wiki/File:...   # kendi fotoğrafını koyunca bu bloğu sil.
  lisans: CC BY-SA 4.0
  lisansUrl: https://creativecommons.org/licenses/by-sa/4.0/
kategori: corbalar                  # zorunlu, src/data/kategoriler.json'daki bir anahtar (her dilde aynı)
hazirlamaSuresi: 10                 # zorunlu, dakika (tam sayı)
pisirmeSuresi: 30                   # isteğe bağlı, dakika
porsiyon: 4 kişilik                 # isteğe bağlı
malzemeler:                         # isteğe bağlı ama önerilir; sayfada kutu + Google tarif şeması
  - 1 su bardağı mercimek
taslak: false                       # true ise yayınlanmaz
---
```

4. İçinde `: ` (iki nokta + boşluk) geçen değerleri **tırnak içine al**: `aciklama: "Kış klasiği: ..."`.
5. Gövdeye hikâye + `## Hazırlanışı` (numaralı liste) + isteğe bağlı `## Püf noktası` yaz.
   **Malzemeleri gövdede tekrar yazma**; frontmatter'daki liste sayfada otomatik gösterilir.
6. Yeni kategori: panel → Kategoriler (ya da `src/data/kategoriler.json`). Adlar, adresler ve tarif formundaki seçenekler
   oradan otomatik gelir. Tarif bağlı bir kategorinin `anahtar`ını değiştirme.

## Adlandırma kuralları

- URL / dosya adı: küçük harf, Türkçe karakterden arındırılmış, kelimeler tireyle:
  `zeytinyagli-taze-fasulye` (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u). en/ar adresleri İngilizce kelimelerle, Latin harfle.
- Kod içindeki değişken ve bileşen adları Türkçe (`baslik`, `TarifKarti`); bu tutarlılık korunmalı.
- Türkçe ve İngilizce metinler samimi “sen / you” diliyle yazılır.
- Tarih ve fiyatlar için daima `tarihBicimle(dil, ...)` / `fiyatBicimle(dil, ...)` kullan.

## Tasarım

- Renk, yazı tipi, köşe ve gölge değerleri **yalnızca** `src/styles/global.css` içindeki `:root` değişkenlerinden
  alınır; bileşenlerde sabit renk kodu yazma.
- Palet: krem zemin, terakota (ana vurgu), adaçayı yeşili (ikincil), kahve (başlıklar).
- Yazı tipleri `@fontsource-variable` ile siteyle birlikte barındırılır. Google Fonts CDN **kullanma** (KVKK + hız).
- Mobil öncelikli: temel stil telefona göre yazılır, `min-width` medya sorgularıyla genişletilir.
  Dokunma hedefleri en az 44px (dil seçici 36px, çevresindeki boşlukla birlikte yeterli); yatay kaydırma olmamalı.
- Görseller her zaman `astro:assets` `<Image>` ile, `alt` metni ve uygun `widths`/`sizes` ile kullanılır.
  İlk ekrandaki ana görsel `loading="eager" fetchpriority="high"`, diğerleri lazy.

## SEO

- Her sayfa `TemelLayout`'u kullanır; `dil`, `baslik`, `aciklama` ve `alternatifler` vermek **zorundadır**.
- `hreflang` (tr/en/ar + x-default=tr) ve `og:locale:alternate` etiketleri `alternatifler`'den otomatik üretilir.
- Canonical adres `temizYol()` ile `.html` ekinden arındırılır (build `format: 'file'` kullanıyor).
- OG görseli: yerel görsel `ogGorsel` prop'u ile verilir → 1200×630 JPG otomatik üretilir;
  verilmezse `public/og/varsayilan.jpg` kullanılır.
- Tarif sayfaları `Recipe`, e-kitap sayfası `Product`, ana sayfa `WebSite` JSON-LD üretir (`inLanguage` ile).
- Sitemap `@astrojs/sitemap` ile otomatik; RSS her dil için ayrı (`/rss.xml`, `/en/rss.xml`, `/ar/rss.xml`).
- Alan adı değişirse 3 yeri güncelle: `astro.config.mjs` (`site`), `src/site.config.ts` (`url`),
  `public/robots.txt` (Sitemap satırı).

## E-kitap ve ödeme

- Satış iki kanaldan yapılır: `turkiye` (Shopier, TL) ve `yurtdisi` (Gumroad, $). Her kanalın sağlayıcı adı,
  para birimi `src/site.config.ts → ekitap.satis` içinde sabittir; fiyat, eski fiyat, link ve sayfa sayısı
  `src/data/satis.json` içindedir (panel → Satış ve fiyatlar).
  `ekitap.dilKanali` hangi dilin hangi kanalı göstereceğini belirler (tr → turkiye, en/ar → yurtdisi);
  diğer kanal, linki hazırsa satın alma kutusunda küçük bir link olarak çıkar.
- Fiyatı her zaman kanalın para birimiyle biçimle: `fiyatBicimle(dil, k.fiyat, k.paraBirimi)`.
- Başlık, alt başlık, kapak, içindekiler ve SSS her dil için `src/data/<dil>/ekitap.json` içindedir (panel → E-kitap).
- Bir kanalın `link`'i `#` ile başladığı sürece o kanalın "Satın Al" butonu pasif görünür ve "Satış çok yakında" yazar.
  Gerçek link girilince buton (ve mobildeki yapışkan satın alma çubuğu) yeni sekmede ödeme sayfasını açar.
- Kopya koruması "sosyal DRM"dir: her PDF'e alıcının e-postası basılır (Gumroad kendisi yapar, Shopier için
  `npm run damgala -- <pdf> <eposta> [sipariş]`, `scripts/pdf-damgala.mjs`). Kurulum, sipariş akışı, PDF'teki
  telif sayfası ve sızıntı durumunda yapılacaklar için **`EKITAP-SATIS.md`**.
- E-kitap PDF'i ve `damga-kaydi.csv` asla proje klasörüne konmaz (`.gitignore` ayrıca engeller).
- E-kitap Türkçe ise en/ar sayfalarında `dilNotu` bunu belirtir.
- Sitede ödeme formu, kart bilgisi veya kullanıcı verisi toplanmaz; ödeme tamamen harici sağlayıcıdadır.

## Yönetim paneli (Sveltia CMS)

- Git tabanlı panel: `public/admin/index.html` + `public/admin/config.yml`. Sunucu veya veritabanı yok;
  panel doğrudan `src/content/blog/<dil>/*.md` ve `src/data/**` dosyalarını düzenler.
- **Sitedeki her içerik panelden yönetilir:** Tarifler · Sayfalar (Ana sayfa, Hakkımda, İletişim, tarif sayfalarının
  ortak yazıları, menü ve alt bilgi) · E-kitap · Satış ve fiyatlar · Yasal metinler · Kategoriler · Site ayarları.
  Sayfa fotoğrafları (karşılama, Hakkımda, e-kitap kapağı) da panelden değişir. Kodda kalanlar: logo, renkler, sayfa düzeni.
- **`config.yml` elle düzenlenmez**, `npm run panel` ile `scripts/panel-ayarlari.mjs`'ten üretilir. Sayfa metinlerinin
  alanları JSON yapısından otomatik çıkar; betikte yalnızca Türkçe etiketler/ipuçları ve tarif, satış, kategori,
  ayar formları tanımlıdır. JSON'a anahtar eklediğinde etiketini betiğe ekleyip `npm run panel` çalıştır.
- Panel boş alanları dosyaya `''` / `null` olarak yazar (`omit_empty_optional_fields: false`), böylece JSON'da anahtar
  kaybolmaz. Tarif şeması (`content.config.ts → istegeBagli`) bu boş değerleri "yok" sayar.
- **Yerelde kullanım (Chrome/Edge):** `npm run dev` → http://localhost:4321/admin/index.html →
  "Yerel Repo ile Çalış" → proje klasörünü seç. Kaydedilenler doğrudan dosyalara yazılır, dev sunucusu anında gösterir.
  Sonra değişiklikleri git ile commit et. (Firefox/Safari'de yerel mod çalışmaz.)
- **Yayındaki site üzerinden kullanım:** Panel `adnaanyilmaz/e-book` deposuna yazar (`panel-ayarlari.mjs → backend.repo`;
  depo değişirse orayı güncelle ve `npm run panel` çalıştır). Giriş, GitHub'da oluşturulan kişisel erişim anahtarıyla yapılır
  (fine-grained token, yalnızca bu depo, Contents: Read and write). Her kayıt bir commit olur ve site yeniden build edilir.
- Tarif şemasını (`src/content.config.ts`) değiştirirsen `panel-ayarlari.mjs`'teki tarif formunu da güncelle.
- Görseller panelden `src/assets/` (tarif kapakları `src/assets/tarifler/`) altına yüklenir ve dosyaya
  `"@/assets/..."` yolu yazılır; `lib/gorsel.ts` bunu çözer. Arapça alanlar panelde sağdan sola görünür.
- Panelin sürümü `index.html`'de sabittir (`@sveltia/cms@0.253.2`); yükseltmeden önce sürüm notlarını oku.
- `/admin/` arama motorlarına kapalıdır (`robots.txt` + `noindex`).

## Yasal sayfalar

- KVKK, mesafeli satış sözleşmesi, iade koşulları ve çerez politikası şu an **şablondur**
  (`src/data/<dil>/yasal.json → yasalMetinler`, panel → Yasal metinler).
  `[DOLDURULACAK]` alanları hukukçu kontrolünde doldurulmadan satışa başlanmamalı.
- Bağlayıcı metin Türkçedir; en/ar sayfaları bilgilendirme amaçlı çeviridir ve bunu belirten not gösterir.
- Doldurulduğunda panel → Yasal metinler → "Şablon metin uyarısını göster" seçeneğini kapat ve her metnin
  "Son güncelleme tarihi"ni güncelle.
- Siteye analitik/reklam aracı (çerez kullanan bir şey) eklenirse çerez politikası güncellenmeli ve onay bandı eklenmeli.

## Bekleyen işler

- [ ] Kendi fotoğrafları: şu an stok fotoğraflar var. `hero.jpg`, `hakkimda.jpg` ve OG görseli Unsplash'ten
      (lisans kaynak göstermeyi şart koşmuyor). Tarif kapakları Wikimedia Commons'tan (CC BY-SA), bu yüzden
      md dosyalarında `kapakKaynak` var; kendi fotoğrafını koyunca o bloğu sil. `ekitap-kapak.jpg` hero
      fotoğrafından üretildi ve kitap adı ("Evin Tadı") resmin içine yazılı: ad kesinleşince yeniden yap.
- [ ] Alan adı
- [ ] E-kitap adı, fiyatı, içindekiler ve SSS (3 dilde; panel → E-kitap, Satış ve fiyatlar)
- [ ] Shopier ve Gumroad hesapları, ürün linkleri ve dolar fiyatı (panel → Satış ve fiyatlar; adımlar `EKITAP-SATIS.md`)
- [ ] SSS'teki teslim süresi (24 saat) ve mesafeli satış Madde 4.1 lisans metni hukukçu kontrolünde
- [ ] İletişim e-postası, Hakkımda metni (3 dilde)
- [ ] Yasal metinler
- [ ] Arapça metinlerin anadili Arapça olan biri tarafından gözden geçirilmesi
- [ ] Node 22 + Astro 7 yükseltmesi (yayın öncesi)
- [ ] Örnek tarifleri (`Örnek tarif` / `Sample recipe` / `وصفة تجريبية` notlu olanlar) gerçek tariflerle değiştir
