import * as validator from 'validator';
import { CustomSanitizer, StandardSanitizer } from '../base';
import { Context } from '../context';
import { Sanitizers } from './sanitizers';
import { Sanitization } from '../context-items/sanitization';

export class SanitizersImpl<Chain> implements Sanitizers<Chain> {
  constructor(private readonly context: Context, private readonly chain: Chain) {}

  customSanitizer(sanitizer: CustomSanitizer) {
    this.context.addItem(new Sanitization(this.context, sanitizer, true));
    return this.chain;
  }

  // Standard sanitizers
  private addStandardSanitization(sanitizer: StandardSanitizer, ...options: any[]) {
    this.context.addItem(new Sanitization(this.context, sanitizer, false, options));
    return this.chain;
  }

  blacklist(chars: string) {
    return this.addStandardSanitization(validator.blacklist, chars);
  }
  escape() {
    return this.addStandardSanitization(validator.escape);
  }
  unescape() {
    return this.addStandardSanitization(validator.unescape);
  }
  ltrim(chars?: string) {
    return this.addStandardSanitization(validator.ltrim, chars);
  }
  normalizeEmail(options?: validator.Options.NormalizeEmailOptions) {
    return this.addStandardSanitization(validator.normalizeEmail, options);
  }
  rtrim(chars?: string) {
    return this.addStandardSanitization(validator.rtrim, chars);
  }
  stripLow(keep_new_lines?: boolean) {
    return this.addStandardSanitization(validator.stripLow, keep_new_lines);
  }
  toBoolean(strict?: boolean) {
    return this.addStandardSanitization(validator.toBoolean, strict);
  }
  toDate() {
    return this.addStandardSanitization(validator.toDate);
  }
  toFloat() {
    return this.addStandardSanitization(validator.toFloat);
  }
  toInt(radix?: number) {
    return this.addStandardSanitization(validator.toInt, radix);
  }
  trim(chars?: string) {
    return this.addStandardSanitization(validator.trim, chars);
  }
  whitelist(chars: string) {
    return this.addStandardSanitization(validator.whitelist, chars);
  }
}
