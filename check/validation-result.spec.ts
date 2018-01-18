import { validationResult, ResultFactory, ResultFactoryBuilderOptions, Result } from './validation-result';

const options: ResultFactoryBuilderOptions = {
  formatter(error) {
    return error.location + error.msg + error.param + error.value;
  }
};

const resultFactoryDefault: ResultFactory = validationResult.withDefaults();
const resultFactoryWithPartialOptions: ResultFactory = validationResult.withDefaults({});
const resultFactoryWithOptions: ResultFactory = validationResult.withDefaults(options);

const resultAny: Result = validationResult({} as any);

let anyArray: any[] = resultAny.array();
anyArray = resultAny.array({ onlyFirstError: true });

const anyMap: Record<string, any> = resultAny.mapped();
const resultAny2: Result = resultAny.formatWith(options.formatter);

const empty: boolean = resultAny.isEmpty();
resultAny.throw();

const resultError: Result<Error> = validationResult<Error>({} as any);
const errorArray: Error[] = resultError.array();
const errorMap: Record<string, Error> = resultError.mapped();