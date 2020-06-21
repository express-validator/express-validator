import { ValidationChain } from '../chain';
import { check } from '../middlewares/check';
import { ContextBuilder } from '../context-builder';
import { Request, ValidationHalt } from '../base';
import { Result } from '../validation-result';
import { ChainCondition } from './chain-condition';

let condition: ValidationChain;
let runItem: (req: Request) => Promise<void>;

beforeEach(() => {
  condition = check('id', ['params']).isInt();

  const item = new ChainCondition(condition);
  runItem = req =>
    item.run(new ContextBuilder().build(), 'id', {
      req,
      location: 'params',
      path: 'id',
    });
});

it('runs the condition chain on the request', () => {
  condition.run = jest.fn().mockResolvedValue(new Result(e => e, []));

  const req = {};
  runItem(req);

  expect(condition.run).toHaveBeenCalledWith(req, { dryRun: true });
});

it('does not throw if the chain has no errors', () => {
  const req = {
    params: { id: '123' },
  };
  return expect(runItem(req)).resolves.toBeUndefined();
});

it('throws a validation halt if the chain has errors', () => {
  const req = {
    params: { id: 'bla' },
  };
  return expect(runItem(req)).rejects.toThrowError(ValidationHalt);
});
