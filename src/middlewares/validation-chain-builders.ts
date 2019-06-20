import { Location } from '../base';
import { check as baseCheck } from './check';

export function buildCheckFunction(locations: Location[]) {
  return (fields?: string | string[], message?: any) => baseCheck(fields, locations, message);
}

export const check = buildCheckFunction(['body', 'cookies', 'headers', 'params', 'query']);
export const body = buildCheckFunction(['body']);
export const cookie = buildCheckFunction(['cookies']);
export const header = buildCheckFunction(['headers']);
export const param = buildCheckFunction(['params']);
export const query = buildCheckFunction(['query']);
