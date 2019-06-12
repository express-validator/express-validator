import { Sanitizers } from './sanitizers';
import { Request } from '../base';
import { ReadonlyContext } from '../context';
import { ContextRunner } from './context-runner';

export interface SanitizationChain extends Sanitizers<SanitizationChain>, ContextRunner {
  (req: Request, res: any, next: (errors?: any) => void): void;
  context: ReadonlyContext;
}
