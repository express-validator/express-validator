import { Request } from '../base';
import { ContextBuilder } from '../context-builder';
import { Sanitizers } from './sanitizers';
import { Validators } from './validators';
import { ContextHandler } from './context-handler';
import { ContextRunner } from './context-runner';

export interface ValidationChain<Req = Request, Res = any, NextFn = (error?: any) => void>
  extends Validators<ValidationChain>,
    Sanitizers<ValidationChain>,
    ContextHandler<ValidationChain>,
    ContextRunner {
  (req: Req, res: Res, next: NextFn): void;
  builder: ContextBuilder;
}
