import * as _ from 'lodash';
import { Location, Request, contextsSymbol, InternalRequest, errorsSymbol, failedOneOfContextsSymbol } from './base';
import { SelectFields, RemoveOptionals, FieldInstance, EnsureInstance, ContextRunner } from './context-runners';
import { Context } from './context';

interface FieldInstanceBag {
  instance: FieldInstance;
  context: Context;
}

export function matchedData(req: Request, options: {
  includeOptionals?: boolean,
  locations?: Location[],
  onlyValidData?: boolean,
} = {}) {
  const internalReq: InternalRequest = req;

  const fieldExtractor = createFieldExtractor(req, options.includeOptionals !== true);
  const validityFilter = createValidityFilter(req, options.onlyValidData);
  const locationFilter = createLocationFilter(options.locations);

  return _(internalReq[contextsSymbol])
    .flatMap(fieldExtractor)
    .filter(validityFilter)
    .map(field => field.instance)
    .filter(locationFilter)
    .reduce((state, instance) => _.set(state, instance.path, instance.value), {})
    .valueOf();
}

function createFieldExtractor(req: Request, removeOptionals: boolean) {
  const fieldSelector = new SelectFields();
  const optionalsRemover = new RemoveOptionals();
  const ensureInstance = new EnsureInstance();

  return (context: Context) => {
    let instances = fieldSelector.run(req, context, []);

    if (removeOptionals) {
      instances = optionalsRemover.run(req, context, instances);
    }

    instances = ensureInstance.run(req, context, instances);
    return instances.map((instance): FieldInstanceBag => ({ instance, context }));
  };
}

function createValidityFilter(req: InternalRequest, onlyValidData = true) {
  const errors = req[errorsSymbol] || [];
  const failedOneOfContexts = req[failedOneOfContextsSymbol] || [];

  return !onlyValidData ? () => true : (field: FieldInstanceBag) => {
    const hasError = errors.some(error => (
      error.location === field.instance.location
      && error.param === field.instance.path
    ));

    const failedWithinOneOf = failedOneOfContexts.includes(field.context);

    return !(hasError || failedWithinOneOf);
  };
}

function createLocationFilter(locations: Location[] = []) {
  // No locations mean all locations
  const allLocations = locations.length === 0;
  return allLocations
    ? () => true
    : (field: FieldInstance) => locations.includes(field.location);
}