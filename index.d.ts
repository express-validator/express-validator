// Type definitions for express-validator 3.0.0
// Project: https://github.com/ctavan/express-validator
// Definitions by: Ayman Nedjmeddine <https://github.com/IOAyman>, Nathan Ridley <https://github.com/axefrog/>, Jonathan Häberle <http://dreampulse.de>, Peter Harris <https://github.com/codeanimal/>, Kacper Polak <kacper@hypequality.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

///<reference types="express"/>
import * as express from 'express';
import {
  Dictionary,
  Result,
  MappedError,
  Options,
  Validator as BaseValidator
} from './shared-typings';

// Add RequestValidation Interface on to Express's Request Interface.
declare global {
  namespace Express {
    interface Request extends ExpressValidator.RequestValidation { }
  }
}
export as namespace ExpressValidator;
/**
 * @param options see: https://github.com/ctavan/express-validator#middleware-options
 * @constructor
 */
declare function ExpressValidator(options?: Options.ExpressValidatorOptions): express.RequestHandler;
export = ExpressValidator;
// Internal Module.
declare namespace ExpressValidator {

  export type URLProtocol = 'http' | 'https' | 'ftp'
  export type UUIDVersion = 3 | 4 | 5 | 'all'
  export type IPVersion = 4 | 6
  export type AlphaLocale = 'ar' | 'ar-AE' | 'ar-BH' | 'ar-DZ' | 'ar-EG' | 'ar-IQ' | 'ar-JO' | 'ar-KW' | 'ar-LB' | 'ar-LY' | 'ar-MA' | 'ar-QA' | 'ar-QM' | 'ar-SA' | 'ar-SD' | 'ar-SY' | 'ar-TN' | 'ar-YE' | 'cs-CZ' | 'da-DK' | 'de-DE' | 'en-AU' | 'en-GB' | 'en-HK' | 'en-IN' | 'en-NZ' | 'en-US' | 'en-ZA' | 'en-ZM' | 'es-ES' | 'fr-FR' | 'hu-HU' | 'nl-NL' | 'pl-PL' | 'pt-BR' | 'pt-PT' | 'ru-RU' | 'sr-RS' | 'sr-RS@latin' | 'tr-TR' | 'uk-UA'
  export type AlphanumericLocale = 'ar' | 'ar-AE' | 'ar-BH' | 'ar-DZ' | 'ar-EG' | 'ar-IQ' | 'ar-JO' | 'ar-KW' | 'ar-LB' | 'ar-LY' | 'ar-MA' | 'ar-QA' | 'ar-QM' | 'ar-SA' | 'ar-SD' | 'ar-SY' | 'ar-TN' | 'ar-YE' | 'cs-CZ' | 'da-DK' | 'de-DE' | 'en-AU' | 'en-GB' | 'en-HK' | 'en-IN' | 'en-NZ' | 'en-US' | 'en-ZA' | 'en-ZM' | 'es-ES' | 'fr-FR' | 'fr-BE' | 'hu-HU' | 'nl-BE' | 'nl-NL' | 'pl-PL' | 'pt-BR' | 'pt-PT' | 'ru-RU' | 'sr-RS' | 'sr-RS@latin' | 'tr-TR' | 'uk-UA'
  export type MobilePhoneLocal = 'ar-DZ' | 'ar-SA' | 'ar-SY' | 'cs-CZ' | 'de-DE' | 'da-DK' | 'el-GR' | 'en-AU' | 'en-GB' | 'en-HK' | 'en-IN' | 'en-NZ' | 'en-US' | 'en-CA' | 'en-ZA' | 'en-ZM' | 'es-ES' | 'fi-FI' | 'fr-FR' | 'hu-HU' | 'it-IT' | 'ja-JP' | 'ms-MY' | 'nb-NO' | 'nn-NO' | 'pl-PL' | 'pt-PT' | 'ru-RU' | 'sr-RS' | 'tr-TR' | 'vi-VN' | 'zh-CN' | 'zh-TW'
  export type Location = 'body' | 'params' | 'query' | 'headers' // TODO add cookies if #292 is accepted

