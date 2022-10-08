import { Sanitizers } from '../chain/sanitizers';
import { Validators } from '../chain/validators';
import { CustomValidator, DynamicMessageCreator, Location, Request } from '../base';
import { ValidationChain, ValidatorsImpl } from '../chain';
import { Optional } from '../context';
import { ResultWithContext } from '../chain/context-runner-impl';
import { check } from './check';

type ValidatorSchemaOptions<K extends keyof Validators<any>> =
  | true
  | {
      /**
       * Options to pass to the validator.
       * Not used with custom validators.
       */
      options?: Parameters<Validators<any>[K]> | Parameters<Validators<any>[K]>[0];

      /**
       * The error message if there's a validation error,
       * or a function for creating an error message dynamically.
       */
      errorMessage?: DynamicMessageCreator | any;

      /**
       * Whether the validation should be reversed.
       */
      negated?: boolean;

      /**
       * Whether the validation should bail after running this validator
       */
      bail?: boolean;

      /**
       * Specify a condition upon which this validator should run.
       * Can either be a validation chain, or a custom validator function.
       */
      if?: CustomValidator | ValidationChain;
    };

export type ValidatorsSchema = { [K in keyof Validators<any>]?: ValidatorSchemaOptions<K> };

type SanitizerSchemaOptions<K extends keyof Sanitizers<any>> =
  | true
  | {
      /**
       * Options to pass to the sanitizer.
       * Not used with custom sanitizers.
       */
      options?: Parameters<Sanitizers<any>[K]> | Parameters<Sanitizers<any>[K]>[0];
    };

export type SanitizersSchema = { [K in keyof Sanitizers<any>]?: SanitizerSchemaOptions<K> };

type InternalParamSchema = ValidatorsSchema & SanitizersSchema;

/**
 * Defines a schema of validations/sanitizations for a field
 */
export type ParamSchema = InternalParamSchema & {
  /**
   * Which request location(s) the field to validate is.
   * If unset, the field will be checked in every request location.
   */
  in?: Location | Location[];

  /**
   * The general error message in case a validator doesn't specify one,
   * or a function for creating the error message dynamically.
   */
  errorMessage?: DynamicMessageCreator | any;

  /**
   * Whether this field should be considered optional
   */
  optional?:
    | true
    | {
        options?: Partial<Optional>;
      };
};

/**
 * @deprecated  Only here for v5 compatibility. Please use ParamSchema instead.
 */
export type ValidationParamSchema = ParamSchema;

/**
 * Defines a mapping from field name to a validations/sanitizations schema.
 */
export type Schema = Record<string, ParamSchema>;

/**
 * @deprecated  Only here for v5 compatibility. Please use Schema instead.
 */
export type ValidationSchema = Schema;

const validLocations: Location[] = ['body', 'cookies', 'headers', 'params', 'query'];
const protectedNames = ['errorMessage', 'in'];

/**
 * Creates an express middleware with validations for multiple fields at once in the form of
 * a schema object.
 *
 * @param schema the schema to validate.
 * @param defaultLocations
 * @returns
 */
export function checkSchema(
  schema: Schema,
  defaultLocations: Location[] = validLocations,
): ValidationChain[] & {
  run: (req: Request) => Promise<ResultWithContext[]>;
} {
  const chains = Object.keys(schema).map(field => {
    const config = schema[field];
    const chain = check(field, ensureLocations(config, defaultLocations), config.errorMessage);

    Object.keys(config)
      .filter((method: keyof ParamSchema): method is keyof InternalParamSchema => {
        return config[method] && !protectedNames.includes(method);
      })
      .forEach(method => {
        if (typeof chain[method] !== 'function') {
          console.warn(
            `express-validator: a validator/sanitizer with name ${method} does not exist`,
          );
          return;
        }

        // Using "!" because typescript doesn't know it isn't undefined.
        const methodCfg = config[method]!;

        let options: any[] = methodCfg === true ? [] : methodCfg.options ?? [];
        if (options != null && !Array.isArray(options)) {
          options = [options];
        }

        if (isValidatorOptions(method, methodCfg) && methodCfg.if) {
          chain.if(methodCfg.if);
        }

        if (isValidatorOptions(method, methodCfg) && methodCfg.negated) {
          chain.not();
        }

        (chain[method] as any)(...options);

        if (isValidatorOptions(method, methodCfg) && methodCfg.errorMessage) {
          chain.withMessage(methodCfg.errorMessage);
        }

        if (isValidatorOptions(method, methodCfg) && methodCfg.bail) {
          chain.bail();
        }
      });

    return chain;
  });

  const run = async (req: Request) => {
    return await Promise.all(chains.map(chain => chain.run(req)));
  };

  return Object.assign(chains, { run });
}

function isValidatorOptions(
  method: string,
  methodCfg: any,
): methodCfg is Exclude<ValidatorSchemaOptions<any>, true> {
  return methodCfg !== true && method in ValidatorsImpl.prototype;
}

function ensureLocations(config: ParamSchema, defaults: Location[]) {
  // .filter(Boolean) is done because in can be undefined -- which is not going away from the type
  // See https://github.com/Microsoft/TypeScript/pull/29955 for details
  const locations = Array.isArray(config.in)
    ? config.in
    : ([config.in].filter(Boolean) as Location[]);
  const actualLocations = locations.length ? locations : defaults;

  return actualLocations.filter(location => validLocations.includes(location));
}
