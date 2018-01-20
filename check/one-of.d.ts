import * as express from 'express';
import { ValidationChain } from './check';
import { Location } from './location';

type ValidationChains = (ValidationChain | ValidationChain[])[];

export function oneOf(chains: ValidationChains, message?: OneOfCustomMessageBuilder): express.RequestHandler;
export function oneOf(chains: ValidationChains, message?: any): express.RequestHandler;

export interface OneOfCustomMessageBuilder {
  (options: { req: express.Request }): any;
}