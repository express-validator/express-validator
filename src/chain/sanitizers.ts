import { CustomSanitizer } from '../base';
import * as Options from '../options';

export interface Sanitizers<Return> {
  customSanitizer(sanitizer: CustomSanitizer): Return;

  blacklist(chars: string): Return;
  default(default_value: any): Return;
  escape(): Return;
  unescape(): Return;
  ltrim(chars?: string): Return;
  normalizeEmail(options?: Options.NormalizeEmailOptions): Return;
  rtrim(chars?: string): Return;
  replace(new_value: any, values_to_replace?: any[]): Return;
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
