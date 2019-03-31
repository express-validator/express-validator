import { CustomSanitizer, CustomValidator, StandardSanitizer, StandardValidator, DynamicMessageCreator, Location } from "./base";

// Validation types
interface BaseValidation {
  negated: boolean;
  message?: DynamicMessageCreator | any;
}

interface CustomValidation extends BaseValidation {
  custom: true;
  validator: CustomValidator;
}

interface StandardValidation extends BaseValidation {
  custom: false;
  options: any[];
  validator: StandardValidator;
}

// Sanitization types
interface BaseSanitization {
  custom: boolean;
}

interface CustomSanitization extends BaseSanitization {
  custom: true;
  sanitizer: CustomSanitizer;
}

interface StandardSanitization extends BaseSanitization {
  custom: false;
  options: any[];
  sanitizer: StandardSanitizer;
}

export class Context {
  private negated = false;

  private _optional: { nullable: boolean, checkFalsy: boolean } | false = false;
  get optional() {
    return this._optional;
  }

  private readonly _sanitizations: (CustomSanitization | StandardSanitization)[] = [];
  get sanitizations(): ReadonlyArray<CustomSanitization | StandardSanitization> {
    return this._sanitizations;
  }

  private readonly _validations: (CustomValidation | StandardValidation)[] = [];
  get validations(): ReadonlyArray<CustomValidation | StandardValidation> {
    return this._validations;
  }

  constructor(
    readonly fields: string[],
    readonly locations: Location[],
    readonly message?: any
  ) {}

  // Validations part
  negate() {
    this.negated = true;
  }

  addValidation(validator: CustomValidator, meta: { custom: true }): void;
  addValidation(validator: StandardValidator, meta: { custom: false, options?: any[] }): void;
  addValidation(validator: CustomValidator | StandardValidator, meta: {
    custom: boolean,
    options?: any[],
  }) {
    if (meta.custom === true) {
      this._validations.push({
        validator,
        custom: true,
        negated: this.negated,
      });
    } else {
      this._validations.push({
        validator,
        options: meta.options || [],
        custom: false,
        negated: this.negated,
      });
    }

    this.negated = false;
  }

  setOptional(options: boolean | { nullable?: boolean, checkFalsy?: boolean } = true) {
    if (typeof options === 'boolean') {
      this._optional = options ? { checkFalsy: false, nullable: false } : false;
    } else {
      this._optional = {
        checkFalsy: !!options.checkFalsy,
        nullable: !!options.nullable
      };
    }
  }

  // Sanitizations part
  addSanitization(sanitizer: CustomSanitizer, meta: { custom: true }): void;
  addSanitization(sanitizer: StandardSanitizer, meta: { custom: false, options?: any[] }): void;
  addSanitization(sanitizer: CustomSanitizer | StandardSanitizer, meta: {
    custom: boolean,
    options?: any[]
  }) {
    if (meta.custom) {
      this._sanitizations.push({
        sanitizer,
        custom: true,
      });
    } else {
      this._sanitizations.push({
        sanitizer,
        options: meta.options || [],
        custom: false,
      });
    }
  }
}