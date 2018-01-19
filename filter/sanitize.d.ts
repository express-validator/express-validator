import * as express from 'express';

interface Sanitizer {
  blacklist(chars: string): this;
  escape(): this;
  ltrim(chars?: string): this;
  normalizeEmail(options?: Options.NormalizeEmailOptions): this;
  rtrim(chars?: string): this;
  stripLow(keep_new_lines?: boolean): this;
  toBoolean(strict?: boolean): this;
  toDate(): this;
  toFloat(): this;
  toInt(radix?: number): this;
  trim(chars?: string): this;
  unescape(): this;
  whitelist(chars: string): this;
}

interface SanitizationChain extends express.RequestHandler, Sanitizer {}

declare namespace Options {
  interface NormalizeEmailOptions {
    all_lowercase?: boolean
    gmail_lowercase?: boolean
    gmail_remove_dots?: boolean
    gmail_remove_subaddress?: boolean
    gmail_convert_googlemaildotcom?: boolean
    outlookdotcom_lowercase?: boolean
    outlookdotcom_remove_subaddress?: boolean
    yahoo_lowercase?: boolean
    yahoo_remove_subaddress?: boolean
    icloud_lowercase?: boolean
    icloud_remove_subaddress?: boolean
  }
}