import * as _ from 'lodash';
import { Context } from '../context';
import { ContextRunner, FieldInstance } from './context-runner';
import { Request } from '../base';

export class PersistBack implements ContextRunner {
  run(req: Request, _context: Context, instances: FieldInstance[]) {
    instances
      .filter(instance => {
        const initialValue = _.get(req[instance.location], instance.path);
        // Avoids persisting undefined values when the keys don't exist
        return initialValue !== instance.value;
      })
      .forEach(instance => {
        instance.path === ''
          ? _.set(req, instance.location, instance.value)
          : _.set(req[instance.location], instance.path, instance.value);
      });

    return Promise.resolve(instances);
  }
}
