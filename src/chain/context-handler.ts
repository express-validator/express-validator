import { CustomValidator } from '../base';
import { Optional } from '../context';
import { ValidationChain } from './validation-chain';

export interface ContextHandler<Chain> {
  /**
   * Stops running validations if any of the previous ones have failed.
   *
   * Useful to prevent a custom validator that touches a database or external API from running when
   * you know it will fail.
   *
   * May be used multiple times in the same validation chain if desired.
   *
   * @example
   *  check('username')
   *    .isEmail()
   *    // If not an email, stop here
   *    .bail()
   *    .custom(checkDenylistDomain)
   *    // If domain is not allowed, don't go check if it already exists
   *    .bail()
   *    .custom(checkEmailExists)
   *
   * @returns the current validation chain
   */
  bail(): Chain;

  /**
   * Adds a condition on whether the validation should continue on a field or not.
   * @param condition may be either
   *  - a custom validator-like function, which must truthy or a promise that resolves to continue
   *    validation. If the return value is falsy, a promise that rejects, or if it throws, validation
   *    will stop.
   * - a validation chain which if it would produce errors, the validation chain stops.
   * @example
   *  check('newPassword')
   *    // Only validate if the old password has been provided
   *    .if((value, { req }) => req.body.oldPassword)
   *    // Or, use it with a a validation chain
   *    .if(body('oldPassword').notEmpty())
   * @returns the current validation chain
   */
  if(condition: CustomValidator | ValidationChain): Chain;

  /**
   * Marks the field(s) of the validation chain as optional.
   * By default, only fields with an `undefined` value are considered optional and will be ignored
   * when validating.
   *
   * @param options an object of options to customize the behavior of optional.
   * @returns the current validation chain
   */
  optional(options?: Partial<Optional> | true): Chain;
}
