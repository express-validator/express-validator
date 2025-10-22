---
id: index
title: express-validator
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

express-validator is a set of [express.js](http://expressjs.com/) middlewares that wraps the
extensive collection of validators and sanitizers offered by [validator.js](https://github.com/validatorjs/validator.js).

It allows you to combine them in many ways so that you can validate and sanitize your express requests,
and offers tools to determine if the request is valid or not, which data was matched according to
your validators, and so on.

## Support

This version of express-validator requires that your application is running on [Node.js 14+](https://nodejs.org/docs/latest-v14.x/api/).  
It's also verified to work with [express.js 4.x](https://expressjs.com/en/4x/api.html).

Note that, despite the name, express-validator might work with libraries that aren't express.js.
The main requirement is that the HTTP server library you're using models its HTTP request object
similarly to express.js, and contains these properties:

- `req.body`: the body of the HTTP request. Can be any value, however objects, arrays
  and other JavaScript primitives work better.
- `req.cookies`: the [`Cookie` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie)
  parsed as an object from cookie name to its value.
- `req.headers`: the headers sent along with the HTTP request.
- `req.params`: an object from name to value.  
  In express.js, [this is parsed from the request path and matched with route definition path](https://expressjs.com/en/guide/routing.html),
  but it can really be anything meaningful coming from the HTTP request.
- `req.query`: the portion after the `?` in the HTTP request's path, parsed as an object from
  query parameter name to value.

One example library that works out of the box with express-validator is [Restify](http://restify.com/).

## Installation

express-validator is on the npm registry! Install it using your favorite Node.js package manager:

<Tabs>
<TabItem value="npm" label="npm">

```bash
npm install express-validator
```

</TabItem>
<TabItem value="yarn" label="Yarn">

```bash
yarn add express-validator
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add express-validator
```

</TabItem>
</Tabs>
