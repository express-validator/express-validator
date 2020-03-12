import { Sanitizers } from '../chain/sanitizers';
import { Validators } from '../chain/validators';
import { DynamicMessageCreator, Location } from '../base';
import { ValidatorsImpl } from '../chain';
import { Optional } from '../context';
import { check } from './check';

type ValidatorSchemaOptions<K extends keyof Validators<any>> =
  | true
  | {
      options?: Parameters<Validators<any>[K]> | Parameters<Validators<any>[K]>[0];
      errorMessage?: DynamicMessageCreator | any;
      negated?: boolean;
      bail?: boolean;
    };

export type ValidatorsSchema = { [K in keyof Validators<any>]?: ValidatorSchemaOptions<K> };

type SanitizerSchemaOptions<K extends keyof Sanitizers<any>> =
  | true
  | {
      options?: Parameters<Sanitizers<any>[K]> | Parameters<Sanitizers<any>[K]>[0];
    };

export type SanitizersSchema = { [K in keyof Sanitizers<any>]?: SanitizerSchemaOptions<K> };

type InternalParamSchema = ValidatorsSchema & SanitizersSchema;

/**
 * Defines a schema of validations/sanitizations plus a general validation error message
 * and possible field locations.
 */
export type ParamSchema = InternalParamSchema & {
  in?: Location | Location[];
  errorMessage?: DynamicMessageCreator | any;
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

export function checkSchema(schema: Schema, defaultLocations: Location[] = validLocations) {
  return Object.keys(schema).map(field => {
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

        let options: any[] = methodCfg === true ? [] : methodCfg.options || [];
        if (options != null && !Array.isArray(options)) {
          options = [options];
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
