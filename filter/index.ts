export {
  Location,
  Meta,
  CustomSanitizer,
  SanitizationChain,
  sanitize,
  sanitizeBody,
  sanitizeCookie,
  sanitizeParam,
  sanitizeQuery,
  buildSanitizeFunction,
  matchedData,
  MatchedDataOptions,
} from '../src';

console.warn(
  'express-validator: requires to express-validator/filter are deprecated.' +
    'You should just use require("express-validator") instead.',
);
