import * as _ from 'lodash';
import { Context } from '../context';
import { ContextRunner, FieldInstance } from './context-runner';
import { Request } from '../base';

export class EnsureInstance implements ContextRunner {
  run(_req: Request, context: Context, instances: FieldInstance[]) {
    const groups = _.groupBy(instances, 'originalPath');
    return _.flatMap(Object.keys(groups), key => {
      const groupInstances = groups[key];

      // #331 - When multiple locations are involved, all of them must pass the validation.
      // If none of the locations contain the field, we at least include one for error reporting.
      // #458, #531 - Wildcards are an exception though: they may yield 0..* instances with different
      // paths, so we may want to skip this filtering.
      if (groupInstances.length > 1 && context.locations.length > 1 && !key.includes('*')) {
        const withValue = groupInstances.filter(field => field.value !== undefined);
        return withValue.length ? withValue : [groupInstances[0]];
      }

      return groupInstances;
    });
  }
}
