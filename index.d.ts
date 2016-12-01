// Type definitions for express-validator 3.0.0
// Project: https://github.com/ctavan/express-validator
// Definitions by: Ayman Nedjmeddine <https://github.com/IOAyman>, Nathan Ridley <https://github.com/axefrog/>, Jonathan Häberle <http://dreampulse.de>, Peter Harris <https://github.com/codeanimal/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
import * as express from 'express'
import * as Promise from 'bluebird'

// Add RequestValidation Interface on to Express's Request Interface.
declare namespace Express {
  interface Request extends ExpressValidator.RequestValidation {}
}

// External express-validator module.
declare module "express-validator" {

  /**
   * @param options see: https://github.com/ctavan/express-validator#middleware-options
   * @constructor
   */
  function ExpressValidator(options?: ExpressValidator.Options.ExpressValidatorOptions): express.RequestHandler;

  export = ExpressValidator;
}

// Internal Module.
declare namespace ExpressValidator {

  interface ValidatorFunction { (item: string | {}, message?: string): Validator; }
  interface ValidatorExtraFunction extends ValidatorFunction { (matchIndex: number, message?: string): Validator; }
  interface SanitizerFunction { (item: string): Sanitizer; }
  interface Dictionary<T> { [key: string]: T; }
  interface Result {
    /**
     * @return A boolean determining whether there were errors or not.
     */
    isEmpty(): boolean
    /**
     * @return All errors for all validated parameters will be included, unless you specify that you want only the first
     * error of each param by invoking `result.useFirstErrorOnly()`.
     */
    array(): MappedError[]
    /**
     * @return An object of errors, where the key is the parameter name, and the value is an error object as returned by
     *  the error formatter.
     * Because of historical reasons, by default this method will return the last error of each parameter.
     * You can change this behavior by invoking result.useFirstErrorOnly(), so the first error is returned instead.
     */
    mapped(): Dictionary<MappedError>
    /**
     * Sets the `firstErrorOnly` flag of this result object, which modifies the way other methods like `result.array()`
     * and `result.mapped()` work.
     */
    useFirstErrorOnly(): Result
    /**
     * Useful for dealing with the validation errors in the catch block of a try..catch or promise.
     *
     * @throws If there are errors, throws an Error object which is decorated with the same API as the validation
     * result object.
     */
    throw(): Result
  }

  export interface RequestValidation {
    assert: ValidatorExtraFunction;
    validate: ValidatorExtraFunction;
    check: ValidatorExtraFunction;
    checkBody: ValidatorFunction;
    checkFiles: ValidatorFunction;
    checkHeaders: ValidatorFunction;
    checkParams: ValidatorFunction;
    checkQuery: ValidatorFunction;

    filter: SanitizerFunction;
    sanitize: SanitizerFunction;
    sanitizeBody: SanitizerFunction;
    sanitizeQuery: SanitizerFunction;
    sanitizeParams: SanitizerFunction;
    sanitizeHeaders: SanitizerFunction;

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

  export interface Validator {
    isEmail(options?: ExpressValidator.Options.IsEmailOptions): Validator;
    /**
     * Accepts http, https, ftp
     */
    isURL(options?: ExpressValidator.Options.IsURLOptions): Validator;
    isMACAddress(): Validator;
    /**
     * Combines isIPv4 and isIPv6
     */
    isIP(version?: number): Validator;
    isFQDN(options?: ExpressValidator.Options.IsFQDNOptions): Validator;
    isBoolean(): Validator;
    isAlpha(locale?: string): Validator; // TODO AlphaLocale type
    isAlphanumeric(locale?: string): Validator; // TODO AlphanumericLocale type
    isNumeric(): Validator;
    isLowercase(): Validator;
    isUppercase(): Validator;
    isAscii(): Validator;
    isFullWidth(): Validator;
    isHalfWidth(): Validator;
    isVariableWidth(): Validator;
    isMultibyte(): Validator;
    isSurrogatePair(): Validator;
    isInt(options?: MinMaxOptions): Validator;
    /**
     * Alias for isDecimal
     */
    isFloat(options?: MinMaxOptions): Validator;
    isDecimal(): Validator;
    isHexadecimal(): Validator;
    isDivisibleBy(num: number): Validator;
    /**
     * Accepts valid hexcolors with or without # prefix
     */
    isHexColor(): Validator;
    isMD5(): Validator;
    isJSON(): Validator;
    /**
     * Check if length is 0
     */
    isEmpty(): Validator;
    isLength(options: MinMaxOptions): Validator;
    isByteLength(options: MinMaxOptions): Validator;
    /**
     * Version can be 3, 4, 5, 'all' or empty, see http://en.wikipedia.org/wiki/Universally_unique_identifier
     */
    isUUID(version?: number | string): Validator; // TODO UUID version type
    isMongoId(): Validator;
    /**
     * Uses Date.parse() - regex is probably a better choice
     */
    isDate(): Validator;
    /**
     * Argument is optional and defaults to today. Comparison is non-inclusive
     */
    isAfter(date?: Date): Validator;
    /**
     * Argument is optional and defaults to today. Comparison is non-inclusive
     */
    isBefore(date?: Date): Validator;
    isIn(options: string | string[]): Validator;
    /**
     * Will work against Visa, MasterCard, American Express, Discover, Diners Club, and JCB card numbering formats
     */
    isCreditCard(): Validator;
    isISIN(): Validator;
    isISBN(version?: number): Validator;
    isISSN(options?: ExpressValidator.Options.IsISSNOptions): Validator
    isMobilePhone(locale: string): Validator; // TODO MobilePhoneLocale
    isCurrency(options: ExpressValidator.Options.IsCurrencyOptions): Validator;
    isISO8601(): Validator;
    isBase64(): Validator;
    isDataURI(): Validator;
    isWhitelisted(chars: string | string[]): Validator;


