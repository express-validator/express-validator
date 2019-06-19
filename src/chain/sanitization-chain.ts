import { Request } from '../base';
import { ContextBuilder } from '../context-builder';
import { Sanitizers } from './sanitizers';
import { ContextRunner } from './context-runner';

export interface SanitizationChain extends Sanitizers<SanitizationChain>, ContextRunner {
  (req: Request, res: any, next: (errors?: any) => void): void;
  builder: ContextBuilder;
}
