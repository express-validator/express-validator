import { ReadonlyContext } from './context';

export type Location = 'body' | 'cookies' | 'headers' | 'params' | 'query';
export type Meta = { req: Request; location: Location; path: string };

export type CustomValidator = (input: any, meta: Meta) => any;
export type StandardValidator = (input: string, ...options: any[]) => boolean;

export type CustomSanitizer = (input: any, meta: Meta) => any;
export type StandardSanitizer = (input: string, ...options: any[]) => any;

export type DynamicMessageCreator = (value: any, meta: Meta) => any;

export interface FieldInstance {
  path: string;
  originalPath: string;
  location: Location;
  value: any;
  originalValue: any;
}

export type ValidationError =
  | {
      param: '_error';
      msg: any;
      nestedErrors: ValidationError[];
      // These are optional so places don't need to define them, but can reference them
      location?: undefined;
      value?: undefined;
    }
  | {
      location: Location;
      param: string;
      value: any;
      msg: any;
      // This is optional so places don't need to define it, but can reference it
      nestedErrors?: unknown[];
    };

export interface Request {
  [k: string]: any;
  body?: any;
  cookies?: Record<string, any>;
  headers?: Record<string, any>;
  params?: Record<string, any>;
  query?: Record<string, any>;
}

export const contextsKey = 'express-validator#contexts';

export interface InternalRequest extends Request {
  [contextsKey]?: ReadonlyContext[];
}

export type Middleware = (req: Request, res: any, next: (err?: any) => void) => void;

export class ValidationHalt extends Error {}
