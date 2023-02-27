import { FieldInstance } from './base';

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

export function fieldRenameUtility(path: string, field: FieldInstance) {
  if (path.includes('.*')) {
    return _renameFieldWithAsterisk(path, field);
  }
  // Normal dot notation wildcard path
  return path;
}

function _renameFieldWithAsterisk(path: string, field: FieldInstance) {
  const { path: original } = field;
  // Extract the indices from the input string
  const regExp = /\[(\d+)\]/g;
  const matches = [...original.matchAll(regExp)];
  const indices = matches.map(([, index]) => index);

  // Replace the placeholders in the format with the corresponding indices
  let result = path;
  result = result.replace(/\.\*/g, () => {
    const _index = Number(indices.shift());
    return !isNaN(_index) ? `[${_index}]` : '[0]';
  });
  return result;
}
