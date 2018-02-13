import { ValidationChain } from './check';
import { checkSchema, ValidationSchema, ValidationParamSchema } from './schema';

const fooSchema: ValidationParamSchema = {
  in: 'body',
  isAlpha: true,
  isIn: {
    errorMessage: 'foo',
    options: [['foo', 'bar']]
  },
  custom: {
    options: (value, { req, location, path }) => {
      return value + req.body.foo + location + path;
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