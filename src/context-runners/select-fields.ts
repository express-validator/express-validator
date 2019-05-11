import * as _ from 'lodash';
import { Request, Location } from '../base';
import { Context } from '../context';
import { ContextRunner, FieldInstance } from './context-runner';

export class SelectFields implements ContextRunner {
  run(req: Request, context: Context, _instances: FieldInstance[]) {
    return _(context.fields)
      .flatMap(field => _.flatMap(context.locations, location => {
        return this.expandField(req, field, location);
      }))
      .uniqWith<FieldInstance>(_.isEqual)
      .value();
  }

  private expandField(req: Request, field: string, location: Location): FieldInstance[] {
    const originalPath = field;
    const pathToExpand = location === 'headers' ? field.toLowerCase() : field;

    const paths: string[] = [];
    this.expandPath(req[location], pathToExpand, paths);

    return paths.map(path => {
      const value = path === '' ? req[location] : _.get(req[location], path);
      return {
        location,
        path,
        originalPath,
        value,
        originalValue: value
      };
    });
  }

  private expandPath(object: any, path: string | string[], accumulator: string[]) {
    const segments = _.toPath(path);
    const wildcardPos = segments.indexOf('*');

    if (wildcardPos > -1) {
      const subObject = wildcardPos === 0
        ? object
        : _.get(object, segments.slice(0, wildcardPos));

      if (!subObject || !_.isObjectLike(subObject)) {
        return;
      }

      Object.keys(subObject).map(key => segments
        // Before the *
        .slice(0, wildcardPos)
        // The part that the * matched
        .concat(key)
        // After the *
        .concat(segments.slice(wildcardPos + 1))
      ).forEach(subPath => {
        this.expandPath(object, subPath, accumulator);
      });
    } else {
      const reconstructedPath = segments.reduce((prev, segment) => {
        let part = '';
        if (/^\d+$/.test(segment)) {
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
      accumulator.push(reconstructedPath);
    }
  }
}