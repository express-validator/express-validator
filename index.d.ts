// Type definitions for express-validator 3.0.0
// Project: https://github.com/ctavan/express-validator
// Definitions by: Ayman Nedjmeddine <https://github.com/IOAyman>, Nathan Ridley <https://github.com/axefrog/>, Jonathan Häberle <http://dreampulse.de>, Peter Harris <https://github.com/codeanimal/>, Kacper Polak <kacper@hypequality.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

///<reference types="express"/>
import * as express from 'express';
import { Location } from './check/location';
import {
  Result,
  Validator as BaseValidator,
  ValidatorOptions
} from './check';
import { Sanitizer as BaseSanitizer } from './filter'

// Add RequestValidation Interface on to Express's Request Interface.
declare global {
  namespace Express {
    interface Request extends ExpressValidator.RequestValidation { }
  }
}

export as namespace ExpressValidator;
interface ExpressValidatorOptions {
  errorFormatter?(param: string, msg: string, value: any, location: Location): any,
  customSanitizers?: Record<string, (...value: any[]) => any>,
  customValidators?: Record<string, (...value: any[]) => boolean | Promise<any>>,
}

declare function ExpressValidator(options?: ExpressValidatorOptions): express.RequestHandler;
export = ExpressValidator;

// Internal Module.
declare namespace ExpressValidator {
  export type ValidationSchema = Record<
    string,
    ValidationSchemaParamOptions | { [custom: string]: ValidatorSchemaOptions }
  >;

  interface ValidatorSchemaOptions {
    options?: any[]
    errorMessage?: any
  }

  interface ValidationSchemaParamOptions {
    in?: Location
    errorMessage?: any

    // Additional ValidatorChain.prototype.* validators
    optional?: boolean | ValidatorOptions.OptionalOptions
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
    isMimeType?: ValidatorSchemaOptions
    isMobilePhone?: ValidatorSchemaOptions
    isPort?: ValidatorSchemaOptions
    isCurrency?: ValidatorSchemaOptions
    isISO31661Alpha2?: ValidatorSchemaOptions
    isISO8601?: ValidatorSchemaOptions
    isBase64?: ValidatorSchemaOptions
    isDataURI?: ValidatorSchemaOptions
    isWhitelisted?: ValidatorSchemaOptions

    // Additional Validators provided by validator.js
    equals?: ValidatorSchemaOptions
    contains?: ValidatorSchemaOptions
    matches?: ValidatorSchemaOptions
  }

  interface ValidatorFunction {
    (item: string | string[] | number, message?: any): Validator;
    (schema: {}): Validator;
  }
  interface SanitizerFunction { (item: string): Sanitizer; }

  export interface RequestValidation {
    assert: ValidatorFunction;
    validate: ValidatorFunction;
    check: ValidatorFunction;
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

    validationErrors(mapped?: boolean): Record<string, any> | any[];
    validationErrors<T>(mapped?: boolean): Record<string, T> | T[];
    asyncValidationErrors(mapped?: boolean): Promise<any[] | Record<string, any>>;
    asyncValidationErrors<T>(mapped?: boolean): Promise<T[] | Record<string, T>>;
    getValidationResult(): Promise<Result>
  }

  export interface Validator extends BaseValidator, Sanitizer {
    notEmpty(): this;
    len(options: ValidatorOptions.MinMaxOptions): this;
  }

  export interface Sanitizer {}

}
