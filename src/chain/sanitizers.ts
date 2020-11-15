import { CustomSanitizer } from '../base';
import * as Options from '../options';

export interface Sanitizers<Return> {
  // custom sanitizers
  customSanitizer(sanitizer: CustomSanitizer): Return;
  default(default_value: any): Return;
  replace(values_to_replace: any, new_value: any): Return;

  // validator's sanitizers
  blacklist(chars: string): Return;
  escape(): Return;
  unescape(): Return;
  ltrim(chars?: string): Return;
  normalizeEmail(options?: Options.NormalizeEmailOptions): Return;
  rtrim(chars?: string): Return;
  stripLow(keep_new_lines?: boolean): Return;
  toArray(): Return;
  toBoolean(strict?: boolean): Return;
  toDate(): Return;
  toFloat(): Return;
  toInt(radix?: number): Return;
  toLowerCase(): Return;
  toUpperCase(): Return;
  trim(chars?: string): Return;
  whitelist(chars: string): Return;
}
