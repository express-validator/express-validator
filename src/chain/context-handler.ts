import { CustomValidator } from '../base';
import { Optional } from '../context';
import { ValidationChain } from './validation-chain';

export interface ContextHandler<Chain> {
  bail(): Chain;
  if(condition: CustomValidator | ValidationChain): Chain;
  optional(options?: Partial<Optional> | true): Chain;
}
