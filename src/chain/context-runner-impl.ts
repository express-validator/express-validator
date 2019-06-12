import { ContextRunner } from './context-runner';
import { Context } from '../context';
import { SelectFields, selectFields as baseSelectFields } from '../select-fields';
import { Request } from '../base';

export class ContextRunnerImpl implements ContextRunner {
  constructor(
    private readonly context: Context,
    private readonly selectFields: SelectFields = baseSelectFields,
  ) {}

  async run(req: Request) {
    const { context } = this;
    const instances = this.selectFields(req, context.fields, context.locations);
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
