export {
  // base
  Location,
  Meta,
  CustomSanitizer,
  // chain
  SanitizationChain,
  // middleware/sanitization-chain-builders
  sanitize,
  sanitizeBody,
  sanitizeCookie,
  sanitizeParam,
  sanitizeQuery,
  buildSanitizeFunction,
  // matched-data
  matchedData,
  MatchedDataOptions,
} from '../src';

console.warn(
  'express-validator: requires to express-validator/filter are deprecated.' +
    'You should just use require("express-validator") instead.',
);
