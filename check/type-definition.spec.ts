import { Request, Response } from 'express';
import {
  check,
  body,
  header,
  query,
  cookie,
  param,
  oneOf,
  validationResult
} from './'

const req: Request = <Request>{};
const res: Response = <Response>{};

// Test results
const result = validationResult(req);
result.isEmpty();
result.formatWith(error => {
  error.msg;
  error.location;
  error.param;
  error.value;
});

const resultWithDefaults: validationResult = validationResult.withDefaults({
  formatter: error => {
    error.msg;
    error.location;
    error.param;
    error.value;
  }
});
resultWithDefaults(req);

const arrayErrors = result.array();
arrayErrors[0].location;
arrayErrors[0].msg;
arrayErrors[0].param;
arrayErrors[0].value;

result.array({ onlyFirstError: true });

const mappedErrors = result.mapped();
mappedErrors.foo.location;
mappedErrors.foo.msg;
mappedErrors.foo.param;
mappedErrors.foo.value;

// Test as middleware
body('foo');
param('foo');
query('foo');
cookie('foo');
header('foo');
check('foo')(req, res, () => {});

oneOf([
  check('foo').isInt(),
  [ check('bar').isDecimal(), check('baz').isHexColor() ]
])(req, res, () => {});

oneOf([ check('foo').isInt(), check('bar').isDecimal() ], 'some message');

// Test validation chain methods
check('foo', 'with error message')
  .custom((value, { req, location, path }) => {
    throw new Error([value, req.body.foo, location, path].join(' '));
  })
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
  .isHash('md5')
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
  .isLatLong()
  .isPostalCode('US')
  .isEmpty()
  .isLength({ min: 0, max: 0 })
  .isByteLength({ min: 0, max: 0 })
  .isUUID().isUUID('all').isUUID(3).isUUID(4).isUUID(5)
  .isMongoId()
  .isISRC()
  .isAfter().isAfter(new Date().toString())
  .isBefore().isBefore(new Date().toString())
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
  .not()
  .exists()
  .equals(true).equals(0).equals('').equals({}).contains('')
  .matches('').matches('', '').matches(/ /, '')
  .optional().optional({ checkFalsy: true }).optional({ nullable: true })
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
  })
  .withMessage(new Error('message'))
  .withMessage(2)
  .withMessage('message');