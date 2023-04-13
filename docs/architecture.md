---
title: Architecture
---

## How express-validator works

In express.js terminology, **middlewares** are functions that receive the request (`req`) and
response (`res`) objects of an incoming HTTP request. Middlewares can respond to the request,
or pass control over to the next registered middleware.

express-validator is implemented mostly as a bunch of middleware functions, which will read the request
and verify if it's valid or not according to the specification you declared for each field.
Any invalid fields are then recorded internally, and validation errors can be forwarded back to the
user for them to fix up their request and try again.

Since it comes with many built-in validators and sanitizers, the style of specifying
the validations as middlewares confers express-validator a somewhat
[declarative programming style](https://en.wikipedia.org/wiki/Declarative_programming).
You usually don't tell it _when_ the validations are meant to run, though you can have control over
that if you wish.
