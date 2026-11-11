# Naif Mutfak — proje kuralları

Instagram'daki @naifmutfakk yemek hesabının web sitesi. Astro ile üretilen, tamamen statik, Türkçe bir site.
Ziyaretçilerin çoğu Instagram'dan telefonla geliyor: **her değişiklik önce mobilde (375px) doğru görünmeli.**

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
  site.config.ts        TEK AYAR DOSYASI: site adı, URL, Instagram, e-posta,
                        e-kitap fiyatı + ödeme linki, menü, kategoriler, biçimleyiciler
  content.config.ts     blog koleksiyonu şeması (Zod)
  content/blog/*.md     tarifler (dosya adı = URL: /blog/<dosya-adi>)
  assets/               logo, hero, e-kitap kapağı, tarif görselleri (astro:assets ile optimize edilir)
  components/           Header, Footer, SEO, TarifKarti, TarifListesi, EkitapVitrin
  layouts/              TemelLayout (her sayfa), YasalLayout (yasal metinler)
  lib/tarifler.ts       yayindakiTarifler(): taslakları eler, tarihe göre sıralar
  pages/                her dosya bir URL
  styles/global.css     tasarım değerleri (CSS değişkenleri) + ortak sınıflar
public/                 favicon, robots.txt, og/varsayilan.jpg (dokunulmadan kopyalanır)
```

## Yeni tarif ekleme

1. Kapak görselini `src/assets/tarifler/<slug>.jpg` olarak koy (yatay, en az 1200px genişlik).
2. `src/content/blog/<slug>.md` oluştur. Frontmatter alanları:

```yaml
---
baslik: Mercimek Çorbası            # zorunlu, en fazla 80 karakter
aciklama: Tek cümlelik özet.        # zorunlu, en fazla 170 karakter (meta description)
tarih: 2026-11-04                   # zorunlu
guncelleme: 2026-11-20              # isteğe bağlı
kapak: ../../assets/tarifler/<slug>.jpg   # zorunlu, göreli yol
kapakAlt: Görselin açıklaması       # zorunlu (erişilebilirlik + SEO)
kategori: corbalar                  # zorunlu, site.config.ts → kategoriler
hazirlamaSuresi: 10                 # zorunlu, dakika (tam sayı)
pisirmeSuresi: 30                   # isteğe bağlı, dakika
porsiyon: 4 kişilik                 # isteğe bağlı
malzemeler:                         # isteğe bağlı ama önerilir; sayfada kutu + Google tarif şeması
  - 1 su bardağı mercimek
taslak: false                       # true ise yayınlanmaz
---
```

3. Gövdeye hikâye + `## Hazırlanışı` (numaralı liste) + isteğe bağlı `## Püf noktası` yaz.
   **Malzemeleri gövdede tekrar yazma**; frontmatter'daki liste sayfada otomatik gösterilir.
4. Yeni kategori gerekirse `site.config.ts` içinde hem `kategoriler` dizisine hem `kategoriAdlari`na ekle.

## Adlandırma kuralları

- URL / dosya adı (slug): küçük harf, Türkçe karakterden arındırılmış, kelimeler tireyle:
  `zeytinyagli-taze-fasulye` (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u).
- Kod içindeki değişken ve bileşen adları Türkçe (`baslik`, `TarifKarti`); bu tutarlılık korunmalı.
- Kullanıcıya görünen tüm metinler Türkçe ve samimi “sen” diliyle yazılır.
- Tarih ve fiyatlar için daima `tarihBicimle()` / `fiyatBicimle()` kullan (tr-TR biçimi).

## Tasarım

- Renk, yazı tipi, köşe ve gölge değerleri **yalnızca** `src/styles/global.css` içindeki `:root` değişkenlerinden
  alınır; bileşenlerde sabit renk kodu yazma.
- Palet: krem zemin, terakota (ana vurgu), adaçayı yeşili (ikincil), kahve (başlıklar).
- Yazı tipleri: Fraunces (başlık), Nunito (metin); `@fontsource-variable` ile siteyle birlikte barındırılır.
  Google Fonts CDN **kullanma** (KVKK + hız).
- Mobil öncelikli: temel stil telefona göre yazılır, `min-width` medya sorgularıyla genişletilir.
  Dokunma hedefleri en az 44px; yatay kaydırma olmamalı.
- Görseller her zaman `astro:assets` `<Image>` ile, `alt` metni ve uygun `widths`/`sizes` ile kullanılır.
  İlk ekrandaki ana görsel `loading="eager" fetchpriority="high"`, diğerleri lazy.
- Hareketler `prefers-reduced-motion` kullanıcısına saygı göstermeli.

## SEO

- Her sayfa `TemelLayout`'u kullanır ve `baslik` + `aciklama` vermek **zorundadır**.
- OG görseli: yerel görsel `ogGorsel` prop'u ile verilir → 1200×630 JPG otomatik üretilir;
  verilmezse `public/og/varsayilan.jpg` kullanılır.
- Tarif sayfaları `Recipe`, e-kitap sayfası `Product`, ana sayfa `WebSite` JSON-LD üretir.
- Sitemap `@astrojs/sitemap` ile otomatik; RSS `/rss.xml`.
- Alan adı değişirse 3 yeri güncelle: `astro.config.mjs` (`site`), `src/site.config.ts` (`url`),
  `public/robots.txt` (Sitemap satırı).

## E-kitap ve ödeme

- Fiyat, eski fiyat, sayfa sayısı ve **ödeme linki** `src/site.config.ts` → `ekitap` içindedir.
- `odemeLinki` `#` ile başladığı sürece "Satın Al" butonu pasif görünür ve "Satış çok yakında" yazar.
  Gerçek link girilince buton otomatik olarak yeni sekmede ödeme sayfasını açar.
- Sitede ödeme formu, kart bilgisi veya kullanıcı verisi toplanmaz; ödeme tamamen harici sağlayıcıdadır.

## Yasal sayfalar

- `kvkk`, `mesafeli-satis-sozlesmesi`, `iade-kosullari`, `cerez-politikasi` şu an **şablondur**.
  `[DOLDURULACAK]` alanları hukukçu kontrolünde doldurulmadan satışa başlanmamalı.
- Doldurulduğunda `YasalLayout` içindeki "Şablon metin" uyarısını kaldır ve `guncelleme` tarihini güncelle.
- Siteye analitik/reklam aracı (çerez kullanan bir şey) eklenirse çerez politikası güncellenmeli ve onay bandı eklenmeli.

## Bekleyen işler

- [ ] Gerçek logo ve görseller (`src/assets/` içindekiler şu an GEÇİCİ GÖRSEL yer tutucuları)
- [ ] Alan adı
- [ ] E-kitap adı, fiyatı, içindekiler ve SSS (`site.config.ts`, `pages/e-kitap.astro`)
- [ ] Ödeme linki
- [ ] İletişim e-postası, Hakkımda metni
- [ ] Yasal metinler
- [ ] Node 22 + Astro 7 yükseltmesi (yayın öncesi)
- [ ] Örnek tarifleri (`> **Örnek tarif.**` notlu olanlar) gerçek tariflerle değiştir
