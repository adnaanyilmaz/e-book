// js/main.js — Ortak işlevler: sepet, render, filtre, tema, grafik
// Sayfalar <body data-sayfa="..."> özniteliğiyle kendilerini tanıtır;
// ilgili başlatma işlevi DOM hazır olduğunda çalışır.

"use strict";

/* ============================================================
   Yardımcılar
   ============================================================ */

// Türk Lirası para formatı
function paraFormati(tutar) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(tutar);
}

// Sayıları Türkçe biçimde yazar (1.250 gibi)
function sayiFormati(n) {
  return new Intl.NumberFormat("tr-TR").format(n);
}

function kitapBul(id) {
  return EBOOKS.find((k) => k.id === id) || null;
}

// Puanı yıldızlara çevirir (4.8 -> ★★★★¾'ye en yakın tam gösterim)
function yildizHtml(puan) {
  var tam = Math.round(puan);
  var yildizlar = "";
  for (var i = 0; i < 5; i++) yildizlar += i < tam ? "★" : "☆";
  return '<span class="yildizlar" aria-hidden="true">' + yildizlar + "</span>";
}

function puanHtml(kitap) {
  return (
    '<span class="puan">' +
    yildizHtml(kitap.puan) +
    "<span>" +
    kitap.puan.toLocaleString("tr-TR") +
    " (" +
    sayiFormati(kitap.yorumSayisi) +
    " değerlendirme)</span></span>"
  );
}

function kapakStili(kitap) {
  return (
    "background: linear-gradient(150deg, " +
    kitap.kapak.g1 +
    ", " +
    kitap.kapak.g2 +
    ")"
  );
}

function kacirdim(kitap) {
  // İndirim yüzdesi; indirim yoksa null
  if (!kitap.eskiFiyat) return null;
  return Math.round((1 - kitap.fiyat / kitap.eskiFiyat) * 100);
}

// Kitap adı gibi kullanıcı verisi olabilecek metinleri güvenli yazar.
// EBOOKS birinci elden veri olsa da, tutarlılık için hep bunu kullanıyoruz.
function metinGuvenli(metin) {
  var kutu = document.createElement("span");
  kutu.textContent = metin;
  return kutu.innerHTML;
}

/* ============================================================
   Sepet (localStorage üzerinde "lezzet_sepet" anahtarı)
   ============================================================ */

function sepetiOku() {
  try {
    var ham = JSON.parse(localStorage.getItem(SEPET_ANAHTAR) || "{}");
    return ham && typeof ham === "object" ? ham : {};
  } catch (hata) {
    return {};
  }
}

function sepetiKaydet(sepet) {
  localStorage.setItem(SEPET_ANAHTAR, JSON.stringify(sepet));
  sepetRozetiniGuncelle();
}

function sepeteEkle(id, adet) {
  var sepet = sepetiOku();
  sepet[id] = (sepet[id] || 0) + (adet || 1);
  sepetiKaydet(sepet);
}

function sepettenCikar(id) {
  var sepet = sepetiOku();
  delete sepet[id];
  sepetiKaydet(sepet);
}

function sepetiGuncelle(id, adet) {
  if (adet <= 0) return sepettenCikar(id);
  var sepet = sepetiOku();
  sepet[id] = adet;
  sepetiKaydet(sepet);
}

function sepetAdeti() {
  var sepet = sepetiOku();
  return Object.values(sepet).reduce(function (t, a) {
    return t + a;
  }, 0);
}

function sepetToplami() {
  var sepet = sepetiOku();
  return Object.entries(sepet).reduce(function (t, giris) {
    var kitap = kitapBul(giris[0]);
    return t + (kitap ? kitap.fiyat * giris[1] : 0);
  }, 0);
}

function sepetiBosalt() {
  sepetiKaydet({});
}

