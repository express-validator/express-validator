import * as assert from 'assert';
import { Sanitizers } from '../chain/sanitizers';
import { Validators } from '../chain/validators';
import { CustomValidator, DynamicMessageCreator, Location, Request } from '../base';
import { ValidationChain, ValidatorsImpl } from '../chain';
import { Optional } from '../context';
import { ResultWithContext } from '../chain/context-runner-impl';
import { check } from './check';

type ValidatorSchemaOptions<K extends keyof Validators<any>> = {
  /**
   * Options to pass to the validator.
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

export type ValidatorsSchema = {
  [K in Exclude<keyof Validators<any>, 'custom'>]?: true | ValidatorSchemaOptions<K>;
} & {
  custom?: ValidatorSchemaOptions<'custom'> | ValidatorSchemaOptions<'custom'>[];
};

type SanitizerSchemaOptions<K extends keyof Sanitizers<any>> = {
  /**
   * Options to pass to the sanitizer.
   */
  options?: Parameters<Sanitizers<any>[K]> | Parameters<Sanitizers<any>[K]>[0];
};

export type SanitizersSchema = {
  [K in Exclude<keyof Sanitizers<any>, 'customSanitizer'>]?: true | SanitizerSchemaOptions<K>;
} & {
  customSanitizer?:
    | SanitizerSchemaOptions<'customSanitizer'>
    | SanitizerSchemaOptions<'customSanitizer'>[];
};

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
const protectedNames: (keyof ParamSchema)[] = ['errorMessage', 'in'];

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
        if (methodCfg === true) {
          // Validators which require options shouldn't be receiving a boolean,
          // but many of express-validator tutorials are old and will be in plain JS,
          // so just use a type cast and pretend that no arguments are sufficient.
          (chain[method] as () => void)();
        } else if (Array.isArray(methodCfg)) {
          methodCfg.forEach(config => applyValidator(chain, method, config));
        } else {
          applyValidator(chain, method, methodCfg);
        }
      });

    return chain;
  });

  const run = async (req: Request) => {
    return await Promise.all(chains.map(chain => chain.run(req)));
  };

  return Object.assign(chains, { run });
}

function applyValidator<K extends keyof InternalParamSchema>(
  chain: ValidationChain,
  name: K,
  config: InternalParamSchema[K],
) {
  assert(typeof config === 'object' && config && !Array.isArray(config));
  const options: any[] = Array.isArray(config.options)
    ? config.options
    : config.options !== undefined
    ? [config.options]
    : [];

  if (isValidatorOptions(name, config)) {
    config.if && chain.if(config.if);
    config.negated && chain.not();
  }

  (chain[name] as any)(...options);

  if (isValidatorOptions(name, config)) {
    config.errorMessage && chain.withMessage(config.errorMessage);
    config.bail && chain.bail();
  }
}

function isValidatorOptions<K extends keyof InternalParamSchema>(
  method: K,
  config: object,
): config is ValidatorSchemaOptions<any> {
  return config && method in ValidatorsImpl.prototype;
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
