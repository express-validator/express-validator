import * as validator from '../lib/express_validator'
import * as express from 'express'
const app = express();


app.use(validator({
  customValidators: { isAwesomeLib: (value: any) => isNaN(value) ? true : true },
  customSanitizers: { toAwesome: (lib: any) => [lib] },
  errorFormatter: (param: string, msg: string, value: any) => ({ param, msg, value })
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
  req.filter('param')
    .toDate()
    .toFloat()
    .toInt().toInt(10)
    .toBoolean().toBoolean(true)
    .trim('')
    .ltrim('').rtrim('')
    .stripLow().stripLow(true)
    .escape().unescape()
    .blacklist('').whitelist('')
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


  // VALIDATIONS

  const schema: ExpressValidator.ValidationSchema = {
    param: {
      in: 'headers',
      contains: { errorMessage: 'message', options: [] },
      isAwesomeLib: { errorMessage: 'message', options: [] }
    }
  };

  req.assert('param').isEmail({ require_tld: true });
  req.assert('param', 'message');
  req.assert('param.child', 'message').optional();
  req.assert(schema);

  req.validate('param');
  req.validate('param', 'message');
  req.validate('param.child', 'message').optional();
  req.validate(schema);

  req.check('param').isEmail({ require_tld: true });
  req.check('param', 'message');
  req.check('param.child', 'message');
  req.check(['param', 'child'], 'message').optional();
  req.check(schema);


  req.checkBody('param').isEmail({ require_tld: true });
  req.checkBody('param', 'message');
  req.checkBody('param.child', 'message');
  req.checkBody(['param', 'child'], 'message').optional();
  req.checkBody(schema);


  req.checkCookies('param').isEmail({ require_tld: true });
  req.checkCookies('param', 'message');
  req.checkCookies('param.child', 'message');
  req.checkCookies(['param', 'child'], 'message').optional();
  req.checkCookies(schema);


  req.checkHeaders('param').isEmail({ require_tld: true });
  req.checkHeaders('param', 'message');
  req.checkHeaders('param.child', 'message');
  req.checkHeaders(['param', 'child'], 'message').optional();
  req.checkHeaders(schema);


  req.checkParams('param').isEmail({ require_tld: true });
  req.checkParams('param', 'message');
  req.checkParams('param.child', 'message');
  req.checkParams(['param', 'child'], 'message').optional();
  req.checkParams(schema);


  req.checkQuery('param').isEmail({ require_tld: true });
  req.checkQuery('param', 'message');
  req.checkQuery('param.child', 'message');
  req.checkQuery(['param', 'child'], 'message').optional();
  req.checkQuery(schema);


  // TODO chain all validators


  req.getValidationResult()

    .then(result => result.isEmpty() ? next() : result.throw())

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
