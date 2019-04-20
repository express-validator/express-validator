export type Location = 'body' | 'cookies' | 'headers' | 'params' | 'query';
export type Meta = { req: Request, location: Location, path: string };

export type CustomValidator = (input: any, meta: Meta) => any;
export type StandardValidator = (input: string, ...options: any[]) => boolean;

export type CustomSanitizer = (input: any, meta: Meta) => any;
export type StandardSanitizer = (input: string, ...options: any[]) => any;

export type DynamicMessageCreator = (value: any, meta: Meta) => any;

export interface ValidationError {
  location: Location;
  param: string;
  value: any;
  msg: any;
}

export interface Request {
  body?: any;
  cookies?: Record<string, any>;
  headers?: Record<string, any>;
  params?: Record<string, any>;
  query?: Record<string, any>;
}

export interface InternalRequest extends Request {
  _validationErrors?: ValidationError[];
}