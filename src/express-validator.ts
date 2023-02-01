import {
  AlternativeMessageFactory,
  CustomSanitizer,
  CustomValidator,
  Location,
  Middleware,
  Request,
  ValidationError,
} from './base';
import { ContextRunner, ValidationChain } from './chain';
import { MatchedDataOptions, matchedData } from './matched-data';
import { check } from './middlewares/check';
import { OneOfErrorType, OneOfOptions, oneOf } from './middlewares/one-of';
import {
  DefaultSchemaKeys,
  ExtensionSanitizerSchemaOptions,
  ExtensionValidatorSchemaOptions,
  ParamSchema,
  RunnableValidationChains,
  createCheckSchema,
} from './middlewares/schema';
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

/**
 * Schema of validations/sanitizations for a field, including extension validators/sanitizers
 */
export type ParamSchemaWithExtensions<
  V extends string,
  S extends string,
  T extends string = DefaultSchemaKeys,
> = {
  [K in keyof ParamSchema<T> | V | S]?: K extends V
    ? ExtensionValidatorSchemaOptions
    : K extends S
    ? ExtensionSanitizerSchemaOptions
    : K extends keyof ParamSchema<T>
    ? ParamSchema<T>[K]
    : // Should never happen.
      never;
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

/**
 * Mapping from field name to a validations/sanitizations schema, including extensions from an
 * ExpressValidator instance.
 */
export type CustomSchema<
  T extends ExpressValidator<any, any, any>,
  K extends string = DefaultSchemaKeys,
> = T extends ExpressValidator<infer V, infer S, any>
  ? Record<string, ParamSchemaWithExtensions<Extract<keyof V, string>, Extract<keyof S, string>, K>>
  : never;
/* eslint-enable no-use-before-define */

export class ExpressValidator<
  V extends CustomValidatorsMap = {},
  S extends CustomSanitizersMap = {},
  E = ValidationError,
> {
  private readonly validatorEntries: [keyof V, CustomValidator][];
  private readonly sanitizerEntries: [keyof S, CustomSanitizer][];

  constructor(
    private readonly validators?: V,
    private readonly sanitizers?: S,
    private readonly options?: CustomOptions<E>,
  ) {
    this.validatorEntries = Object.entries(validators || {});
    this.sanitizerEntries = Object.entries(sanitizers || {});
  }

  private createChain(
    fields: string | string[] = '',
    locations: Location[] = [],
    message?: any,
  ): CustomValidationChain<this> {
    const middleware = check(fields, locations, message) as CustomValidationChain<this>;

    const boundValidators = Object.fromEntries(
      this.validatorEntries.map(([name, fn]) => [name, () => middleware.custom(fn)]),
    ) as Record<keyof V, () => CustomValidationChain<this>>;

    const boundSanitizers = Object.fromEntries(
      this.sanitizerEntries.map(([name, fn]) => [name, () => middleware.customSanitizer(fn)]),
    ) as Record<keyof S, () => CustomValidationChain<this>>;

    return Object.assign(middleware, boundValidators, boundSanitizers);
  }

  readonly buildCheckFunction = (
    locations: Location[],
  ): ((fields?: string | string[], message?: any) => CustomValidationChain<this>) => {
    return (fields?: string | string[], message?: any) =>
      this.createChain(fields, locations, message);
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
   * Creates an express middleware with validations for multiple fields at once in the form of
   * a schema object.
   *
   * @param schema the schema to validate.
   * @param defaultLocations which locations to validate in each field. Defaults to every location.
   */
  // NOTE: This method references its own type, so the type cast is necessary.
  readonly checkSchema = createCheckSchema(
    (...args) => this.createChain(...args),
    Object.keys(this.validators || {}) as Extract<keyof V, string>[],
    Object.keys(this.sanitizers || {}) as Extract<keyof S, string>[],
  ) as <T extends string = DefaultSchemaKeys>(
    schema: CustomSchema<this, T>,
    locations?: Location[],
  ) => RunnableValidationChains<CustomValidationChain<this>>;

  /**
   * Creates a middleware that will ensure that at least one of the given validation chains
   * or validation chain groups are valid.
   *
   * If none are, a single error of type `alternative` is added to the request,
   * with the errors of each chain made available under the `nestedErrors` property.
   *
   * @param chains an array of validation chains to check if are valid.
   *               If any of the items of `chains` is an array of validation chains, then all of them
   *               must be valid together for the request to be considered valid.
   * @param options.message a function for creating a custom error message in case none of the chains are valid
   */
  oneOf(
    chains: (CustomValidationChain<this> | CustomValidationChain<this>[])[],
    options?: { message?: AlternativeMessageFactory; errorType?: OneOfErrorType },
  ): Middleware & ContextRunner;

  /**
   * Creates a middleware that will ensure that at least one of the given validation chains
   * or validation chain groups are valid.
   *
   * If none are, a single error of type `alternative` is added to the request,
   * with the errors of each chain made available under the `nestedErrors` property.
   *
   * @param chains an array of validation chains to check if are valid.
   *               If any of the items of `chains` is an array of validation chains, then all of them
   *               must be valid together for the request to be considered valid.
   * @param options.message an error message to use in case none of the chains are valid
   */
  oneOf(
    chains: (CustomValidationChain<this> | CustomValidationChain<this>[])[],
    options?: { message?: any; errorType?: OneOfErrorType },
  ): Middleware & ContextRunner;
  oneOf(
    chains: (CustomValidationChain<this> | CustomValidationChain<this>[])[],
    options?: OneOfOptions,
  ) {
    return oneOf(chains, options);
  }

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
