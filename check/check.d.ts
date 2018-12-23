import * as express from 'express';
import { Sanitizer } from '../filter';
import { Location } from './location';

export type URLProtocol = 'http' | 'https' | 'ftp'
export type UUIDVersion = 3 | 4 | 5 | 'all'
export type IPVersion = 4 | 6
export type AlphaLocale = 'ar' | 'ar-AE' | 'ar-BH' | 'ar-DZ' | 'ar-EG' | 'ar-IQ' | 'ar-JO' | 'ar-KW' | 'ar-LB' | 'ar-LY' | 'ar-MA' | 'ar-QA' | 'ar-QM' | 'ar-SA' | 'ar-SD' | 'ar-SY' | 'ar-TN' | 'ar-YE' | 'bg-BG' | 'cs-CZ' | 'da-DK' | 'de-DE' | 'el-GR' | 'en-AU' | 'en-GB' | 'en-HK' | 'en-IN' | 'en-NZ' | 'en-US' | 'en-ZA' | 'en-ZM' | 'es-ES' | 'fr-FR' | 'hu-HU' | 'it-IT' | 'nb-NO' | 'nl-NL' | 'nn-NO' | 'pl-PL' | 'pt-BR' | 'pt-PT' | 'ru-RU' | 'sk-SK' | 'sr-RS' | 'sr-RS@latin' | 'sv-SE' | 'tr-TR' | 'uk-UA'
export type AlphanumericLocale = 'ar' | 'ar-AE' | 'ar-BH' | 'ar-DZ' | 'ar-EG' | 'ar-IQ' | 'ar-JO' | 'ar-KW' | 'ar-LB' | 'ar-LY' | 'ar-MA' | 'ar-QA' | 'ar-QM' | 'ar-SA' | 'ar-SD' | 'ar-SY' | 'ar-TN' | 'ar-YE' | 'bg-BG' | 'cs-CZ' | 'da-DK' | 'de-DE' | 'el-GR' | 'en-AU' | 'en-GB' | 'en-HK' | 'en-IN' | 'en-NZ' | 'en-US' | 'en-ZA' | 'en-ZM' | 'es-ES' | 'fr-FR' | 'fr-BE' | 'hu-HU' | 'it-IT' | 'nb-NO' | 'nl-BE' | 'nl-NL' | 'nn-NO' | 'pl-PL' | 'pt-BR' | 'pt-PT' | 'ru-RU' | 'sk-SK' | 'sr-RS' | 'sr-RS@latin' | 'sv-SE' | 'tr-TR' | 'uk-UA'
export type MobilePhoneLocal = 'any' | 'ar-AE' | 'ar-DZ' | 'ar-EG' | 'ar-JO' | 'ar-KW' | 'ar-SA' | 'ar-SY' | 'ar-TN' | 'be-BY' | 'bg-BG' | 'cs-CZ' | 'de-DE' | 'da-DK' | 'el-GR' | 'en-AU' | 'en-GB' | 'en-HK' | 'en-IN' | 'en-KE' | 'en-NG' | 'en-NZ' | 'en-PK' | 'en-RW' | 'en-SG' | 'en-TZ' | 'en-UG' | 'en-US' | 'en-CA' | 'en-ZA' | 'en-ZM' | 'es-ES' | 'et-EE' | 'fa-IR' | 'fi-FI' | 'fo-FO' | 'fr-FR' | 'he-IL' | 'hu-HU' | 'id-ID' | 'it-IT' | 'ja-JP' | 'kk-KZ' | 'kl-GL' | 'lt-LT' | 'ms-MY' | 'nb-NO' | 'nn-NO' | 'pl-PL' | 'pt-PT' | 'ro-RO' | 'ru-RU' | 'sk-SK' | 'sr-RS' | 'sv-SE' | 'th-TH' | 'tr-TR' | 'uk-UA' | 'vi-VN' | 'zh-CN' | 'zh-HK' | 'zh-TW'
export type PostalCodeLocale = 'any' | 'AT' | 'AU' | 'BE' | 'BG' | 'CA' | 'CH' | 'CZ' | 'DE' | 'DK' | 'DZ' | 'EE' | 'ES' | 'FI' | 'FR' | 'GB' | 'GR' | 'HR' | 'HU' | 'IL' | 'IN' | 'IS' | 'IT' | 'JP' | 'KE' | 'LI' | 'LT' | 'LU' | 'LV' | 'MX' | 'NL' | 'NO' | 'PL' | 'PT' | 'RO' | 'RU' | 'SA' | 'SE' | 'SI' | 'TN' | 'TW' | 'US' | 'ZA' | 'ZM';
export type HashAlgorithm = 'md4' | 'md5' | 'sha1' | 'sha256'| 'sha384'| 'sha512'| 'ripemd128'| 'ripemd160'| 'tiger128'| 'tiger160'| 'tiger192'| 'crc32'| 'crc32b';

