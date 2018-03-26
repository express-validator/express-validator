import { ValidationChain } from './check';
import { checkSchema, ValidationSchema, ValidationParamSchema } from './schema';

const fooSchema: ValidationParamSchema = {
  in: 'body',
  isAlpha: true,
  isIn: {
    errorMessage: 'foo',
    options: [['foo', 'bar']]
  },
  toInt: true,
  toBoolean: {
    options: true // Strict mode
  },
  custom: {
    options: (value, { req, location, path }) => {
      return value + req.body.foo + location + path;
    }
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      let sanitizedValue;

      if (req.body.foo && location && path) {
        sanitizedValue = parseInt(value);
      } else {
        sanitizedValue = 0;
      }

      return sanitizedValue;
    }
  },
  exists: true
};

const barSchema: ValidationParamSchema = {
  in: ['body', 'params'],
  errorMessage: 'foo'
};

const schema: ValidationSchema = { fooSchema, barSchema };
const chains: ValidationChain[] = checkSchema(schema);