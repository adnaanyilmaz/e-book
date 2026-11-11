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
  site.config.ts        dilden bağımsız ayarlar: URL, Instagram, e-posta, e-kitap fiyatı + ödeme linki, kategoriler
  i18n/
    diller.ts           desteklenen diller, yön (ltr/rtl), tarih + fiyat biçimleyiciler
    yollar.ts           HER SAYFANIN HER DİLDEKİ ADRESİ (sayfaYolu, kategoriYolu, tarifYolu)
    ceviriler.ts        tüm arayüz metinleri (tr / en / ar), doldur() ve parcala() yardımcıları
    yasal.ts            yasal sayfaların şablon içeriği (3 dil)
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
  assets/               logo, hero, e-kitap kapağı, tarif görselleri (astro:assets ile optimize edilir)
  styles/global.css     tasarım değerleri (CSS değişkenleri) + ortak sınıflar + Arapça ayarları
public/                 favicon, robots.txt, og/varsayilan.jpg
```

## Çoklu dil

- Türkçe varsayılan dildir ve önek almaz: `/hakkimda`. İngilizce `/en/about`, Arapça `/ar/about`.
- **Adresleri asla elle yazma**; daima `sayfaYolu(dil, 'hakkimda')`, `kategoriYolu(...)`, `tarifUrl(tarif)` kullan.
  Adres değiştirmek için yalnızca `src/i18n/yollar.ts`'i düzenle.
- **Arayüzde sabit metin yazma**; metni `src/i18n/ceviriler.ts` içinde üç dile birden ekle,
  bileşende `ceviri(dil).bolum.anahtar` ile kullan. `tr` kaynak yapıdır; `en`/`ar`'da eksik anahtar
  build'de tip hatası verir.
- Metin içine link/değer gerekiyorsa `{yer_tutucu}` kullan: düz metin için `doldur()`, link için `parcala()`.
- Her sayfa `TemelLayout`'a `dil` ve `alternatifler` (diğer dillerdeki adresleri) verir; dil seçici ve
  `hreflang` etiketleri buradan üretilir.
- Yeni sayfa: `yollar.ts → sayfaSluglari` + `src/views/` altında görünüm + `[...yol].astro` içinde ekle.
- Yeni dil: `diller.ts` (diller + dilBilgisi), `yollar.ts` (tüm slug tabloları), `ceviriler.ts`, `yasal.ts`,
  `src/content/blog/<dil>/`, `src/pages/<dil>/rss.xml.ts`.

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
kapak: ../../../assets/tarifler/<anahtar>.jpg   # zorunlu, göreli yol (dil klasöründen 3 seviye yukarı)
kapakAlt: Görselin açıklaması       # zorunlu (erişilebilirlik + SEO)
kategori: corbalar                  # zorunlu, site.config.ts → kategoriler (her dilde aynı anahtar)
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
6. Yeni kategori: `site.config.ts → kategoriler`, `ceviriler.ts → kategoriler` (3 dil),
   `yollar.ts → kategoriSluglari`.

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

- Fiyat, eski fiyat, sayfa sayısı ve **ödeme linki** `src/site.config.ts` → `ekitap` içindedir;
  başlık, alt başlık, içindekiler ve SSS her dil için `ceviriler.ts → ekitap` içindedir.
- `odemeLinki` `#` ile başladığı sürece "Satın Al" butonu pasif görünür ve "Satış çok yakında" yazar.
  Gerçek link girilince buton (ve mobildeki yapışkan satın alma çubuğu) yeni sekmede ödeme sayfasını açar.
- E-kitap Türkçe ise en/ar sayfalarında `dilNotu` bunu belirtir.
- Sitede ödeme formu, kart bilgisi veya kullanıcı verisi toplanmaz; ödeme tamamen harici sağlayıcıdadır.

## Yasal sayfalar

- KVKK, mesafeli satış sözleşmesi, iade koşulları ve çerez politikası şu an **şablondur** (`src/i18n/yasal.ts`).
  `[DOLDURULACAK]` alanları hukukçu kontrolünde doldurulmadan satışa başlanmamalı.
- Bağlayıcı metin Türkçedir; en/ar sayfaları bilgilendirme amaçlı çeviridir ve bunu belirten not gösterir.
- Doldurulduğunda `YasalLayout` içindeki "Şablon metin" uyarısını kaldır ve `yasalGuncelleme` tarihini güncelle.
- Siteye analitik/reklam aracı (çerez kullanan bir şey) eklenirse çerez politikası güncellenmeli ve onay bandı eklenmeli.

## Bekleyen işler

- [ ] Gerçek logo ve fotoğraflar (`src/assets/` içindekiler şu an GEÇİCİ GÖRSEL yer tutucuları)
- [ ] Alan adı
- [ ] E-kitap adı, fiyatı, içindekiler ve SSS (3 dilde, `ceviriler.ts` + `site.config.ts`)
- [ ] Ödeme linki
- [ ] İletişim e-postası, Hakkımda metni (3 dilde)
- [ ] Yasal metinler
- [ ] Arapça metinlerin anadili Arapça olan biri tarafından gözden geçirilmesi
- [ ] Node 22 + Astro 7 yükseltmesi (yayın öncesi)
- [ ] Örnek tarifleri (`Örnek tarif` / `Sample recipe` / `وصفة تجريبية` notlu olanlar) gerçek tariflerle değiştir
