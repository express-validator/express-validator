import { CustomValidator, DynamicMessageCreator } from '../base';
import * as Options from '../options';

export interface Validators<Return> {
  // validation manipulation
  not(): Return;
  withMessage(message: DynamicMessageCreator): Return;
  withMessage(message: any): Return;

  // custom validators
  custom(validator: CustomValidator): Return;
  exists(options?: { checkFalsy?: boolean; checkNull?: boolean }): Return;
  isArray(options?: { min?: number; max?: number }): Return;
  isString(): Return;

  // validator's validators
  contains(elem: any): Return;
  equals(comparison: string): Return;
  isAfter(date?: string): Return;
  isAlpha(locale?: Options.AlphaLocale): Return;
  isAlphanumeric(locale?: Options.AlphanumericLocale): Return;
  isAscii(): Return;
  isBase32(): Return;
  isBase64(): Return;
  isBefore(date?: string): Return;
  isBoolean(): Return;
  isByteLength(options: Options.MinMaxExtendedOptions): Return;
  isCreditCard(): Return;
  isCurrency(options?: Options.IsCurrencyOptions): Return;
  isDataURI(): Return;
  isDecimal(options?: Options.IsDecimalOptions): Return;
  isDivisibleBy(number: number): Return;
  isEmail(options?: Options.IsEmailOptions): Return;
  isEmpty(options?: Options.IsEmptyOptions): Return;
  isFQDN(options?: Options.IsFQDNOptions): Return;
  isFloat(options?: Options.IsFloatOptions): Return;
  isFullWidth(): Return;
  isHalfWidth(): Return;
  isHash(algorithm: Options.HashAlgorithm): Return;
  isHexColor(): Return;
  isHexadecimal(): Return;
  isIdentityCard(locale?: ['ES'] | 'any'): Return;
  isIP(version?: Options.IPVersion): Return;
  isIPRange(): Return;
  isISBN(version?: number): Return;
  isISSN(options?: Options.IsISSNOptions): Return;
  isISIN(): Return;
  isISO8601(options?: Options.IsISO8601Options): Return;
  isISO31661Alpha2(): Return;
  isISO31661Alpha3(): Return;
  isISRC(): Return;
  isIn(values: any[]): Return;
  isInt(options?: Options.IsIntOptions): Return;
  isJSON(): Return;
  isJWT(): Return;
  isLatLong(): Return;
  isLength(options: Options.MinMaxOptions): Return;
  isLowercase(): Return;
  isMagnetURI(): Return;
  isMACAddress(options?: Options.IsMACAddressOptions): Return;
  isMD5(): Return;
  isMimeType(): Return;
  isMobilePhone(locale: Options.MobilePhoneLocale, options?: Options.IsMobilePhoneOptions): Return;
  isMongoId(): Return;
  isMultibyte(): Return;
  isNumeric(options?: Options.IsNumericOptions): Return;
  isPort(): Return;
  isPostalCode(locale: Options.PostalCodeLocale): Return;
  isRFC3339(): Return;
  isSurrogatePair(): Return;
  isURL(options?: Options.IsURLOptions): Return;
  isUUID(version?: Options.UUIDVersion): Return;
  isUppercase(): Return;
  isVariableWidth(): Return;
  isWhitelisted(chars: string | string[]): Return;
  matches(pattern: RegExp | string, modifiers?: string): Return;
}