  export type ValidationSchema = {
    [param: string]:
    Options.ValidationSchemaParamOptions // standard validators
    | // or
    { [customValidator: string]: Options.ValidatorSchemaOptions } // custom ones
  }

  interface ValidatorFunction {
    (item: string | string[], message?: any): Validator;
    (schema: {}): Validator;
  }
  /**
   * This one's used for RegexRoutes
   * @see https://github.com/ctavan/express-validator#regex-routes
   */
  interface ValidatorFunctionRegExp extends ValidatorFunction { (matchIndex: number, message?: string): Validator; }
  interface SanitizerFunction { (item: string): Sanitizer; }

  export interface RequestValidation {
    assert: ValidatorFunctionRegExp;
    validate: ValidatorFunctionRegExp;
    check: ValidatorFunctionRegExp;
    checkBody: ValidatorFunction;
    checkCookies: ValidatorFunction;
    checkHeaders: ValidatorFunction;
    checkParams: ValidatorFunction;
    checkQuery: ValidatorFunction;

    filter: SanitizerFunction;
    sanitize: SanitizerFunction;
    sanitizeBody: SanitizerFunction;
    sanitizeQuery: SanitizerFunction;
    sanitizeParams: SanitizerFunction;
    sanitizeHeaders: SanitizerFunction;
    sanitizeCookies: SanitizerFunction;

    /**
     * @deprecated
     * @param mapped Will cause the validator to return an object that maps parameter to error.
     * @return Synchronous errors in the form of an array. If there are no errors, the returned value is false.
     */
    validationErrors(mapped?: boolean): Dictionary<MappedError> | MappedError[];
    /**
     * @deprecated
     * @param mapped Will cause the validator to return an object that maps parameter to error.
     * @return Synchronous errors in the form of an array. If there are no errors, the returned value is false.
     */
    validationErrors<T>(mapped?: boolean): Dictionary<T> | T[];
    /**
     * @deprecated
     * @param mapped Whether to map parameters to errors or not.
     */
    asyncValidationErrors(mapped?: boolean): Promise<MappedError[] | Dictionary<MappedError>>;
    /**
     * @deprecated
     * @param mapped Whether to map parameters to errors or not.
     */
    asyncValidationErrors<T>(mapped?: boolean): Promise<T[] | Dictionary<T>>;
    /**
     * @return Promise<Result> A Promise which resolves to a result object.
     */
    getValidationResult(): Promise<Result>
  }

  export interface Validator extends BaseValidator {
    // Additional legacy validators

    notEmpty(): this;
    len(options: Options.MinMaxOptions): this;
  }

  interface Sanitizer {
    /**
     * Convert the input string to a date, or null if the input is not a date.
     */
    toDate(): Sanitizer;
    /**
     * Convert the input string to a float, or NaN if the input is not a float.
     */
    toFloat(): Sanitizer;
    /**
     * Convert the input string to a float, or NaN if the input is not a float.
     */
    toInt(radix?: number): Sanitizer;
    /**
     * Cnvert the input string to a boolean.
     * Everything except for '0', 'false' and '' returns true.
     * @param strict If true, only '1' and 'true' return true.
     */
    toBoolean(strict?: boolean): Sanitizer;
    /**
     * Trim characters (whitespace by default) from both sides of the input.
     * @param chars Defaults to whitespace
     */
    trim(chars?: string): Sanitizer;
    ltrim(chars?: string): Sanitizer;
    rtrim(chars?: string): Sanitizer;
    /**
     * Remove characters with a numerical value < 32 and 127, mostly control characters.
     * Unicode-safe in JavaScript.
     * @param keep_new_lines If true, newline characters are preserved (\n and \r, hex 0xA and 0xD).
     */
    stripLow(keep_new_lines?: boolean): Sanitizer;
    /**
     * Escape &, <, >, and "
     */
    escape(): Sanitizer;
    /**
     * Replaces HTML encoded entities with <, >, &, ', " and /.
     */
    unescape(): Sanitizer;
    blacklist(chars: string): Sanitizer;
    whitelist(chars: string): Sanitizer;

    normalizeEmail(options?: Options.NormalizeEmailOptions): Sanitizer;
  }

}
