import * as validator from 'validator';
import { CustomValidator, StandardValidator } from '../base';
import { CustomValidation, StandardValidation } from '../context-items';
import { ContextBuilder } from '../context-builder';
import * as Options from '../options';
import { Validators } from './validators';

export class ValidatorsImpl<Chain> implements Validators<Chain> {
  private lastValidator: CustomValidation | StandardValidation;
  private negateNext = false;

  constructor(private readonly builder: ContextBuilder, private readonly chain: Chain) {}

  private addItem(item: CustomValidation | StandardValidation) {
    this.builder.addItem(item);
    this.lastValidator = item;
    // Reset this.negateNext so that next validation isn't negated too
    this.negateNext = false;

    return this.chain;
  }

  // validation manipulation
  not() {
    this.negateNext = true;
    return this.chain;
  }

  withMessage(message: any) {
    this.lastValidator.message = message;
    return this.chain;
  }

  // custom validators
  custom(validator: CustomValidator) {
    return this.addItem(new CustomValidation(validator, this.negateNext));
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

  isArray(options: { min?: number; max?: number } = {}) {
    return this.custom(
      value =>
        Array.isArray(value) &&
        (typeof options.min === 'undefined' || value.length >= options.min) &&
        (typeof options.max === 'undefined' || value.length <= options.max),
    );
  }

  isString() {
    return this.custom(value => typeof value === 'string');
  }

  // Standard validators
  private addStandardValidation(validator: StandardValidator, ...options: any[]) {
    return this.addItem(new StandardValidation(validator, this.negateNext, options));
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
  isAlpha(locale?: Options.AlphaLocale) {
    return this.addStandardValidation(validator.isAlpha, locale);
  }
  isAlphanumeric(locale?: Options.AlphanumericLocale) {
    return this.addStandardValidation(validator.isAlphanumeric, locale);
  }
  isAscii() {
    return this.addStandardValidation(validator.isAscii);
  }
  isBase32() {
    return this.addStandardValidation(validator.isBase32);
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
  isByteLength(options: Options.MinMaxOptions) {
    return this.addStandardValidation(validator.isByteLength, options);
  }
  isCreditCard() {
    return this.addStandardValidation(validator.isCreditCard);
  }
  isCurrency(options?: Options.IsCurrencyOptions) {
    return this.addStandardValidation(validator.isCurrency, options);
  }
  isDataURI() {
    return this.addStandardValidation(validator.isDataURI);
  }
  isDecimal(options?: Options.IsDecimalOptions) {
    return this.addStandardValidation(validator.isDecimal, options);
  }
  isDivisibleBy(number: number) {
    return this.addStandardValidation(validator.isDivisibleBy, number);
  }
  isEmail(options?: Options.IsEmailOptions) {
    return this.addStandardValidation(validator.isEmail, options);
  }
  isEmpty(options?: Options.IsEmptyOptions) {
    return this.addStandardValidation(validator.isEmpty, options);
  }
  isFQDN(options?: Options.IsFQDNOptions) {
    return this.addStandardValidation(validator.isFQDN, options);
  }
  isFloat(options?: Options.IsFloatOptions) {
    return this.addStandardValidation(validator.isFloat, options);
  }
  isFullWidth() {
    return this.addStandardValidation(validator.isFullWidth);
  }
  isHalfWidth() {
    return this.addStandardValidation(validator.isHalfWidth);
  }
  isHash(algorithm: Options.HashAlgorithm) {
    return this.addStandardValidation(validator.isHash, algorithm);
  }
  isHexColor() {
    return this.addStandardValidation(validator.isHexColor);
  }
  isHexadecimal() {
    return this.addStandardValidation(validator.isHexadecimal);
  }
  isIdentityCard(locale: ['ES'] | 'any') {
    return this.addStandardValidation(validator.isIdentityCard, locale);
  }
  isIP(version?: Options.IPVersion) {
    return this.addStandardValidation(validator.isIP, version);
  }
  isIPRange() {
    return this.addStandardValidation(validator.isIPRange);
  }
  isISBN(version?: number) {
    return this.addStandardValidation(validator.isISBN, version);
  }
  isISSN(options?: Options.IsISSNOptions) {
    return this.addStandardValidation(validator.isISSN, options);
  }
  isISIN() {
    return this.addStandardValidation(validator.isISIN);
  }
  isISO8601(options?: Options.IsISO8601Options) {
    return this.addStandardValidation(validator.isISO8601, options);
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
  isInt(options?: Options.IsIntOptions) {
    return this.addStandardValidation(validator.isInt, options);
  }
  isJSON() {
    return this.addStandardValidation(validator.isJSON);
  }
  isJWT() {
    return this.addStandardValidation(validator.isJWT);
  }
  isLatLong() {
    return this.addStandardValidation(validator.isLatLong);
  }
  isLength(options: Options.MinMaxOptions) {
    return this.addStandardValidation(validator.isLength, options);
  }
  isLowercase() {
    return this.addStandardValidation(validator.isLowercase);
  }
  isMagnetURI() {
    return this.addStandardValidation(validator.isMagnetURI);
  }
  isMACAddress(options?: Options.IsMACAddressOptions) {
    return this.addStandardValidation(validator.isMACAddress, options);
  }
  isMD5() {
    return this.addStandardValidation(validator.isMD5);
  }
  isMimeType() {
    return this.addStandardValidation(validator.isMimeType);
  }
  isMobilePhone(locale: Options.MobilePhoneLocale, options?: Options.IsMobilePhoneOptions) {
    return this.addStandardValidation(validator.isMobilePhone, locale, options);
  }
  isMongoId() {
    return this.addStandardValidation(validator.isMongoId);
  }
  isMultibyte() {
    return this.addStandardValidation(validator.isMultibyte);
  }
  isNumeric(options?: Options.IsNumericOptions) {
    return this.addStandardValidation(validator.isNumeric, options);
  }
  isPort() {
    return this.addStandardValidation(validator.isPort);
  }
  isPostalCode(locale: Options.PostalCodeLocale) {
    return this.addStandardValidation(validator.isPostalCode, locale);
  }
  isRFC3339() {
    return this.addStandardValidation(validator.isRFC3339);
  }
  isSurrogatePair() {
    return this.addStandardValidation(validator.isSurrogatePair);
  }
  isURL(options?: Options.IsURLOptions) {
    return this.addStandardValidation(validator.isURL, options);
  }
  isUUID(version?: Options.UUIDVersion) {
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
