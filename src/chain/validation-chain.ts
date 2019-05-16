import { Sanitizers } from './sanitizers';
import { Validators } from './validators';
import { ContextHandler } from './context-handler';
import { Request } from '../base';
import { ReadonlyContext } from '../context';

export interface ValidationChain
  extends Validators<ValidationChain>,
    Sanitizers<ValidationChain>,
    ContextHandler<ValidationChain> {
  (req: Request, res: any, next: (error?: any) => void): void;
  context: ReadonlyContext;
}
