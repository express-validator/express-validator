declare module 'validator' {
  export function contains(str: string, elem: any): boolean;
  export function equals(str: string, comparison: string): boolean;
  export function isAfter(str: string, date?: string): boolean;
  export function isAlpha(str: string, locale?: AlphaLocale): boolean;
  export function isAlphanumeric(str: string, locale?: AlphanumericLocale): boolean;
  export function isAscii(str: string): boolean;
  export function isBase32(str: string): boolean;
  export function isBase64(str: string): boolean;
  export function isBefore(str: string, date?: string): boolean;
  export function isBoolean(str: string): boolean;
  export function isByteLength(str: string, options: Options.MinMaxOptions): boolean;
  export function isCreditCard(str: string): boolean;
  export function isCurrency(str: string, options?: Options.IsCurrencyOptions): boolean;
  export function isDataURI(str: string): boolean;
  export function isDecimal(str: string, options?: Options.IsDecimalOptions): boolean;
  export function isDivisibleBy(str: string, number: number): boolean;
  export function isEmail(str: string, options?: Options.IsEmailOptions): boolean;
  export function isEmpty(str: string, options?: Options.IsEmptyOptions): boolean;
  export function isFQDN(str: string, options?: Options.IsFQDNOptions): boolean;
  export function isFloat(str: string, options?: Options.IsFloatOptions): boolean;
  export function isFullWidth(str: string): boolean;
  export function isHalfWidth(str: string): boolean;
  export function isHash(str: string, algorithm: HashAlgorithm): boolean;
  export function isHexColor(str: string): boolean;
  export function isHexadecimal(str: string): boolean;
  export function isIdentityCard(str: string, locale?: ['ES'] | 'any'): boolean;
  export function isIP(str: string, version?: IPVersion): boolean;
  export function isIPRange(str: string): boolean;
  export function isISBN(str: string, version?: number): boolean;
  export function isISSN(str: string, options?: Options.IsISSNOptions): boolean;
  export function isISIN(str: string): boolean;
  export function isISO8601(str: string, options?: Options.IsISO8601Options): boolean;
  export function isISO31661Alpha2(str: string): boolean;
  export function isISO31661Alpha3(str: string): boolean;
  export function isISRC(str: string): boolean;
  export function isIn(str: string, values: any[]): boolean;
  export function isInt(str: string, options?: Options.IsIntOptions): boolean;
  export function isJSON(str: string): boolean;
  export function isJWT(str: string): boolean;
  export function isLatLong(str: string): boolean;
  export function isLength(str: string, options: Options.MinMaxOptions): boolean;
  export function isLowercase(str: string): boolean;
  export function isMagnetURI(str: string): boolean;
  export function isMACAddress(str: string, options: Options.IsMACAddressOptions): boolean;
  export function isMD5(str: string): boolean;
  export function isMimeType(str: string): boolean;
  export function isMobilePhone(
    str: string,
    locale: MobilePhoneLocale,
    options?: Options.IsMobilePhoneOptions,
  ): boolean;
  export function isMongoId(str: string): boolean;
  export function isMultibyte(str: string): boolean;
  export function isNumeric(str: string, options?: Options.IsNumericOptions): boolean;
  export function isPort(str: string): boolean;
  export function isPostalCode(str: string, locale: PostalCodeLocale): boolean;
  export function isRFC3339(str: string): boolean;
  export function isSurrogatePair(str: string): boolean;
  export function isURL(str: string, options?: Options.IsURLOptions): boolean;
  export function isUUID(str: string, version?: UUIDVersion): boolean;
  export function isUppercase(str: string): boolean;
  export function isVariableWidth(str: string): boolean;
  export function isWhitelisted(str: string, chars: string | string[]): boolean;
  export function matches(str: string, pattern: RegExp | string, modifiers?: string): boolean;

  export function blacklist(str: string, chars: string): string;
  export function escape(str: string): string;
  export function unescape(str: string): string;
  export function ltrim(str: string, chars?: string): string;
  export function normalizeEmail(str: string, options?: Options.NormalizeEmailOptions): string;
  export function rtrim(str: string, chars?: string): string;
  export function stripLow(str: string, keep_new_lines?: boolean): string;
  export function toBoolean(str: string, strict?: boolean): boolean;
  export function toDate(str: string): Date;
  export function toFloat(str: string): number;
  export function toInt(str: string, radix?: number): string;
  export function trim(str: string, chars?: string): string;
  export function whitelist(str: string, chars: string): string;
  export function toString(str: string): string;

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
    | 'en-GB'
    | 'en-GH'
    | 'en-HK'
    | 'en-IE'
    | 'en-IN'
    | 'en-KE'
    | 'en-MU'
    | 'en-NG'
    | 'en-NZ'
    | 'en-PK'
    | 'en-RW'
    | 'en-SG'
    | 'en-TZ'
    | 'en-UG'
    | 'en-US'
    | 'en-CA'
    | 'en-ZA'
    | 'en-ZM'
    | 'es-ES'
    | 'es-MX'
    | 'es-PY'
    | 'es-UY'
    | 'et-EE'
    | 'fa-IR'
    | 'fi-FI'
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
    | 'MX'
    | 'NL'
    | 'NO'
    | 'PL'
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

  export namespace Options {
    interface MinMaxOptions {
      min?: number;
      max?: number;
    }

    interface MinMaxExtendedOptions extends MinMaxOptions {
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
    interface IsCurrencyOptions {
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

    interface IsDecimalOptions {
      decimal_digits?: string;
      force_decimal?: boolean;
      locale?: AlphanumericLocale;
    }

    interface IsEmailOptions {
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
    interface IsEmptyOptions {
      ignore_whitespace: boolean;
    }

    interface IsFloatOptions extends MinMaxExtendedOptions {
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
    interface IsFQDNOptions {
      require_tld?: boolean;
      allow_underscores?: boolean;
      allow_trailing_dot?: boolean;
    }

    interface IsIntOptions extends MinMaxExtendedOptions {
      allow_leading_zeroes?: boolean;
    }

    interface IsISO8601Options {
      strict: boolean;
    }

    /**
     * defaults to
     * {
     *    case_sensitive: false,
     *    require_hyphen: false
     * }
     */
    interface IsISSNOptions {
      case_sensitive?: boolean;
      require_hyphen?: boolean;
    }

    /**
     * defaults to
     * {
     *    no_colons: false
     * }
     */
    interface IsMACAddressOptions {
      no_colons?: boolean;
    }

    interface IsMobilePhoneOptions {
      strictMode?: boolean;
    }

    /**
     * defaults to
     * {
     *    no_symbols: false
     * }
     */
    interface IsNumericOptions {
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
    interface IsURLOptions {
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

    interface NormalizeEmailOptions {
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
  }
}
