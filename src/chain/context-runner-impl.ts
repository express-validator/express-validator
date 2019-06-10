import { ContextRunner } from './context-runner';
import { Context } from '../context';
import { SelectFields, selectFields as baseSelectFields } from '../select-fields';
import { Location, Request } from '../base';

export class ContextRunnerImpl implements ContextRunner {
  constructor(
    private readonly context: Context,
    private readonly fields: string[],
    private readonly locations: Location[],
    private readonly selectFields: SelectFields = baseSelectFields,
  ) {}

  async run(req: Request) {
    const { context, fields, locations } = this;
    const instances = this.selectFields(req, fields, locations);
    context.addFieldInstances(instances);

    for (const contextItem of context.stack) {
      const promises = context
        .getData({
          // Data not provided in optional contexts shouldn't be validated.
          requiredOnly: contextItem.kind === 'validation',
        })
        .map(instance =>
          contextItem.run(instance.value, {
            req,
            location: instance.location,
            path: instance.path,
          }),
        );

      await Promise.all(promises);
    }
  }
}