function sepetRozetiniGuncelle() {
  var rozet = document.querySelector(".sepet-rozeti");
  if (!rozet) return;
  var adet = sepetAdeti();
  rozet.textContent = adet > 0 ? String(adet) : "";
  rozet.setAttribute("aria-label", "Sepette " + adet + " ürün");
}

/* ============================================================
   Küçük bildirim (toast)
   ============================================================ */

var toastZamanlayici = null;
function toastGoster(mesaj) {
  var kutu = document.querySelector(".toast");
  if (!kutu) return;
  kutu.textContent = mesaj;
  kutu.classList.add("acik");
  clearTimeout(toastZamanlayici);
  toastZamanlayici = setTimeout(function () {
    kutu.classList.remove("acik");
  }, 2400);
}

/* ============================================================
   Kitap kartı (kitaplar + ana sayfa + benzer kitaplar)
   ============================================================ */

function kitapKartiHtml(kitap) {
  var indirim = kacirdim(kitap);
  var eskiFiyatHtml = kitap.eskiFiyat
    ? '<span class="eski-fiyat">' + paraFormati(kitap.eskiFiyat) + "</span>"
    : "";
  return (
    '<article class="kitap-karti">' +
    '<a href="kitap.html?id=' +
    encodeURIComponent(kitap.id) +
    '" class="kitap-kapagi" style="' +
    kapakStili(kitap) +
    '" aria-label="' +
    metinGuvenli(kitap.baslik) +
    ' kapağı">' +
    (indirim ? '<span class="indirim-rozeti">%' + indirim + "</span>" : "") +
    "<span>" +
    kitap.kapak.emoji +
    "</span>" +
    '<span class="kapak-baslik">' +
    metinGuvenli(kitap.baslik) +
    "</span></a>" +
    '<span class="kategori-ciplaki">' +
    metinGuvenli(kitap.kategori) +
    "</span>" +
    "<h3><a href=\"kitap.html?id=" +
    encodeURIComponent(kitap.id) +
    '">' +
    metinGuvenli(kitap.baslik) +
    "</a></h3>" +
    '<div class="kart-meta"><span class="yazar">' +
    metinGuvenli(kitap.yazar) +
    "</span><span>" +
    sayiFormati(kitap.tarifSayisi) +
    " tarif</span></div>" +
    puanHtml(kitap) +
    '<div class="kart-alt">' +
    '<span class="fiyat">' +
    paraFormati(kitap.fiyat) +
    eskiFiyatHtml +
    "</span>" +
    '<button class="buton buton-kucuk sepete-ekle" data-id="' +
    kitap.id +
    '">Sepete ekle</button>' +
    "</div></article>"
  );
}

// Katalog gridine kitapları yazar
function kitaplariRender(hedef, kitaplar) {
  var kutu = document.querySelector(hedef);
  if (!kutu) return;
  if (!kitaplar.length) {
    kutu.innerHTML =
      '<p class="bos-sonuc">Aradığınız ölçütlere uyan e-kitap bulunamadı.</p>';
    return;
  }
  kutu.innerHTML = kitaplar.map(kitapKartiHtml).join("");
}

/* ============================================================
   Grafik: kategorilere göre tarif sayısı (tek serili yatay çubuk)
   dataviz kuralları: tek renk (seri-1), ince çubuklar, tabanda kare
   veri ucunda 4px yuvarlak, değerler metin rengiyle uçta, saç teli
   ızgara, çubuk başına hover/odak ipucu, tablo görünümü.
   ============================================================ */

function kategoriOzetleri() {
  var ozet = {};
  EBOOKS.forEach(function (k) {
    ozet[k.kategori] = (ozet[k.kategori] || 0) + k.tarifSayisi;
  });
  // Büyükten küçüğe sırala
  return Object.entries(ozet).sort(function (a, b) {
    return b[1] - a[1];
  });
}

