import type { Dil } from './diller';
import type { YasalAnahtar } from './yollar';

/**
 * Yasal sayfaların şablon içeriği. Bağlayıcı metin Türkçedir; en/ar bilgilendirme amaçlı çeviridir.
 * Metinler doldurulduğunda `guncelleme` tarihini de güncelle.
 */
interface YasalMetin {
  aciklama: string;
  bolumler: { baslik: string; metin: string }[];
}

const D = { tr: '[DOLDURULACAK]', en: '[TO BE COMPLETED]', ar: '[يُستكمل لاحقًا]' } as const;

export const yasalGuncelleme: Record<YasalAnahtar, string> = {
  kvkk: '2026-11-11',
  mesafeli: '2026-11-11',
  iade: '2026-11-11',
  cerez: '2026-11-11',
};

export const yasalMetinler: Record<YasalAnahtar, Record<Dil, YasalMetin>> = {
  kvkk: {
    tr: {
      aciklama: 'Naif Mutfak, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerin işlenmesine ilişkin aydınlatma metni.',
      bolumler: [
        { baslik: '1. Veri sorumlusu', metin: `${D.tr}: Ad soyad / unvan, adres, iletişim e-postası, varsa VERBİS bilgisi` },
        { baslik: '2. İşlenen kişisel veriler', metin: `${D.tr}: Kimlik, iletişim, müşteri işlem, işlem güvenliği verileri vb.` },
        { baslik: '3. Kişisel verilerin işlenme amaçları', metin: `${D.tr}: E-kitap satışı ve teslimi, iletişim taleplerinin yanıtlanması, yasal yükümlülükler vb.` },
        { baslik: '4. Hukuki sebepler ve toplama yöntemi', metin: `${D.tr}: KVKK m.5 kapsamındaki hukuki sebepler; e-posta, ödeme sağlayıcısı vb. kanallar` },
        { baslik: '5. Kişisel verilerin aktarılması', metin: `${D.tr}: Ödeme sağlayıcısı, barındırma hizmeti, e-posta servisi; yurt dışı aktarım varsa belirtilmeli` },
        { baslik: '6. Saklama süresi', metin: D.tr },
        { baslik: '7. İlgili kişinin hakları (KVKK m.11)', metin: `${D.tr}: Haklar listesi ve başvuru yöntemi` },
      ],
    },
    en: {
      aciklama: 'Naif Mutfak privacy notice on the processing of personal data under Turkish Personal Data Protection Law No. 6698 (KVKK).',
      bolumler: [
        { baslik: '1. Data controller', metin: `${D.en}: Name / business name, address, contact email, VERBİS registration if any` },
        { baslik: '2. Personal data processed', metin: `${D.en}: Identity, contact, customer transaction and transaction security data, etc.` },
        { baslik: '3. Purposes of processing', metin: `${D.en}: Selling and delivering the e-book, answering enquiries, legal obligations, etc.` },
        { baslik: '4. Legal grounds and collection methods', metin: `${D.en}: Legal grounds under Article 5 of KVKK; email, payment provider and other channels` },
        { baslik: '5. Transfer of personal data', metin: `${D.en}: Payment provider, hosting, email service; any transfer abroad must be stated` },
        { baslik: '6. Retention period', metin: D.en },
        { baslik: '7. Your rights (KVKK Article 11)', metin: `${D.en}: List of rights and how to apply` },
      ],
    },
    ar: {
      aciklama: 'إشعار Naif Mutfak بشأن معالجة البيانات الشخصية وفق قانون حماية البيانات الشخصية التركي رقم 6698.',
      bolumler: [
        { baslik: '1. المسؤول عن البيانات', metin: `${D.ar}: الاسم أو الاسم التجاري، العنوان، البريد الإلكتروني، ورقم التسجيل في VERBİS إن وُجد` },
        { baslik: '2. البيانات الشخصية التي تتم معالجتها', metin: `${D.ar}: بيانات الهوية والتواصل ومعاملات العملاء وأمن المعاملات وغيرها` },
        { baslik: '3. أغراض المعالجة', metin: `${D.ar}: بيع الكتاب الإلكتروني وتسليمه، الرد على الاستفسارات، الالتزامات القانونية وغيرها` },
        { baslik: '4. الأسس القانونية وطرق الجمع', metin: `${D.ar}: الأسس القانونية وفق المادة 5 من القانون؛ البريد الإلكتروني ومزوّد الدفع وغيرها` },
        { baslik: '5. نقل البيانات الشخصية', metin: `${D.ar}: مزوّد الدفع، الاستضافة، خدمة البريد؛ ويجب ذكر أي نقل إلى الخارج` },
        { baslik: '6. مدة الاحتفاظ', metin: D.ar },
        { baslik: '7. حقوقك (المادة 11)', metin: `${D.ar}: قائمة الحقوق وطريقة تقديم الطلب` },
      ],
    },
  },
  mesafeli: {
    tr: {
      aciklama: 'Naif Mutfak e-kitap satışlarına ilişkin mesafeli satış sözleşmesi.',
      bolumler: [
        { baslik: 'Madde 1.1: Satıcı', metin: `${D.tr}: Unvan, adres, telefon, e-posta, vergi dairesi / numarası, MERSİS no (varsa)` },
        { baslik: 'Madde 1.2: Alıcı', metin: `${D.tr}: Sipariş sırasında alıcının bildirdiği bilgiler` },
        { baslik: 'Madde 2: Konu', metin: D.tr },
        { baslik: 'Madde 3: Sözleşme konusu ürün', metin: `${D.tr}: Ürün adı (dijital e-kitap), format, satış fiyatı (KDV dahil), ödeme şekli` },
        { baslik: 'Madde 4: Teslimat', metin: `${D.tr}: Dijital teslim yöntemi ve süresi` },
        { baslik: 'Madde 5: Cayma hakkı', metin: `${D.tr}: Mesafeli Sözleşmeler Yönetmeliği m.15 kapsamında, tüketiciye anında teslim edilen gayrimaddi mallara ilişkin istisna ve alıcının onayı` },
        { baslik: 'Madde 6: Uyuşmazlıkların çözümü', metin: `${D.tr}: Tüketici hakem heyetleri ve tüketici mahkemeleri` },
        { baslik: 'Madde 7: Yürürlük', metin: D.tr },
      ],
    },
    en: {
      aciklama: 'Distance sales agreement for Naif Mutfak e-book purchases.',
      bolumler: [
        { baslik: 'Article 1.1: Seller', metin: `${D.en}: Business name, address, phone, email, tax office / number, MERSİS no. (if any)` },
        { baslik: 'Article 1.2: Buyer', metin: `${D.en}: Details provided by the buyer when ordering` },
        { baslik: 'Article 2: Subject', metin: D.en },
        { baslik: 'Article 3: Product', metin: `${D.en}: Product name (digital e-book), format, price (VAT included), payment method` },
        { baslik: 'Article 4: Delivery', metin: `${D.en}: Digital delivery method and time` },
        { baslik: 'Article 5: Right of withdrawal', metin: `${D.en}: Exception for intangible goods delivered instantly under Article 15 of the Distance Contracts Regulation, and the buyer’s consent` },
        { baslik: 'Article 6: Dispute resolution', metin: `${D.en}: Consumer arbitration committees and consumer courts` },
        { baslik: 'Article 7: Entry into force', metin: D.en },
      ],
    },
    ar: {
      aciklama: 'عقد البيع عن بُعد الخاص بمشتريات الكتاب الإلكتروني من Naif Mutfak.',
      bolumler: [
        { baslik: 'المادة 1.1: البائع', metin: `${D.ar}: الاسم التجاري، العنوان، الهاتف، البريد الإلكتروني، الدائرة والرقم الضريبي، رقم MERSİS إن وُجد` },
        { baslik: 'المادة 1.2: المشتري', metin: `${D.ar}: البيانات التي يقدمها المشتري عند الطلب` },
        { baslik: 'المادة 2: الموضوع', metin: D.ar },
        { baslik: 'المادة 3: المنتج', metin: `${D.ar}: اسم المنتج (كتاب إلكتروني رقمي)، الصيغة، السعر شاملًا الضريبة، طريقة الدفع` },
        { baslik: 'المادة 4: التسليم', metin: `${D.ar}: طريقة التسليم الرقمي ومدته` },
        { baslik: 'المادة 5: حق الانسحاب', metin: `${D.ar}: الاستثناء الخاص بالسلع غير المادية المسلّمة فورًا وفق المادة 15 من لائحة العقود عن بُعد، وموافقة المشتري` },
        { baslik: 'المادة 6: تسوية النزاعات', metin: `${D.ar}: لجان التحكيم الاستهلاكي ومحاكم المستهلك` },
        { baslik: 'المادة 7: السريان', metin: D.ar },
      ],
    },
  },
  iade: {
    tr: {
      aciklama: 'Naif Mutfak dijital ürün (e-kitap) iade ve cayma koşulları.',
      bolumler: [
        { baslik: 'Dijital ürünlerde cayma hakkı', metin: `${D.tr}: Dijital içeriklerde cayma hakkının istisnası ve alıcının satın alma öncesi onayı` },
        { baslik: 'İade yapılabilecek durumlar', metin: `${D.tr}: Örn. dosyanın hiç teslim edilmemesi, bozuk / açılamayan dosya, mükerrer ödeme` },
        { baslik: 'İade talebi nasıl yapılır?', metin: `${D.tr}: Başvuru e-postası, gerekli bilgiler, yanıt süresi` },
        { baslik: 'Ödemenin iadesi', metin: `${D.tr}: İade süresi ve yöntemi` },
      ],
    },
    en: {
      aciklama: 'Refund and withdrawal terms for Naif Mutfak digital products (e-book).',
      bolumler: [
        { baslik: 'Right of withdrawal for digital products', metin: `${D.en}: Exception to the right of withdrawal for digital content and the buyer’s prior consent` },
        { baslik: 'When a refund is possible', metin: `${D.en}: E.g. the file was never delivered, a corrupt / unreadable file, duplicate payment` },
        { baslik: 'How to request a refund', metin: `${D.en}: Contact email, required details, response time` },
        { baslik: 'Refund of payment', metin: `${D.en}: Refund time and method` },
      ],
    },
    ar: {
      aciklama: 'شروط الاسترداد والانسحاب للمنتجات الرقمية (الكتاب الإلكتروني) من Naif Mutfak.',
      bolumler: [
        { baslik: 'حق الانسحاب في المنتجات الرقمية', metin: `${D.ar}: استثناء المحتوى الرقمي من حق الانسحاب وموافقة المشتري المسبقة` },
        { baslik: 'الحالات التي يمكن فيها الاسترداد', metin: `${D.ar}: مثل عدم تسليم الملف، أو ملف تالف لا يفتح، أو دفع مكرر` },
        { baslik: 'كيف أطلب الاسترداد؟', metin: `${D.ar}: البريد الإلكتروني للطلب، البيانات المطلوبة، مدة الرد` },
        { baslik: 'إعادة المبلغ', metin: `${D.ar}: مدة الاسترداد وطريقته` },
      ],
    },
  },
  cerez: {
    tr: {
      aciklama: 'Naif Mutfak web sitesinde kullanılan çerezler ve çerez tercihleri hakkında bilgilendirme.',
      bolumler: [
        { baslik: 'Çerez nedir?', metin: D.tr },
        {
          baslik: 'Sitemizde kullanılan çerezler',
          metin: `Bu site şu anda çerez kullanmamaktadır; yazı tipleri dahil tüm dosyalar kendi sunucumuzdan yüklenir. ${D.tr}: Analitik veya reklam araçları eklenirse bu bölüm güncellenmeli ve bir çerez onay bandı eklenmelidir.`,
        },
        { baslik: 'Çerezleri nasıl yönetebilirsiniz?', metin: `${D.tr}: Tarayıcı ayarlarından çerezleri silme / engelleme` },
        { baslik: 'İletişim', metin: D.tr },
      ],
    },
    en: {
      aciklama: 'Information about cookies used on the Naif Mutfak website and your cookie choices.',
      bolumler: [
        { baslik: 'What is a cookie?', metin: D.en },
        {
          baslik: 'Cookies used on this site',
          metin: `This site currently uses no cookies; all files, including fonts, are served from our own server. ${D.en}: If analytics or advertising tools are added, this section must be updated and a cookie consent banner added.`,
        },
        { baslik: 'How to manage cookies', metin: `${D.en}: Deleting / blocking cookies in your browser settings` },
        { baslik: 'Contact', metin: D.en },
      ],
    },
    ar: {
      aciklama: 'معلومات حول ملفات تعريف الارتباط المستخدمة في موقع Naif Mutfak وخياراتك بشأنها.',
      bolumler: [
        { baslik: 'ما هي ملفات تعريف الارتباط؟', metin: D.ar },
        {
          baslik: 'ملفات تعريف الارتباط المستخدمة في الموقع',
          metin: `لا يستخدم هذا الموقع حاليًا أي ملفات تعريف ارتباط؛ إذ تُحمَّل جميع الملفات، بما فيها الخطوط، من خادمنا. ${D.ar}: عند إضافة أدوات تحليل أو إعلانات يجب تحديث هذا القسم وإضافة شريط موافقة.`,
        },
        { baslik: 'كيف تدير ملفات تعريف الارتباط؟', metin: `${D.ar}: حذفها أو حظرها من إعدادات المتصفح` },
        { baslik: 'التواصل', metin: D.ar },
      ],
    },
  },
};
