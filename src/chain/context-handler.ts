import { Optional } from '../context';
import { CustomValidator } from '../base';

export interface ContextHandler<Chain> {
  if(condition: CustomValidator): Chain;
  optional(options?: Partial<Optional> | true): Chain;
}