function grafikIpucuGoster(ipucu, satir, kategori, deger) {
  ipucu.querySelector(".ipucu-deger").textContent = sayiFormati(deger) + " tarif";
  ipucu.querySelector(".ipucu-etiket").textContent = kategori + ": ";
  ipucu.style.display = "block";
  var kutu = satir.getBoundingClientRect();
  ipucu.style.left = Math.min(kutu.left + kutu.width / 2 - ipucu.offsetWidth / 2, window.innerWidth - ipucu.offsetWidth - 8) + "px";
  ipucu.style.top = kutu.top - ipucu.offsetHeight - 8 + "px";
}

function kategoriGrafiginiCiz() {
  var govde = document.querySelector("#kategori-grafigi .grafik-govde");
  if (!govde) return;

  var veri = kategoriOzetleri();
  var enBuyuk = veri[0][1];

  // Erişilebilirlik: grafiğin özetini aria-label olarak ver
  var grafik = document.getElementById("kategori-grafigi");
  grafik.setAttribute(
    "role",
    "img"
  );
  grafik.setAttribute(
    "aria-label",
    "Kategorilere göre toplam tarif sayısı: " +
      veri
        .map(function (d) {
          return d[0] + " " + sayiFormati(d[1]);
        })
        .join(", ")
  );

  govde.innerHTML = "";
  var ipucu = document.querySelector(".grafik-ipucu");

  veri.forEach(function (d) {
    var satir = document.createElement("div");
    satir.className = "cubuk-satiri";
    satir.tabIndex = 0; // klavye odağı — ipucu hover ile aynı içeriği verir

    var etiket = document.createElement("span");
    etiket.className = "cubuk-etiket";
    etiket.textContent = d[0];

    var alani = document.createElement("div");
    alani.className = "cubuk-alani";

    var cubuk = document.createElement("div");
    cubuk.className = "cubuk";
    cubuk.style.width = Math.max(2, Math.round((d[1] / enBuyuk) * 100)) + "%";

    alani.appendChild(cubuk);

    var deger = document.createElement("span");
    deger.className = "cubuk-degeri";
    deger.textContent = sayiFormati(d[1]);

    satir.append(etiket, alani, deger);

    // İpucu (tooltip): değerler çubuk uçlarında da yazılıdır; ipucu yalnızca
    // zenginleştirir, hiçbir bilgiyi tek başına taşımaz.
    satir.addEventListener("mouseenter", function () {
      grafikIpucuGoster(ipucu, satir, d[0], d[1]);
    });
    satir.addEventListener("focus", function () {
      grafikIpucuGoster(ipucu, satir, d[0], d[1]);
    });
    satir.addEventListener("mouseleave", function () {
      ipucu.style.display = "none";
    });
    satir.addEventListener("blur", function () {
      ipucu.style.display = "none";
    });

    govde.appendChild(satir);
  });

  // Tablo görünümü (renk/etkileşimden bağımsız erişim)
  var tablo = grafik.querySelector("tbody");
  if (tablo) {
    tablo.innerHTML = "";
    veri.forEach(function (d) {
      var tr = document.createElement("tr");
      var tdK = document.createElement("td");
      tdK.textContent = d[0];
      var tdD = document.createElement("td");
      tdD.textContent = sayiFormati(d[1]);
      tr.append(tdK, tdD);
      tablo.appendChild(tr);
    });
  }
}

/* ============================================================
   Ana sayfa
   ============================================================ */

