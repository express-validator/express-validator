import { SelectFields, selectFields as baseSelectFields } from '../select-fields';
import { InternalRequest, Request, ValidationHalt, contextsSymbol } from '../base';
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

    const haltedInstances = new Set<string>();

    for (const contextItem of context.stack) {
      const promises = context.getData({ requiredOnly: true }).map(async instance => {
        const instanceKey = `${instance.location}:${instance.path}`;
        if (haltedInstances.has(instanceKey)) {
          return;
        }

        try {
          await contextItem.run(context, instance.value, {
            req,
            location: instance.location,
            path: instance.path,
          });
        } catch (e) {
          if (e instanceof ValidationHalt) {
            haltedInstances.add(instanceKey);
            return;
          }

          throw e;
        }
      });

      await Promise.all(promises);
    }

    if (options.saveContext === undefined || options.saveContext) {
      const internalReq = req as InternalRequest;
      internalReq[contextsSymbol] = (internalReq[contextsSymbol] || []).concat(context);
    }

    return context;
  }
}
