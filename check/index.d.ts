import * as express from 'express';
import { Result, Options, Validator } from '../shared-typings';

export const check: ValidationChainBuilder;
export const checkBody: ValidationChainBuilder;
export const checkCookies: ValidationChainBuilder;
export const checkHeaders: ValidationChainBuilder;
export const checkParams: ValidationChainBuilder;
export const checkQuery: ValidationChainBuilder;
export function validationResult (req: express.Request): Result;

export interface ValidationChainBuilder {
  (field: string | string[], message?: string): ValidationChain;
}

export interface ValidationChain extends express.RequestHandler, Validator {
  custom(validator: CustomValidator): this;
}

export interface CustomValidator {
  (value: any, options: { req: express.Request, location: string, path: string }): any;
}