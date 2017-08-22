import {
  check,
  checkBody,
  checkHeaders,
  checkQuery,
  checkCookies,
  checkParams
} from './'

// Test as middleware
check('foo')(null, null, () => {});

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
  .equals(true).equals(0).equals('').equals({}).contains('')
  .matches('').matches('', '').matches(/ /, '')
  .optional().optional({ checkFalsy: true })
  .withMessage('message');