function anasayfaBaslat() {
  // KPI satırı — veriler EBOOKS'tan hesaplanır
  var toplamTarif = EBOOKS.reduce(function (t, k) {
    return t + k.tarifSayisi;
  }, 0);
  var ortalamaPuan =
    EBOOKS.reduce(function (t, k) {
      return t + k.puan;
    }, 0) / EBOOKS.length;
  var kategoriSayisi = new Set(EBOOKS.map(function (k) {
    return k.kategori;
  })).size;

  var kpi = {
    "#kpi-kitap": sayiFormati(EBOOKS.length),
    "#kpi-tarif": sayiFormati(toplamTarif) + "+",
    "#kpi-puan": ortalamaPuan.toLocaleString("tr-TR", {
      minimumFractionDigits: 1,
    }),
    "#kpi-kategori": sayiFormati(kategoriSayisi),
  };
  Object.entries(kpi).forEach(function (giris) {
    var el = document.querySelector(giris[0]);
    if (el) el.textContent = giris[1];
  });

  // Öne çıkan kitaplar
  var oneCikanlar = EBOOKS.filter(function (k) {
    return k.oneCikan;
  });
  kitaplariRender("#one-cikan-kitaplar", oneCikanlar);

  kategoriGrafiginiCiz();

  // Hero kitap yığını (kapaklar)
  var yigin = document.querySelector(".hero-kitap-yigini");
  if (yigin) {
    yigin.innerHTML = oneCikanlar
      .slice(0, 3)
      .map(function (k) {
        return (
          '<div class="kitap-kapagi" style="' +
          kapakStili(k) +
          '" aria-hidden="true"><span>' +
          k.kapak.emoji +
          "</span></div>"
        );
      })
      .join("");
  }

  // Bülten formu (simülasyon)
  var bulten = document.querySelector(".bulten-formu");
  if (bulten) {
    bulten.addEventListener("submit", function (olay) {
      olay.preventDefault();
      var eposta = bulten.querySelector("input[type=email]").value.trim();
      if (!eposta) return;
      bulten.reset();
      toastGoster("Teşekkürler! Bültene kaydınız alındı.");
    });
  }
}

/* ============================================================
   Kitaplar sayfası — arama + kategori + sıralama
   Filtre satırı tek satır hâlinde, kapsadığı her şeyin üstünde.
   ============================================================ */

function kitaplarSayfasiBaslat() {
  var arama = document.getElementById("arama");
  var kategoriSec = document.getElementById("kategori-sec");
  var siralamaSec = document.getElementById("siralama-sec");
  var sonucSayisi = document.getElementById("sonuc-sayisi");

  // Kategori seçenekleri veriden üretilir
  var kategoriler = Array.from(
    new Set(EBOOKS.map(function (k) { return k.kategori; }))
  ).sort(function (a, b) { return a.localeCompare(b, "tr"); });
  kategoriler.forEach(function (k) {
    var secenek = document.createElement("option");
    secenek.value = k;
    secenek.textContent = k;
    kategoriSec.appendChild(secenek);
  });

  function filtrele() {
    var terim = arama.value.trim().toLocaleLowerCase("tr");
    var kategori = kategoriSec.value;
    var siralama = siralamaSec.value;

    var sonuc = EBOOKS.filter(function (k) {
      var terimUyar =
        !terim ||
        k.baslik.toLocaleLowerCase("tr").includes(terim) ||
        k.yazar.toLocaleLowerCase("tr").includes(terim) ||
        k.kategori.toLocaleLowerCase("tr").includes(terim);
      var kategoriUyar = kategori === "tumu" || k.kategori === kategori;
      return terimUyar && kategoriUyar;
    });

    var siralayicilar = {
      "onerilen": function (a, b) { return b.puan - a.puan; },
      "fiyat-artan": function (a, b) { return a.fiyat - b.fiyat; },
      "fiyat-azalan": function (a, b) { return b.fiyat - a.fiyat; },
      "puan": function (a, b) { return b.puan - a.puan; },
      "isim": function (a, b) { return a.baslik.localeCompare(b.baslik, "tr"); },
    };
    sonuc.sort(siralayicilar[siralama] || siralayicilar.onerilen);

    kitaplariRender("#kitap-listesi", sonuc);
    sonucSayisi.textContent =
      sayiFormati(sonuc.length) + " e-kitap listeleniyor";
  }

  arama.addEventListener("input", filtrele);
  kategoriSec.addEventListener("change", filtrele);
  siralamaSec.addEventListener("change", filtrele);

  filtrele();
}

