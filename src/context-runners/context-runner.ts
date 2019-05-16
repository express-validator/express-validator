import { Location, Request } from '../base';
import { Context } from '../context';

export interface FieldInstance {
  path: string;
  originalPath: string;
  location: Location;
  value: any;
  originalValue: any;
}

export interface ContextRunner {
  run(
    req: Request,
    context: Context,
    instances: FieldInstance[]
  ): Promise<FieldInstance[]> | FieldInstance[];
}
