import {
  CustomSanitizer,
  CustomValidator,
  FieldValidationError,
  Meta,
  ValidationError,
} from './base';
import { ExpressValidator } from './express-validator';

describe('ExpressValidator', () => {
  let isAllowedDomain: CustomValidator;
  let removeEmailAttribute: CustomSanitizer;
  const createInstance = () => new ExpressValidator({ isAllowedDomain }, { removeEmailAttribute });

  beforeEach(() => {
    isAllowedDomain = jest.fn(() => true);
    removeEmailAttribute = jest.fn(value => value);
  });

  describe.each([
    ['check', ['body', 'cookies', 'headers', 'params', 'query']],
    ['body', ['body']],
    ['cookies', ['cookies']],
    ['headers', ['headers']],
    ['params', ['params']],
    ['query', ['query']],
  ] as const)('#%s()', (method, locations) => {
    const foo = 'bar';
    const req = {
      body: { foo },
      cookies: { foo },
      headers: { foo },
      params: { foo },
      query: { foo },
    };

    it(`creates a validation chain for ${locations.join(', ')}`, async () => {
      const result = await createInstance()[method]('foo').isInt().run(req);
      const errors = result.array() as FieldValidationError[];
      expect(errors).toHaveLength(locations.length);
      errors.forEach(error => {
        expect(locations).toContain(error.location);
      });
    });

    it('creates a validation chain with the extension methods', async () => {
      const chain = createInstance()[method]('foo');
      expect(chain.isAllowedDomain()).toBe(chain);
      expect(chain.removeEmailAttribute()).toBe(chain);

      await chain.run(req);
      locations.forEach(location => {
        const meta: Meta = { req, location, path: 'foo' };
        expect(isAllowedDomain).toHaveBeenCalledWith(foo, meta);
        expect(removeEmailAttribute).toHaveBeenCalledWith(foo, meta);
      });
    });
  });

  describe('#validationResult()', () => {
    it('uses no error formatter by default', async () => {
      const req = {};
      const { check, validationResult } = new ExpressValidator();
      await check('foo').exists().withMessage('not exists').run(req);

      const [error] = validationResult(req).array();
      expect(error).toEqual<ValidationError>({
        type: 'field',
        path: 'foo',
        location: 'body',
        value: undefined,
        msg: 'not exists',
      });
    });

    it('uses specified error formatter', async () => {
      const req = {};
      const { check, validationResult } = new ExpressValidator(undefined, undefined, {
        errorFormatter: err => `${err.type}: ${err.msg}`,
      });
      await check('foo').exists().withMessage('not exists').run(req);

      const [error] = validationResult(req).array();
      expect(error).toBe('field: not exists');
    });
  });
});
