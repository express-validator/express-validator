
var chai = require('chai');
var express = require('express');
var request = require('supertest');
var expressValidator = require('../index');

describe('Testability:', function() {
  describe('validator works with multiple express apps,', function() {

    // This test case:
    //  - creates two express apps
    //  - initializes each app with different custom validators of the same name
    //  - verifies that custom validators declared for one app do not
    //    contaminate the other app's validators
    it('custom validators do not contaminate other sessions', function(done) {
      var happyApp = express();
      var angryApp = express();
      chai.assert(happyApp !== angryApp, 'express app is not a singleton');

      // Happy express app has a custom validator which always returns true
      happyApp.use(expressValidator({
        customValidators: {alpha: function() { return true }}
      }));

      // Angry express app has a custom validator which always returns false
      //  - angryApp isn't actually explicitly used in this case
      angryApp.use(expressValidator({
        customValidators: {alpha: function() { return false }}
      }));

      // Middleware to assert that validation happens without errors
      happyApp.use(function(req, res) {

        // Perform validation with the custom validator
        req.check('alpha').alpha();

        // Get the validation result from express-validator
        //  - assert that there were no errors
        //  - respond via express appropriately (status 200 or 500)
        return req.getValidationResult()
          .then(function(result) {
            var noErrors = result.isEmpty();
            chai.assert(noErrors, 'custom validators are not overwritten');
            if (noErrors) {
              res.status(200).send('cool');
            } else {
              res.status(500).send('not-cool');
            }
          })
          .catch(function(error) { done(error); })
      });

      // Launch a test request to the happy express app
      request(happyApp)
        .get('/')
        .send({alpha: '123'})
        .expect(200)
        .end(function(err) { done(err); });
    });
  });
});
