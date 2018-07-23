import { ValidationChain, ValidatorOptions, CustomValidator } from './check';
import { Location } from './location';
import { CustomSanitizer } from '../filter/sanitize';

export function checkSchema(schema: ValidationSchema): ValidationChain[];

type ValidationSchema = Record<string, ValidationParamSchema>;

type ValidatorSchemaOptions<T = any> = true | {
  options?: T | T[];
  errorMessage?: any;
  negated?: boolean;
};

type SanitizerSchemaOptions<T = any> = true | {
  options?: T | T[];
};

interface ValidationParamSchema extends ValidatorsSchema, SanitizersSchema {
  in: Location | Location[],
  errorMessage?: any

  custom?: ValidatorSchemaOptions<CustomValidator>;
  exists?: ValidatorSchemaOptions<ValidatorOptions.ExistsOptions>;
  optional?: boolean | ValidatorOptions.OptionalOptions;

  customSanitizer?: SanitizerSchemaOptions<CustomSanitizer>;
}

interface ValidatorsSchema {
  contains?: ValidatorSchemaOptions;
  equals?: ValidatorSchemaOptions;
  isAfter?: ValidatorSchemaOptions;
  isAlpha?: ValidatorSchemaOptions;
  isAlphanumeric?: ValidatorSchemaOptions;
  isArray?: ValidatorSchemaOptions;
  isAscii?: ValidatorSchemaOptions;
  isBase64?: ValidatorSchemaOptions;
  isBefore?: ValidatorSchemaOptions;
  isBoolean?: ValidatorSchemaOptions;
  isByteLength?: ValidatorSchemaOptions;
  isCreditCard?: ValidatorSchemaOptions;
  isCurrency?: ValidatorSchemaOptions;
  isDataURI?: ValidatorSchemaOptions;
  isDecimal?: ValidatorSchemaOptions;
  isDivisibleBy?: ValidatorSchemaOptions;
  isEmail?: ValidatorSchemaOptions;
  isEmpty?: ValidatorSchemaOptions;
  isFloat?: ValidatorSchemaOptions;
  isFQDN?: ValidatorSchemaOptions;
  isFullWidth?: ValidatorSchemaOptions;
  isHalfWidth?: ValidatorSchemaOptions;
  isHash?: ValidatorSchemaOptions;
  isHexadecimal?: ValidatorSchemaOptions;
  isHexColor?: ValidatorSchemaOptions;
  isIn?: ValidatorSchemaOptions;
  isInt?: ValidatorSchemaOptions;
  isIP?: ValidatorSchemaOptions;
  isIPRange?: ValidatorSchemaOptions;
  isISIN?: ValidatorSchemaOptions;
  isISO31661Alpha2?: ValidatorSchemaOptions;
  isISO31661Alpha3?: ValidatorSchemaOptions;
  isISO8601?: ValidatorSchemaOptions;
  isISRC?: ValidatorSchemaOptions;
  isISBN?: ValidatorSchemaOptions;
  isISSN?: ValidatorSchemaOptions;
  isJSON?: ValidatorSchemaOptions;
  isNumeric?: ValidatorSchemaOptions;
  isLatLong?: ValidatorSchemaOptions;
  isLength?: ValidatorSchemaOptions;
  isLowercase?: ValidatorSchemaOptions;
  isMACAddress?: ValidatorSchemaOptions;
  isMD5?: ValidatorSchemaOptions;
  isMimeType?: ValidatorSchemaOptions;
  isMobilePhone?: ValidatorSchemaOptions;
  isMongoId?: ValidatorSchemaOptions;
  isMultibyte?: ValidatorSchemaOptions;
  isPostalCode?: ValidatorSchemaOptions;
  isPort?: ValidatorSchemaOptions;
  isString?: ValidatorSchemaOptions;
  isSurrogatePair?: ValidatorSchemaOptions;
  isUppercase?: ValidatorSchemaOptions;
  isURL?: ValidatorSchemaOptions;
  isUUID?: ValidatorSchemaOptions;
  isVariableWidth?: ValidatorSchemaOptions;
  isWhitelisted?: ValidatorSchemaOptions;
  matches?: ValidatorSchemaOptions;
}

interface SanitizersSchema {
  blacklist?: SanitizerSchemaOptions;
  escape?: true;
  unescape?: true;
  ltrim?: true | SanitizerSchemaOptions;
  normalizeEmail?: true | SanitizerSchemaOptions;
  rtrim?: true | SanitizerSchemaOptions;
  stripLow?: true | SanitizerSchemaOptions;
  toBoolean?: true | SanitizerSchemaOptions;
  toDate?: true;
  toFloat?: true;
  toInt?: true | SanitizerSchemaOptions;
  trim?: true | SanitizerSchemaOptions;
  whitelist?: true | SanitizerSchemaOptions;
}
