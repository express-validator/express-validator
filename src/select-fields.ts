import * as _ from 'lodash';
import { FieldInstance, Location, Request } from './base';

export type SelectFields = (
  req: Request,
  fields: string[],
  locations: Location[],
) => FieldInstance[];

export const selectFields: SelectFields = (req, fields, locations) =>
  _(fields)
    .flatMap(field =>
      _.flatMap(locations, location => {
        return expandField(req, field, location);
      }),
    )
    // Avoid duplicates if multiple field selections would return the same field twice.
    // E.g. with fields = ['*.foo', 'bar.foo'] and req.body = { bar: { foo: 1 }, baz: { foo: 2 } },
    // the instance bla.foo would appear twice, and baz.foo once.
    .uniqWith(isSameFieldInstance)
    .value();

function isSameFieldInstance(a: FieldInstance, b: FieldInstance) {
  return a.path === b.path && a.location === b.location;
}

function expandField(req: Request, field: string, location: Location): FieldInstance[] {
  const originalPath = field;
  const pathToExpand = location === 'headers' ? field.toLowerCase() : field;

  const paths: string[] = [];
  expandPath(req[location], pathToExpand, paths);

  return paths.map(path => {
    const value = path === '' ? req[location] : _.get(req[location], path);
    return {
      location,
      path,
      originalPath,
      value,
      originalValue: value,
    };
  });
}

function expandPath(object: any, path: string | string[], accumulator: string[]) {
  const segments = _.toPath(path);
  const wildcardPos = segments.indexOf('*');

  if (wildcardPos > -1) {
    const subObject = wildcardPos === 0 ? object : _.get(object, segments.slice(0, wildcardPos));

    if (!subObject || !_.isObjectLike(subObject)) {
      return;
    }

    Object.keys(subObject)
      .map(key =>
        segments
          // Before the *
          .slice(0, wildcardPos)
          // The part that the * matched
          // #1205 - Escape a legit field "*" to avoid it from causing infinite recursion
          .concat(key === '*' ? `\\${key}` : key)
          // After the *
          .concat(segments.slice(wildcardPos + 1)),
      )
      .forEach(subPath => {
        expandPath(object, subPath, accumulator);
      });
  } else {
    const reconstructedPath = reconstructFieldPath(segments);
    accumulator.push(reconstructedPath);
  }
}

/**
 * Reconstructs a field path from a list of path segments.
 *
 * Most segments will be concatenated by a dot, for example `['foo', 'bar']` becomes `foo.bar`.
 * However, a numeric segment will be wrapped in brackets to match regular JS array syntax:
 *
 * ```
 * reconstructFieldPath(['foo', 0, 'bar']) // foo[0].bar
 * ```
 *
 * Segments which have a special character such as `.` will be wrapped in brackets and quotes,
 * which also matches JS syntax for objects with such keys.
 *
 * ```
 * reconstructFieldPath(['foo', 'bar.baz', 'qux']) // foo["bar.baz"].qux
 * ```
 */
export function reconstructFieldPath(segments: readonly string[]): string {
  return segments.reduce((prev, segment) => {
    let part = '';
    segment = segment === '\\*' ? '*' : segment;

    // TODO: Handle brackets?
    if (segment.includes('.')) {
      // Special char key access
      part = `["${segment}"]`;
    } else if (/^\d+$/.test(segment)) {
      // Index access
      part = `[${segment}]`;
    } else if (prev) {
      // Object key access
      part = `.${segment}`;
    } else {
      // Top level key
      part = segment;
    }

    return prev + part;
  }, '');
}
