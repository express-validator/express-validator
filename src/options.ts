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
  | 'az-AZ'
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
  | 'fa-AF'
  | 'fa-IR'
  | 'fr-FR'
  | 'he'
  | 'hu-HU'
  | 'id-ID'
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
  | 'th-TH'
  | 'tr-TR'
  | 'uk-UA'
  | 'vi-VN';

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
  | 'az-AZ'
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
  | 'fa-AF'
  | 'fa-IR'
  | 'fr-FR'
  | 'fr-BE'
  | 'he'
  | 'hu-HU'
  | 'it-IT'
  | 'id-ID'
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
  | 'th-TH'
  | 'tr-TR'
  | 'uk-UA'
  | 'vi-VN';

export type MobilePhoneLocale =
  | 'any'
  | 'am-AM'
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
  | 'ar-SA'
  | 'ar-SY'
  | 'ar-TN'
  | 'az-AZ'
  | 'be-BY'
  | 'bg-BG'
  | 'bn-BD'
  | 'bs-BA'
  | 'cs-CZ'
  | 'de-AT'
  | 'de-CH'
  | 'de-DE'
  | 'de-LU'
  | 'da-DK'
  | 'el-GR'
  | 'en-AU'
  | 'en-CA'
  | 'en-GB'
  | 'en-GG'
  | 'en-GH'
  | 'en-HK'
  | 'en-HN'
  | 'en-IE'
  | 'en-IN'
  | 'en-KE'
  | 'en-MT'
  | 'en-MU'
  | 'en-NG'
  | 'en-NZ'
  | 'en-PH'
  | 'en-PK'
  | 'en-RW'
  | 'en-SG'
  | 'en-SL'
  | 'en-TZ'
  | 'en-UG'
  | 'en-US'
  | 'en-ZA'
  | 'en-ZM'
  | 'en-ZW'
  | 'es-AR'
  | 'es-BO'
  | 'es-CL'
  | 'es-CO'
  | 'es-CR'
  | 'es-DO'
  | 'es-EC'
  | 'es-ES'
  | 'es-MX'
  | 'es-PA'
  | 'es-PE'
  | 'es-PY'
  | 'es-UY'
  | 'et-EE'
  | 'fa-IR'
  | 'fi-FI'
  | 'fj-FJ'
  | 'fo-FO'
  | 'fr-BE'
  | 'fr-FR'
  | 'fr-GF'
  | 'fr-GP'
  | 'fr-MQ'
  | 'fr-RE'
  | 'ga-IE'
  | 'he-IL'
  | 'hu-HU'
  | 'id-ID'
  | 'it-IT'
  | 'it-SM'
  | 'ja-JP'
  | 'ka-GE'
  | 'kk-KZ'
  | 'kl-GL'
  | 'lt-LT'
  | 'ms-MY'
  | 'nb-NO'
  | 'nl-NL'
  | 'ne-NP'
  | 'nn-NO'
  | 'pl-PL'
  | 'pt-BR'
  | 'pt-PT'
  | 'ro-RO'
  | 'ru-RU'
  | 'sk-SK'
  | 'sl-SI'
  | 'sq-AL'
  | 'sr-RS'
  | 'sv-SE'
  | 'th-TH'
  | 'tr-TR'
  | 'uk-UA'
  | 'uz-Uz'
  | 'vi-VN'
  | 'zh-CN'
  | 'zh-HK'
  | 'zh-TW';

export type PostalCodeLocale =
  | 'any'
  | 'AD'
  | 'AT'
  | 'AU'
  | 'AZ'
  | 'BE'
  | 'BG'
  | 'BR'
  | 'BY'
  | 'CA'
  | 'CH'
  | 'CN'
  | 'CZ'
  | 'DE'
  | 'DK'
  | 'DO'
  | 'DZ'
  | 'EE'
  | 'ES'
  | 'FI'
  | 'FR'
  | 'GB'
  | 'GR'
  | 'HR'
  | 'HT'
  | 'HU'
  | 'ID'
  | 'IL'
  | 'IN'
  | 'IS'
  | 'IR'
  | 'IT'
  | 'JP'
  | 'KE'
  | 'LI'
  | 'LT'
  | 'LU'
  | 'LV'
  | 'MT'
  | 'MX'
  | 'MY'
  | 'NL'
  | 'NO'
  | 'NP'
  | 'NZ'
  | 'PL'
  | 'PR'
  | 'PT'
  | 'RO'
  | 'RU'
  | 'SA'
  | 'SE'
  | 'SG'
  | 'SI'
  | 'TH'
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

export type IdentityCard =
  | 'any'
  | 'ar-TN'
  | 'ES'
  | 'he-IL'
  | 'IN'
  | 'IT'
  | 'NO'
  | 'zh-CN'
  | 'zh-TW';

