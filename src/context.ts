import * as _ from 'lodash';
import {
  FieldInstance,
  FieldValidationError,
  Location,
  Meta,
  Request,
  UnknownFieldInstance,
  ValidationError,
} from './base';
import { ContextItem } from './context-items';
import { IncludeOptionals } from './matched-data';

function getDataMapKey(path: string, location: Location) {
  return `${location}:${path}`;
}

// NOTE: Keep this in sync with OptionalOptions#values docs
/**
 * Defines which kind of value makes a field optional.
 *
 * - `undefined`: only `undefined` values; equivalent to `value === undefined`
 * - `null`: only `undefined` and `null` values; equivalent to `value == null`
 * - `falsy`: all falsy values; equivalent to `!value`
 * - `false`: not optional.
 */
export type Optional = 'undefined' | 'null' | 'falsy' | false;

export type AddErrorOptions =
  | {
      type: 'field';
      message?: any;
      value: any;
      meta: Meta;
    }
  | {
      type: 'unknown_fields';
      req: Request;
      message?: any;
      fields: UnknownFieldInstance[];
    }
  | {
      type: 'alternative';
      req: Request;
      message?: any;
      nestedErrors: FieldValidationError[];
    }
  | {
      type: 'alternative_grouped';
      req: Request;
      message?: any;
      nestedErrors: FieldValidationError[][];
    };

export type ValueVisibility =
  | { type: 'visible' }
  | { type: 'hidden' }
  | { type: 'redacted'; value: string };

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
    readonly bail: boolean,
    readonly visibility: ValueVisibility = { type: 'visible' },
    readonly message?: any,
  ) {}

  getData(options: { includeOptionals: IncludeOptionals } = { includeOptionals: true }) {
    const { optional } = this;
    const checks =
      !options.includeOptionals && optional
        ? [
            (value: any) => value !== undefined,
            (value: any) => (optional === 'null' ? value != null : true),
            (value: any) => (optional === 'falsy' ? value : true),
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
      .filter(instance => {
        if (options.includeOptionals === 'ignoreUndefined') {
          return checks.every(check => check(instance.value)) && instance.value !== undefined
        } else {
          return checks.every(check => check(instance.value))
        }
      })
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

  addError(opts: AddErrorOptions) {
    const msg = opts.message || this.message || 'Invalid value';
    let error: ValidationError;
    switch (opts.type) {
      case 'field':
        error = this.updateVisibility({
          type: 'field',
          value: opts.value,
          msg: typeof msg === 'function' ? msg(opts.value, opts.meta) : msg,
          path: opts.meta?.path,
          location: opts.meta?.location,
        });
        break;

      case 'unknown_fields':
        error = {
          type: 'unknown_fields',
          msg: typeof msg === 'function' ? msg(opts.fields, { req: opts.req }) : msg,
          fields: opts.fields,
        };
        break;

      case 'alternative':
        error = {
          type: 'alternative',
          msg: typeof msg === 'function' ? msg(opts.nestedErrors, { req: opts.req }) : msg,
          nestedErrors: opts.nestedErrors.map(error => this.updateVisibility(error)),
        };
        break;

      case 'alternative_grouped':
        error = {
          type: 'alternative_grouped',
          msg: typeof msg === 'function' ? msg(opts.nestedErrors, { req: opts.req }) : msg,
          nestedErrors: opts.nestedErrors.map(errors =>
            errors.map(error => this.updateVisibility(error)),
          ),
        };
        break;

      default:
        throw new Error(`Unhandled addError case`);
    }

    this._errors.push(error);
  }

  private updateVisibility(error: FieldValidationError): FieldValidationError {
    switch (this.visibility.type) {
      case 'hidden':
        error = { ...error };
        delete error.value;
        return error;

      case 'redacted':
        return {
          ...error,
          value: this.visibility.value,
        };

      case 'visible':
      default:
        return error;
    }
  }
}

export type ReadonlyContext = Pick<
  Context,
  Exclude<keyof Context, 'setData' | 'addFieldInstances' | 'addError'>
>;