/* ============================================================
   Kitap detay sayfası (?id=...)
   ============================================================ */

function kitapSayfasiBaslat() {
  var id = new URLSearchParams(window.location.search).get("id");
  var kitap = kitapBul(id);
  var hedef = document.getElementById("kitap-detayi");

  if (!kitap) {
    hedef.innerHTML =
      '<div class="bos-sepet"><div class="ikon">📖</div>' +
      "<h2>E-kitap bulunamadı</h2>" +
      '<p class="kart-meta">Aradığınız kitap kaldırılmış veya adres hatalı olabilir.</p>' +
      '<a class="buton" href="kitaplar.html">Tüm e-kitaplara göz at</a></div>';
    return;
  }

  document.title = kitap.baslik + " — Lezzet Kütüphanesi";
  window.scrollTo(0, 0);

  var indirim = kacirdim(kitap);
  var kapsamHtml = kitap.kapsam
    .map(function (m) { return "<li>" + metinGuvenli(m) + "</li>"; })
    .join("");

  hedef.innerHTML =
    '<div class="detay-izgarasi">' +
    '<div class="detay-sol"><div class="kitap-kapagi" style="' +
    kapakStili(kitap) +
    '">' +
    (indirim ? '<span class="indirim-rozeti">%' + indirim + "</span>" : "") +
    "<span>" +
    kitap.kapak.emoji +
    "</span>" +
    '<span class="kapak-baslik">' +
    metinGuvenli(kitap.baslik) +
    "</span></div></div>" +
    '<div class="detay-sag">' +
    '<span class="kategori-ciplaki">' +
    metinGuvenli(kitap.kategori) +
    "</span>" +
    "<h1>" +
    metinGuvenli(kitap.baslik) +
    "</h1>" +
    '<div class="kart-meta"><span class="yazar">' +
    metinGuvenli(kitap.yazar) +
    "</span></div>" +
    puanHtml(kitap) +
    '<p style="margin-top:14px">' +
    metinGuvenli(kitap.aciklama) +
    "</p>" +
    '<div class="ayrinti-ciplaklari">' +
    '<div class="ayrinti-ciplaki"><div class="ad">Tarif</div><div class="deger">' +
    sayiFormati(kitap.tarifSayisi) +
    '</div></div><div class="ayrinti-ciplaki"><div class="ad">Sayfa</div><div class="deger">' +
    sayiFormati(kitap.sayfa) +
    '</div></div><div class="ayrinti-ciplaki"><div class="ad">Biçim</div><div class="deger">PDF + EPUB</div></div></div>' +
    '<div class="detay-fiyat-kutusu">' +
    '<span class="fiyat">' +
    paraFormati(kitap.fiyat) +
    (kitap.eskiFiyat
      ? '<span class="eski-fiyat">' + paraFormati(kitap.eskiFiyat) + "</span>"
      : "") +
    "</span>" +
    '<p class="stok-notu">Dijital ürün — satın alma sonrası anında indirme + e-posta bağlantısı.</p>' +
    '<button class="buton sepete-ekle" data-id="' +
    kitap.id +
    '">Sepete ekle</button>' +
    "</div>" +
    "<h3>Kitapta neler var?</h3>" +
    '<ul class="kapsam-listesi">' +
    kapsamHtml +
    "</ul>" +
    "</div></div>";

  // Benzer kitaplar (aynı kategori, bu kitap hariç)
  var benzerler = EBOOKS.filter(function (k) {
    return k.kategori === kitap.kategori && k.id !== kitap.id;
  });
  if (!benzerler.length) {
    benzerler = EBOOKS.filter(function (k) { return k.id !== kitap.id; }).slice(0, 3);
  }
  kitaplariRender("#benzer-kitaplar", benzerler.slice(0, 3));
  var benzerBolum = document.getElementById("benzer-bolumu");
  if (benzerBolum) benzerBolum.style.display = benzerler.length ? "" : "none";
}

