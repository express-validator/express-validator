export {
  // base
  Location,
  Meta,
  CustomValidator,
  DynamicMessageCreator,
  ValidationError,
  // chain
  ValidationChain,
  // middleware/validation-chain-builders
  check,
  body,
  cookie,
  header,
  param,
  query,
  buildCheckFunction,
  // middleware/schema
  checkSchema,
  Schema,
  ValidationSchema,
  ParamSchema,
  ValidationParamSchema,
  // middleware/one-of
  oneOf,
  OneOfCustomMessageBuilder,
  // validation-result
  validationResult,
  ErrorFormatter,
  Result,
  ResultFactory,
} from '../src';

console.warn(
  'express-validator: requires to express-validator/check are deprecated.' +
    'You should just use require("express-validator") instead.',
);
