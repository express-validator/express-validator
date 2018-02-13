import { ValidationChain, ValidatorOptions, CustomValidator } from './check';
import { Location } from './location';

export function checkSchema(schema: ValidationSchema): ValidationChain[];

type ValidationSchema = Record<string, ValidationParamSchema>;

type ValidatorSchemaOptions<T = any> = true | {
  options?: T | T[];
  errorMessage?: any;
};

interface ValidationParamSchema {
  in: Location | Location[],
  errorMessage?: any

  custom?: ValidatorSchemaOptions<CustomValidator>;
  exists?: ValidatorSchemaOptions;
  optional?: boolean | ValidatorOptions.OptionalOptions;

  equals?: ValidatorSchemaOptions;
  contains?: ValidatorSchemaOptions;
  isAfter?: ValidatorSchemaOptions;
  isAlpha?: ValidatorSchemaOptions;
  isAlphanumeric?: ValidatorSchemaOptions;
  isAscii?: ValidatorSchemaOptions;
  isBase64?: ValidatorSchemaOptions;
  isBefore?: ValidatorSchemaOptions;
  isBoolean?: ValidatorSchemaOptions;
  isByteLength?: ValidatorSchemaOptions;
  isCreditCard?: ValidatorSchemaOptions;
  isCurrency?: ValidatorSchemaOptions;
  isDataURI?: ValidatorSchemaOptions;
  isDate?: ValidatorSchemaOptions;
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
  isISIN?: ValidatorSchemaOptions;
  isISO31661Alpha2?: ValidatorSchemaOptions;
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
  isSurrogatePair?: ValidatorSchemaOptions;
  isUppercase?: ValidatorSchemaOptions;
  isURL?: ValidatorSchemaOptions;
  isUUID?: ValidatorSchemaOptions;
  isVariableWidth?: ValidatorSchemaOptions;
  isWhitelisted?: ValidatorSchemaOptions;
  matches?: ValidatorSchemaOptions;
}