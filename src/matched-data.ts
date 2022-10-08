import * as _ from 'lodash';
import { FieldInstance, InternalRequest, Location, Request, contextsKey } from './base';
import { Context } from './context';

interface FieldInstanceBag {
  instance: FieldInstance;
  context: Context;
}

export type MatchedDataOptions = {
  /**
   * Whether the value returned by `matchedData()` should include data deemed optional.
   * @default false
   */
  includeOptionals: boolean;

  /**
   * An array of locations in the request to extract the data from.
   */
  locations: Location[];

  /**
   * Whether the value returned by `matchedData()` should include only values that have passed
   * validation.
   * @default true
   */
  onlyValidData: boolean;
};

/**
 * Extracts data validated or sanitized from the request, and builds an object with them.
 *
 * @param req the express request object
 * @param options
 * @returns an object of data that's been validated or sanitized in the passed request
 */
export function matchedData(
  req: Request,
  options: Partial<MatchedDataOptions> = {},
): Record<string, any> {
  const internalReq: InternalRequest = req;

  const fieldExtractor = createFieldExtractor(options.includeOptionals !== true);
  const validityFilter = createValidityFilter(options.onlyValidData);
  const locationFilter = createLocationFilter(options.locations);

  return _(internalReq[contextsKey])
    .flatMap(fieldExtractor)
    .filter(validityFilter)
    .map(field => field.instance)
    .filter(locationFilter)
    .reduce((state, instance) => _.set(state, instance.path, instance.value), {})
    .valueOf();
}

function createFieldExtractor(removeOptionals: boolean) {
  return (context: Context) => {
    const instances = context.getData({ requiredOnly: removeOptionals });
    return instances.map((instance): FieldInstanceBag => ({ instance, context }));
  };
}

function createValidityFilter(onlyValidData = true) {
  return !onlyValidData
    ? () => true
    : (field: FieldInstanceBag) => {
        const hasError = field.context.errors.some(
          error =>
            error.location === field.instance.location && error.param === field.instance.path,
        );

        return !hasError;
      };
}

function createLocationFilter(locations: Location[] = []) {
  // No locations mean all locations
  const allLocations = locations.length === 0;
  return allLocations ? () => true : (field: FieldInstance) => locations.includes(field.location);
}
