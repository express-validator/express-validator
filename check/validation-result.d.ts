import * as express from 'express';
import { Location } from './location';

export type ErrorFormatter<T = any> = (error: {
  location: Location,
  param: string,
  msg: any,
  value: any
}) => T;

export interface Result<T = any> {
  array(options?: { onlyFirstError?: boolean }): T[];
  formatWith(formatter: ErrorFormatter<T>): this;
  isEmpty(): boolean;
  mapped(): Record<string, T>;
  throw(): void;
}

export const validationResult: ResultFactory;

export interface ResultFactory {
  <T>(req: express.Request): Result<T>;
  withDefaults(options?: Partial<ResultFactoryBuilderOptions>) : this;
}

interface ResultFactoryBuilderOptions {
  formatter: ErrorFormatter;
}
