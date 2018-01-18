import * as express from 'express';
import { ValidationChain } from './check';

type ValidationChains = (ValidationChain | ValidationChain[])[];

export function oneOf(chains: ValidationChains, message?: any): express.RequestHandler;