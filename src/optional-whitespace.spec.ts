import { body } from './middlewares/validation-chain-builders';

describe('optional() with whitespace-only values', () => {
  it('should skip validation cleanly when optional field contains whitespace only', async () => {
    const req = {
      body: { age: '   ' },
    };

    const result = await body('age').optional().trim().isInt().run(req);
    const errors = result.array();

    console.log('Errors:', errors);
    expect(errors).toHaveLength(0);
  });

  it('should produce validation error when optional field with whitespace (not trimmed) fails validation', async () => {
    const req = {
      body: { age: '   ' },
    };

    const result = await body('age').optional().isInt().run(req);
    const errors = result.array();

    console.log('Errors (no trim):', errors);
    expect(errors).toHaveLength(1);
    expect(errors[0].msg).toBe('Invalid value');
  });

  it('should skip validation when optional field is completely undefined', async () => {
    const req = {
      body: {},
    };

    const result = await body('age').optional().trim().isInt().run(req);
    const errors = result.array();

    expect(errors).toHaveLength(0);
  });

  it('should validate successfully when optional field has valid value', async () => {
    const req = {
      body: { age: '25' },
    };

    const result = await body('age').optional().trim().isInt().run(req);
    const errors = result.array();

    expect(errors).toHaveLength(0);
  });

  it('should produce validation error when optional field has invalid value', async () => {
    const req = {
      body: { age: 'abc' },
    };

    const result = await body('age').optional().trim().isInt().run(req);
    const errors = result.array();

    expect(errors).toHaveLength(1);
    expect(errors[0].msg).toBe('Invalid value');
  });

  it('should skip validation with checkFalsy option when value is whitespace-only', async () => {
    const req = {
      body: { age: '   ' },
    };

    const result = await body('age')
      .optional({ checkFalsy: true })
      .trim()
      .isInt()
      .run(req);
    const errors = result.array();

    console.log('Errors (checkFalsy):', errors);
    expect(errors).toHaveLength(0);
  });
});
