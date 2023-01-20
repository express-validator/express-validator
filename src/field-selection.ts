import * as _ from 'lodash';
import { FieldInstance, Location, Request, UnknownFieldInstance } from './base';

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

type Tree = { [K: string]: Tree };
export const selectUnknownFields = (
  req: Request,
  knownFields: string[],
  locations: Location[],
): UnknownFieldInstance[] => {
  const tree: Tree = {};
  knownFields.map(field => {
    const segments = field === '' ? [''] : _.toPath(field);
    pathToTree(segments, tree);
  });

  const instances: UnknownFieldInstance[] = [];
  for (const location of locations) {
    if (req[location] != null) {
      instances.push(...findUnknownFields(location, req[location], tree));
    }
  }

  return instances;
};

function pathToTree(segments: string[], tree: Tree) {
  // Will either create or merge into existing branch for the current path segment
  const branch: Tree = tree[segments[0]] || (tree[segments[0]] = {});
  if (segments.length > 1) {
    pathToTree(segments.slice(1), branch);
  } else {
    // Leaf value.
    branch[''] = {};
  }
}

/**
 * Performs a depth-first search for unknown fields in `value`.
 * The path to the unknown fields will be pushed to the `unknownFields` argument.
 *
 * Known fields must be passed via `tree`. A field won't be considered unknown if:
 * - its branch is validated as a whole; that is, it contains an empty string key (e.g `{ ['']: {} }`); OR
 * - its path is individually validated; OR
 * - it's covered by a wildcard (`*`).
 *
 * @returns the list of unknown fields
 */
function findUnknownFields(
  location: Location,
  value: any,
  tree: Tree,
  treePath: string[] = [],
  unknownFields: UnknownFieldInstance[] = [],
): UnknownFieldInstance[] {
  if (tree['']) {
    // The rest of the tree from here is covered by some validation chain
    // For example, when the current treePath is `['foo', 'bar']` but `foo` is known
    return unknownFields;
  }

  if (typeof value !== 'object') {
    if (!treePath.length) {
      // This is most likely a req.body that isn't an object (e.g. `req.body = 'bla'`),
      // and wasn't validated either.
      unknownFields.push({
        path: '',
        value,
        location,
      });
    }
    return unknownFields;
  }

  const wildcardBranch = tree['*'];
  for (const key of Object.keys(value)) {
    const keyBranch = tree[key];
    const path = treePath.concat([key]);
    if (!keyBranch && !wildcardBranch) {
      // No trees cover this path, so it's an unknown one.
      unknownFields.push({
        path: reconstructFieldPath(path),
        value: value[key],
        location,
      });
      continue;
    }

    const keyUnknowns = keyBranch ? findUnknownFields(location, value[key], keyBranch, path) : [];
    const wildcardUnknowns = wildcardBranch
      ? findUnknownFields(location, value[key], wildcardBranch, path)
      : [];

    // If either branch contains only known fields, then don't mark the fields not covered by the
    // other branch to the list of unknown ones.
    // For example, `foo` is more comprehensive than `foo.*.bar`.
    if ((!keyBranch || keyUnknowns.length) && (!wildcardBranch || wildcardUnknowns.length)) {
      unknownFields.push(...keyUnknowns, ...wildcardUnknowns);
    }
  }

  return unknownFields;
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
