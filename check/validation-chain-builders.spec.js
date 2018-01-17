const { expect } = require('chai');
const { check, body, cookie, header, param, query } = require('./validation-chain-builders');

describe('check: checkAll middleware', () => {
  it('checks body', () => {
    const req = {
      body: { foo: 'asd' }
    };

    return check('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors).to.have.length(1);
    });
  });

  it('checks query', () => {
    const req = {
      query: { foo: 'asd' }
    };

    return check('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors).to.have.length(1);
    });
  });

  it('checks params', () => {
    const req = {
      params: { foo: 'asd' }
    };

    return check('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors).to.have.length(1);
    });
  });

  it('checks cookies', () => {
    const req = {
      cookies: { foo: 'asd' }
    };

    return check('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors).to.have.length(1);
    });
  });

  it('checks headers', () => {
    const req = {
      headers: { Foo: 'asd' }
    };

    return check('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors).to.have.length(1);
    });
  });

  it('checks all locations at the same time', () => {
    const req = {
      body: { foo: 'asd' },
      cookies: { foo: 'asd' },
      params: { foo: 'asd' },
      query: { foo: 'asd' },
      headers: { foo: 'asd' }
    };

    return check('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors).to.have.length(5);
    });
  });
});

describe('check: checkBody middleware', () => {
  it('checks only the body location', () => {
    const req = {
      body: { foo: 'asd' },
      cookies: { foo: 'asd' },
      params: { foo: 'asd' },
      query: { foo: 'asd' },
      get: { headers: 'asd' }
    };

    return checkBody('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors)
        .to.have.length(1)
        .and.to.have.deep.property('[0].location', 'body');
    });
  });
});

describe('check: checkCookies middleware', () => {
  it('checks only the cookies location', () => {
    const req = {
      body: { foo: 'asd' },
      cookies: { foo: 'asd' },
      params: { foo: 'asd' },
      query: { foo: 'asd' },
      headers: { foo: 'asd' }
    };

    return checkCookies('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors)
        .to.have.length(1)
        .and.to.have.deep.property('[0].location', 'cookies');
    });
  });
});

describe('check: checkHeaders middleware', () => {
  it('checks only the params location', () => {
    const req = {
      body: { foo: 'asd' },
      cookies: { foo: 'asd' },
      params: { foo: 'asd' },
      query: { foo: 'asd' },
      headers: { Foo: 'asd' }
    };

    return checkHeaders('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors)
        .to.have.length(1)
        .and.to.have.deep.property('[0].location', 'headers');
    });
  });
});

describe('check: checkParams middleware', () => {
  it('checks only the params location', () => {
    const req = {
      body: { foo: 'asd' },
      cookies: { foo: 'asd' },
      params: { foo: 'asd' },
      query: { foo: 'asd' },
      get: { headers: 'asd' }
    };

    return checkParams('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors)
        .to.have.length(1)
        .and.to.have.deep.property('[0].location', 'params');
    });
  });
});

describe('check: checkQuery middleware', () => {
  it('checks only the query location', () => {
    const req = {
      body: { foo: 'asd' },
      cookies: { foo: 'asd' },
      params: { foo: 'asd' },
      query: { foo: 'asd' },
      get: { headers: 'asd' }
    };

    return checkQuery('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors)
        .to.have.length(1)
        .and.to.have.deep.property('[0].location', 'query');
    });
  });
});