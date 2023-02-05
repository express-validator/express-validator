import { AlternativeValidationError, FieldValidationError, Meta, ValidationError } from './base';
import { ExpressValidator } from './express-validator';

describe('ExpressValidator', () => {
  let isAllowedDomain: jest.Mock;
  let removeEmailAttribute: jest.Mock;
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

  describe('#checkExact()', () => {
    it('works with custom chains', async () => {
      const req = { query: { foo: 1 } };
      const { query, checkExact } = createInstance();
      const result = await checkExact(query('bar').isAllowedDomain()).run(req);
      const errors = result.mapped();
      expect(isAllowedDomain).toHaveBeenCalled();
      expect(errors._unknown_fields).toBeDefined();
    });
  });

  describe('#oneOf()', () => {
    it('can be used with custom chains', async () => {
      const req = { query: { foo: 1 } };
      const { check, oneOf } = createInstance();
      isAllowedDomain.mockImplementation(() => {
        throw new Error('wow');
      });

      const result = await oneOf([check('foo').isString(), check('foo').isAllowedDomain()], {
        errorType: 'flat',
      }).run(req);
      const [error] = result.array();
      const { nestedErrors } = error as AlternativeValidationError;
      expect(nestedErrors[1]).toMatchObject({ msg: 'wow' });
    });
  });

  describe('#checkSchema()', () => {
    it('creates a schema with the extension methods', async () => {
      const { checkSchema } = createInstance();
      const custom = jest.fn();
      const req = {};

      const chains = checkSchema({
        domain: {
          isAllowedDomain: true,
          isCustom: { custom },
          removeEmailAttribute: true,
        },
      });

      expect(chains[0].isAllowedDomain()).toBe(chains[0]);
      expect(chains[0].removeEmailAttribute()).toBe(chains[0]);

      await chains.run(req);
      expect(isAllowedDomain).toHaveBeenCalled();
      expect(removeEmailAttribute).toHaveBeenCalled();
      expect(custom).toHaveBeenCalled();
    });

    it('does not treat extension methods as inline custom validators/sanitizers', async () => {
      const { checkSchema } = createInstance();
      const custom = jest.fn();
      const customSanitizer = jest.fn();
      const req = {};

      const chains = checkSchema({
        domain: {
          // @ts-expect-error
          isAllowedDomain: { custom },
          // @ts-expect-error
          removeEmailAttribute: { customSanitizer },
        },
      });

      await chains.run(req);
      // Should still run the instance implementation, instead of the inline ones
      expect(isAllowedDomain).toHaveBeenCalled();
      expect(removeEmailAttribute).toHaveBeenCalled();
      expect(custom).not.toHaveBeenCalled();
      expect(customSanitizer).not.toHaveBeenCalled();
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

  describe('#matchedData()', () => {
    it('can be used on custom chains', async () => {
      const req = { query: { foo: 1 } };
      const { check, matchedData } = createInstance();
      await check('foo').isAllowedDomain().run(req);

      const data = matchedData(req);
      expect(data.foo).toBe(1);
    });
  });
});
