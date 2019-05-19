import * as validator from 'validator';
import { CustomValidator, StandardValidator } from '../base';
import { Context } from '../context';
import { Validators } from './validators';

export class ValidatorsImpl<Chain> implements Validators<Chain> {
  constructor(private readonly context: Context, private readonly chain: Chain) {}

  custom(validator: CustomValidator) {
    this.context.addValidation(validator, { custom: true });
    return this.chain;
  }

  exists(options: { checkFalsy?: boolean; checkNull?: boolean } = {}) {
    let validator: CustomValidator;
    if (options.checkFalsy) {
      validator = value => !!value;
    } else if (options.checkNull) {
      validator = value => value != null;
    } else {
      validator = value => value !== undefined;
    }

    return this.custom(validator);
  }

  isArray() {
    return this.custom(value => Array.isArray(value));
  }

  isString() {
    return this.custom(value => typeof value === 'string');
  }

  // Standard validators
  private addStandardValidation(validator: StandardValidator, ...options: any[]) {
    this.context.addValidation(validator, {
      options,
      custom: false,
    });

    return this.chain;
  }

  contains(elem: any) {
    return this.addStandardValidation(validator.contains, elem);
  }
  equals(comparison: string) {
    return this.addStandardValidation(validator.equals, comparison);
  }
  isAfter(date?: string) {
    return this.addStandardValidation(validator.isAfter, date);
  }
  isAlpha(locale?: validator.AlphaLocale) {
    return this.addStandardValidation(validator.isAlpha, locale);
  }
  isAlphanumeric(locale?: validator.AlphanumericLocale) {
    return this.addStandardValidation(validator.isAlphanumeric, locale);
  }
  isAscii() {
    return this.addStandardValidation(validator.isAscii);
  }
  isBase64() {
    return this.addStandardValidation(validator.isBase64);
  }
  isBefore(date?: string) {
    return this.addStandardValidation(validator.isBefore, date);
  }
  isBoolean() {
    return this.addStandardValidation(validator.isBoolean);
  }
  isByteLength(options: validator.Options.MinMaxOptions) {
    return this.addStandardValidation(validator.isByteLength, options);
  }
  isCreditCard() {
    return this.addStandardValidation(validator.isCreditCard);
  }
  isCurrency(options?: validator.Options.IsCurrencyOptions) {
    return this.addStandardValidation(validator.isCurrency, options);
  }
  isDataURI() {
    return this.addStandardValidation(validator.isDataURI);
  }
  isDecimal(options?: validator.Options.IsDecimalOptions) {
    return this.addStandardValidation(validator.isDecimal, options);
  }
  isDivisibleBy(number: number) {
    return this.addStandardValidation(validator.isDivisibleBy, number);
  }
  isEmail(options?: validator.Options.IsEmailOptions) {
    return this.addStandardValidation(validator.isEmail, options);
  }
  isEmpty(options?: validator.Options.IsEmptyOptions) {
    return this.addStandardValidation(validator.isEmpty, options);
  }
  isFQDN(options?: validator.Options.IsFQDNOptions) {
    return this.addStandardValidation(validator.isFQDN, options);
  }
  isFloat(options?: validator.Options.IsFloatOptions) {
    return this.addStandardValidation(validator.isFloat, options);
  }
  isFullWidth() {
    return this.addStandardValidation(validator.isFullWidth);
  }
  isHalfWidth() {
    return this.addStandardValidation(validator.isHalfWidth);
  }
  isHash(algorithm: validator.HashAlgorithm) {
    return this.addStandardValidation(validator.isHash, algorithm);
  }
  isHexColor() {
    return this.addStandardValidation(validator.isHexColor);
  }
  isHexadecimal() {
    return this.addStandardValidation(validator.isHexadecimal);
  }
  isIP(version?: validator.IPVersion) {
    return this.addStandardValidation(validator.isIP, version);
  }
  isIPRange() {
    return this.addStandardValidation(validator.isIPRange);
  }
  isISBN(version?: number) {
    return this.addStandardValidation(validator.isISBN, version);
  }
  isISSN(options?: validator.Options.IsISSNOptions) {
    return this.addStandardValidation(validator.isISSN, options);
  }
  isISIN() {
    return this.addStandardValidation(validator.isISIN);
  }
  isISO8601() {
    return this.addStandardValidation(validator.isISO8601);
  }
  isISO31661Alpha2() {
    return this.addStandardValidation(validator.isISO31661Alpha2);
  }
  isISO31661Alpha3() {
    return this.addStandardValidation(validator.isISO31661Alpha3);
  }
  isISRC() {
    return this.addStandardValidation(validator.isISRC);
  }
  isIn(values: any[]) {
    return this.addStandardValidation(validator.isIn, values);
  }
  isInt(options?: validator.Options.IsIntOptions) {
    return this.addStandardValidation(validator.isInt, options);
  }
  isJSON() {
    return this.addStandardValidation(validator.isJSON);
  }
  isLatLong() {
    return this.addStandardValidation(validator.isLatLong);
  }
  isLength(options: validator.Options.MinMaxOptions) {
    return this.addStandardValidation(validator.isLength, options);
  }
  isLowercase() {
    return this.addStandardValidation(validator.isLowercase);
  }
  isMACAddress() {
    return this.addStandardValidation(validator.isMACAddress);
  }
  isMD5() {
    return this.addStandardValidation(validator.isMD5);
  }
  isMimeType() {
    return this.addStandardValidation(validator.isMimeType);
  }
  isMobilePhone(
    locale: validator.MobilePhoneLocale,
    options?: validator.Options.IsMobilePhoneOptions,
  ) {
    return this.addStandardValidation(validator.isMobilePhone, locale, options);
  }
  isMongoId() {
    return this.addStandardValidation(validator.isMongoId);
  }
  isMultibyte() {
    return this.addStandardValidation(validator.isMultibyte);
  }
  isNumeric(options?: validator.Options.IsNumericOptions) {
    return this.addStandardValidation(validator.isNumeric, options);
  }
  isPort() {
    return this.addStandardValidation(validator.isPort);
  }
  isPostalCode(locale: validator.PostalCodeLocale) {
    return this.addStandardValidation(validator.isPostalCode, locale);
  }
  isRFC3339() {
    return this.addStandardValidation(validator.isRFC3339);
  }
  isSurrogatePair() {
    return this.addStandardValidation(validator.isSurrogatePair);
  }
  isURL(options?: validator.Options.IsURLOptions) {
    return this.addStandardValidation(validator.isURL, options);
  }
  isUUID(version?: validator.UUIDVersion) {
    return this.addStandardValidation(validator.isUUID, version);
  }
  isUppercase() {
    return this.addStandardValidation(validator.isUppercase);
  }
  isVariableWidth() {
    return this.addStandardValidation(validator.isVariableWidth);
  }
  isWhitelisted(chars: string | string[]) {
    return this.addStandardValidation(validator.isWhitelisted, chars);
  }
  matches(pattern: RegExp | string, modifiers?: string) {
    return this.addStandardValidation(validator.matches, pattern, modifiers);
  }
}