/* ============================================================
   Sepet ve ödeme simülasyonu
   ============================================================ */

function sepetSayfasiBaslat() {
  renderSepet();

  var form = document.getElementById("odeme-formu");
  if (form) {
    form.addEventListener("submit", function (olay) {
      olay.preventDefault();
      // Simülasyon: gerçek ödeme alınmaz (bkz. CLAUDE.md)
      var ad = form.querySelector("#odeme-ad").value.trim();
      var panel = document.getElementById("basari-paneli");
      var isimEl = document.getElementById("basari-adi");
      if (isimEl) isimEl.textContent = ad ? ad.split(" ")[0] : "değerli okur";
      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth" });
      sepetiBosalt();
      renderSepet();
      form.reset();
      form.hidden = true;
    });
  }
}

function renderSepet() {
  var liste = document.getElementById("sepet-listesi");
  var ozet = document.getElementById("sepet-ozeti");
  var formAlani = document.getElementById("odeme-alani");
  var panel = document.getElementById("basari-paneli");
  if (!liste) return;

  var sepet = sepetiOku();
  var girisler = Object.entries(sepet).filter(function (g) {
    return kitapBul(g[0]);
  });

  sepetRozetiniGuncelle();

  if (!girisler.length) {
    liste.innerHTML =
      '<div class="bos-sepet"><div class="ikon">🛒</div>' +
      "<h2>Sepetiniz boş</h2>" +
      "<p>Kütüphanemizden seveceğiniz bir e-kitap seçin.</p>" +
      '<a class="buton" href="kitaplar.html">E-kitaplara göz at</a></div>';
    ozet.innerHTML = "";
    if (formAlani) formAlani.hidden = true;
    return;
  }

  if (panel) panel.hidden = true;
  if (formAlani) formAlani.hidden = false;
  var odemeFormu = document.getElementById("odeme-formu");
  if (odemeFormu) odemeFormu.hidden = false;

  liste.innerHTML =
    '<table class="sepet-tablosu">' +
    "<thead><tr><th>E-kitap</th><th>Fiyat</th><th>Adet</th><th>Tutar</th>" +
    '<th class="sutun-istegebagli"><span class="gizli-metin">Sil</span></th></tr></thead>' +
    "<tbody>" +
    girisler
      .map(function (giris) {
        var kitap = kitapBul(giris[0]);
        var adet = giris[1];
        return (
          "<tr>" +
          '<td><div class="sepet-urun">' +
          '<div class="mini-kapak" style="' +
          kapakStili(kitap) +
          '">' +
          kitap.kapak.emoji +
          "</div>" +
          "<div><a href=\"kitap.html?id=" +
          encodeURIComponent(kitap.id) +
          '"><strong>' +
          metinGuvenli(kitap.baslik) +
          "</strong></a><br>" +
          '<span class="kart-meta">' +
          metinGuvenli(kitap.yazar) +
          "</span></div></div></td>" +
          '<td class="sayisal">' +
          paraFormati(kitap.fiyat) +
          "</td>" +
          '<td><div class="adet-kontrol">' +
          '<button data-islem="azalt" data-id="' +
          kitap.id +
          '" aria-label="Adedi azalt">−</button>' +
          '<span class="adet">' +
          adet +
          "</span>" +
          '<button data-islem="arttir" data-id="' +
          kitap.id +
          '" aria-label="Adedi artır">+</button>' +
          "</div></td>" +
          '<td class="sayisal">' +
          paraFormati(kitap.fiyat * adet) +
          "</td>" +
          '<td class="sutun-istegebagli"><button class="sil-dugmesi" data-islem="sil" data-id="' +
          kitap.id +
          '" aria-label="Sepetten çıkar">✕</button></td>' +
          "</tr>"
        );
      })
      .join("") +
    "</tbody></table>";

  var araToplam = sepetToplami();
  ozet.innerHTML =
    '<div class="ozet-satiri"><span>Ara toplam</span><span>' +
    paraFormati(araToplam) +
    "</span></div>" +
    '<div class="ozet-satiri"><span>Dijital teslimat</span><span>Ücretsiz</span></div>' +
    '<div class="ozet-satiri toplam"><span>Genel toplam</span><span>' +
    paraFormati(araToplam) +
    "</span></div>";
}

