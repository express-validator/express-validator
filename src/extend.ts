import { CustomValidators } from './base';
import { ValidatorsImpl } from './chain';

export const extend = {
  validators(customValidators: CustomValidators) {
    for (const [name, validator] of Object.entries(customValidators)) {
      (ValidatorsImpl.prototype as any)[name] = function (this: ValidatorsImpl<any>, options: any) {
        return this.custom(validator, options);
      };
    }
  },
};
