import { Optional } from '../context';

export interface ContextHandler<Chain> {
  optional(options?: Partial<Optional> | true): Chain;
}
