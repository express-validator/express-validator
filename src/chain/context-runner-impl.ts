import { SelectFields, selectFields as baseSelectFields } from '../select-fields';
import { InternalRequest, Request, contextsSymbol } from '../base';
import { ContextBuilder } from '../context-builder';
import { ContextRunner } from './context-runner';

export class ContextRunnerImpl implements ContextRunner {
  constructor(
    private readonly builder: ContextBuilder,
    private readonly selectFields: SelectFields = baseSelectFields,
  ) {}

  async run(req: Request, options: { saveContext?: boolean } = {}) {
    const context = this.builder.build();
    const instances = this.selectFields(req, context.fields, context.locations);
    context.addFieldInstances(instances);

    for (const contextItem of context.stack) {
      const promises = context
        .getData({
          // Data not provided in optional contexts shouldn't be validated.
          requiredOnly: contextItem.kind === 'validation',
        })
        .map(instance =>
          contextItem.run(context, instance.value, {
            req,
            location: instance.location,
            path: instance.path,
          }),
        );

      await Promise.all(promises);
    }

    if (options.saveContext === undefined || options.saveContext) {
      const internalReq = req as InternalRequest;
      internalReq[contextsSymbol] = (internalReq[contextsSymbol] || []).concat(context);
    }

    return context;
  }
}
