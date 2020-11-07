import { Request } from '../base';
import { ReadonlyContext } from '../context';
import { Result } from '../validation-result';

export interface ContextRunner {
  run(req: Request, options?: { dryRun?: boolean }): Promise<Result & { context: ReadonlyContext }>;
}
