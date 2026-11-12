# E-kitap satışı ve kopya koruması

Bu belge, e-kitabın nasıl satılacağını, kopyalanmasının nasıl caydırılacağını ve telif hakkının
nasıl korunacağını anlatır. Siteyle ilgili teknik kurallar `CLAUDE.md` içindedir.

## Kısaca

| | Türkiye | Yurt dışı |
|---|---|---|
| Platform | Shopier | Gumroad |
| Para birimi | TL | $ |
| Hangi sayfa | Türkçe sayfa (`/e-kitap`) | İngilizce ve Arapça sayfalar |
| PDF'e alıcı damgası | Sen basarsın (`npm run damgala`) | Gumroad otomatik basar |
| Teslim | Sen e-postayla gönderirsin (24 saat içinde) | Otomatik, birkaç dakika |

Her sayfada diğer platform için de küçük bir link çıkar (ör. yurt dışındaki bir Türk okur dolarla alabilir).

## 1. Kurulum

### Gumroad (yurt dışı)

1. gumroad.com'da hesap aç. Ödeme ayarlarında Türk banka hesabını (TL) ekle.
   Türkiye'nin listede olduğunu ve en düşük ödeme tutarını hesabında kontrol et.
2. Yeni ürün → dijital ürün. PDF'i yükle.
3. **Content** sekmesinde dosyanın altındaki **"Stamp PDFs with the buyer information"** seçeneğini aç.
   PDF'te parola veya kopyalama koruması varsa bu özellik çalışmaz; önce korumayı kaldır.
4. Fiyatı dolar olarak gir ve aynı rakamı yönetim panelinde **Satış ve fiyatlar → Yurt dışı satışı → Fiyat** alanına yaz.
5. Ürün açıklamasına lisans notunu ekle (aşağıdaki "PDF'in içine" metninin kısa hali yeterli).
6. Ürünün satış linkini aynı yerdeki **Gumroad ürün linki** alanına yapıştır.

### Shopier (Türkiye)

1. Shopier hesabını aç (vergi durumun için mali müşavirine danış).
2. Ürünü **dijital ürün** olarak ekle, ama **PDF'i Shopier'e yükleme**. Yüklersen Shopier herkese aynı,
   damgasız dosyayı gönderir. Bunun yerine ürün açıklamasına şunu yaz:
   "Ödemenden sonra sana özel hazırlanan PDF en geç 24 saat içinde e-posta adresine gönderilir."
3. Fiyatı ve ürün linkini yönetim panelinde **Satış ve fiyatlar → Türkiye satışı** altına yaz.

> Damgasız ama anında teslim istersen: PDF'i Shopier'e yükleyip otomatik teslimi açabilirsin.
> Bu durumda Türkiye'deki kopyalar kişiye özel olmaz. Sitedeki "her kopya işaretlenir" cümlesini ve
> SSS'teki teslim cevabını (panel → E-kitap → Sıkça sorulan sorular) buna göre değiştir.

## 2. Shopier siparişi gelince

```bash
npm run damgala -- "C:\Users\...\E-kitap\evin-tadi.pdf" alici@ornek.com 100245
```

- Her sayfanın altına küçük gri bir satır basılır:
  `Licensed to alici@ornek.com · Order #100245 · Personal use only. Copying or sharing is prohibited.`
- Çıktı, asıl PDF'in yanına `evin-tadi-alici-ornek-com.pdf` adıyla kaydedilir. Bu dosyayı alıcıya e-postayla gönder.
- Aynı klasördeki `damga-kaydi.csv` dosyasına satış kaydı ve dosyanın parmak izi (SHA-256) eklenir.

**Asıl PDF'i ve `damga-kaydi.csv` dosyasını bu proje klasörüne koyma.** Proje klasörü yayına gidebilir.
`.gitignore` güvence olsun diye `*.pdf` ve `damga-kaydi.csv` dosyalarını hariç tutuyor, ama dosyaları ayrı
bir klasörde tutmak daha güvenli. Kayıt dosyası alıcı e-postaları içerdiği için kişisel veridir.

## 3. PDF'in içine konacaklar

Kitabı hazırlarken (Canva, InDesign vb.) **ikinci sayfaya** bir telif sayfası koy:

