// Type definitions for express-validator 3.0.0
// Project: https://github.com/ctavan/express-validator
// Definitions by: Ayman Nedjmeddine <https://github.com/IOAyman>, Nathan Ridley <https://github.com/axefrog/>, Jonathan Häberle <http://dreampulse.de>, Peter Harris <https://github.com/codeanimal/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

///<reference types="express"/>
///<reference types="bluebird"/>

// Add RequestValidation Interface on to Express's Request Interface.
declare namespace Express {
  interface Request extends ExpressValidator.RequestValidation {}
}

// External express-validator module.
declare module "express-validator" {
  import express = require('express');

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
  /**
   * This one's used for RegexRoutes
   * @see https://github.com/ctavan/express-validator#regex-routes
   */
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

  export interface Validator {
    isEmail(options?: ExpressValidator.Options.IsEmailOptions): Validator;
    isURL(options?: ExpressValidator.Options.IsURLOptions): Validator;
    isMACAddress(): Validator;
    /**
     *
     * @param version IP version number 4 or 6
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
    isInt(options?: ExpressValidator.Options.IsIntOptions): Validator;
    isFloat(options?: ExpressValidator.Options.MinMaxExtendedOptions): Validator;
    isDecimal(): Validator;
    isHexadecimal(): Validator;
    isDivisibleBy(num: number): Validator;
    isHexColor(): Validator;
    isMD5(): Validator;
    isJSON(): Validator;
    isEmpty(): Validator;
    isLength(options: ExpressValidator.Options.MinMaxOptions): Validator;
    isByteLength(options: ExpressValidator.Options.MinMaxOptions): Validator;
    /**
     * @param version 3, 4, 5 or 'all'. Default is 'all'.
     * @see http://en.wikipedia.org/wiki/Universally_unique_identifier
     */
    isUUID(version?: number | string): Validator; // TODO UUID version type
    /**
     * @see https://docs.mongodb.com/manual/reference/bson-types/#objectid
     */
    isMongoId(): Validator;
    isDate(): Validator;
    /**
     * @param date Optional. Default to now.
     */
    isAfter(date?: Date): Validator;
    /**
     * @param date Optional. Default to now.
     */
    isBefore(date?: Date): Validator;
    isIn(options: string | string[]): Validator;
    isCreditCard(): Validator;
    isISIN(): Validator;
    /**
     * @param version
     * @see https://en.wikipedia.org/wiki/International_Standard_Book_Number
     */
    isISBN(version?: number): Validator;
    /**
     * @param options
     * @see https://en.wikipedia.org/wiki/International_Standard_Serial_Number
     */
    isISSN(options?: ExpressValidator.Options.IsISSNOptions): Validator
    isMobilePhone(locale: string): Validator; // TODO MobilePhoneLocale
    isCurrency(options: ExpressValidator.Options.IsCurrencyOptions): Validator;
    /**
     * @see https://en.wikipedia.org/wiki/ISO_8601
     */
    isISO8601(): Validator;
    /**
     * @see https://en.wikipedia.org/wiki/Base64
     */
    isBase64(): Validator;
    /**
     * @see https://en.wikipedia.org/wiki/Data_URI_scheme
     */
    isDataURI(): Validator;
    isWhitelisted(chars: string | string[]): Validator;


    // Additional Validators provided by validator.js

    equals(equals: any): Validator;
    contains(str: string): Validator;
    matches(pattern: RegExp | string, modifiers?: string): Validator;


    // Additional ValidatorChain.prototype.* validators

    notEmpty(): Validator;
    len(options: ExpressValidator.Options.MinMaxOptions): Validator;
    optional(options?: ExpressValidator.Options.OptionalOptions): Validator;
    withMessage(message: string): Validator;
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
    trim(chars: string): Sanitizer;
    ltrim(chars: string): Sanitizer;
    rtrim(chars: string): Sanitizer;
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

    normalizeEmail(options?: ExpressValidator.Options.NormalizeEmailOptions): Sanitizer;
  }

  interface MappedError {
    param: string;
    msg: string;
    value: string;
  }
}

declare namespace ExpressValidator.Options {

  export interface ExpressValidatorOptions {
    customValidators?: { [validatorName: string]: (value: any) => boolean }
    customSanitizers?: { [sanitizername: string]: (value: any) => any }
    errorFormatter?: (param: string, msg: string, value: any) => {param: string, msg: string, value: any}
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
    protocols?: string[]; // TODO Protocol type
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
    allow_space_after_digits?: boolean;
  }

  interface OptionalOptions {
    checkFalsy?: boolean;
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
