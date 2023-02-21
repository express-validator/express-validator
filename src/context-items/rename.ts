import * as _ from 'lodash';
import { Meta } from '../base';
import { Context } from '../context';
import { ContextItem } from './context-item';

export class Rename implements ContextItem {
  constructor(readonly newPath: string) {}

  async run(context: Context, value: any, meta: Meta) {
    const { req, location, path } = meta;

    if (path !== this.newPath) {
      if (context.fields.length !== 1) {
        throw new Error('Cannot rename multiple fields.');
      }

      if (this.newPath.includes('*')) {
        throw new Error('Cannot use rename() with wildcards.');
      }

      if (_.get(req[location], this.newPath) !== undefined) {
        throw new Error(`Cannot rename to req.${location}.${path} as it already exists.`);
      }

      _.set(req[location], this.newPath, value);
      _.unset(req[location], path);
    }
    return Promise.resolve();
  }
}
