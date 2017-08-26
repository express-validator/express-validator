import * as express from 'express';

export function matchedData (req: express.Request, options?: MatchedDataOptions): { [key: string]: any };

interface MatchedDataOptions {
  onlyValidData: boolean
}