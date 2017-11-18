import { ErrorFormatter } from '../shared-typings';

export function withDefaults(options: WithDefaultsOptions) : object;

interface WithDefaultsOptions {
  formatter: ErrorFormatter
}
