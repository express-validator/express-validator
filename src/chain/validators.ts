import * as validator from 'validator';
import { CustomValidator } from '../base';

export interface Validators<Return> {
  custom(validator: CustomValidator): Return;
  exists(options?: { checkFalsy?: boolean, checkNull?: boolean }): Return;
  isArray(): Return;
  isString(): Return;

  // validator's validators
  contains(elem: any): Return;
  equals(comparison: string): Return;
  isAfter(date?: string): Return;
  isAlpha(locale?: validator.AlphaLocale): Return;
  isAlphanumeric(locale?: validator.AlphanumericLocale): Return;
  isAscii(): Return;
  isBase64(): Return;
  isBefore(date?: string): Return;
  isBoolean(): Return;
  isByteLength(options: validator.Options.MinMaxExtendedOptions): Return;
  isCreditCard(): Return;
  isCurrency(options?: validator.Options.IsCurrencyOptions): Return;
  isDataURI(): Return;
  isDecimal(options?: validator.Options.IsDecimalOptions): Return;
  isDivisibleBy(number: number): Return;
  isEmail(options?: validator.Options.IsEmailOptions): Return;
  isEmpty(options?: validator.Options.IsEmptyOptions): Return;
  isFQDN(options?: validator.Options.IsFQDNOptions): Return;
  isFloat(options?: validator.Options.IsFloatOptions): Return;
  isFullWidth(): Return;
  isHalfWidth(): Return;
  isHash(algorithm: validator.HashAlgorithm): Return;
  isHexColor(): Return;
  isHexadecimal(): Return;
  isIP(version?: validator.IPVersion): Return;
  isIPRange(): Return;
  isISBN(version?: number): Return;
  isISSN(options?: validator.Options.IsISSNOptions): Return;
  isISIN(): Return;
  isISO8601(): Return;
  isISO31661Alpha2(): Return;
  isISO31661Alpha3(): Return;
  isISRC(): Return;
  isIn(values: any[]): Return;
  isInt(options?: validator.Options.IsIntOptions): Return;
  isJSON(): Return;
  isLatLong(): Return;
  isLength(options: validator.Options.MinMaxOptions): Return;
  isLowercase(): Return;
  isMACAddress(): Return;
  isMD5(): Return;
  isMimeType(): Return;
  isMobilePhone(
    locale: validator.MobilePhoneLocale,
    options?: validator.Options.IsMobilePhoneOptions
  ): Return;
  isMongoId(): Return;
  isMultibyte(): Return;
  isNumeric(options?: validator.Options.IsNumericOptions): Return;
  isPort(): Return;
  isPostalCode(locale: validator.PostalCodeLocale): Return;
  isRFC3339(): Return;
  isSurrogatePair(): Return;
  isURL(options?: validator.Options.IsURLOptions): Return;
  isUUID(version?: validator.UUIDVersion): Return;
  isUppercase(): Return;
  isVariableWidth(): Return;
  isWhitelisted(chars: string | string[]): Return;
  matches(pattern: RegExp | string, modifiers?: string): Return;
}
