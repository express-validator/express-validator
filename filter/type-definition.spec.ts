import { Request, Response } from 'express';
import {
  matchedData,
  sanitize,
  sanitizeBody,
  sanitizeCookie,
  sanitizeParam,
  sanitizeQuery
} from './';

const req: Request = <Request>{};
const res: Response = <Response>{};

matchedData(req).foo;
matchedData(req, { onlyValidData: true }).bar;
matchedData(req, { locations: ['body', 'params'] }).bar;

// Sanitization
sanitize('foo')(req, res, () => {});
sanitizeBody('foo')(req, res, () => {});
sanitizeCookie('foo')(req, res, () => {});
sanitizeParam('foo')(req, res, () => {});
sanitizeQuery('foo')(req, res, () => {});

sanitize(['foo', 'bar'])
  .trim()
  .trim('abc')
  .ltrim()
  .ltrim('abc')
  .rtrim()
  .rtrim('abc')
  .blacklist('a')
  .whitelist('z')
  .escape()
  .unescape()
  .toInt()
  .toInt(10)
  .toFloat()
  .toDate()
  .stripLow()
  .stripLow(true)
  .normalizeEmail()
  .normalizeEmail({
    all_lowercase: true,
    gmail_lowercase: true,
    gmail_remove_dots: true,
    gmail_remove_subaddress: true,
    gmail_convert_googlemaildotcom: true,
    outlookdotcom_lowercase: true,
    outlookdotcom_remove_subaddress: true,
    yahoo_lowercase: true,
    yahoo_remove_subaddress: true,
    icloud_lowercase: true,
    icloud_remove_subaddress: true
  });