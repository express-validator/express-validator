import { CustomMessageBuilder, ValidationChain } from './check';
import { Location } from "./location";

interface ValidationChainBuilder {
  (fields: string | string[], message?: CustomMessageBuilder): ValidationChain;
  (fields: string | string[], message?: any): ValidationChain;
}

export function buildCheckFunction(location: Location[]): ValidationChainBuilder;
export const check: ValidationChainBuilder;
export const body: ValidationChainBuilder;
export const cookie: ValidationChainBuilder;
export const header: ValidationChainBuilder;
export const param: ValidationChainBuilder;
export const query: ValidationChainBuilder;