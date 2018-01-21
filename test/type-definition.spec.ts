import * as validator from '..'
import * as express from 'express'
import { sanitizeQuery } from '../filter/index';
const app = express();

// customValidators defined right below
declare module '..' {
  export interface Validator {
    isAwesomeLib(): Validator;
    isAsync(): Validator;
  }

  export interface Sanitizer {
    toAwesome(): any;
  }
}

app.use(validator({
  customValidators: {
    isAwesomeLib: (value: any, param: any) => value == param,
    isAsync: () => Promise.resolve(true)
  },
  customSanitizers: { toAwesome: (lib: any) => [lib] },
  errorFormatter: (param: string, msg: string, value: any, location: any) => ({ param, msg, value, location })
}));

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Content-Type', 'application/json');


  // SANITIZERS

  req.sanitizeCookies('param');
  req.sanitizeHeaders('param');
  req.sanitizeParams('param');
  req.sanitizeQuery('param');
  req.sanitizeBody('param');
  req.sanitize('param');

  // Legacy API-specific testing
  let sanitizationChain: validator.Sanitizer = req.filter('param');
  sanitizationChain.toAwesome();

  // VALIDATIONS

  const schema: ExpressValidator.ValidationSchema = {
    param: {
      in: 'headers',
      errorMessage: 'msg',
      contains: { errorMessage: { msg: 'message' }, options: [] },
      isAwesomeLib: { errorMessage: 'message', options: [] }
    }
  };

  req.assert('param').isEmail({ require_tld: true });
  req.assert('param', 'message');
  req.assert('param.child', { msg: 'message' }).optional();
  req.assert(schema);

  req.validate('param');
  req.validate('param', 'message');
  req.validate('param.child', { msg: 'message' }).optional();
  req.validate(schema);

  req.check('param').isEmail({ require_tld: true });
  req.check('param', 'message');
  req.check('param.child', { msg: 'message' });
  req.check(['param', 'child'], 'message').optional();
  req.check(schema);


  req.checkBody('param').isEmail({ require_tld: true });
  req.checkBody('param', 'message');
  req.checkBody('param.child', { msg: 'message' });
  req.checkBody(['param', 'child'], 'message').optional();
  req.checkBody(schema);


  req.checkCookies('param').isEmail({ require_tld: true });
  req.checkCookies('param', 'message');
  req.checkCookies('param.child', { msg: 'message' });
  req.checkCookies(['param', 'child'], 'message').optional();
  req.checkCookies(schema);


  req.checkHeaders('param').isEmail({ require_tld: true });
  req.checkHeaders('param', 'message');
  req.checkHeaders('param.child', { msg: 'message' });
  req.checkHeaders(['param', 'child'], 'message').optional();
  req.checkHeaders(schema);


  req.checkParams('param').isEmail({ require_tld: true });
  req.checkParams('param', 'message');
  req.checkParams('param.child', { msg: 'message' });
  req.checkParams(['param', 'child'], 'message').optional();
  req.checkParams(schema);


  req.checkQuery('param').isEmail({ require_tld: true });
  req.checkQuery('param', 'message');
  req.checkQuery('param.child', { msg: 'message' });
  req.checkQuery(['param', 'child'], 'message').optional();
  req.checkQuery(schema);


  // Legacy API-specific testing
  let validationChain: validator.Validator = req.check('param', 'message');
  validationChain = validationChain
    .len({ min: 1, max: 2 })
    .notEmpty()
    .isAwesomeLib()
    .isAsync();

  // getting result

  req.getValidationResult()
    .then(result => {
      result.formatWith(error => {
        error.msg;
        error.location;
        error.param;
        error.value;
      });

      result.isEmpty() ? next() : result.throw()
    })

    .catch(result =>
      next({
        mapped: result.mapped(),
        array: result.array(),
        first_only: {
          mapped: result.mapped(),
          array: result.array()
        }
      }));


  // deprecated but still available

  req.asyncValidationErrors()
    .then(() => next())
    .catch(errors => next(errors));

  let errors: any;
  errors = req.validationErrors();
  errors = req.validationErrors(true);
  if (errors)
    return next(errors)

});
