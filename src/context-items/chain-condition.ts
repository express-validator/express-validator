import { Meta, ValidationHalt } from '../base';
import { ContextRunner } from '../chain';
import { Context } from '../context';
import { ContextItem } from './context-item';

export class ChainCondition implements ContextItem {
  constructor(private readonly chain: ContextRunner) {}

  async run(_context: Context, _value: any, meta: Meta) {
    const result = await this.chain.run(meta.req, { dryRun: true });
    if (!result.isEmpty()) {
      throw new ValidationHalt();
    }
  }
}
