import { Location } from '../check/location';
import { SanitizationChain } from './sanitize';

interface SanitizationChainBuilder {
  (fields: string | string[], message?: any): SanitizationChain;
}

export function buildSanitizeFunction(location: Location[]): SanitizationChainBuilder;
export const sanitize: SanitizationChainBuilder;
export const sanitizeBody: SanitizationChainBuilder;
export const sanitizeCookie: SanitizationChainBuilder;
export const sanitizeParam: SanitizationChainBuilder;
export const sanitizeQuery: SanitizationChainBuilder;