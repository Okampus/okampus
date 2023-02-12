const charMap = {
  'ً': 'an',
  'ٌ': 'on',
  'ٍ': 'en',
  'َ': 'a',
  'ُ': 'u',
  'ِ': 'e',
  'ْ': '',
  '–': '-',
  '…': '...',
  '‘': "'",
  '’': "'",
  '“': '\\"',
  '”': '\\"',
  '„': '\\"',
  '&': 'and',
  '%': 'percent',
  '†': '+',
  '•': '*',
  '˚': 'o',
  '©': '(c)',
  '®': '(r)',
  '∂': 'd',
  '∆': 'delta',
  '∑': 'sum',
  '<': 'less',
  '>': 'greater',
  '|': 'or',
  '∞': 'infinity',
  '☢': 'radioactive',
  '♥': 'love',
  '¤': 'currency',
  '¢': 'cent',
  $: 'dollar',
  '£': 'pound',
  '¥': 'yen',
  '฿': 'baht',
  '₠': 'ecu',
  '₢': 'cruzeiro',
  '₣': 'french franc',
  '₤': 'lira',
  '₥': 'mill',
  '₦': 'naira',
  '₧': 'peseta',
  '₩': 'won',
  '₪': 'new shequel',
  '₫': 'dong',
  '€': 'euro',
  '₭': 'kip',
  '₮': 'tugrik',
  '₯': 'drachma',
  '₰': 'penny',
  '₱': 'peso',
  '₲': 'guarani',
  '₳': 'austral',
  '₴': 'hryvnia',
  '₵': 'cedi',
  '₸': 'kazakhstani tenge',
  '₹': 'indian rupee',
  '₺': 'turkish lira',
  '₽': 'russian ruble',
  '₿': 'bitcoin',
  '₨': 'rupee',
  '﷼': 'rial',
  '٠': '0',
  '۰': '0',
  '١': '1',
  '۱': '1',
  '٢': '2',
  '۲': '2',
  '٣': '3',
  '۳': '3',
  '٤': '4',
  '۴': '4',
  '٥': '5',
  '۵': '5',
  '٦': '6',
  '۶': '6',
  '٧': '7',
  '۷': '7',
  '٨': '8',
  '۸': '8',
  '٩': '9',
  '۹': '9',
  ª: 'a',
  á: 'a',
  Á: 'A',
  à: 'a',
  À: 'A',
  ă: 'a',
  Ă: 'A',
  ắ: 'a',
  Ắ: 'A',
  ằ: 'a',
  Ằ: 'A',
  ẵ: 'a',
  Ẵ: 'A',
  ẳ: 'a',
  Ẳ: 'A',
  â: 'a',
  Â: 'A',
  ấ: 'a',
  Ấ: 'A',
  ầ: 'a',
  Ầ: 'A',
  ẫ: 'a',
  Ẫ: 'A',
  ẩ: 'a',
  Ẩ: 'A',
  å: 'a',
  Å: 'A',
  ä: 'a',
  Ä: 'A',
  ã: 'a',
  Ã: 'A',
  ą: 'a',
  Ą: 'A',
  ā: 'a',
  Ā: 'A',
  ả: 'a',
  Ả: 'A',
  ạ: 'a',
  Ạ: 'A',
  ặ: 'a',
  Ặ: 'A',
  ậ: 'a',
  Ậ: 'A',
  æ: 'ae',
  Æ: 'AE',
  ć: 'c',
  Ć: 'C',
  č: 'c',
  Č: 'C',
  ç: 'c',
  Ç: 'C',
  ď: 'd',
  Ď: 'D',
  đ: 'dj',
  Đ: 'DJ',
  ð: 'd',
  Ð: 'D',
  é: 'e',
  É: 'E',
  è: 'e',
  È: 'E',
  ê: 'e',
  Ê: 'E',
  ế: 'e',
  Ế: 'E',
  ề: 'e',
  Ề: 'E',
  ễ: 'e',
  Ễ: 'E',
  ể: 'e',
  Ể: 'E',
  ě: 'e',
  Ě: 'E',
  ë: 'e',
  Ë: 'E',
  ẽ: 'e',
  Ẽ: 'E',
  ė: 'e',
  Ė: 'E',
  ę: 'e',
  Ę: 'e',
  ē: 'e',
  Ē: 'E',
  ẻ: 'e',
  Ẻ: 'E',
  ẹ: 'e',
  Ẹ: 'E',
  ệ: 'e',
  Ệ: 'E',
  ə: 'e',
  Ə: 'E',
  ƒ: 'f',
  ğ: 'g',
  Ğ: 'G',
  ģ: 'g',
  Ģ: 'G',
  í: 'i',
  Í: 'I',
  ì: 'i',
  Ì: 'I',
  î: 'i',
  Î: 'I',
  ï: 'i',
  Ï: 'I',
  ĩ: 'i',
  Ĩ: 'I',
  İ: 'I',
  į: 'i',
  Į: 'I',
  ī: 'i',
  Ī: 'i',
  ỉ: 'i',
  Ỉ: 'I',
  ị: 'i',
  Ị: 'I',
  ı: 'i',
  ķ: 'k',
  Ķ: 'k',
  ľ: 'l',
  Ľ: 'L',
  ļ: 'l',
  Ļ: 'L',
  ł: 'l',
  Ł: 'L',
  ǉ: 'lj',
  ǈ: 'LJ',
  ń: 'n',
  Ń: 'N',
  ň: 'n',
  Ň: 'N',
  ñ: 'n',
  Ñ: 'N',
  ņ: 'n',
  Ņ: 'N',
  ǌ: 'nj',
  ǋ: 'NJ',
  º: 'o',
  ó: 'o',
  Ó: 'O',
  ò: 'o',
  Ò: 'O',
  ô: 'o',
  Ô: 'O',
  ố: 'o',
  Ố: 'O',
  ồ: 'o',
  Ồ: 'O',
  ỗ: 'o',
  Ỗ: 'O',
  ổ: 'o',
  Ổ: 'O',
  ö: 'o',
  Ö: 'O',
  ő: 'o',
  Ő: 'O',
  õ: 'o',
  Õ: 'O',
  ø: 'o',
  Ø: 'O',
  ō: 'o',
  Ō: 'O',
  ỏ: 'o',
  Ỏ: 'O',
  ơ: 'o',
  Ơ: 'O',
  ớ: 'o',
  Ớ: 'O',
  ờ: 'o',
  Ờ: 'O',
  ỡ: 'o',
  Ỡ: 'O',
  ở: 'o',
  Ở: 'O',
  ợ: 'o',
  Ợ: 'O',
  ọ: 'o',
  Ọ: 'O',
  ộ: 'o',
  Ộ: 'O',
  œ: 'oe',
  Œ: 'OE',
  ŕ: 'r',
  Ŕ: 'R',
  ř: 'r',
  Ř: 'R',
  ś: 's',
  Ś: 'S',
  š: 's',
  Š: 'S',
  ş: 's',
  Ş: 'S',
  ṣ: 's',
  Ṣ: 'S',
  ș: 's',
  Ș: 'S',
  '℠': 'sm',
  ß: 'ss',
  ẞ: 'SS',
  ť: 't',
  Ť: 'T',
  ţ: 't',
  Ţ: 'T',
  ț: 't',
  Ț: 'T',
  '™': 'tm',
  ú: 'u',
  Ú: 'U',
  ù: 'u',
  Ù: 'U',
  û: 'u',
  Û: 'U',
  ů: 'u',
  Ů: 'U',
  ü: 'u',
  Ü: 'U',
  ű: 'u',
  Ű: 'U',
  ũ: 'u',
  Ũ: 'U',
  ų: 'u',
  Ų: 'U',
  ū: 'u',
  Ū: 'u',
  ủ: 'u',
  Ủ: 'U',
  ư: 'u',
  Ư: 'U',
  ứ: 'u',
  Ứ: 'U',
  ừ: 'u',
  Ừ: 'U',
  ữ: 'u',
  Ữ: 'U',
  ử: 'u',
  Ử: 'U',
  ự: 'u',
  Ự: 'U',
  ụ: 'u',
  Ụ: 'U',
  ẃ: 'w',
  Ẃ: 'W',
  ẁ: 'w',
  Ẁ: 'W',
  ŵ: 'w',
  Ŵ: 'W',
  ẅ: 'w',
  Ẅ: 'W',
  ý: 'y',
  Ý: 'Y',
  ỳ: 'y',
  Ỳ: 'Y',
  ŷ: 'y',
  Ŷ: 'Y',
  ÿ: 'y',
  Ÿ: 'Y',
  ỹ: 'y',
  Ỹ: 'Y',
  ỷ: 'y',
  Ỷ: 'Y',
  ỵ: 'y',
  Ỵ: 'Y',
  ź: 'z',
  Ź: 'Z',
  ž: 'z',
  Ž: 'Z',
  ż: 'z',
  Ż: 'Z',
  þ: 'th',
  Þ: 'TH',
  α: 'a',
  Α: 'A',
  ά: 'a',
  Ά: 'A',
  β: 'b',
  Β: 'B',
  γ: 'g',
  Γ: 'G',
  δ: 'd',
  Δ: 'D',
  ε: 'e',
  Ε: 'E',
  έ: 'e',
  Έ: 'E',
  ζ: 'z',
  Ζ: 'Z',
  η: 'h',
  Η: 'H',
  ή: 'h',
  Ή: 'H',
  θ: '8',
  Θ: '8',
  ι: 'i',
  Ι: 'I',
  ί: 'i',
  Ί: 'I',
  ϊ: 'i',
  Ϊ: 'I',
  ΐ: 'i',
  κ: 'k',
  Κ: 'K',
  λ: 'l',
  Λ: 'L',
  μ: 'm',
  Μ: 'M',
  ν: 'n',
  Ν: 'N',
  ξ: '3',
  Ξ: '3',
  ο: 'o',
  Ο: 'O',
  ό: 'o',
  Ό: 'O',
  π: 'p',
  Π: 'P',
  ρ: 'r',
  Ρ: 'R',
  σ: 's',
  Σ: 'S',
  ς: 's',
  τ: 't',
  Τ: 'T',
  υ: 'y',
  Υ: 'Y',
  ύ: 'y',
  Ύ: 'Y',
  ϋ: 'y',
  Ϋ: 'Y',
  ΰ: 'y',
  φ: 'f',
  Φ: 'F',
  χ: 'x',
  Χ: 'X',
  ψ: 'ps',
  Ψ: 'PS',
  ω: 'w',
  Ω: 'W',
  ώ: 'w',
  Ώ: 'W',
  а: 'a',
  А: 'A',
  ә: 'ae',
  Ә: 'AE',
  б: 'b',
  Б: 'B',
  в: 'v',
  В: 'V',
  г: 'g',
  Г: 'G',
  ґ: 'g',
  Ґ: 'G',
  ғ: 'gh',
  Ғ: 'GH',
  д: 'd',
  Д: 'D',
  ђ: 'dj',
  Ђ: 'DJ',
  е: 'e',
  Е: 'E',
  ё: 'yo',
  Ё: 'Yo',
  є: 'ye',
  Є: 'Ye',
  ж: 'zh',
  Ж: 'Zh',
  з: 'z',
  З: 'Z',
  и: 'i',
  И: 'I',
  ѝ: 'u',
  і: 'i',
  І: 'I',
  ї: 'yi',
  Ї: 'Yi',
  й: 'j',
  Й: 'J',
  ј: 'j',
  Ј: 'J',
  к: 'k',
  К: 'K',
  қ: 'kh',
  Қ: 'KH',
  л: 'l',
  Л: 'L',
  љ: 'lj',
  Љ: 'LJ',
  м: 'm',
  М: 'M',
  н: 'n',
  Н: 'N',
  ң: 'ng',
  Ң: 'NG',
  њ: 'nj',
  Њ: 'NJ',
  о: 'o',
  О: 'O',
  ө: 'oe',
  Ө: 'OE',
  п: 'p',
  П: 'P',
  р: 'r',
  Р: 'R',
  с: 's',
  С: 'S',
  т: 't',
  Т: 'T',
  ћ: 'c',
  Ћ: 'C',
  у: 'u',
  У: 'U',
  ү: 'ue',
  Ү: 'UE',
  ұ: 'u',
  Ұ: 'U',
  ф: 'f',
  Ф: 'F',
  х: 'h',
  Х: 'H',
  һ: 'h',
  Һ: 'H',
  ц: 'c',
  Ц: 'C',
  ч: 'ch',
  Ч: 'Ch',
  џ: 'dz',
  Џ: 'DZ',
  ш: 'sh',
  Ш: 'Sh',
  щ: 'sh',
  Щ: 'Sh',
  ъ: 'u',
  Ъ: 'U',
  ы: 'y',
  Ы: 'Y',
  ь: '',
  Ь: '',
  э: 'e',
  Э: 'E',
  ю: 'yu',
  Ю: 'Yu',
  я: 'ya',
  Я: 'Ya',
  ა: 'a',
  ბ: 'b',
  გ: 'g',
  დ: 'd',
  ე: 'e',
  ვ: 'v',
  ზ: 'z',
  თ: 't',
  ი: 'i',
  კ: 'k',
  ლ: 'l',
  მ: 'm',
  ნ: 'n',
  ო: 'o',
  პ: 'p',
  ჟ: 'zh',
  რ: 'r',
  ს: 's',
  ტ: 't',
  უ: 'u',
  ფ: 'f',
  ქ: 'k',
  ღ: 'gh',
  ყ: 'q',
  შ: 'sh',
  ჩ: 'ch',
  ც: 'ts',
  ძ: 'dz',
  წ: 'ts',
  ჭ: 'ch',
  ხ: 'kh',
  ჯ: 'j',
  ჰ: 'h',
  Ա: 'A',
  Բ: 'B',
  Գ: 'G',
  Դ: 'D',
  Ե: 'E',
  և: 'EV',
  Զ: 'Z',
  Է: "E'",
  Ը: "Y'",
  Թ: "T'",
  Ժ: 'JH',
  Ի: 'I',
  Լ: 'L',
  Խ: 'X',
  Ծ: "C'",
  Կ: 'K',
  Հ: 'H',
  Ձ: "D'",
  Ղ: 'GH',
  Ճ: 'TW',
  Մ: 'M',
  Յ: 'Y',
  Ն: 'N',
  Շ: 'SH',
  Չ: 'CH',
  Պ: 'P',
  Ջ: 'J',
  Ռ: "R'",
  Ս: 'S',
  Վ: 'V',
  Տ: 'T',
  Ր: 'R',
  Ց: 'C',
  Փ: "P'",
  Ք: "Q'",
  Օ: "O''",
  Ֆ: 'F',
  ء: 'a',
  آ: 'aa',
  أ: 'a',
  ؤ: 'u',
  إ: 'i',
  ئ: 'e',
  ا: 'a',
  ب: 'b',
  پ: 'p',
  ة: 'h',
  ت: 't',
  ث: 'th',
  ج: 'j',
  چ: 'ch',
  ح: 'h',
  خ: 'kh',
  د: 'd',
  ذ: 'th',
  ر: 'r',
  ز: 'z',
  ژ: 'zh',
  س: 's',
  ش: 'sh',
  ص: 's',
  ض: 'dh',
  ط: 't',
  ظ: 'z',
  ع: 'a',
  غ: 'gh',
  ف: 'f',
  ق: 'q',
  ك: 'k',
  ک: 'k',
  گ: 'g',
  ل: 'l',
  ﻵ: 'laa',
  ﻷ: 'laa',
  ﻹ: 'lai',
  ﻻ: 'la',
  م: 'm',
  ن: 'n',
  ه: 'h',
  و: 'w',
  ى: 'a',
  ي: 'y',
  ی: 'y',
  元: 'yuan',
  円: 'yen',
};

export function toSlug(value: string): string {
  value = value.trim().replace(/\s+/g, '-').toLowerCase();
  for (const key of value) {
    if (value.includes(key) && key in charMap) {
      const replaceValue = charMap[key as keyof typeof charMap];
      value = value.replace(key, replaceValue);
    }
  }

  value = value.replace(/[^\w-.]/g, '');
  return value;
}
