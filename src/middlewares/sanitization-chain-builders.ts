import { Location } from '../base';
import { sanitize as baseSanitize } from './sanitize';

export function buildSanitizeFunction(locations: Location[]) {
  return (fields?: string | string[]) => baseSanitize(fields, locations);
}

export const sanitize = buildSanitizeFunction(['body', 'cookies', 'params', 'query']);
export const sanitizeBody = buildSanitizeFunction(['body']);
export const sanitizeCookie = buildSanitizeFunction(['cookies']);
export const sanitizeParam = buildSanitizeFunction(['params']);
export const sanitizeQuery = buildSanitizeFunction(['query']);