    // Additional Validators provided by validator.js

    equals(equals: any): Validator;
    contains(str: string): Validator;
    /**
     * Usage: matches(/[a-z]/i) or matches('[a-z]','i')
     */
    matches(str: string, pattern: RegExp | string, modifiers?: string): Validator;


    // Additional ValidatorChain.prototype.* validators

    notEmpty(): Validator;
    len(options: MinMaxOptions): Validator;
    optional(options?: { checkFalsy?: boolean }): Validator;
    withMessage(message: string): Validator;
  }

  interface Sanitizer {
    /**
     * Trim optional `chars`, default is to trim whitespace (\r\n\t )
     */
    trim(...chars: string[]): Sanitizer;
    ltrim(...chars: string[]): Sanitizer;
    rtrim(...chars: string[]): Sanitizer;
    stripLow(keep_new_lines?: boolean): Sanitizer;
    toFloat(): Sanitizer;
    toInt(radix?: number): Sanitizer;
    /**
     * True unless str = '0', 'false', or str.length == 0. In strict mode only '1' and 'true' return true.
     */
    toBoolean(strict?: boolean): Sanitizer;

    /**
     * Convert the input string to a date, or null if the input is not a date.
     */
    toDate(): Sanitizer;

    /**
     * Escape &, <, >, and "
     */
    escape(): Sanitizer;

    /**
     * Replaces HTML encoded entities with <, >, &, ', " and /.
     */
    unescape(): Sanitizer;

    blacklist(chars: string): Sanitizer;
    blacklist(chars: string[]): Sanitizer;
    whitelist(chars: string): Sanitizer;
    whitelist(chars: string[]): Sanitizer;

    normalizeEmail(options?: { lowercase?: boolean; remove_dots?: boolean; remove_extensions?: boolean }): Sanitizer;

    /**
     * !!! XSS sanitization was removed from the library (see: https://github.com/chriso/validator.js#xss-sanitization)
     */
  }

  interface MappedError {
    param: string;
    msg: string;
    value: string;
  }

  interface MinMaxOptions {
    min?: number;
    max?: number;
  }
}

declare namespace ExpressValidator.Options {

  export interface ExpressValidatorOptions {
    customValidators: { [validatorName: string]: (value: any) => boolean }
    customSanitizers: { [sanitizername: string]: (value: any) => any }
    errorFormatter: (param: string, msg: string, value: any) => {param: string, msg: string, value: any}
  }

  // VALIDATORS

  interface IsEmailOptions {
    allow_display_name?: boolean;
    allow_utf8_local_part?: boolean;
    require_tld?: boolean;
  }

  interface IsURLOptions {
    protocols?: string[];
    require_tld?: boolean;
    require_protocol?: boolean;
    require_host: boolean;
    require_valid_protocol?: boolean;
    allow_underscores?: boolean;
    host_whitelist?: (string | RegExp)[];
    host_blacklist?: (string | RegExp)[];
    allow_trailing_dot?: boolean;
    allow_protocol_relative_urls?: boolean;
  }

  interface IsFQDNOptions {
    require_tld?: boolean;
    allow_underscores?: boolean;
    allow_trailing_dot?: boolean;
  }

  interface IsISSNOptions {
    case_sensitive: boolean
    require_hyphen: boolean
  }

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
    allow_space_after_digits?: boolean;
  }


  // SANITIZERS
}
