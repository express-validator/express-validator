
var xss = require('./validator').xssClean;

console.log(xss('I <3 this'));
