import { ContextRunner, FieldInstance } from "./context-runner";
import { Context } from "../context";

export class RemoveOptionals implements ContextRunner {
  async run(_req: any, context: Context, instances: FieldInstance[]) {
    const { optional } = context;

    // Short circuit "compulsory" context
    if (!optional) {
      return instances;
    }

    const checks = [
      (value: any) => value !== undefined,
      (value: any) => optional.nullable ? value != null : true,
      (value: any) => optional.checkFalsy ? value : true,
    ];

    return instances.filter(instance => checks.every(check => check(instance.value)));
  }
}