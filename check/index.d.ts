import * as express from 'express';
import { Validator } from '../shared-typings';

export type ValidationChains = ValidationChain | ValidationChain[];

export const check: ValidationChainBuilder;
export const body: ValidationChainBuilder;
export const cookie: ValidationChainBuilder;
export const header: ValidationChainBuilder;
export const param: ValidationChainBuilder;
export const query: ValidationChainBuilder;
export { default as validationResult } from './validation-result';
export function oneOf (chains: ValidationChains[], message?: string): express.RequestHandler;

export interface ValidationChainBuilder {
  (field: string | string[], message?: string): ValidationChain;
}

export interface ValidationChain extends express.RequestHandler, Validator {
  custom(validator: CustomValidator): this;
}

export interface CustomValidator {
  (value: any, options: { req: express.Request, location: string, path: string }): any;
}