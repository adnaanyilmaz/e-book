# CLAUDE.md — Lezzet Kütüphanesi (Yemek Tarifi E-Kitap Satış Sitesi)

## Proje Özeti

Bu proje, yemek tarifleri içeren e-kitaplar satan bir web sitesidir.
Site **Türkçe** olarak hazırlanmıştır ve tamamen statik (frontend-only) bir yapıdadır:

- Sunucu / backend yoktur; tüm işlevler tarayıcıda çalışır.
- Ödeme adımı **simülasyondur** (gerçek ödeme entegrasyonu yoktur).
- E-kitap verileri `js/data.js` içinde JS nesnesi olarak tutulur.

## Kullanılan Teknolojiler

- **HTML5** — semantik yapı (`header`, `nav`, `main`, `article`, `footer`)
- **CSS3** — tek stil dosyası (`css/style.css`), CSS değişkenleri, responsive tasarım (mobil öncelikli)
- **Vanilla JavaScript** — framework yok; `js/data.js` (veri) ve `js/main.js` (işlevler)

Kurulum, derleme (build) adımı veya bağımlılık (npm paketi vb.) **yoktur**.
Siteyi görüntülemek için dosyaları bir tarayıcıda açmak yeterlidir
(örn. `index.html`). Sepet verisi `localStorage` üzerinde `lezzet_sepet` anahtarında saklanır.

## Dosya Yapısı

```
deneme_claude/
├── CLAUDE.md          # Bu dosya — proje kuralları
├── index.html         # Ana sayfa (kampanyalar, öne çıkan kitaplar, kategori grafiği)
├── kitaplar.html      # Tüm e-kitap kataloğu; arama + kategori filtresi + sıralama
├── kitap.html         # Kitap detay sayfası (?id=... parametresi ile)
├── sepet.html         # Sepet ve ödeme simülasyonu
├── hakkinda.html      # Hakkımızda
├── iletisim.html      # İletişim (form gönderimi simüle edilir)
├── css/
│   └── style.css      # Tüm stiller — yeni stiller buraya eklenir
└── js/
    ├── data.js        # E-kitap verileri (tek doğruluk kaynağı)
    └── main.js        # Ortak işlevler: sepet, render, filtre, tema
```

## Kod Kuralları

- **Dil:** Kullanıcıya görünen tüm metinler Türkçe; kod yorumları da Türkçe yazılır.
- **Veri:** Yeni e-kitap eklemek için yalnızca `js/data.js` içindeki `EBOOKS`
  dizisine yeni bir nesne eklenir; HTML elle düzenlenmez (kartlar JS ile render edilir).
- **Kimlikler:** Kitap `id`leri kebab-case ve benzersiz olmalıdır (örn. `turk-mutfagi-klasikleri`).
- **Sepet:** `main.js` içindeki sepet API'si kullanılır:
  `sepeteEkle(id)`, `sepettenCikar(id)`, `sepetiGuncelle(id, adet)`, `sepetAdeti()`.
  Sepet mantığına dokunulduğunda hem `index.html` hem `sepet.html` üzerinde test edilir.
- **Stil:** Renkler `:root` içindeki CSS değişkenlerinden alınır; hardcoded renk kullanılmaz.
  Site açık/koyu tema destekler (`data-theme` özniteliği + `body.tema-secici`).
- **Erişilebilirlik:** Görsellerde `alt` metni, formlarda `label`, butonlarda
  anlamlı metin bulunur. Kontrast oranlarına dikkat edilir.
- **Görselleştirme:** Sayfaya grafik/istatistik öğesi (grafik, KPI satırı, gösterge)
  eklenmeden önce `dataviz` skill'i okunur ve renk/kural önerileri uygulanır.

## Test

Otomatik test yoktur. Değişiklik sonrası tarayıcıda şunlar kontrol edilir:

1. `index.html` açılır — öne çıkan kitaplar ve grafik görüntülenir.
2. `kitaplar.html` — arama, kategori filtresi ve sıralama çalışır.
3. Bir kitap detayına gidilir, sepete eklenir; `sepet.html`'de adet güncellenir.
4. Ödeme formu doldurulur, simüle edilmiş satın alma akışı tamamlanır.
5. Sayfa ~360px genişlikte (mobil) kontrol edilir.
