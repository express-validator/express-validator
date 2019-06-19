import { Request } from '../base';
import { ContextBuilder } from '../context-builder';
import { Sanitizers } from './sanitizers';
import { Validators } from './validators';
import { ContextHandler } from './context-handler';
import { ContextRunner } from './context-runner';

export interface ValidationChain
  extends Validators<ValidationChain>,
    Sanitizers<ValidationChain>,
    ContextHandler<ValidationChain>,
    ContextRunner {
  (req: Request, res: any, next: (error?: any) => void): void;
  builder: ContextBuilder;
}
