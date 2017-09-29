export type URLProtocol = 'http' | 'https' | 'ftp'
export type UUIDVersion = 3 | 4 | 5 | 'all'
export type IPVersion = 4 | 6
export type AlphaLocale = 'ar' | 'ar-AE' | 'ar-BH' | 'ar-DZ' | 'ar-EG' | 'ar-IQ' | 'ar-JO' | 'ar-KW' | 'ar-LB' | 'ar-LY' | 'ar-MA' | 'ar-QA' | 'ar-QM' | 'ar-SA' | 'ar-SD' | 'ar-SY' | 'ar-TN' | 'ar-YE' | 'cs-CZ' | 'da-DK' | 'de-DE' | 'en-AU' | 'en-GB' | 'en-HK' | 'en-IN' | 'en-NZ' | 'en-US' | 'en-ZA' | 'en-ZM' | 'es-ES' | 'fr-FR' | 'hu-HU' | 'it-IT' | 'nb-NO' | 'nl-NL' | 'nn-NO' | 'pl-PL' | 'pt-BR' | 'pt-PT' | 'ru-RU' | 'sr-RS' | 'sr-RS@latin' | 'sv-SE' | 'tr-TR' | 'uk-UA'
export type AlphanumericLocale = 'ar' | 'ar-AE' | 'ar-BH' | 'ar-DZ' | 'ar-EG' | 'ar-IQ' | 'ar-JO' | 'ar-KW' | 'ar-LB' | 'ar-LY' | 'ar-MA' | 'ar-QA' | 'ar-QM' | 'ar-SA' | 'ar-SD' | 'ar-SY' | 'ar-TN' | 'ar-YE' | 'cs-CZ' | 'da-DK' | 'de-DE' | 'en-AU' | 'en-GB' | 'en-HK' | 'en-IN' | 'en-NZ' | 'en-US' | 'en-ZA' | 'en-ZM' | 'es-ES' | 'fr-FR' | 'fr-BE' | 'hu-HU' | 'it-IT' | 'nb-NO' | 'nl-BE' | 'nl-NL' | 'nn-NO' | 'pl-PL' | 'pt-BR' | 'pt-PT' | 'ru-RU' | 'sr-RS' | 'sr-RS@latin' | 'sv-SE' | 'tr-TR' | 'uk-UA'
export type MobilePhoneLocal = 'any' | 'ar-AE' | 'ar-DZ' | 'ar-EG' | 'ar-JO' | 'ar-SA' | 'ar-SY' | 'cs-CZ' | 'de-DE' | 'da-DK' | 'el-GR' | 'en-AU' | 'en-GB' | 'en-HK' | 'en-IN' | 'en-KE' | 'en-NG' | 'en-NZ' | 'en-PK' | 'en-RW' | 'en-TZ' | 'en-UG' | 'en-US' | 'en-CA' | 'en-ZA' | 'en-ZM' | 'es-ES' | 'fa-IR' | 'fi-FI' | 'fr-FR' | 'he-IL' | 'hu-HU' | 'id-ID' | 'it-IT' | 'ja-JP' | 'lt-LT' | 'ms-MY' | 'nb-NO' | 'nn-NO' | 'pl-PL' | 'pt-PT' | 'ro-RO' | 'ru-RU' | 'sk-SK' | 'sr-RS' | 'tr-TR' | 'vi-VN' | 'zh-CN' | 'zh-HK' | 'zh-TW'
export type PostalCodeLocale = 'any' | 'AT' | 'AU' | 'BE' | 'CA' | 'CH' | 'CZ' | 'DE' | 'DK' | 'DZ' | 'ES' | 'FI' | 'FR' | 'GB' | 'GR' | 'IL' | 'IN' | 'IS' | 'IT' | 'JP' | 'KE' | 'LI' | 'MX' | 'NL' | 'NO' | 'PL' | 'PT' | 'RO' | 'RU' | 'SA' | 'SE' | 'TW' | 'US' | 'ZA' | 'ZM';
export type Location = 'body' | 'params' | 'query' | 'headers' | 'cookie'
export type HashAlgorithm = 'md4' | 'md5' | 'sha1' | 'sha256'| 'sha384'| 'sha512'| 'ripemd128'| 'ripemd160'| 'tiger128'| 'tiger160'| 'tiger192'| 'crc32'| 'crc32b';

