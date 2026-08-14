export type AppLanguage = 'ru' | 'en' | 'kk' | 'tr';

export const languageKey = 'appLanguage';

export const languages: { code: AppLanguage; label: string }[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'kk', label: 'Қазақша' },
  { code: 'tr', label: 'Türkçe' },
];

type Dictionary = Record<string, Record<Exclude<AppLanguage, 'ru'>, string>>;

const dictionary: Dictionary = {
  'AI для молодых бизнесов': { en: 'AI for young businesses', kk: 'Жас бизнеске арналған AI', tr: 'Genç işletmeler için AI' },
  'AI может ошибаться': { en: 'AI can make mistakes', kk: 'AI қателесуі мүмкін', tr: 'AI hata yapabilir' },
  'AI отчёт': { en: 'AI report', kk: 'AI есебі', tr: 'AI raporu' },
  'AI помощник': { en: 'AI assistant', kk: 'AI көмекші', tr: 'AI asistanı' },
  'AI команды': { en: 'AI commands', kk: 'AI командалары', tr: 'AI komutları' },
  'Pie chart': { en: 'Pie chart', kk: 'Дөңгелек диаграмма', tr: 'Pasta grafik' },
  'Search...': { en: 'Search...', kk: 'Іздеу...', tr: 'Ara...' },
  'Workspace': { en: 'Workspace', kk: 'Жұмыс орны', tr: 'Çalışma alanı' },
  'Безопасность': { en: 'Security', kk: 'Қауіпсіздік', tr: 'Güvenlik' },
  'Безопасный профиль': { en: 'Secure profile', kk: 'Қауіпсіз профиль', tr: 'Güvenli profil' },
  'Бизнесом': { en: 'business', kk: 'бизнесті', tr: 'işi' },
  'Ближайшая оплата': { en: 'Next payment', kk: 'Келесі төлем', tr: 'Sıradaki ödeme' },
  'Вернуться на главную': { en: 'Back to home', kk: 'Басты бетке оралу', tr: 'Ana sayfaya dön' },
  'Верхний': { en: 'Top', kk: 'Жоғарғы', tr: 'Üst' },
  'Вкладки': { en: 'Tabs', kk: 'Бөлімдер', tr: 'Sekmeler' },
  'Все ключевые инструменты в одном месте: ИИ-чат, реклама, аренда, платежи, заявки, свободные места и профиль команды.': {
    en: 'All key tools in one place: AI chat, ads, rent, payments, requests, free seats, and team profile.',
    kk: 'Барлық негізгі құралдар бір жерде: AI чат, жарнама, аренда, төлемдер, өтінімдер, бос орындар және команда профилі.',
    tr: 'Tüm temel araçlar tek yerde: AI sohbet, reklam, kira, ödemeler, talepler, boş yerler ve ekip profili.',
  },
  'Вход, телефон, настройки и личные данные держатся в одном аккуратном месте.': {
    en: 'Login, phone, settings, and personal data stay in one clean place.',
    kk: 'Кіру, телефон, баптаулар және жеке деректер бір жерде сақталады.',
    tr: 'Giriş, telefon, ayarlar ve kişisel veriler tek düzenli yerde durur.',
  },
  'Выбери вкладки, из которых ИИ возьмёт информацию. В отчёт попадут только отмеченные данные.': {
    en: 'Choose tabs for AI to use. Only selected data will be included.',
    kk: 'AI ақпарат алатын бөлімдерді таңда. Есепке тек белгіленген деректер кіреді.',
    tr: 'AI’ın kullanacağı sekmeleri seç. Rapora sadece seçilen veriler girer.',
  },
  'Генерация идей, текстов и анализ фото': { en: 'Ideas, text, and photo analysis', kk: 'Идея, мәтін және фото талдау', tr: 'Fikir, metin ve fotoğraf analizi' },
  'Генерируется...': { en: 'Generating...', kk: 'Жасалып жатыр...', tr: 'Oluşturuluyor...' },
  'Готовые разделы для аренды, платежей, заявок, рекламы и свободных мест.': {
    en: 'Ready sections for rent, payments, requests, ads, and free seats.',
    kk: 'Аренда, төлемдер, өтінімдер, жарнама және бос орындарға дайын бөлімдер.',
    tr: 'Kira, ödemeler, talepler, reklam ve boş yerler için hazır bölümler.',
  },
  'Диаграмма': { en: 'Chart', kk: 'Диаграмма', tr: 'Grafik' },
  'Договоры': { en: 'Contracts', kk: 'Шарттар', tr: 'Sözleşmeler' },
  'Добавить свободное место': { en: 'Add free seat', kk: 'Бос орын қосу', tr: 'Boş yer ekle' },
  'Добавить схемы': { en: 'Add schemes', kk: 'Схемалар қосу', tr: 'Şema ekle' },
  'Думaю': { en: 'Thinking', kk: 'Ойланып жатырмын', tr: 'Düşünüyorum' },
  'Думаю': { en: 'Thinking', kk: 'Ойланып жатырмын', tr: 'Düşünüyorum' },
  'Загрузите одно или несколько фото, либо вставьте через Ctrl+V': {
    en: 'Upload one or more photos, or paste with Ctrl+V',
    kk: 'Бір немесе бірнеше фото жүктеңіз немесе Ctrl+V арқылы қойыңыз',
    tr: 'Bir veya birkaç fotoğraf yükleyin ya da Ctrl+V ile yapıştırın',
  },
  'Загрузите фото схемы': { en: 'Upload a scheme photo', kk: 'Схема фотосын жүктеңіз', tr: 'Şema fotoğrafı yükle' },
  'Заметки': { en: 'Notes', kk: 'Жазбалар', tr: 'Notlar' },
  'Заметки по объектам': { en: 'Object notes', kk: 'Нысан жазбалары', tr: 'Nesne notları' },
  'Занятая кровать': { en: 'Busy bed', kk: 'Бос емес төсек', tr: 'Dolu yatak' },
  'Заявки': { en: 'Requests', kk: 'Өтінімдер', tr: 'Talepler' },
  'Идеи, тексты и ответы': { en: 'Ideas, texts, and answers', kk: 'Идеялар, мәтіндер және жауаптар', tr: 'Fikirler, metinler ve cevaplar' },
  'ИИ анализирует новую схему...': { en: 'AI is analyzing the new scheme...', kk: 'AI жаңа схеманы талдап жатыр...', tr: 'AI yeni şemayı analiz ediyor...' },
  'ИИ может отвечать, анализировать фото и самостоятельно обновлять подходящие записи.': {
    en: 'AI can answer, analyze photos, and update matching records.',
    kk: 'AI жауап береді, фотоларды талдайды және тиісті жазбаларды жаңарта алады.',
    tr: 'AI cevap verebilir, fotoğraf analiz edebilir ve uygun kayıtları güncelleyebilir.',
  },
  'ИИ поставит кликабельные значки прямо на найденные кровати.': {
    en: 'AI will place clickable markers on found beds.',
    kk: 'AI табылған төсектерге басылатын белгілер қояды.',
    tr: 'AI bulunan yataklara tıklanabilir işaretler koyar.',
  },
  'Календарь оплат': { en: 'Payment calendar', kk: 'Төлем күнтізбесі', tr: 'Ödeme takvimi' },
  'Календарь заявок': { en: 'Request calendar', kk: 'Өтінім күнтізбесі', tr: 'Talep takvimi' },
  'Картинка товара 1080x1080': { en: 'Product card 1080x1080', kk: 'Тауар карточкасы 1080x1080', tr: 'Ürün kartı 1080x1080' },
  'Нa главную': { en: 'Home', kk: 'Басты бет', tr: 'Ana sayfa' },
  'На главную': { en: 'Home', kk: 'Басты бет', tr: 'Ana sayfa' },
  'Напиши задачу или выбери готовый сценарий ниже.': {
    en: 'Write a task or choose a ready scenario below.',
    kk: 'Тапсырма жазыңыз немесе төменнен дайын сценарий таңдаңыз.',
    tr: 'Bir görev yazın veya aşağıdan hazır senaryo seçin.',
  },
  'Настройки': { en: 'Settings', kk: 'Баптаулар', tr: 'Ayarlar' },
  'Нижний': { en: 'Bottom', kk: 'Төменгі', tr: 'Alt' },
  'Ничего не найдено': { en: 'Nothing found', kk: 'Ештеңе табылмады', tr: 'Sonuç bulunamadı' },
  'Открыть профиль': { en: 'Open profile', kk: 'Профильді ашу', tr: 'Profili aç' },
  'Открыть схему мест': { en: 'Open seat scheme', kk: 'Орын схемасын ашу', tr: 'Yer şemasını aç' },
  'Отменa': { en: 'Cancel', kk: 'Бас тарту', tr: 'İptal' },
  'Отмена': { en: 'Cancel', kk: 'Бас тарту', tr: 'İptal' },
  'Отправить': { en: 'Send', kk: 'Жіберу', tr: 'Gönder' },
  'Отчёты': { en: 'Reports', kk: 'Есептер', tr: 'Raporlar' },
  'Отчёт из выбранных вкладок': { en: 'Report from selected tabs', kk: 'Таңдалған бөлімдер есебі', tr: 'Seçilen sekmelerden rapor' },
  'Платежи': { en: 'Payments', kk: 'Төлемдер', tr: 'Ödemeler' },
  'Платежи, статусы и напоминания': { en: 'Payments, statuses, and reminders', kk: 'Төлемдер, статустар және еске салулар', tr: 'Ödemeler, durumlar ve hatırlatmalar' },
  'Поддержка': { en: 'Support', kk: 'Қолдау', tr: 'Destek' },
  'Попробовать AI': { en: 'Try AI', kk: 'AI қолданып көру', tr: 'AI dene' },
  'Последние операции': { en: 'Latest operations', kk: 'Соңғы операциялар', tr: 'Son işlemler' },
  'Профиль': { en: 'Profile', kk: 'Профиль', tr: 'Profil' },
  'Реклама': { en: 'Ads', kk: 'Жарнама', tr: 'Reklam' },
  'Свободная кровать': { en: 'Free bed', kk: 'Бос төсек', tr: 'Boş yatak' },
  'Свободные места': { en: 'Free seats', kk: 'Бос орындар', tr: 'Boş yerler' },
  'Свободные места на схеме здания': { en: 'Free seats on the building scheme', kk: 'Ғимарат схемасындағы бос орындар', tr: 'Bina şemasındaki boş yerler' },
  'Сгенерировать': { en: 'Generate', kk: 'Жасау', tr: 'Oluştur' },
  'Скачать отчёт': { en: 'Download report', kk: 'Есепті жүктеу', tr: 'Raporu indir' },
  'Скопировать текст': { en: 'Copy text', kk: 'Мәтінді көшіру', tr: 'Metni kopyala' },
  'Создать рекламу': { en: 'Create ad', kk: 'Жарнама жасау', tr: 'Reklam oluştur' },
  'Списочный': { en: 'List', kk: 'Тізім', tr: 'Liste' },
  'Схема здания': { en: 'Building scheme', kk: 'Ғимарат схемасы', tr: 'Bina şeması' },
  'Схема свободных мест': { en: 'Free seats scheme', kk: 'Бос орындар схемасы', tr: 'Boş yerler şeması' },
  'Схемы сохраняются после перезапуска, а ИИ отмечает свободные, занятые и двухъярусные кровати.': {
    en: 'Schemes are saved after restart, and AI marks free, busy, and bunk beds.',
    kk: 'Схемалар қайта іске қосылғаннан кейін сақталады, AI бос, бос емес және екі қабатты төсектерді белгілейді.',
    tr: 'Şemalar yeniden başlatmadan sonra kaydedilir; AI boş, dolu ve ranza yatakları işaretler.',
  },
  'Табличный': { en: 'Table', kk: 'Кесте', tr: 'Tablo' },
  'Такой страницы пока нет': { en: 'This page does not exist yet', kk: 'Бұл бет әлі жоқ', tr: 'Bu sayfa henüz yok' },
  'Управляй бизнесом быстрее': { en: 'Manage business faster', kk: 'Бизнесті жылдам басқар', tr: 'İşi daha hızlı yönet' },
  'Установить цену': { en: 'Set price', kk: 'Бағаны қою', tr: 'Fiyat belirle' },
  'Фон': { en: 'Background', kk: 'Фон', tr: 'Arka plan' },
  'Фото и данные': { en: 'Photos and data', kk: 'Фото және деректер', tr: 'Fotoğraf ve veriler' },
  'Фото схемы': { en: 'Scheme photo', kk: 'Схема фотосы', tr: 'Şema fotoğrafı' },
  'Цeна кровати': { en: 'Bed price', kk: 'Төсек бағасы', tr: 'Yatak fiyatı' },
  'Цена кровати': { en: 'Bed price', kk: 'Төсек бағасы', tr: 'Yatak fiyatı' },
  'Чат с ИИ': { en: 'AI chat', kk: 'AI чат', tr: 'AI sohbet' },
  'Чем помочь сегодня?': { en: 'How can I help today?', kk: 'Бүгін қалай көмектесейін?', tr: 'Bugün nasıl yardımcı olayım?' },
  'Шахматка': { en: 'Matrix', kk: 'Матрица', tr: 'Matris' },
  'Языки': { en: 'Languages', kk: 'Тілдер', tr: 'Diller' },
  'с AI workspace': { en: 'with AI workspace', kk: 'AI workspace арқылы', tr: 'AI workspace ile' },
  'свободно': { en: 'free', kk: 'бос', tr: 'boş' },
  'сохрани 10 часов в неделю': { en: 'save 10 hours a week', kk: 'аптасына 10 сағат үнемде', tr: 'haftada 10 saat kazan' },
  'схем': { en: 'schemes', kk: 'схема', tr: 'şema' },
  'цена не указана': { en: 'price not set', kk: 'баға көрсетілмеген', tr: 'fiyat belirtilmedi' },
  'занято': { en: 'busy', kk: 'бос емес', tr: 'dolu' },
};

