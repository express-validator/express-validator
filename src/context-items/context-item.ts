import { Meta } from '../base';

export interface UnknownContextItem {
  kind: 'unknown';
  run(value: any, meta: Meta): Promise<void>;
}

export interface ValidationContextItem {
  kind: 'validation';
  message: any;
  run(value: any, meta: Meta): Promise<void>;
}

export type ContextItem = UnknownContextItem | ValidationContextItem;
