import * as express from 'express';
import { Sanitizer, Location } from '../shared-typings';

export function matchedData (req: express.Request, options?: MatchedDataOptions): { [key: string]: any };
export const sanitize: SanitizationChainBuilder;
export const sanitizeBody: SanitizationChainBuilder;
export const sanitizeCookie: SanitizationChainBuilder;
export const sanitizeParam: SanitizationChainBuilder;
export const sanitizeQuery: SanitizationChainBuilder;

interface MatchedDataOptions {
  onlyValidData?: boolean
  locations?: Location[]
}

export interface SanitizationChainBuilder {
  (field: string | string[]): SanitizationChain;
}

export interface SanitizationChain extends express.RequestHandler, Sanitizer {}