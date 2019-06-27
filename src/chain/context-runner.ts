import { Request } from '../base';
import { Context } from '../context';

export interface ContextRunner {
  run(req: Request, options?: { saveContext?: boolean }): Promise<Context>;
}