export interface Dictionary<T> { [key: string]: T; }

export interface Validator extends Sanitizer {

  /*
    * Hi fellow contributor,
    * TODO if you add a validator here, please add it also to ValidationSchemaParamOptions
    * preferably in the same order/position, just to make it easier for comparision.
    */

  isEmail(options?: Options.IsEmailOptions): this;
  isURL(options?: Options.IsURLOptions): this;
  isMACAddress(): this;
  /**
   *
   * @param version IP version number 4 or 6
   */
  isIP(version?: IPVersion): this;
  isFQDN(options?: Options.IsFQDNOptions): this;
  isBoolean(): this;
  /**
   * @param locale Optional. Defaults to en-US
   */
  isAlpha(locale?: AlphaLocale): this;
  /**
   * @param locale Optional. Defaults to en-US
   */
  isAlphanumeric(locale?: AlphanumericLocale): this;
  isNumeric(): this;
  isLowercase(): this;
  isUppercase(): this;
  isAscii(): this;
  isFullWidth(): this;
  isHalfWidth(): this;
  isVariableWidth(): this;
  isHash(algorithm: HashAlgorithm): this;
  isMultibyte(): this;
  isSurrogatePair(): this;
  isInt(options?: Options.IsIntOptions): this;
  isFloat(options?: Options.MinMaxExtendedOptions): this;
  isDecimal(): this;
  isHexadecimal(): this;
  isDivisibleBy(num: number): this;
  isHexColor(): this;
  isMD5(): this;
  isJSON(): this;
  isLatLong(): this;
  isPostalCode(locale: PostalCodeLocale): this;
  isEmpty(): this;
  isLength(options: Options.MinMaxOptions): this;
  isByteLength(options: Options.MinMaxOptions): this;
  /**
   * @param version 3, 4, 5 or 'all'. Default is 'all'.
   * @see http://en.wikipedia.org/wiki/Universally_unique_identifier
   */
  isUUID(version?: UUIDVersion): this;
  /**
   * @see https://docs.mongodb.com/manual/reference/bson-types/#objectid
   */
  isMongoId(): this;
  /**
   * @param date Optional. Default to now.
   */
  isAfter(date?: string): this;
  /**
   * @param date Optional. Default to now.
   */
  isBefore(date?: string): this;
  isIn(options: string | string[]): this;
  isCreditCard(): this;
  isISIN(): this;
  /**
   * @see https://en.wikipedia.org/wiki/International_Standard_Recording_Code
   */
  isISRC(): this;
  /**
   * @param version
   * @see https://en.wikipedia.org/wiki/International_Standard_Book_Number
   */
  isISBN(version?: number): this;
  /**
   * @param options
   * @see https://en.wikipedia.org/wiki/International_Standard_Serial_Number
   */
  isISSN(options?: Options.IsISSNOptions): this
  isMobilePhone(locale: MobilePhoneLocal): this;
  isCurrency(options: Options.IsCurrencyOptions): this;
  /**
   * @see https://en.wikipedia.org/wiki/ISO_8601
   */
  isISO8601(): this;
  /**
   * @see https://en.wikipedia.org/wiki/Base64
   */
  isBase64(): this;
  /**
   * @see https://en.wikipedia.org/wiki/Data_URI_scheme
   */
  isDataURI(): this;
  isWhitelisted(chars: string | string[]): this;

  // Additional validators provided by validator.js

  equals(equals: any): this;
  contains(str: string): this;
  matches(pattern: RegExp | string, modifiers?: string): this;


