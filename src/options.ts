export type URLProtocol = 'http' | 'https' | 'ftp';
export type UUIDVersion = 3 | 4 | 5 | '3' | '4' | '5' | 'all';
export type IPVersion = 4 | 6;

export type AlphaLocale =
  | 'ar'
  | 'ar-AE'
  | 'ar-BH'
  | 'ar-DZ'
  | 'ar-EG'
  | 'ar-IQ'
  | 'ar-JO'
  | 'ar-KW'
  | 'ar-LB'
  | 'ar-LY'
  | 'ar-MA'
  | 'ar-QA'
  | 'ar-QM'
  | 'ar-SA'
  | 'ar-SD'
  | 'ar-SY'
  | 'ar-TN'
  | 'ar-YE'
  | 'bg-BG'
  | 'cs-CZ'
  | 'da-DK'
  | 'de-DE'
  | 'el-GR'
  | 'en-AU'
  | 'en-GB'
  | 'en-HK'
  | 'en-IN'
  | 'en-NZ'
  | 'en-US'
  | 'en-ZA'
  | 'en-ZM'
  | 'es-ES'
  | 'fr-FR'
  | 'hu-HU'
  | 'it-IT'
  | 'ku-IQ'
  | 'nb-NO'
  | 'nl-NL'
  | 'nn-NO'
  | 'pl-PL'
  | 'pt-BR'
  | 'pt-PT'
  | 'ru-RU'
  | 'sk-SK'
  | 'sl-SI'
  | 'sr-RS'
  | 'sr-RS@latin'
  | 'sv-SE'
  | 'tr-TR'
  | 'uk-UA';

export type AlphanumericLocale =
  | 'ar'
  | 'ar-AE'
  | 'ar-BH'
  | 'ar-DZ'
  | 'ar-EG'
  | 'ar-IQ'
  | 'ar-JO'
  | 'ar-KW'
  | 'ar-LB'
  | 'ar-LY'
  | 'ar-MA'
  | 'ar-QA'
  | 'ar-QM'
  | 'ar-SA'
  | 'ar-SD'
  | 'ar-SY'
  | 'ar-TN'
  | 'ar-YE'
  | 'bg-BG'
  | 'cs-CZ'
  | 'da-DK'
  | 'de-DE'
  | 'el-GR'
  | 'en-AU'
  | 'en-GB'
  | 'en-HK'
  | 'en-IN'
  | 'en-NZ'
  | 'en-US'
  | 'en-ZA'
  | 'en-ZM'
  | 'es-ES'
  | 'fr-FR'
  | 'fr-BE'
  | 'hu-HU'
  | 'it-IT'
  | 'ku-IQ'
  | 'nb-NO'
  | 'nl-BE'
  | 'nl-NL'
  | 'nn-NO'
  | 'pl-PL'
  | 'pt-BR'
  | 'pt-PT'
  | 'ru-RU'
  | 'sk-SK'
  | 'sl-SI'
  | 'sr-RS'
  | 'sr-RS@latin'
  | 'sv-SE'
  | 'tr-TR'
  | 'uk-UA';

export type MobilePhoneLocale =
  | 'any'
  | 'ar-AE'
  | 'ar-BH'
  | 'ar-DZ'
  | 'ar-EG'
  | 'ar-JO'
  | 'ar-IQ'
  | 'ar-KW'
  | 'ar-SA'
  | 'ar-SY'
  | 'ar-TN'
  | 'be-BY'
  | 'bg-BG'
  | 'bn-BD'
  | 'cs-CZ'
  | 'de-DE'
  | 'da-DK'
  | 'el-GR'
  | 'en-AU'
  | 'en-CA'
  | 'en-GB'
  | 'en-GH'
  | 'en-HK'
  | 'en-IE'
  | 'en-IN'
  | 'en-KE'
  | 'en-MT'
  | 'en-MU'
  | 'en-NG'
  | 'en-NZ'
  | 'en-PK'
  | 'en-RW'
  | 'en-SG'
  | 'en-TZ'
  | 'en-UG'
  | 'en-US'
  | 'en-ZA'
  | 'en-ZM'
  | 'es-CL'
  | 'es-ES'
  | 'es-MX'
  | 'es-PY'
  | 'es-UY'
  | 'et-EE'
  | 'fa-IR'
  | 'fi-FI'
  | 'fj-FJ'
  | 'fo-FO'
  | 'fr-FR'
  | 'he-IL'
  | 'hu-HU'
  | 'id-ID'
  | 'it-IT'
  | 'ja-JP'
  | 'kk-KZ'
  | 'kl-GL'
  | 'lt-LT'
  | 'ms-MY'
  | 'nb-NO'
  | 'nl-NL'
  | 'nn-NO'
  | 'pl-PL'
  | 'pt-PT'
  | 'ro-RO'
  | 'ru-RU'
  | 'sk-SK'
  | 'sl-SI'
  | 'sr-RS'
  | 'sv-SE'
  | 'th-TH'
  | 'tr-TR'
  | 'uk-UA'
  | 'vi-VN'
  | 'zh-CN'
  | 'zh-HK'
  | 'zh-TW';

