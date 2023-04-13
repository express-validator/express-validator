import * as _ from 'lodash';
import {
  CustomSanitizer,
  CustomValidator,
  ErrorMessage,
  FieldMessageFactory,
  Location,
  Request,
} from '../base';
import {
  BailOptions,
  SanitizersImpl,
  ValidationChain,
  ValidationChainLike,
  ValidatorsImpl,
} from '../chain';
import { ResultWithContext } from '../chain/context-runner';
import { Sanitizers } from '../chain/sanitizers';
import { Validators } from '../chain/validators';
import { Optional } from '../context';
import { runAllChains } from '../utils';
import { check } from './check';

type BaseValidatorSchemaOptions = {
  /**
   * The error message if there's a validation error,
   * or a function for creating an error message dynamically.
   */
  errorMessage?: FieldMessageFactory | ErrorMessage;

  /**
   * Whether the validation should be reversed.
   */
  negated?: boolean;

  /**
   * Whether the validation should bail after running this validator
   */
  bail?: boolean | BailOptions;

  /**
   * Specify a condition upon which this validator should run.
   * Can either be a validation chain, or a custom validator function.
   */
  if?: CustomValidator | ValidationChain;
};

type ValidatorSchemaOptions<K extends keyof Validators<any>> =
  | true
  | (BaseValidatorSchemaOptions & {
      /**
       * Options to pass to the validator.
       */
      options?: Parameters<Validators<any>[K]> | Parameters<Validators<any>[K]>[0];
    });

type CustomValidatorSchemaOptions = BaseValidatorSchemaOptions & {
  /**
   * The implementation of a custom validator.
   */
  custom: CustomValidator;
};

export type ExtensionValidatorSchemaOptions = true | BaseValidatorSchemaOptions;

export type ValidatorsSchema = {
  [K in keyof Validators<any>]?: ValidatorSchemaOptions<K>;
};

type SanitizerSchemaOptions<K extends keyof Sanitizers<any>> =
  | true
  | {
      /**
       * Options to pass to the sanitizer.
       */
      options?: Parameters<Sanitizers<any>[K]> | Parameters<Sanitizers<any>[K]>[0];
    };

type CustomSanitizerSchemaOptions = {
  /**
   * The implementation of a custom sanitizer.
   */
  customSanitizer: CustomSanitizer;
};

export type ExtensionSanitizerSchemaOptions = true;

export type SanitizersSchema = {
  [K in keyof Sanitizers<any>]?: SanitizerSchemaOptions<K>;
};

type BaseParamSchema = {
  /**
   * Which request location(s) the field to validate is.
   * If unset, the field will be checked in every request location.
   */
  in?: Location | Location[];

  /**
   * The general error message in case a validator doesn't specify one,
   * or a function for creating the error message dynamically.
   */
  errorMessage?: FieldMessageFactory | any;

  /**
   * Whether this field should be considered optional
   */
  optional?:
    | true
    | {
        options?: Partial<Optional>;
      };
};

export type DefaultSchemaKeys =
  | keyof BaseParamSchema
  | keyof ValidatorsSchema
  | keyof SanitizersSchema;

/**
 * Defines a schema of validations/sanitizations for a field
 */
export type ParamSchema<T extends string = DefaultSchemaKeys> = BaseParamSchema &
  ValidatorsSchema &
  SanitizersSchema & {
    [K in T]?: K extends keyof BaseParamSchema
      ? BaseParamSchema[K]
      : K extends keyof ValidatorsSchema
      ? ValidatorsSchema[K]
      : K extends keyof SanitizersSchema
      ? SanitizersSchema[K]
      : CustomValidatorSchemaOptions | CustomSanitizerSchemaOptions;
  };

/**
 * Defines a mapping from field name to a validations/sanitizations schema.
 */
export type Schema<T extends string = DefaultSchemaKeys> = Record<string, ParamSchema<T>>;

/**
 * Shortcut type for the return of a {@link checkSchema()}-like function.
 */
export type RunnableValidationChains<C extends ValidationChainLike> = C[] & {
  run(req: Request): Promise<ResultWithContext[]>;
};

const validLocations: Location[] = ['body', 'cookies', 'headers', 'params', 'query'];
const protectedNames = ['errorMessage', 'in', 'optional'];

/**
 * Factory for a {@link checkSchema()} function which can have extension validators and sanitizers.
 *
 * @see {@link checkSchema()}
 */
