import { Meta } from '../base';
import { Context } from '../context';

export interface UnknownContextItem {
  kind: 'unknown';
  run(context: Context, value: any, meta: Meta): Promise<void>;
}

export interface ValidationContextItem {
  kind: 'validation';
  message: any;
  run(context: Context, value: any, meta: Meta): Promise<void>;
}

export type ContextItem = UnknownContextItem | ValidationContextItem;
