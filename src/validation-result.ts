import * as _ from 'lodash';
import { InternalRequest, Request, ValidationError, contextsKey } from './base';
import { bindAll } from './utils';

/**
 * Given a validation error, returns a new value that represents it.
 */
export type ErrorFormatter<T = any> = (error: ValidationError) => T;
type ToArrayOptions = {
  /**
   * Whether only the first error of each field should be returned.
   * @default false
   */
  onlyFirstError?: boolean;
};

// eslint-disable-next-line no-use-before-define
export type ResultFactory<T> = (req: Request) => Result<T>;

interface ResultFactoryBuilderOptions<T = any> {
  /**
   * The default error formatter of every {@link Result} instance returned by
   * the custom `validationResult()` function.
   */
  formatter: ErrorFormatter<T>;
}

/**
 * Extracts the validation errors of an express request
 */
export const validationResult = Object.assign(withDefaults<ValidationError>(), { withDefaults });

/**
 * The current state of the validation errors in a request.
 */
export class Result<T = any> {
  constructor(
    private formatter: ErrorFormatter<T>,
    private readonly errors: readonly ValidationError[],
  ) {}

  /**
   * Gets the validation errors as an array.
   *
   * @param options.onlyFirstError whether only the first error of each
   */
  array(options?: ToArrayOptions): T[] {
    return options && options.onlyFirstError
      ? Object.values(this.mapped())
      : this.errors.map(this.formatter);
  }

  /**
   * Gets the validation errors as an object.
   * If a field has more than one error, only the first one is set in the resulting object.
   *
   * @returns an object from field name to error
   */
  mapped(): Record<string, T> {
    return this.errors.reduce((mapping, error) => {
      if (!mapping[error.param]) {
        mapping[error.param] = this.formatter(error);
      }

      return mapping;
    }, {} as Record<string, T>);
  }

  /**
   * Specifies a function to format errors with.
   * @param formatter the function to use for formatting errors
   * @returns A new {@link Result} instance with the given formatter
   */
  formatWith<T2>(formatter: ErrorFormatter<T2>): Result<T2> {
    return new Result(formatter, this.errors);
  }

  /**
   * @returns `true` if there are no errors, `false` otherwise
   */
  isEmpty() {
    return this.errors.length === 0;
  }

  /**
   * Throws an error if there are validation errors.
   */
  throw() {
    if (!this.isEmpty()) {
      throw Object.assign(new Error(), bindAll(this));
    }
  }
}

/**
 * Creates a `validationResult`-like function with default options passed to every {@link Result} it
 * returns.
 */
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
