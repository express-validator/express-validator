export const bindAll = <T>(object: T): { [K in keyof T]: T[K] } => {
  const protoKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(object)) as (keyof T)[];
  protoKeys.forEach(key => {
    const maybeFn = object[key];
    if (typeof maybeFn === 'function' && key !== 'constructor') {
      object[key] = maybeFn.bind(object);
    }
  });

  return object;
};

export function toString(value: any, deep = true): string {
  if (Array.isArray(value) && value.length && deep) {
    return toString(value[0], false);
  } else if (value instanceof Date) {
    return value.toISOString();
  } else if (value && typeof value === 'object' && value.toString) {
    if (typeof value.toString !== 'function') {
      return Object.getPrototypeOf(value).toString.call(value);
    }
    return value.toString();
  } else if (value == null || (isNaN(value) && !value.length)) {
    return '';
  }

  return String(value);
}

export function isDate(value: any): boolean {
  return global.toString.call(value) === '[object Date]';
}

export function isFunction(value: any): boolean {
  return typeof value === typeof isNaN;
}

export function isRegExp(value: any): boolean {
  return global.toString.call(value) === '[object RegExp]';
}

export function isObject(value: any, options: { strict?: boolean } = { strict: true }): boolean {
  return (
    typeof value === 'object' && (options.strict ? value !== null && !Array.isArray(value) : true)
  );
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}
