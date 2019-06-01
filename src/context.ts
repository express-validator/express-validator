import * as _ from 'lodash';
import {
  CustomSanitizer,
  CustomValidator,
  Location,
  Meta,
  StandardSanitizer,
  StandardValidator,
  ValidationError,
} from './base';
import { ContextItem, CustomValidation, StandardValidation } from './context-items';
import { Sanitization } from './context-items/sanitization';

export interface FieldInstance {
  path: string;
  originalPath: string;
  location: Location;
  value: any;
  originalValue: any;
}

function getDataMapKey(path: string, location: Location) {
  return `${location}:${path}`;
}

export class Context {
  private negated = false;

  private _optional: { nullable: boolean; checkFalsy: boolean } | false = false;
  get optional() {
    return this._optional;
  }

  private readonly errors: ValidationError[] = [];
  private readonly stack: ContextItem[] = [];
  private readonly dataMap: Map<string, FieldInstance> = new Map();

  constructor(readonly message?: any) {}

  // Data part
  getData(options: { requiredOnly: boolean }): Record<string, FieldInstance> {
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
          return withValue.length ? withValue : [withValue[0]];
        }

        return instances;
      })
      .valueOf()
      .reduce(
        (memo, instance) => {
          if (checks.every(check => check(instance.value))) {
            memo[instance.path] = instance.value;
          }

          return memo;
        },
        {} as Record<string, FieldInstance>,
      );
  }

  addFieldInstances(instances: FieldInstance[]) {
    instances.forEach(instance => {
      this.dataMap.set(getDataMapKey(instance.path, instance.location), instance);
    });
  }

  setData(path: string, value: any, location: Location) {
    const instance = this.dataMap.get(getDataMapKey(path, location));
    if (!instance) {
      throw new Error('Attempt to write data that did not pre-exist in context');
    }

    instance.value = value;
  }

  // Validations part
  negate() {
    this.negated = true;
  }

  addError(message: any, value: any, meta: Meta) {
    let msg = message || this.message || 'Invalid value';
    if (typeof msg === 'function') {
      msg = msg(value, meta);
    }

    this.errors.push({
      value,
      msg,
      param: meta.path,
      location: meta.location,
    });
  }

  addValidation(validator: CustomValidator, meta: { custom: true }): void;
  addValidation(validator: StandardValidator, meta: { custom: false; options?: any[] }): void;
  addValidation(
    validator: CustomValidator | StandardValidator,
    meta: {
      custom: boolean;
      options?: any[];
    },
  ) {
    this.stack.push(
      meta.custom
        ? new CustomValidation(this, validator, this.negated)
        : new StandardValidation(this, validator, meta.options, this.negated),
    );

    // Reset this.negated so that next validation isn't negated too
    this.negated = false;
  }

  setOptional(options: boolean | { nullable?: boolean; checkFalsy?: boolean } = true) {
    if (typeof options === 'boolean') {
      this._optional = options ? { checkFalsy: false, nullable: false } : false;
    } else {
      this._optional = {
        checkFalsy: !!options.checkFalsy,
        nullable: !!options.nullable,
      };
    }
  }

  // Sanitizations part
  addSanitization(sanitizer: CustomSanitizer, meta: { custom: true }): void;
  addSanitization(sanitizer: StandardSanitizer, meta: { custom: false; options?: any[] }): void;
  addSanitization(
    sanitizer: CustomSanitizer | StandardSanitizer,
    meta: {
      custom: boolean;
      options?: any[];
    },
  ) {
    this.stack.push(new Sanitization(this, sanitizer, meta.custom, meta.options));
  }
}

export type ReadonlyContext = Pick<
  Context,
  Exclude<keyof Context, 'addSanitization' | 'addValidation' | 'setOptional' | 'negate'>
>;
