import { Sanitizers } from './sanitizers';
import { Validators } from './validators';
import { ContextHandler } from './context-handler';
import { Request } from '../base';

export interface ValidationChain extends
  Validators<ValidationChain>,
  Sanitizers<ValidationChain>,
  ContextHandler<ValidationChain> {
    (req: Request, res: any, next: () => void): void;
  }