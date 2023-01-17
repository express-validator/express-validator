import { ReadonlyContext } from './context';

export interface Request {
  [k: string]: any;
  body?: any;
  cookies?: Record<string, any>;
  headers?: Record<string, any>;
  params?: Record<string, any>;
  query?: Record<string, any>;
}

export type Middleware = (req: Request, res: any, next: (err?: any) => void) => void;

export type Location = 'body' | 'cookies' | 'headers' | 'params' | 'query';

/**
 * Metadata about a validated field.
 */
export type Meta = {
  /**
   * The express request from which the field was validated
   */
  req: Request;

  /**
   * Which of the request objects the field was picked from
   */
  location: Location;

  /**
   * The full path of the field within the request object.
   *
   * @example
   * const meta = { req, location: 'body', path: 'foo.bar' }; // req.body.foo.bar
   */
  path: string;
};

/**
 * A function which may
 * - return falsy values, a promise that rejects or throw to indicate that a field is invalid;
 * - return truthy values or a promise that resolves to indicate that a field is valid.
 *
 * @param input the field value
 * @param meta metadata about the field being validated
 */
export type CustomValidator = (input: any, meta: Meta) => any;
export type StandardValidator = (input: string, ...options: any[]) => boolean;

export type CustomSanitizer = (input: any, meta: Meta) => any;
export type StandardSanitizer = (input: string, ...options: any[]) => any;

export interface FieldInstance {
  path: string;
  originalPath: string;
  location: Location;
  value: any;
  originalValue: any;
}

export type FieldValidationError = {
  /**
   * Indicates that the error occurred because a field had an invalid value
   */
  type: 'field';

  /**
   * The location within the request where this field is
   */
  location: Location;

  /**
   * The path to the field which has a validation error
   */
  path: string;

  /**
   * The value of the field
   */
  value: any;

  /**
   * The error message
   */
  msg: any;
};

export type AlternativeValidationError = {
  /**
   * Indicates that the error occurred because all alternatives (e.g. in `oneOf()`) were invalid
   */
  type: 'alternative';

  /**
   * The error message
   */
  msg: any;

  /**
   * The list of underlying validation errors returned by validation chains in `oneOf()`
   */
  nestedErrors: FieldValidationError[];
};

/**
 * A validation error as reported by a middleware.
 * The properties available in the error object vary according to the type.
 *
 * @example
 *  if (error.type === 'alternative') {
 *    console.log(`There are ${error.nestedErrors.length} errors under this alternative list`);
 *  } else if (error.type === 'field') {
 *    console.log(`There's an error with field ${error.path) in the request ${error.location}`);
 *  }
 *
 */
export type ValidationError = AlternativeValidationError | FieldValidationError;

/**
 * A function which creates an error message based on a field's value.
 *
 * @param input the field value
 * @param meta metadata about the field that was validated
 */
export type FieldMessageFactory = (value: any, meta: Meta) => any;

/**
 * A function which creates an error message based on an alternative's nested errors.
 *
 * @see `oneOf()`
 * @param nestedErrors The errors from the invalid alternative(s).
 * @param opts
 */
export type AlternativeMessageFactory = (
  nestedErrors: FieldValidationError[],
  opts: { req: Request },
) => any;

// Not using Symbol because of #813
export const contextsKey = 'express-validator#contexts';

export interface InternalRequest extends Request {
  [contextsKey]?: ReadonlyContext[];
}

export class ValidationHalt extends Error {}
