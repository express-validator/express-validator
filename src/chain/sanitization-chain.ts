import { Sanitizers } from './sanitizers';
import { Request } from '../base';
import { ContextRunner } from './context-runner';

export interface SanitizationChain extends Sanitizers<SanitizationChain>, ContextRunner {
  (req: Request, res: any, next: (errors?: any) => void): void;
}
