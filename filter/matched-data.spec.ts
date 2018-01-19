import { matchedData } from './matched-data';

let dataRecord: Record<string, any> = matchedData({} as any);
dataRecord = matchedData({} as any, {});
dataRecord = matchedData({} as any, {
  locations: ['body', 'cookies'],
  onlyValidData: true
});

const dataObj: { [key: string]: any } = matchedData({} as any);