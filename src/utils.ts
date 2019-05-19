export const bindAll = <T>(object: T): { [K in keyof T]: T[K] } => {
  const protoKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(object)) as (keyof T)[];
  protoKeys.forEach(key => {
    const maybeFn = object[key];
    if (typeof maybeFn === 'function') {
      object[key] = maybeFn.bind(object);
    }
  });

  return object;
};