export type PassportCountryCode =
  | 'AM'
  | 'AR'
  | 'AT'
  | 'AU'
  | 'BE'
  | 'BG'
  | 'BY'
  | 'CA'
  | 'CH'
  | 'CN'
  | 'CY'
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
  | 'IE'
  | 'IN'
  | 'IS'
  | 'IT'
  | 'JP'
  | 'KR'
  | 'LT'
  | 'LU'
  | 'LV'
  | 'MT'
  | 'NL'
  | 'PO'
  | 'PT'
  | 'RO'
  | 'RU'
  | 'SE'
  | 'SL'
  | 'SK'
  | 'TR'
  | 'UA'
  | 'US';

export type TaxIDLocale = 'en-US';

export type VATCountryCode = 'GB';

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
 *  ignoreCase: false
 * }
 */
export interface ContainsOptions {
  ignoreCase?: boolean;
}

export interface IsAlphaOptions {
  ignore?: string | string[] | RegExp;
}

/**
 * defaults to
 * {
 *  urlSafe: false
 * }
 */
export interface IsBase64Options {
  urlSafe?: boolean;
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

/**
 * defaults to
 * {
 *    format: 'YYYY/MM/DD',
 *    delimiters: ['/', '-'],
 *    strictMode: false
 * }
 */
export interface IsDateOptions {
  format?: string;
  delimiters?: string[];
  strictMode?: boolean;
}

export interface IsDecimalOptions {
  decimal_digits?: string;
  force_decimal?: boolean;
  locale?: AlphanumericLocale;
  blacklisted_chars?: string;
}

export interface IsEmailOptions {
  allow_display_name?: boolean;
  allow_utf8_local_part?: boolean;
  require_tld?: boolean;
  ignore_max_length?: boolean;
  allow_ip_domain?: boolean;
  domain_specific_validation?: boolean;
  blacklisted_chars?: string;
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
 *    allow_trailing_dot: false,
 *    allow_numeric_tld: false
 * }
 */
export interface IsFQDNOptions {
  require_tld?: boolean;
  allow_underscores?: boolean;
  allow_trailing_dot?: boolean;
  allow_numeric_tld?: false;
}

export interface IsIntOptions extends MinMaxExtendedOptions {
  allow_leading_zeroes?: boolean;
}

/**
 * defaults to
 * {
 *  allow_primitives: false
 * }
 */
export interface IsJSONOptions {
  allow_primitives?: boolean;
}

/**
 * defaults to
 * {
 *  checkDMS: false
 * }
 */
export interface IsLatLongOptions {
  checkDMS?: boolean;
}

/**
 * defaults to
 * {
 *  allow_hyphens: false
 * }
 */
export interface IsIMEIOptions {
  allow_hyphens?: boolean;
}

/**
 * defaults to
 * {
 *    strict: false,
 *    strictSeparator: false
 * }
 */
export interface IsISO8601Options {
  strict?: boolean;
  strictSeparator?: boolean;
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
  locale?: AlphanumericLocale;
}

/**
 * defaults to
 * {
 *    minLength: 8,
 *    minLowercase: 1,
 *    minUppercase: 1,
 *    minNumbers: 1,
 *    minSymbols: 1,
 *    returnScore: false,
 *    pointsPerUnique: 1,
 *    pointsPerRepeat: 0.5,
 *    pointsForContainingLower: 10,
 *    pointsForContainingUpper: 10,
 *    pointsForContainingNumber: 10,
 *    pointsForContainingSymbol: 10
 * }
 */
export interface IsStrongPasswordOptions {
  minLength?: number;
  minLowercase?: number;
  minUppercase?: number;
  minNumbers?: number;
  minSymbols?: number;
  returnScore?: boolean;
  pointsPerUnique?: number;
  pointsPerRepeat?: number;
  pointsForContainingLower?: number;
  pointsForContainingUpper?: number;
  pointsForContainingNumber?: number;
  pointsForContainingSymbol?: number;
}

/**
 * defaults to
 * {
 *    protocols: ['http','https','ftp'],
 *    require_tld: true,
 *    require_protocol: false,
 *    require_host: true,
 *    require_port: false;
 *    require_valid_protocol: true,
 *    allow_underscores: false,
 *    host_whitelist: false,
 *    host_blacklist: false,
 *    allow_trailing_dot: false,
 *    allow_protocol_relative_urls: false,
 *    validate_length: true
 * }
 */
export interface IsURLOptions {
  protocols?: URLProtocol[];
  require_tld?: boolean;
  require_protocol?: boolean;
  require_host?: boolean;
  require_port?: boolean;
  require_valid_protocol?: boolean;
  allow_underscores?: boolean;
  host_whitelist?: (string | RegExp)[];
  host_blacklist?: (string | RegExp)[];
  allow_trailing_dot?: boolean;
  allow_protocol_relative_urls?: boolean;
  disallow_auth?: boolean;
  validate_length?: boolean;
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
