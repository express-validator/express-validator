import * as express from 'express';
import { Location } from '../check/location';

export function matchedData(req: express.Request, options?: Partial<MatchedDataOptions>): Record<string, any>;

export interface MatchedDataOptions {
  includeOptionals: boolean;
  onlyValidData: boolean;
  locations: Location[];
}