import { isDate, isFunction, isObject, isRegExp, isString } from '../utils';
import { Schema, SchemaTypes } from './schema-validator';

function simpleCompare(a: any, b: any): boolean {
  return a === b || (a !== a && b !== b);
}

function equals(o1: any, o2: any) {
  if (o1 === o2) {
    return true;
  }
  if (o1 === null || o2 === null) {
    return false;
  }
  // eslint-disable-next-line no-self-compare
  if (o1 !== o1 && o2 !== o2) {
    return true;
  } // NaN === NaN
  var t1 = typeof o1,
    t2 = typeof o2,
    length,
    key,
    keySet;
  if (t1 === t2 && t1 === 'object') {
    if (Array.isArray(o1)) {
      if (!Array.isArray(o2)) {
        return false;
      }
      if ((length = o1.length) === o2.length) {
        for (key = 0; key < length; key++) {
          if (!equals(o1[key], o2[key])) {
            return false;
          }
        }
        return true;
      }
    } else if (isDate(o1)) {
      if (!isDate(o2)) {
        return false;
      }
      return simpleCompare(o1.getTime(), o2.getTime());
    } else if (isRegExp(o1)) {
      if (!isRegExp(o2)) {
        return false;
      }
      return o1.toString() === o2.toString();
    } else {
      if (Array.isArray(o2) || isDate(o2) || isRegExp(o2)) {
        return false;
      }
      keySet = Object.create(null);
      for (key in o1) {
        if (isFunction(o1[key])) {
          continue;
        }
        if (!equals(o1[key], o2[key])) {
          return false;
        }
        keySet[key] = true;
      }
      for (key in o2) {
        if (!(key in keySet) && o2[key] !== void 0 && !isFunction(o2[key])) {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}

function getExtraProps(base: Record<string, any>, check: Record<string, any>): string[] {
  return Object.keys(check).slice(Object.keys(base).length);
}

// Polyfill for Array.prototype.flap, this could be avoided using es2019 or later
function flatDeep(arr: any[], d = 1): any[] {
  return d > 0
    ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
    : arr.slice();
}

function instantiate(Type: any, arg: any): any {
  // eslint-disable-next-line new-cap
  return [Date, Object].includes(Type) ? new Type(arg) : Type(arg);
}

//

export function schemaValidator(
  value: any,
  schema: Schema,
  forbidExtraProperties: boolean = false,
  parentKey: string = '',
) {
  let error: string = '';
  if (forbidExtraProperties) {
    error = getExtraProps(schema, value)[0];
  }
  if (!error) {
    Object.entries(schema).every(
      ([key, rawType]: [string, SchemaTypes | SchemaTypes[] | Schema[]]) => {
        // This could be [rawType].flat() using es2019 or later
        const types = flatDeep([rawType]);
        if (value.hasOwnProperty(key)) {
          const toMatch = value[key];
          // We got to test against each type bacuse a failure is could mean the value is another of the types allowed
          const tests: (boolean | string)[] = types
            .filter(v => v !== undefined)
            .reduce((acc, type) => {
              // acc.push(isFn(Type)
              //   ? equals(instantiate(type, toMatch), toMatch)
              //   : isObject(Type)
              //   ? compareRecursively(schema[key], value[key], forbidExtraProperties, key)
              //   isRegExp(type)
              //   ? type
              //   : Type === toMatch);
              if (isFunction(type)) {
                acc.push(equals(instantiate(type, toMatch), toMatch));
              } else if (isObject(type)) {
                acc.push(schemaValidator(schema[key], value[key], forbidExtraProperties, key));
              } else if (isRegExp(type) && isString(toMatch)) {
                acc.push(type.test(toMatch));
              } else {
                acc.push(type === toMatch);
              }

              return acc;
            }, []);

          const test = tests.find((t: boolean | string) => !!t); // find first error if any

          test || (error = isString(test) ? test : key);
        } else {
          if (!types.includes(undefined)) {
            error = key;
          }
        }
        return !error;
      },
    );
  }

  return error ? [parentKey, error].filter(Boolean).join('.') : '';
}
