export type SchemaTypes = Boolean | String | Date | Object | RegExp;
export type Schema = {
  [key: string]: SchemaTypes | SchemaTypes[] | Schema;
};
