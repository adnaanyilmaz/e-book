#!/usr/bin/env node
/**
 * E-kitap PDF'ine alıcıya özel damga basar (Shopier siparişleri için; Gumroad bunu kendisi yapar).
 *
 *   npm run damgala -- "C:\kitap\evin-tadi.pdf" ali@ornek.com 123456
 *
 * - Her sayfanın altına küçük, gri bir satır yazar: alıcının e-postası + sipariş no.
 * - PDF bilgilerine (metadata) aynı bilgiyi gömer.
 * - Çıktıyı girdi dosyasının yanına `<ad>-<eposta>.pdf` olarak kaydeder.
 * - Aynı klasördeki `damga-kaydi.csv` dosyasına tarih, e-posta, sipariş no ve dosyanın SHA-256 özetini ekler;
 *   internette bir kopya bulursan özetini bu kayıtla karşılaştırıp kimin kopyası olduğunu bulabilirsin.
 *
 * Kayıt dosyası kişisel veri (e-posta) içerir: bilgisayarında tut, paylaşma, git'e ekleme.
 * Asıl PDF'i bu projenin içine KOYMA; bu klasör siteyle birlikte yayınlanabilir.
 */
import { createHash } from 'node:crypto';
import { appendFile, readFile, writeFile, access } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const [girdi, eposta, siparis = ''] = process.argv.slice(2);

if (!girdi || !eposta) {
  console.error('Kullanım: npm run damgala -- <kitap.pdf> <alıcı e-postası> [sipariş no]');
  process.exit(1);
}
// Standart PDF yazı tipi yalnızca Latin-1 basabilir; e-posta ve sipariş no zaten ASCII olmalı.
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta) || !/^[\x21-\x7E]+$/.test(eposta)) {
  console.error(`Geçersiz e-posta: ${eposta}`);
  process.exit(1);
}
if (siparis && !/^[\w-]{1,40}$/.test(siparis)) {
  console.error(`Sipariş no yalnızca harf, rakam, - ve _ içerebilir: ${siparis}`);
  process.exit(1);
}

let pdf;
try {
  pdf = await PDFDocument.load(await readFile(girdi));
} catch (hata) {
  console.error(`PDF açılamadı: ${girdi}\n${hata.message}`);
  console.error('PDF parola/kopyalama korumalıysa korumayı kaldırıp tekrar dene.');
  process.exit(1);
}

const yazi = await pdf.embedFont(StandardFonts.Helvetica);
const satir = `Licensed to ${eposta}${siparis ? ` · Order #${siparis}` : ''} · Personal use only. Copying or sharing is prohibited.`;
const boyut = 7;

for (const sayfa of pdf.getPages()) {
  const { width } = sayfa.getSize();
  // Uzun satır dar sayfaya sığmazsa küçült
  const olcek = Math.min(1, (width - 40) / yazi.widthOfTextAtSize(satir, boyut));
  const b = boyut * olcek;
  const genislik = yazi.widthOfTextAtSize(satir, b);
  sayfa.drawText(satir, { x: (width - genislik) / 2, y: 12, size: b, font: yazi, color: rgb(0.45, 0.4, 0.36) });
}

const tarih = new Date();
pdf.setSubject(`Licensed to ${eposta}${siparis ? ` (order ${siparis})` : ''}`);
pdf.setKeywords([`licensee:${eposta}`, ...(siparis ? [`order:${siparis}`] : []), `stamped:${tarih.toISOString()}`]);
pdf.setModificationDate(tarih);

const bayt = await pdf.save();
const guvenliAd = eposta.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const cikti = join(dirname(girdi), `${basename(girdi, extname(girdi))}-${guvenliAd}.pdf`);
await writeFile(cikti, bayt);

const ozet = createHash('sha256').update(bayt).digest('hex');
const kayit = join(dirname(girdi), 'damga-kaydi.csv');
const kayitVar = await access(kayit).then(() => true, () => false);
await appendFile(
  kayit,
  (kayitVar ? '' : 'tarih,eposta,siparis,dosya,sha256\n') + [tarih.toISOString(), eposta, siparis, basename(cikti), ozet].join(',') + '\n',
);

console.log(`Damgalandı: ${cikti}`);
console.log(`${pdf.getPageCount()} sayfa · SHA-256 ${ozet.slice(0, 16)}… · kayıt: ${kayit}`);
