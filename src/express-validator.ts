import {
  CustomSanitizer,
  CustomValidator,
  Location,
  Middleware,
  Request,
  ValidationError,
} from './base';
import { ValidationChain } from './chain';
import { MatchedDataOptions, matchedData } from './matched-data';
import { check } from './middlewares/check';
import { ErrorFormatter, Result, validationResult } from './validation-result';

type CustomValidatorsMap = Record<string, CustomValidator>;
type CustomSanitizersMap = Record<string, CustomSanitizer>;
type CustomOptions<E = ValidationError> = {
  errorFormatter?: ErrorFormatter<E>;
};

/**
 * A validation chain that contains some extension validators/sanitizers.
 *
 * Built-in methods return the same chain type so that chaining using more of the extensions is
 * possible.
 *
 * @example
 * ```
 * function createChain(chain: ValidationChainWithExtensions<'isAllowedDomain' | 'removeEmailAttribute'>) {
 *  return chain
 *    .isEmail()
 *    .isAllowedDomain()
 *    .trim()
 *    .removeEmailAttribute();
 * }
 * ```
 */
export type ValidationChainWithExtensions<T extends string> = Middleware & {
  [K in keyof ValidationChain]: ValidationChain[K] extends (...args: infer A) => ValidationChain
    ? (...params: A) => ValidationChainWithExtensions<T>
    : ValidationChain[K];
} & {
  [K in T]: () => ValidationChainWithExtensions<T>;
};

/* eslint-disable no-use-before-define */
/**
 * Type of a validation chain created by a custom ExpressValidator instance.
 *
 * @example
 * ```
 * const myExpressValidator = new ExpressValidator({
 *  isAllowedDomain: value => value.endsWith('@gmail.com')
 * });
 *
 * type MyCustomValidationChain = CustomValidationChain<typeof myExpressValidator>
 * function createMyCustomChain(): MyCustomValidationChain {
 *  return myExpressValidator.body('email').isAllowedDomain();
 * }
 * ```
 */
export type CustomValidationChain<T extends ExpressValidator<any, any, any>> =
  T extends ExpressValidator<infer V, infer S, any>
    ? ValidationChainWithExtensions<Extract<keyof V | keyof S, string>>
    : never;

/* eslint-enable no-use-before-define */

export class ExpressValidator<
  V extends CustomValidatorsMap = {},
  S extends CustomSanitizersMap = {},
  E = ValidationError,
> {
  private readonly validators: [keyof V, CustomValidator][];
  private readonly sanitizers: [keyof S, CustomSanitizer][];

  constructor(validators?: V, sanitizers?: S, private readonly options?: CustomOptions<E>) {
    this.validators = Object.entries(validators || {});
    this.sanitizers = Object.entries(sanitizers || {});
  }

  private createChain(
    locations: Location[],
    fields: string | string[] = '',
    message?: any,
  ): CustomValidationChain<this> {
    const middleware = check(fields, locations, message) as CustomValidationChain<this>;

    const boundValidators = Object.fromEntries(
      this.validators.map(([name, fn]) => [name, () => middleware.custom(fn)]),
    ) as Record<keyof V, () => CustomValidationChain<this>>;

    const boundSanitizers = Object.fromEntries(
      this.sanitizers.map(([name, fn]) => [name, () => middleware.customSanitizer(fn)]),
    ) as Record<keyof S, () => CustomValidationChain<this>>;

    return Object.assign(middleware, boundValidators, boundSanitizers);
  }

  readonly buildCheckFunction = (
    locations: Location[],
  ): ((fields?: string | string[], message?: any) => CustomValidationChain<this>) => {
    return (fields?: string | string[], message?: any) =>
      this.createChain(locations, fields, message);
  };

  /**
   * Creates a middleware/validation chain for one or more fields that may be located in
   * any of the following:
   *
   * - `req.body`
   * - `req.cookies`
   * - `req.headers`
   * - `req.params`
   * - `req.query`
   *
   * @param fields  a string or array of field names to validate/sanitize
   * @param message an error message to use when failed validations don't specify a custom message.
   *                Defaults to `Invalid Value`.
   */
  readonly check = this.buildCheckFunction(['body', 'cookies', 'headers', 'params', 'query']);

  /**
   * Same as {@link ExpressValidator.check}, but only validates in `req.body`.
   */
  readonly body = this.buildCheckFunction(['body']);

  /**
   * Same as {@link ExpressValidator.check}, but only validates in `req.cookies`.
   */
  readonly cookies = this.buildCheckFunction(['cookies']);

  /**
   * Same as {@link ExpressValidator.check}, but only validates in `req.headers`.
   */
  readonly headers = this.buildCheckFunction(['headers']);

  /**
   * Same as {@link ExpressValidator.check}, but only validates in `req.params`.
   */
  readonly params = this.buildCheckFunction(['params']);

  /**
   * Same as {@link ExpressValidator.check}, but only validates in `req.query`.
   */
  readonly query = this.buildCheckFunction(['query']);

  /**
   * Extracts the validation errors of an express request using the default error formatter of this
   * instance.
   *
   * @see {@link validationResult()}
   * @param req the express request object
   * @returns a `Result` which will by default use the error formatter passed when
   *          instantiating `ExpressValidator`.
   */
  readonly validationResult = (req: Request): Result<E> => {
    const formatter = this.options?.errorFormatter;
    const result = validationResult(req);
    return formatter ? result.formatWith(formatter) : (result as unknown as Result<E>);
  };

  /**
   * Extracts data validated or sanitized from the request, and builds an object with them.
   *
   * This method is a shortcut for `matchedData`; it does nothing different than it.
   *
   * @see {@link matchedData}
   */
  matchedData(req: Request, options?: Partial<MatchedDataOptions>): Record<string, any> {
    return matchedData(req, options);
  }
}