  // Additional ValidatorChain.prototype.* validators

  not(): this;
  exists(): this;
  optional(options?: Options.OptionalOptions): this;
  withMessage(message: any): this;
}

interface Sanitizer {
  /**
   * Convert the input string to a date, or null if the input is not a date.
   */
  toDate(): this;
  /**
   * Convert the input string to a float, or NaN if the input is not a float.
   */
  toFloat(): this;
  /**
   * Convert the input string to a float, or NaN if the input is not a float.
   */
  toInt(radix?: number): this;
  /**
   * Cnvert the input string to a boolean.
   * Everything except for '0', 'false' and '' returns true.
   * @param strict If true, only '1' and 'true' return true.
   */
  toBoolean(strict?: boolean): this;
  /**
   * Trim characters (whitespace by default) from both sides of the input.
   * @param chars Defaults to whitespace
   */
  trim(chars?: string): this;
  ltrim(chars?: string): this;
  rtrim(chars?: string): this;
  /**
   * Remove characters with a numerical value < 32 and 127, mostly control characters.
   * Unicode-safe in JavaScript.
   * @param keep_new_lines If true, newline characters are preserved (\n and \r, hex 0xA and 0xD).
   */
  stripLow(keep_new_lines?: boolean): this;
  /**
   * Escape &, <, >, and "
   */
  escape(): this;
  /**
   * Replaces HTML encoded entities with <, >, &, ', " and /.
   */
  unescape(): this;
  blacklist(chars: string): this;
  whitelist(chars: string): this;

  normalizeEmail(options?: Options.NormalizeEmailOptions): this;
}

export interface MappedError {
  param: string;
  msg: string;
  value: string;
  location: Location
}

export interface Result {
  /**
   * @return A boolean determining whether there were errors or not.
   */
  isEmpty(): boolean

  /**
   * @return The current validation result instance
   */
  formatWith(formatter: ErrorFormatter): this;

  /**
   * @return All errors for all validated parameters will be included, unless you specify that you want only the first
   * error of each param by invoking `result.useFirstErrorOnly()`.
   */
  array(options?: Options.ResultArrayOptions): MappedError[]

  /**
   * @return An object of errors, where the key is the parameter name, and the value is an error object as returned by
   *  the error formatter.
   * Because of historical reasons, by default this method will return the last error of each parameter.
   * You can change this behavior by invoking result.useFirstErrorOnly(), so the first error is returned instead.
   */
  mapped(): Dictionary<MappedError>

  /**
   * Useful for dealing with the validation errors in the catch block of a try..catch or promise.
   *
   * @throws If there are errors, throws an Error object which is decorated with the same API as the validation
   * result object.
   */
  throw(): Result
}

export interface ErrorFormatter {
  (error: { location: Location, param: string, msg: any, value: any }): any;
}

declare namespace Options {

  export interface ExpressValidatorOptions {
    customValidators?: { [validatorName: string]: (...value: any[]) => boolean | Promise<any> }
    customSanitizers?: { [sanitizername: string]: (value: any) => any }
    errorFormatter?: (param?: string, msg?: string, value?: any, location?: Location) => any
  }

  interface ResultArrayOptions {
    onlyFirstError: boolean;
  }

  interface ValidatorSchemaOptions {
    options?: any[]
    errorMessage?: any
  }

  interface ValidationSchemaParamOptions {
    in?: Location
    errorMessage?: any

    // Additional ValidatorChain.prototype.* validators
    optional?: boolean | OptionalOptions
    notEmpty?: boolean | { errorMessage: string }
    len?: ValidatorSchemaOptions

