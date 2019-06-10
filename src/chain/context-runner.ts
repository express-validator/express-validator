import { Request } from '../base';

export interface ContextRunner {
  run(req: Request): Promise<void>;
}
