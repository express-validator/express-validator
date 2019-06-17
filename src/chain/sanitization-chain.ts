import { Sanitizers } from './sanitizers';
import { Request } from '../base';
import { ContextRunner } from './context-runner';
import { ContextBuilder } from '../context-builder';

export interface SanitizationChain extends Sanitizers<SanitizationChain>, ContextRunner {
  (req: Request, res: any, next: (errors?: any) => void): void;
  builder: ContextBuilder;
}
