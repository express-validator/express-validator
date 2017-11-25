import * as express from 'express';
import { Result, ErrorFormatter } from '../shared-typings';

export const validationResult: validationResult;

export interface validationResult {
  (req: express.Request): Result;
  withDefaults(options: WithDefaultsOptions) : this;
}

interface WithDefaultsOptions {
  formatter: ErrorFormatter;
}

export default validationResult;
