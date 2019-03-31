import { DynamicMessageCreator } from "../base";

export interface ContextHandler<Chain> {
  not(): Chain;
  withMessage(message: DynamicMessageCreator): Chain;
  withMessage(message: any): Chain;
  optional(options?: boolean | { nullable?: boolean, checkFalsy?: boolean }): Chain;
}