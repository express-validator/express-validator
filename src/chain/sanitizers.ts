import * as validator from "validator";
import { CustomSanitizer } from "../base";

export interface Sanitizers<Return> {
  customSanitizer(sanitizer: CustomSanitizer): Return;

  blacklist(chars: string): Return;
  escape(): Return;
  unescape(): Return;
  ltrim(chars?: string): Return;
  normalizeEmail(options?: validator.Options.NormalizeEmailOptions): Return;
  rtrim(chars?: string): Return;
  stripLow(keep_new_lines?: boolean): Return;
  toBoolean(strict?: boolean): Return;
  toDate(): Return;
  toFloat(): Return;
  toInt(radix?: number): Return;
  trim(chars?: string): Return;
  whitelist(chars: string): Return;
}