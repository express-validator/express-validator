import * as _ from 'lodash';
import { FieldInstance, Location, Meta, ValidationError } from './base';
import { ContextItem } from './context-items';

function getDataMapKey(path: string, location: Location) {
  return `${location}:${path}`;
}

export type Optional =
  | {
      /**
       * Whether a field whose value is `null` or `undefined` is to be considered optional.
       * @default false
       */
      nullable: boolean;

      /**
       * Whether a field whose value is falsy (that is, `0`, `false`, `null`, `undefined` or an empty
       * string) is to be considered optional.
       * @default false
       */
      checkFalsy: boolean;
    }
  | false;

export class Context {
  private readonly _errors: ValidationError[] = [];
  get errors(): ReadonlyArray<ValidationError> {
    return this._errors;
  }

  private readonly dataMap: Map<string, FieldInstance> = new Map();

  constructor(
    readonly fields: string[],
    readonly locations: Location[],
    readonly stack: ReadonlyArray<ContextItem>,
    readonly optional: Optional,
    readonly message?: any,
  ) {}

  getData(options: { requiredOnly: boolean } = { requiredOnly: false }) {
    // Have to store this.optional in a const otherwise TS thinks the value could have changed
    // when the functions below run
    const { optional } = this;
    const checks =
      options.requiredOnly && optional
        ? [
            (value: any) => value !== undefined,
            (value: any) => (optional.nullable ? value != null : true),
            (value: any) => (optional.checkFalsy ? value : true),
          ]
        : [];

    return _([...this.dataMap.values()])
      .groupBy('originalPath')
      .flatMap((instances, group) => {
        const locations = _.uniqBy(instances, 'location');

        // #331 - When multiple locations are involved, all of them must pass the validation.
        // If none of the locations contain the field, we at least include one for error reporting.
        // #458, #531 - Wildcards are an exception though: they may yield 0..* instances with different
        // paths, so we may want to skip this filtering.
        if (instances.length > 1 && locations.length > 1 && !group.includes('*')) {
          const withValue = instances.filter(instance => instance.value !== undefined);
          return withValue.length ? withValue : [instances[0]];
        }

        return instances;
      })
      .filter(instance => checks.every(check => check(instance.value)))
      .valueOf();
  }

  addFieldInstances(instances: FieldInstance[]) {
    instances.forEach(instance => {
      this.dataMap.set(getDataMapKey(instance.path, instance.location), { ...instance });
    });
  }

  setData(path: string, value: any, location: Location) {
    const instance = this.dataMap.get(getDataMapKey(path, location));
    if (!instance) {
      throw new Error('Attempt to write data that did not pre-exist in context');
    }

    instance.value = value;
  }

  addError(message: any, value: any, meta: Meta): void;
  addError(message: any, nestedErrors: ValidationError[]): void;
  addError(message: any, valueOrNestedErrors: any, meta?: Meta) {
    const msg = message || this.message || 'Invalid value';
    if (meta) {
      this._errors.push({
        value: valueOrNestedErrors,
        msg: typeof msg === 'function' ? msg(valueOrNestedErrors, meta) : msg,
        param: meta.path,
        location: meta.location,
      });
    } else {
      this._errors.push({
        msg,
        param: '_error',
        nestedErrors: valueOrNestedErrors,
      });
    }
  }
}

export type ReadonlyContext = Pick<
  Context,
  Exclude<keyof Context, 'setData' | 'addFieldInstances' | 'addError'>
>;