    // exported from validator.js
    isEmail?: ValidatorSchemaOptions
    isURL?: ValidatorSchemaOptions
    isMACAddress?: ValidatorSchemaOptions
    isIP?: ValidatorSchemaOptions
    isFQDN?: ValidatorSchemaOptions
    isBoolean?: ValidatorSchemaOptions
    isAlpha?: ValidatorSchemaOptions
    isAlphanumeric?: ValidatorSchemaOptions
    isNumeric?: ValidatorSchemaOptions
    isLowercase?: ValidatorSchemaOptions
    isUppercase?: ValidatorSchemaOptions
    isAscii?: ValidatorSchemaOptions
    isFullWidth?: ValidatorSchemaOptions
    isHalfWidth?: ValidatorSchemaOptions
    isVariableWidth?: ValidatorSchemaOptions
    isHash?: ValidationSchemaParamOptions
    isMultibyte?: ValidatorSchemaOptions
    isSurrogatePair?: ValidatorSchemaOptions
    isInt?: ValidatorSchemaOptions
    isFloat?: ValidatorSchemaOptions
    isDecimal?: ValidatorSchemaOptions
    isHexadecimal?: ValidatorSchemaOptions
    isDivisibleBy?: ValidatorSchemaOptions
    isHexColor?: ValidatorSchemaOptions
    isMD5?: ValidatorSchemaOptions
    isJSON?: ValidatorSchemaOptions
    isLatLong?: ValidationSchemaParamOptions
    isEmpty?: ValidatorSchemaOptions
    isLength?: ValidatorSchemaOptions
    isByteLength?: ValidatorSchemaOptions
    isPostalCode?: ValidationSchemaParamOptions
    isUUID?: ValidatorSchemaOptions
    isMongoId?: ValidatorSchemaOptions
    isDate?: ValidatorSchemaOptions
    isAfter?: ValidatorSchemaOptions
    isBefore?: ValidatorSchemaOptions
    isIn?: ValidatorSchemaOptions
    isCreditCard?: ValidatorSchemaOptions
    isISIN?: ValidatorSchemaOptions
    isISRC?: ValidatorSchemaOptions
    isISBN?: ValidatorSchemaOptions
    isISSN?: ValidatorSchemaOptions
    isMobilePhone?: ValidatorSchemaOptions
    isCurrency?: ValidatorSchemaOptions
    isISO8601?: ValidatorSchemaOptions
    isBase64?: ValidatorSchemaOptions
    isDataURI?: ValidatorSchemaOptions
    isWhitelisted?: ValidatorSchemaOptions

    // Additional Validators provided by validator.js
    equals?: ValidatorSchemaOptions
    contains?: ValidatorSchemaOptions
    matches?: ValidatorSchemaOptions
  }


  // VALIDATORS

  interface MinMaxOptions {
    min?: number;
    max?: number;
  }

  interface MinMaxExtendedOptions extends MinMaxOptions {
    lt?: number;
    gt?: number;
  }

  interface IsIntOptions extends MinMaxExtendedOptions {
    allow_leading_zeroes?: boolean;
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


  // SANITIZERS

  /**
   * Defaults to
   * {
   *   all_lowercase: true
   *   gmail_lowercase: true
   *   gmail_remove_dots: true
   *   gmail_remove_subaddress: true
   *   gmail_convert_googlemaildotcom: true
   *   outlookdotcom_lowercase: true
   *   outlookdotcom_remove_subaddress: true
   *   yahoo_lowercase: true
   *   yahoo_remove_subaddress: true
   *   icloud_lowercase: true
   *   icloud_remove_subaddress: true
   * }
   */
  interface NormalizeEmailOptions {
    all_lowercase?: boolean
    gmail_lowercase?: boolean
    gmail_remove_dots?: boolean
    gmail_remove_subaddress?: boolean
    gmail_convert_googlemaildotcom?: boolean
    outlookdotcom_lowercase?: boolean
    outlookdotcom_remove_subaddress?: boolean
    yahoo_lowercase?: boolean
    yahoo_remove_subaddress?: boolean
    icloud_lowercase?: boolean
    icloud_remove_subaddress?: boolean
  }
}
