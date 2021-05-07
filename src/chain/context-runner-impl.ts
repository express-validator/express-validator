import * as _ from 'lodash';
import { InternalRequest, Request, ValidationHalt, contextsKey } from '../base';
import { Context, ReadonlyContext } from '../context';
import { ContextBuilder } from '../context-builder';
import { SelectFields, selectFields as baseSelectFields } from '../select-fields';
import { Result } from '../validation-result';
import { ContextRunner } from './context-runner';

export class ResultWithContext extends Result {
  constructor(readonly context: ReadonlyContext) {
    super(error => error, context.errors);
  }
}

export class ContextRunnerImpl implements ContextRunner {
  constructor(
    private readonly builderOrContext: ContextBuilder | Context,
    private readonly selectFields: SelectFields = baseSelectFields,
  ) {}

  async run(req: Request, options: { dryRun?: boolean } = {}) {
    const context =
      this.builderOrContext instanceof Context
        ? this.builderOrContext
        : this.builderOrContext.build();
    const instances = this.selectFields(req, context.fields, context.locations);
    context.addFieldInstances(instances);

    const haltedInstances = new Set<string>();

    for (const contextItem of context.stack) {
      const promises = context.getData({ requiredOnly: true }).map(async instance => {
        const { location, path } = instance;
        const instanceKey = `${location}:${path}`;
        if (haltedInstances.has(instanceKey)) {
          return;
        }

        try {
          await contextItem.run(context, instance.value, {
            req,
            location,
            path,
          });

          // An instance is mutable, so if an item changed its value, there's no need to call getData again
          const newValue = instance.value;

          // Checks whether the value changed.
          // Avoids e.g. undefined values being set on the request if it didn't have the key initially.
          const reqValue = path !== '' ? _.get(req[location], path) : req[location];
          if (!options.dryRun && reqValue !== instance.value) {
            path !== '' ? _.set(req[location], path, newValue) : _.set(req, location, newValue);
          }
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

    if (!options.dryRun) {
      const internalReq = req as InternalRequest;
      internalReq[contextsKey] = (internalReq[contextsKey] || []).concat(context);
    }

    return new ResultWithContext(context);
  }
}
