export type Request = any;
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