const reverseDictionary = new Map<string, string>();

for (const [ru, translations] of Object.entries(dictionary)) {
  reverseDictionary.set(ru, ru);
  Object.values(translations).forEach((value) => reverseDictionary.set(value, ru));
}

export function getLanguage(): AppLanguage {
  const saved = localStorage.getItem(languageKey);
  return saved === 'en' || saved === 'kk' || saved === 'tr' ? saved : 'ru';
}

export function setLanguage(language: AppLanguage) {
  localStorage.setItem(languageKey, language);
  window.dispatchEvent(new CustomEvent('app-language-change'));
}

function translateText(value: string, language: AppLanguage) {
  const trimmed = value.trim();
  if (!trimmed) return value;
  const key = reverseDictionary.get(trimmed);
  if (!key) return value;
  const translated = language === 'ru' ? key : dictionary[key]?.[language] ?? key;
  return value.replace(trimmed, translated);
}

function translateElementAttributes(element: Element, language: AppLanguage) {
  ['placeholder', 'aria-label', 'title', 'alt'].forEach((name) => {
    const value = element.getAttribute(name);
    if (!value) return;
    const nextValue = translateText(value, language);
    if (value !== nextValue) element.setAttribute(name, nextValue);
  });
}

export function applyTranslations(language = getLanguage()) {
  document.documentElement.lang = language;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const parent = node.parentElement;
    if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName)) continue;
    textNodes.push(node);
  }
  textNodes.forEach((node) => {
    const nextValue = translateText(node.nodeValue ?? '', language);
    if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
  });
  document.querySelectorAll('input, img, button, a, section, main, textarea').forEach((element) => {
    translateElementAttributes(element, language);
  });
}
