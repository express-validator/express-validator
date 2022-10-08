import { Location } from '../base';
import { check as baseCheck } from './check';

/**
 * Creates a variant of `check()` that checks the given request locations.
 *
 * @example
 *  const checkBodyAndQuery = buildCheckFunction(['body', 'query']);
 */
export function buildCheckFunction(locations: Location[]) {
  return (fields?: string | string[], message?: any) => baseCheck(fields, locations, message);
}

/**
 * Creates a middleware/validation chain for one or more fields that may be located in
 * any of the following:
 *
 * - `req.body`
 * - `req.cookies`
 * - `req.headers`
 * - `req.params`
 * - `req.query`
 *
 * @param fields  a string or array of field names to validate/sanitize
 * @param message an error message to use when failed validations don't specify a custom message.
 *                Defaults to `Invalid Value`.
 */
export const check = buildCheckFunction(['body', 'cookies', 'headers', 'params', 'query']);

/**
 * Same as {@link check()}, but only validates `req.body`.
 */
export const body = buildCheckFunction(['body']);

/**
 * Same as {@link check()}, but only validates `req.cookies`.
 */
export const cookie = buildCheckFunction(['cookies']);

/**
 * Same as {@link check()}, but only validates `req.headers`.
 */
export const header = buildCheckFunction(['headers']);

/**
 * Same as {@link check()}, but only validates `req.params`.
 */
export const param = buildCheckFunction(['params']);

/**
 * Same as {@link check()}, but only validates `req.query`.
 */
export const query = buildCheckFunction(['query']);
