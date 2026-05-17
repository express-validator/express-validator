import { Meta, StandardValidator } from '../base';
import { toString as toStringImpl } from '../utils';
import { Context } from '../context';
import { ContextItem } from './context-item';

export class StandardValidation implements ContextItem {
  message: any;

  constructor(
    private readonly validator: StandardValidator,
    private readonly negated: boolean,
    private readonly options: any[] = [],
    // For testing only.
    // Deliberately not calling it `toString` in order to not override `Object.prototype.toString`.
    private readonly stringify = toStringImpl,
  ) {}

  async run(context: Context, value: any, meta: Meta) {
    // Check if this validator should reject arrays entirely
    if (Array.isArray(value) && this.shouldRejectArrays()) {
      context.addError({ type: 'field', message: this.message, value, meta });
      return;
    }

    const values = Array.isArray(value) ? value : [value];
    values.forEach(value => {
      const result = this.validator(this.stringify(value), ...this.options);
      if (this.negated ? result : !result) {
        context.addError({ type: 'field', message: this.message, value, meta });
      }
    });
  }

  /**
   * Determines if this validator should reject arrays entirely rather than validating individual elements.
   * Type validators (numeric, string, etc.) should reject arrays since an array is not of those types.
   */
  private shouldRejectArrays(): boolean {
    // Check if this is a type validator that should reject arrays
    const typeValidators = [
      'isNumeric', 'isInt', 'isFloat', 'isDecimal', 'isHexadecimal', 'isOctal',
      'isAlpha', 'isAlphanumeric', 'isAscii', 'isBase32', 'isBase58', 'isBase64',
      'isBIC', 'isBoolean', 'isBtcAddress', 'isCreditCard', 'isCurrency',
      'isDataURI', 'isDate', 'isEmail', 'isEmpty', 'isEthereumAddress',
      'isFQDN', 'isFreightContainerID', 'isFullWidth', 'isHalfWidth',
      'isHash', 'isHexColor', 'isHSL', 'isIBAN', 'isIdentityCard',
      'isIMEI', 'isIP', 'isIPRange', 'isISBN', 'isISSN', 'isISIN',
      'isISO8601', 'isISO31661Alpha2', 'isISO31661Alpha3', 'isISO31661Numeric',
      'isISO4217', 'isISO6346', 'isISO6391', 'isISRC', 'isJSON', 'isJWT',
      'isLatLong', 'isLicensePlate', 'isLocale', 'isLowercase', 'isLuhnNumber',
      'isMagnetURI', 'isMailtoURI', 'isMACAddress', 'isMD5', 'isMimeType',
      'isMobilePhone', 'isMongoId', 'isMultibyte', 'isPassportNumber',
      'isPort', 'isPostalCode', 'isRFC3339', 'isRgbColor', 'isSemVer',
      'isSlug', 'isStrongPassword', 'isSurrogatePair', 'isTaxID',
      'isTime', 'isUUID', 'isUppercase', 'isURL', 'isVariableWidth',
      'isWhitelisted',
    ];

    return typeValidators.includes(this.validator.name);
  }
}
