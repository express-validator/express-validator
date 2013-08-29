var assert = require('assert');
var async = require('async');

var App = require('./helpers/app');
var req = require('./helpers/req');

var port = process.env.NODE_HTTP_PORT || 8888;
var url = 'http://localhost:' + port;

// Nested parameters are also supported

var validation = function(req, res) {
    req.assert(['users', '0', 'fields', 'email'], 'not empty').notEmpty();
    //req.assert('user.fields.email', 'not empty').notEmpty();
    req.assert(['users', 0, 'fields', 'email'], 'valid email required').isEmail();
    req.assert('users[0].fields.email', 'not empty').notEmpty();
    req.assert('users[0].fields.email', 'valid email required').isEmail();
    req.assert('users[0][fields][email]', 'not empty').notEmpty();
    req.assert('users[0][fields][email]', 'valid email required').isEmail();

    var errors = req.validationErrors();
    if (errors) {
        res.json(errors);
        return;
    }
    res.json(req.body);
};
var app = new App(port, validation);
app.start();

function fail(body) {
    assert.deepEqual(body[0].msg, 'not empty');
    assert.deepEqual(body[1].msg, 'not empty');
    assert.deepEqual(body[2].msg, 'valid email required');
}

function pass(body) {
    assert.deepEqual(body, {
        users: [
            {
                fields: {
                    email: 'test@example.com'
                }
            },
            {
                fields: {
                    email: 'test2@example.com'
                }
            }
        ]
    });
}

var tests = [

    async.apply(req, 'post', url + '/', {
        json: {
            users: [
                {
                    fields: {
                        email: 'test@example.com'
                    }
                },
                {
                    fields: {
                        email: 'test2@example.com'
                    }
                }
            ]
        }
    }, pass)
];

async.parallel(tests, function(err) {
    assert.ifError(err);
    app.stop();
    console.log('All %d tests passed.', tests.length);
});