export function createCheckSchema<C extends ValidationChainLike>(
  createChain: (fields?: string | string[], locations?: Location[], errorMessage?: any) => C,
  extraValidators: (keyof C)[] = [],
  extraSanitizers: (keyof C)[] = [],
): <T extends string = DefaultSchemaKeys>(
  schema: Schema<T>,
  defaultLocations?: Location[],
) => RunnableValidationChains<C> {
  /** Type guard for an object entry for a standard validator. */
  function isStandardValidator(
    entry: [string, any],
  ): entry is [keyof Validators<any>, ValidatorSchemaOptions<any>] {
    return (
      (entry[0] in ValidatorsImpl.prototype || (extraValidators as string[]).includes(entry[0])) &&
      entry[1]
    );
  }

  /** Type guard for an object entry for a standard sanitizer. */
  function isStandardSanitizer(
    entry: [string, any],
  ): entry is [keyof Sanitizers<any>, SanitizerSchemaOptions<any>] {
    return (
      (entry[0] in SanitizersImpl.prototype || (extraSanitizers as string[]).includes(entry[0])) &&
      entry[1]
    );
  }

  /** Type guard for an object entry for a custom validator. */
  function isCustomValidator(
    entry: [string, any],
  ): entry is [string, CustomValidatorSchemaOptions] {
    return (
      !isStandardValidator(entry) &&
      !isStandardSanitizer(entry) &&
      typeof entry[1] === 'object' &&
      entry[1] &&
      typeof entry[1].custom === 'function'
    );
  }

  /** Type guard for an object entry for a custom sanitizer. */
  function isCustomSanitizer(
    entry: [string, any],
  ): entry is [string, CustomSanitizerSchemaOptions] {
    return (
      !isStandardValidator(entry) &&
      !isStandardSanitizer(entry) &&
      typeof entry[1] === 'object' &&
      entry[1] &&
      typeof entry[1].customSanitizer === 'function'
    );
  }

  return (schema, defaultLocations = validLocations) => {
    const chains = Object.keys(schema).map(field => {
      const config = schema[field];
      const chain = createChain(
        field,
        ensureLocations(config, defaultLocations),
        config.errorMessage,
      );

      // optional doesn't matter where it happens in the chain
      if (config.optional) {
        chain.optional(config.optional === true ? true : config.optional.options);
      }

      for (const entry of Object.entries(config)) {
        if (protectedNames.includes(entry[0])) {
          continue;
        }

        if (
          !isStandardValidator(entry) &&
          !isStandardSanitizer(entry) &&
          !isCustomValidator(entry) &&
          !isCustomSanitizer(entry)
        ) {
          console.warn(
            `express-validator: schema of "${field}" has unknown validator/sanitizer "${entry[0]}"`,
          );
          continue;
        }

        // For validators, stuff that must come _before_ the validator itself in the chain.
        if ((isStandardValidator(entry) || isCustomValidator(entry)) && entry[1] !== true) {
          const [, validatorConfig] = entry;
          validatorConfig.if && chain.if(validatorConfig.if);
          validatorConfig.negated && chain.not();
        }

        if (isStandardValidator(entry) || isStandardSanitizer(entry)) {
          const options = entry[1] ? (entry[1] === true ? [] : _.castArray(entry[1].options)) : [];
          (chain[entry[0]] as any)(...options);
        }
        if (isCustomValidator(entry)) {
          chain.custom(entry[1].custom);
        }
        if (isCustomSanitizer(entry)) {
          chain.customSanitizer(entry[1].customSanitizer);
        }

        // For validators, stuff that must come _after_ the validator itself in the chain.
        if ((isStandardValidator(entry) || isCustomValidator(entry)) && entry[1] !== true) {
          const [, validatorConfig] = entry;
          validatorConfig.bail &&
            chain.bail(validatorConfig.bail === true ? {} : validatorConfig.bail);
          validatorConfig.errorMessage && chain.withMessage(validatorConfig.errorMessage);
        }
      }

      return chain;
    });

    const run = async (req: Request) => runAllChains(req, chains);

    return Object.assign(chains, { run });
  };
}

/**
 * Creates an express middleware with validations for multiple fields at once in the form of
 * a schema object.
 *
 * @param schema the schema to validate.
 * @param defaultLocations
 * @returns
 */
export const checkSchema = createCheckSchema(check);

function ensureLocations(config: ParamSchema, defaults: Location[]) {
  // .filter(Boolean) is done because in can be undefined -- which is not going away from the type
  // See https://github.com/Microsoft/TypeScript/pull/29955 for details
  const locations = Array.isArray(config.in)
    ? config.in
    : ([config.in].filter(Boolean) as Location[]);
  const actualLocations = locations.length ? locations : defaults;

  return actualLocations.filter(location => validLocations.includes(location));
}
