import * as validator from '../lib/express_validator'
import * as express from 'express'
const app = express();


app.use(validator({
  customValidators: { isAwesomeLib: (value: any, param: any) => value == param },
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


  req.check('param', 'message')
    .isEmail().isEmail({ allow_display_name: true, allow_utf8_local_part: true, require_tld: true })
    .isURL({
      protocols: ['http', 'https', 'ftp'],
      require_tld: true,
      require_protocol: true,
      require_host: true,
      require_valid_protocol: true,
      allow_underscores: true,
      host_whitelist: ['', / /i],
      host_blacklist: ['', / /i],
      allow_trailing_dot: true,
      allow_protocol_relative_urls: true,
    })
    .isMACAddress()
    .isIP().isIP(4).isIP(6)
    .isFQDN()
    .isFQDN({ require_tld: true, allow_underscores: true, allow_trailing_dot: true })
    .isBoolean()
    .isAlpha().isAlpha('ar-DZ')
    .isAlphanumeric().isAlphanumeric('ar-DZ')
    .isNumeric()
    .isLowercase()
    .isUppercase()
    .isAscii()
    .isFullWidth()
    .isHalfWidth()
    .isVariableWidth()
    .isMultibyte()
    .isSurrogatePair()
    .isInt().isInt({ min: 0, max: 0, lt: 0, gt: 0, allow_leading_zeroes: true })
    .isFloat().isFloat({ min: 0, max: 0, lt: 0, gt: 0 })
    .isDecimal()
    .isHexadecimal()
    .isDivisibleBy(0)
    .isHexColor()
    .isMD5()
    .isJSON()
    .isEmpty()
    .isLength({ min: 0, max: 0 })
    .isByteLength({ min: 0, max: 0 })
    .isUUID().isUUID('all').isUUID(3).isUUID(4).isUUID(5)
    .isMongoId()
    .isDate()
    .isAfter().isAfter(new Date())
    .isBefore().isBefore(new Date())
    .isIn([''])
    .isCreditCard()
    .isISIN()
    .isISBN().isISBN(0)
    .isISSN({ case_sensitive: true, require_hyphen: true })
    .isMobilePhone('en-US')
    .isCurrency({
      symbol: '',
      require_symbol: true,
      allow_space_after_symbol: true,
      symbol_after_digits: true,
      allow_negatives: true,
      parens_for_negatives: true,
      negative_sign_before_digits: true,
      negative_sign_after_digits: true,
      allow_negative_sign_placeholder: true,
      thousands_separator: '',
      decimal_separator: '',
      allow_space_after_digits: true
    })
    .isISO8601()
    .isBase64()
    .isDataURI()
    .isWhitelisted('')
    .isWhitelisted([''])
    .equals(true).equals(0).equals('').equals({}).contains('')
    .matches('').matches('', '').matches(/ /, '')
    .notEmpty()
    .len({ min: 0, max: 0 })
    .optional().optional({ checkFalsy: true })
    .withMessage('message');



  // getting result

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