> © 2026 [Ad Soyad]. Tüm hakları saklıdır.
>
> Bu e-kitap yalnızca satın alan kişinin kişisel kullanımı içindir. Kitabın tamamı veya bir kısmı
> yazılı izin olmadan kopyalanamaz, paylaşılamaz, yeniden satılamaz, internette ya da sosyal medyada
> yayımlanamaz. Tarifleri kendi mutfağında dilediğin kadar pişirebilir, kendin için yazdırabilirsin.
> Her kopya alıcısının bilgileriyle işaretlenmiştir.
>
> Bir tarifi paylaşmak istersen, kaynak olarak @naifmutfakk etiketiyle paylaşman yeterli.
>
> İletişim: [e-posta]

Ayrıca:
- **Kendi fotoğraflarını kullan.** Sitedeki stok fotoğraflar (CC BY-SA) e-kitapta kullanılırsa kitabın da
  aynı lisansla paylaşılması gerekebilir. Kitapta yalnızca kendi fotoğrafların olsun.
- Fotoğraflara köşede küçük bir `@naifmutfakk` yazısı koymak, ekran görüntüsüyle yayılmayı da işaretler.
- PDF'e parola veya kopyalama kilidi **koyma**: Gumroad damgası çalışmaz, okurları rahatsız eder ve kolayca kırılır.

## 4. Kopyalamaya karşı gerçekçi beklenti

Bir PDF'in paylaşılmasını teknik olarak tamamen engellemek mümkün değil. Gumroad da damganın DRM olmadığını
söylüyor. Amaç, paylaşmayı **zahmetli ve riskli** hale getirmek:

1. **Kişiye özel damga:** Paylaşan kişi kendi e-postasını da yaymış olur. Çoğu insanı bu durdurur.
2. **Açık lisans:** Satış sayfası, SSS, mesafeli satış sözleşmesi ve PDF'in kendisi paylaşmanın yasak olduğunu söylüyor.
3. **Kolay ve uygun fiyat:** İnsanlar ucuz ve kolay alınabilen şeyi korsana daha az arar.
4. **Takip:** Ara sıra kitabın adını Google'da, Telegram'da ve "pdf indir" sitelerinde arat.

## 5. Bir kopya bulursan

1. Ekran görüntüsü al, linki ve tarihi not et.
2. Damgadaki e-postaya bak. Damga silinmişse dosyanın SHA-256 özetini `damga-kaydi.csv` ile karşılaştır
   (PowerShell: `Get-FileHash dosya.pdf`). Gumroad satışlarında e-posta damgası yeterlidir.
3. Platforma kaldırma talebi gönder: Instagram/Facebook, Telegram, Google ("telif hakkı kaldırma talebi")
   ve site barındırıcılarının telif bildirim formları var. Talepte eserin sana ait olduğunu,
   satış sayfanı ve ilk yayın tarihini göster.
4. Damgadaki kişiye nazik ama net bir e-posta yaz. Gerekirse hukukçuna danış.

## 6. Telif hakkı

- Türkiye'de eser sahibinin hakları **eser yaratıldığı anda** doğar (5846 sayılı FSEK). Korunmak için bir
  yere kayıt yaptırmak zorunlu değil.
- **Kanıt hazırla:** Kitabın son halini, taslaklarını ve ham fotoğraflarını tarihli olarak sakla.
  İstersen noter onaylı tarih tespiti ya da Kültür ve Turizm Bakanlığı Telif Hakları Genel Müdürlüğü'nde
  isteğe bağlı kayıt da yaptırabilirsin.
- **e-ISBN** zorunlu değil, ama kitabı "resmi" gösterir. Kültür ve Turizm Bakanlığı'ndaki ISBN Türkiye Ajansı'ndan
  alınıyor. Şartlarını ve ücretini başvurmadan önce kontrol et.
- Bir malzeme listesinin kendisi genelde korunmaz. Korunan şey **senin yazdığın anlatım, fotoğrafların ve
  kitabın düzeni**dir. Bu yüzden kitabın kendi sesinle yazılmış ve kendi fotoğraflarınla hazırlanmış olması önemli.

## 7. Hukukçuya ve mali müşavire sorulacaklar

- Mesafeli satış sözleşmesindeki **Madde 4.1 (lisans)** maddesinin son hali (panel → Yasal metinler).
- Gumroad satışlarında satıcının kim sayıldığı (Gumroad "merchant of record" olarak vergileri üstleniyor
  mu?) ve bunun mesafeli satış ve KVKK metinlerine nasıl yansıyacağı.
- KVKK: Gumroad ABD merkezli, yani yurt dışına veri aktarımı var. Aydınlatma metnine eklenmeli.
- Dijital ürün satışının vergisi (KDV oranı, fatura/e-arşiv) ve Shopier ile Gumroad gelirlerinin beyanı.
