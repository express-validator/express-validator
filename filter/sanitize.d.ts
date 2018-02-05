import * as express from 'express';

export interface Sanitizer {
  blacklist(chars: string): this;
  customSanitizer(sanitizer: CustomSanitizer): this;
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

export interface SanitizationChain extends express.RequestHandler, Sanitizer {}

export interface CustomSanitizer {
  (value: string, options: { req: express.Request, location: string, path: string }): any;
}

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