export interface Validator {
  isAfter(date?: string): this;
  isAlpha(locale?: AlphaLocale): this;
  isAlphanumeric(locale?: AlphanumericLocale): this;
  isArray(): this;
  isAscii(): this;
  isBase64(): this;
  isBefore(date?: string): this;
  isBoolean(): this;
  isByteLength(options: ValidatorOptions.MinMaxOptions): this;
  isCreditCard(): this;
  isCurrency(options: ValidatorOptions.IsCurrencyOptions): this;
  isDataURI(): this;
  isDecimal(options?: ValidatorOptions.IsDecimalOptions): this;
  isDivisibleBy(num: number): this;
  isEmail(options?: ValidatorOptions.IsEmailOptions): this;
  isEmpty(): this;
  isFloat(options?: ValidatorOptions.IsFloatOptions): this;
  isFQDN(options?: ValidatorOptions.IsFQDNOptions): this;
  isFullWidth(): this;
  isHalfWidth(): this;
  isHash(algorithm: HashAlgorithm): this;
  isHexadecimal(): this;
  isHexColor(): this;
  isIn(options: string | string[]): this;
  isInt(options?: ValidatorOptions.IsIntOptions): this;
  isIP(version?: IPVersion): this;
  isIPRange(): this;
  isISIN(): this;
  isISO31661Alpha2(): this;
  isISO31661Alpha3(): this;
  isISO8601(): this;
  isISRC(): this;
  isISBN(version?: number): this;
  isISSN(options?: ValidatorOptions.IsISSNOptions): this;
  isJSON(): this;
  isLatLong(): this;
  isLength(options: ValidatorOptions.MinMaxOptions): this;
  isLowercase(): this;
  isMACAddress(): this;
  isMD5(): this;
  isMimeType(): this;
  isMongoId(): this;
  isMobilePhone(locale: MobilePhoneLocal | MobilePhoneLocal[], options?: ValidatorOptions.IsMobilePhoneOptions): this;
  isMultibyte(): this;
  isNumeric(): this;
  isPostalCode(locale: PostalCodeLocale): this;
  isPort(): this;
  isString(): this;
  isSurrogatePair(): this;
  isUppercase(): this;
  isURL(options?: ValidatorOptions.IsURLOptions): this;
  isUUID(version?: UUIDVersion): this;
  isVariableWidth(): this;
  isWhitelisted(chars: string | string[]): this;

  equals(equals: any): this;
  contains(str: string): this;
  matches(pattern: RegExp | string, modifiers?: string): this;

  // Additional validator methods
  not(): this;
  exists(options?: ValidatorOptions.ExistsOptions): this;
  optional(options?: ValidatorOptions.OptionalOptions): this;
  withMessage(message: CustomMessageBuilder): this;
  withMessage(message: any): this;
}

export interface ValidationChain extends express.RequestHandler, Validator, Sanitizer {
  custom(validator: CustomValidator): this;
}

export interface CustomValidator {
  (value: any, options: { req: express.Request, location: string, path: string }): any;
}

export interface CustomMessageBuilder {
  (value: any, options: { req: express.Request, location: Location, path: string }): any;
}

export namespace ValidatorOptions {
  interface MinMaxOptions {
    min?: number;
    max?: number;
  }

  interface MinMaxExtendedOptions extends MinMaxOptions {
    lt?: number;
    gt?: number;
  }

  interface IsFloatOptions extends MinMaxExtendedOptions {
    locale?: AlphanumericLocale;
  }

  interface IsIntOptions extends MinMaxExtendedOptions {
    allow_leading_zeroes?: boolean;
  }

  interface IsDecimalOptions {
    decimal_digits?: string;
    force_decimal?: boolean;
    locale?: AlphanumericLocale;
  }

  /**
   * defaults to
   * {
   *    allow_display_name: false,
   *    require_display_name: false,
   *    allow_utf8_local_part: true,
   *    require_tld: true
   * }
   */
  interface IsEmailOptions {
    allow_display_name?: boolean;
    allow_utf8_local_part?: boolean;
    require_tld?: boolean;
  }

  interface IsMobilePhoneOptions {
    strictMode?: boolean;
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

  /**
   * defaults to
   * {
   *    case_sensitive: false,
   *    require_hyphen: false
   * }
   */
  interface IsISSNOptions {
    case_sensitive?: boolean
    require_hyphen?: boolean
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

  interface OptionalOptions {
    checkFalsy?: boolean;
    nullable?: boolean;
  }

  /**
   * defaults to
   * {
   *    checkNull: false,
   *    checkFalsy: false
   * }
   */
  interface ExistsOptions {
    checkNull?: boolean;
    checkFalsy?: boolean;
  }
}
