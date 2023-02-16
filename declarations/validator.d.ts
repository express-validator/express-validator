declare module 'validator' {
  export function contains(
    str: string,
    elem: any,
    options?: import('../src/options').ContainsOptions,
  ): boolean;
  export function equals(str: string, comparison: string): boolean;
  export function isAfter(
    str: string,
    dateOrOptions?: string | import('../src/options').IsAfterOptions,
  ): boolean;
  export function isAlpha(
    str: string,
    locale?: import('../src/options').AlphaLocale,
    options?: import('../src/options').IsAlphaOptions,
  ): boolean;
  export function isAlphanumeric(
    str: string,
    locale?: import('../src/options').AlphanumericLocale,
    options?: import('../src/options').IsAlphanumericOptions,
  ): boolean;
  export function isAscii(str: string): boolean;
  export function isBase32(
    str: string,
    options?: import('../src/options').IsBase32Options,
  ): boolean;
  export function isBase58(str: string): boolean;
  export function isBase64(
    str: string,
    options?: import('../src/options').IsBase64Options,
  ): boolean;
  export function isBefore(str: string, date?: string): boolean;
  export function isBIC(str: string): boolean;
  export function isBoolean(
    str: string,
    options?: import('../src/options').IsBooleanOptions,
  ): boolean;
  export function isBtcAddress(str: string): boolean;
  export function isByteLength(
    str: string,
    options: import('../src/options').MinMaxOptions,
  ): boolean;
  export function isCreditCard(str: string): boolean;
  export function isCurrency(
    str: string,
    options?: import('../src/options').IsCurrencyOptions,
  ): boolean;
  export function isDataURI(str: string): boolean;
  export function isDate(str: string, options?: import('../src/options').IsDateOptions): boolean;
  export function isDecimal(
    str: string,
    options?: import('../src/options').IsDecimalOptions,
  ): boolean;
  export function isDivisibleBy(str: string, number: number): boolean;
  export function isEAN(str: string): boolean;
  export function isEmail(str: string, options?: import('../src/options').IsEmailOptions): boolean;
  export function isEmpty(str: string, options?: import('../src/options').IsEmptyOptions): boolean;
  export function isEthereumAddress(str: string): boolean;
  export function isFQDN(str: string, options?: import('../src/options').IsFQDNOptions): boolean;
  export function isFloat(str: string, options?: import('../src/options').IsFloatOptions): boolean;
  export function isFullWidth(str: string): boolean;
  export function isHalfWidth(str: string): boolean;
  export function isHash(str: string, algorithm: import('../src/options').HashAlgorithm): boolean;
  export function isHexColor(str: string): boolean;
  export function isHexadecimal(str: string): boolean;
  export function isHSL(str: string): boolean;
  export function isIBAN(str: string): boolean;
  export function isIdentityCard(
    str: string,
    locale?: import('../src/options').IdentityCardLocale,
  ): boolean;
  export function isIMEI(str: string, options?: import('../src/options').IsIMEIOptions): boolean;
  export function isIP(str: string, version?: import('../src/options').IPVersion): boolean;
  export function isIPRange(str: string, version?: import('../src/options').IPVersion): boolean;
  export function isISBN(
    str: string,
    versionOrOptions?: number | import('../src/options').IsISBNOptions,
  ): boolean;
  export function isISSN(str: string, options?: import('../src/options').IsISSNOptions): boolean;
  export function isISIN(str: string): boolean;
  export function isISO8601(
    str: string,
    options?: import('../src/options').IsISO8601Options,
  ): boolean;
  export function isISO31661Alpha2(str: string): boolean;
  export function isISO31661Alpha3(str: string): boolean;
  export function isISO4217(str: string): boolean;
  export function isISRC(str: string): boolean;
  export function isIn(str: string, values: readonly any[]): boolean;
  export function isISO6391(str: string): boolean;
  export function isInt(str: string, options?: import('../src/options').IsIntOptions): boolean;
  export function isJSON(str: string, options?: import('../src/options').IsJSONOptions): boolean;
  export function isJWT(str: string): boolean;
  export function isLatLong(
    str: string,
    options?: import('../src/options').IsLatLongOptions,
  ): boolean;
  export function isLength(str: string, options: import('../src/options').MinMaxOptions): boolean;
  export function isLicensePlate(
    str: string,
    locale: import('../src/options').IsLicensePlateLocale,
  ): boolean;
  export function isLocale(str: string): boolean;
  export function isLowercase(str: string): boolean;
  export function isLuhnNumber(str: string): boolean;
  export function isMagnetURI(str: string): boolean;
  export function isMACAddress(
    str: string,
    options: import('../src/options').IsMACAddressOptions,
  ): boolean;
  export function isMD5(str: string): boolean;
  export function isMimeType(str: string): boolean;
  export function isMobilePhone(
    str: string,
    locale:
      | import('../src/options').MobilePhoneLocale
      | readonly import('../src/options').MobilePhoneLocale[],
    options?: import('../src/options').IsMobilePhoneOptions,
  ): boolean;
  export function isMongoId(str: string): boolean;
  export function isMultibyte(str: string): boolean;
  export function isNumeric(
    str: string,
    options?: import('../src/options').IsNumericOptions,
  ): boolean;
  export function isOctal(str: string): boolean;
  export function isPassportNumber(
    str: string,
    countryCode?: import('../src/options').PassportCountryCode,
  ): boolean;
  export function isPort(str: string): boolean;
  export function isPostalCode(
    str: string,
    locale: import('../src/options').PostalCodeLocale,
  ): boolean;
  export function isRFC3339(str: string): boolean;
  export function isRgbColor(str: string, includePercentValues?: boolean): boolean;
  export function isSemVer(str: string): boolean;
  export function isSlug(str: string): boolean;
  export function isStrongPassword(
    str: string,
    options?: import('../src/options').IsStrongPasswordOptions,
  ): boolean;
  export function isSurrogatePair(str: string): boolean;
  export function isTaxID(str: string, locale: import('../src/options').TaxIDLocale): boolean;
  export function isTime(str: string, options?: import('../src/options').IsTimeOptions): boolean;
  export function isURL(str: string, options?: import('../src/options').IsURLOptions): boolean;
  export function isUUID(str: string, version?: import('../src/options').UUIDVersion): boolean;
  export function isUppercase(str: string): boolean;
  export function isVariableWidth(str: string): boolean;
  export function isVAT(str: string, countryCode: import('../src/options').VATCountryCode): boolean;
  export function isWhitelisted(str: string, chars: string | readonly string[]): boolean;
  export function matches(str: string, pattern: RegExp | string, modifiers?: string): boolean;

  export function blacklist(str: string, chars: string): string;
  export function escape(str: string): string;
  export function unescape(str: string): string;
  export function ltrim(str: string, chars?: string): string;
  export function normalizeEmail(
    str: string,
    options?: import('../src/options').NormalizeEmailOptions,
  ): string;
  export function rtrim(str: string, chars?: string): string;
  export function stripLow(str: string, keep_new_lines?: boolean): string;
  export function toBoolean(str: string, strict?: boolean): boolean;
  export function toDate(str: string): Date;
  export function toFloat(str: string): number;
  export function toInt(str: string, radix?: number): string;
  export function trim(str: string, chars?: string): string;
  export function whitelist(str: string, chars: string): string;
  export function toString(str: string): string;
}
