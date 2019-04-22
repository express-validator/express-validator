import { Sanitizers } from './chain/sanitizers';
import { Validators } from './chain/validators';
import { DynamicMessageCreator, Location } from './base';

export type ValidatorsSchema = {
  [K in keyof Validators<any>]?: true | {
    options?: (Parameters<Validators<any>[K]>|Parameters<Validators<any>[K]>[0]),
    errorMessage?: any,
    negated?: boolean
  }
};

export type SanitizersSchema = {
  [K in keyof Sanitizers<any>]?: true | {
    options?: (Parameters<Sanitizers<any>[K]>|Parameters<Sanitizers<any>[K]>[0]),
  }
};

/**
 * Defines a schema of validations/sanitizations plus a general validation error message
 * and possible field locations.
 */
export type ParamSchema = ValidatorsSchema & SanitizersSchema & {
  in: Location | Location[],
  errorMessage?: DynamicMessageCreator | any,
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