import * as express from 'express';
import { Validator } from '../shared-typings';

export interface ValidationChain extends express.RequestHandler, Validator {
  custom(validator: CustomValidator): this;
}

export interface CustomValidator {
  (value: any, options: { req: express.Request, location: string, path: string }): any;
}