// Sepet satırındaki adet/sil düğmeleri (olay delegasyonu)
document.addEventListener("click", function (olay) {
  var dugme = olay.target.closest("[data-islem]");
  if (!dugme) return;
  var id = dugme.dataset.id;
  var sepet = sepetiOku();
  if (dugme.dataset.islem === "arttir") sepetiGuncelle(id, (sepet[id] || 0) + 1);
  else if (dugme.dataset.islem === "azalt") sepetiGuncelle(id, (sepet[id] || 0) - 1);
  else if (dugme.dataset.islem === "sil") sepettenCikar(id);
  if (document.body.dataset.sayfa === "sepet") renderSepet();
});

/* ============================================================
   "Sepete ekle" düğmeleri (tüm sayfalarda, olay delegasyonu)
   ============================================================ */

document.addEventListener("click", function (olay) {
  var dugme = olay.target.closest(".sepete-ekle");
  if (!dugme) return;
  var kitap = kitapBul(dugme.dataset.id);
  if (!kitap) return;
  sepeteEkle(kitap.id);
  toastGoster("“" + kitap.baslik + "” sepete eklendi");
});

/* ============================================================
   İletişim sayfası (form gönderimi simüle edilir)
   ============================================================ */

function iletisimSayfasiBaslat() {
  var form = document.getElementById("iletisim-formu");
  if (!form) return;
  form.addEventListener("submit", function (olay) {
    olay.preventDefault();
    form.reset();
    toastGoster("Mesajınız alındı! En kısa sürede dönüş yapacağız.");
  });
}

/* ============================================================
   Tema (açık / koyu) — tercih localStorage'da tutulur
   ============================================================ */

function temayiBaslat() {
  var dugme = document.querySelector(".tema-dugmesi");
  if (!dugme) return;

  function tercihOku() {
    return localStorage.getItem(TEMA_ANAHTAR); // "light" | "dark" | null
  }

  function uygula(tema) {
    if (tema) {
      document.documentElement.dataset.theme = tema;
    } else {
      delete document.documentElement.dataset.theme;
    }
    dugme.textContent = etkinTema() === "dark" ? "☀️" : "🌙";
    dugme.setAttribute(
      "aria-label",
      etkinTema() === "dark" ? "Açık temaya geç" : "Koyu temaya geç"
    );
  }

  function etkinTema() {
    return (
      document.documentElement.dataset.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  }

  dugme.addEventListener("click", function () {
    var yeni = etkinTema() === "dark" ? "light" : "dark";
    localStorage.setItem(TEMA_ANAHTAR, yeni);
    uygula(yeni);
  });

  uygula(tercihOku());
}

/* ============================================================
   Başlatma
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  temayiBaslat();
  sepetRozetiniGuncelle();

  var sayfa = document.body.dataset.sayfa;
  if (sayfa === "anasayfa") anasayfaBaslat();
  else if (sayfa === "kitaplar") kitaplarSayfasiBaslat();
  else if (sayfa === "kitap") kitapSayfasiBaslat();
  else if (sayfa === "sepet") sepetSayfasiBaslat();
  else if (sayfa === "iletisim") iletisimSayfasiBaslat();

  // Yıl bilgisi (alt bilgi)
  var yil = document.querySelector(".yil");
  if (yil) yil.textContent = String(new Date().getFullYear());
});
