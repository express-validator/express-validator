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

export type ParamSchema = ValidatorsSchema & SanitizersSchema & {
  in: Location | Location[],
  errorMessage?: DynamicMessageCreator | any,
};

export type Schema = Record<string, ParamSchema>;