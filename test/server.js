/// <reference path="../expect-middleware.d.ts" />

var express = require('express'),
    bodyParser = require('body-parser');
var expect = require('../dist/index');

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

function testToken(target) {
    var tokenRegex = /token/i;

    return tokenRegex.test(target);
}

app.get('/', function (req, res) {

    res.json({
        'headers': req.headers,
        'body': req.body
    });
});


app.post('/',
    expect('body').toHave(['token', 'password']),
    expect('body.token').toAssert(testToken),
    function (req, res) {
        res.json({
            'headers': req.headers,
            'body': req.body
        });
    }
);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: err
    });
});


app.listen(3030, function () {
    console.log('Example app listening on port 3000!');
});