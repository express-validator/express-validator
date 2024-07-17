import { ContextItem, Dictionary } from './context-items';
import { Context, Optional } from './context';
import { Location } from './base';

export class ContextBuilder {
  private readonly stack: ContextItem[] = [];
  private fields: string[] = [];
  private locations: Location[] = [];
  private message: any;
  private optional: Optional = false;
  private requestBail = false;
  private fieldNames: Dictionary<string, string> = {}

  setFields(fields: string[]) {
    this.fields = fields;
    return this;
  }

  setLocations(locations: Location[]) {
    this.locations = locations;
    return this;
  }

  setMessage(message: any) {
    this.message = message;
    return this;
  }

  addItem(...items: ContextItem[]) {
    this.stack.push(...items);
    return this;
  }

  setOptional(options: Optional) {
    this.optional = options;
    return this;
  }

  setRequestBail() {
    this.requestBail = true;
    return this;
  }

  hide(fieldName: string, hiddenValue: string) {
    this.fieldNames[fieldName] = hiddenValue
    return this;
  }

  build() {
    return new Context(
      this.fields,
      this.locations,
      this.stack,
      this.optional,
      this.requestBail,
      this.fieldNames,
      this.message,
    );
  }
}
