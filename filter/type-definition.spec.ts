import { Request } from 'express';
import { matchedData } from './';

const req: Request = <Request>{};

matchedData(req).foo;
matchedData(req, { onlyValidData: true }).bar;