export type PostalCodeLocale =
  | 'any'
  | 'AD'
  | 'AT'
  | 'AU'
  | 'BE'
  | 'BG'
  | 'BR'
  | 'CA'
  | 'CH'
  | 'CZ'
  | 'DE'
  | 'DK'
  | 'DZ'
  | 'EE'
  | 'ES'
  | 'FI'
  | 'FR'
  | 'GB'
  | 'GR'
  | 'HR'
  | 'HU'
  | 'ID'
  | 'IL'
  | 'IN'
  | 'IS'
  | 'IT'
  | 'JP'
  | 'KE'
  | 'LI'
  | 'LT'
  | 'LU'
  | 'LV'
  | 'MT'
  | 'MX'
  | 'NL'
  | 'NO'
  | 'NZ'
  | 'PL'
  | 'PR'
  | 'PT'
  | 'RO'
  | 'RU'
  | 'SA'
  | 'SE'
  | 'SI'
  | 'TN'
  | 'TW'
  | 'UA'
  | 'US'
  | 'ZA'
  | 'ZM';

export type HashAlgorithm =
  | 'md4'
  | 'md5'
  | 'sha1'
  | 'sha256'
  | 'sha384'
  | 'sha512'
  | 'ripemd128'
  | 'ripemd160'
  | 'tiger128'
  | 'tiger160'
  | 'tiger192'
  | 'crc32'
  | 'crc32b';

export type IdentityCard = 'any' | 'ES' | 'he-IL' | 'zh-TW';

export interface MinMaxOptions {
  min?: number;
  max?: number;
}

export interface MinMaxExtendedOptions extends MinMaxOptions {
  lt?: number;
  gt?: number;
}

/**
 * defaults to
 * {
 *   symbol: '$',
 *   require_symbol: false,
 *   allow_space_after_symbol: false,
 *   symbol_after_digits: false,
 *   allow_negatives: true,
 *   parens_for_negatives: false,
 *   negative_sign_before_digits: false,
 *   negative_sign_after_digits: false,
 *   allow_negative_sign_placeholder: false,
 *   thousands_separator: ',',
 *   decimal_separator: '.',
 *   allow_space_after_digits: false
 * }
 */
export interface IsCurrencyOptions {
  symbol?: string;
  require_symbol?: boolean;
  allow_space_after_symbol?: boolean;
  symbol_after_digits?: boolean;
  allow_negatives?: boolean;
  parens_for_negatives?: boolean;
  negative_sign_before_digits?: boolean;
  negative_sign_after_digits?: boolean;
  allow_negative_sign_placeholder?: boolean;
  thousands_separator?: string;
  decimal_separator?: string;
  allow_decimal?: boolean;
  require_decimal?: boolean;
  digits_after_decimal?: number[];
  allow_space_after_digits?: boolean;
}

export interface IsDecimalOptions {
  decimal_digits?: string;
  force_decimal?: boolean;
  locale?: AlphanumericLocale;
}

export interface IsEmailOptions {
  allow_display_name?: boolean;
  allow_utf8_local_part?: boolean;
  require_tld?: boolean;
}

/**
 * defaults to
 * {
 *    ignore_whitespace: false
 * }
 */
export interface IsEmptyOptions {
  ignore_whitespace: boolean;
}

export interface IsFloatOptions extends MinMaxExtendedOptions {
  locale?: AlphanumericLocale;
}

/**
 * defaults to
 * {
 *    require_tld: true,
 *    allow_underscores: false,
 *    allow_trailing_dot: false
 * }
 */
export interface IsFQDNOptions {
  require_tld?: boolean;
  allow_underscores?: boolean;
  allow_trailing_dot?: boolean;
}

export interface IsIntOptions extends MinMaxExtendedOptions {
  allow_leading_zeroes?: boolean;
}

export interface IsISO8601Options {
  strict: boolean;
}

/**
 * defaults to
 * {
 *    case_sensitive: false,
 *    require_hyphen: false
 * }
 */
export interface IsISSNOptions {
  case_sensitive?: boolean;
  require_hyphen?: boolean;
}

/**
 * defaults to
 * {
 *    no_colons: false
 * }
 */
export interface IsMACAddressOptions {
  no_colons?: boolean;
}

export interface IsMobilePhoneOptions {
  strictMode?: boolean;
}

/**
 * defaults to
 * {
 *    no_symbols: false
 * }
 */
export interface IsNumericOptions {
  no_symbols: boolean;
}

/**
 * defaults to
 * {
 *    protocols: ['http','https','ftp'],
 *    require_tld: true,
 *    require_protocol: false,
 *    require_host: true,
 *    require_valid_protocol: true,
 *    allow_underscores: false,
 *    host_whitelist: false,
 *    host_blacklist: false,
 *    allow_trailing_dot: false,
 *    allow_protocol_relative_urls: false
 * }
 */
export interface IsURLOptions {
  protocols?: URLProtocol[];
  require_tld?: boolean;
  require_protocol?: boolean;
  require_host?: boolean;
  require_valid_protocol?: boolean;
  allow_underscores?: boolean;
  host_whitelist?: (string | RegExp)[];
  host_blacklist?: (string | RegExp)[];
  allow_trailing_dot?: boolean;
  allow_protocol_relative_urls?: boolean;
  disallow_auth?: boolean;
}

export interface NormalizeEmailOptions {
  all_lowercase?: boolean;
  gmail_lowercase?: boolean;
  gmail_remove_dots?: boolean;
  gmail_remove_subaddress?: boolean;
  gmail_convert_googlemaildotcom?: boolean;
  outlookdotcom_lowercase?: boolean;
  outlookdotcom_remove_subaddress?: boolean;
  yahoo_lowercase?: boolean;
  yahoo_remove_subaddress?: boolean;
  icloud_lowercase?: boolean;
  icloud_remove_subaddress?: boolean;
}
