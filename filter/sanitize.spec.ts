import { sanitize } from './sanitization-chain-builders';

sanitize(['foo', 'bar'])
  .customSanitizer((value: string, { req, location, path }) => {
    return value + req.body.foo + location + path;
  })
  .blacklist('a')
  .escape()
  .ltrim()
  .ltrim('abc')
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
  })
  .rtrim()
  .rtrim('abc')
  .stripLow()
  .stripLow(true)
  .trim()
  .trim('abc')
  .toInt()
  .toInt(10)
  .toFloat()
  .toDate()
  .unescape()
  .whitelist('z');