import * as _ from 'lodash';
import { InternalRequest, Request, ValidationError, contextsKey } from './base';
import { bindAll } from './utils';

export type ErrorFormatter<T = any> = (error: ValidationError) => T;
export type ResultFactory<T> = (req: Request) => Result<T>;

interface ResultFactoryBuilderOptions<T = any> {
  formatter: ErrorFormatter<T>;
}

// Assign to a variable so that TS doesn't use its catch all overload, which returns any
const withWithDefaults = { withDefaults };
export const validationResult = Object.assign(withDefaults<ValidationError>(), withWithDefaults);

export class Result<T = any> {
  constructor(
    private formatter: ErrorFormatter<T>,
    private readonly errors: readonly ValidationError[],
  ) {}

  array(options?: { onlyFirstError?: boolean }): T[] {
    return options && options.onlyFirstError
      ? Object.values(this.mapped())
      : this.errors.map(this.formatter);
  }

  mapped(): Record<string, T> {
    return this.errors.reduce((mapping, error) => {
      if (!mapping[error.param]) {
        mapping[error.param] = this.formatter(error);
      }

      return mapping;
    }, {} as Record<string, T>);
  }

  formatWith<T2>(formatter: ErrorFormatter<T2>): Result<T2> {
    return new Result(formatter, this.errors);
  }

  isEmpty() {
    return this.errors.length === 0;
  }

  throw() {
    if (!this.isEmpty()) {
      throw Object.assign(new Error(), bindAll(this));
    }
  }
}

function withDefaults<T = any>(
  options: Partial<ResultFactoryBuilderOptions<T>> = {},
): ResultFactory<T> {
  const defaults: ResultFactoryBuilderOptions<ValidationError> = {
    formatter: error => error,
  };
  const actualOptions = _.defaults(options, defaults);

  return (req: InternalRequest) => {
    const contexts = req[contextsKey] || [];
    const errors = _.flatMap(contexts, 'errors');
    return new Result(actualOptions.formatter, errors);
  };
}
