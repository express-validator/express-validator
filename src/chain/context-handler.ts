import { DynamicMessageCreator } from '../base';

export type OptionalOptions = boolean | { nullable?: boolean, checkFalsy?: boolean };

export interface ContextHandler<Chain> {
  not(): Chain;
  withMessage(message: DynamicMessageCreator): Chain;
  withMessage(message: any): Chain;
  optional(options?: OptionalOptions): Chain;
}
