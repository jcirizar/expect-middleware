/// <reference path="../expect-middleware.d.ts" />
'use strict';
var _ = require('lodash');
var _typeof = require('type-of');
var error_1 = require("./error");
var Expectation = (function () {
    function Expectation(target) {
        this.target = target;
    }
    Expectation.prototype.toHave = function (args) {
        var argType = _typeof(args);
        if (argType !== 'string' && argType !== 'array') {
            throw new error_1.default('Expected args to be {(string|string[])}');
        }
        this.args = args;
        return toHaveExpectation.bind(this);
    };
    Expectation.prototype.toHaveOneOf = function (args) {
        if (_typeof(args) !== 'array') {
            throw new error_1.default('Expected args to be {string[]}');
        }
        this.args = args;
        return toHaveOneOfExpectation.bind(this);
    };
    Expectation.prototype.toExist = function () {
        return toExistExpectation.bind(this);
    };
    Expectation.prototype.toBeOfType = function (args) {
        if (_typeof(args) !== 'string') {
            throw new error_1.default("Expected args to be a string of value " +
                "['date', 'object', 'null', 'undefined', 'string', 'boolean'," +
                " 'number']");
        }
        this.args = args;
        return toBeOfTypeExpectation.bind(this);
    };
    return Expectation;
}());
function toHaveExpectation(req, res, next) {
    var target;
    target = _.get(req, this.target);
    var values = _.chain(target)
        .at(this.args)
        .value();
    if (_.includes(values, undefined)) {
        var message = {
            target: this.target,
            args: this.args,
            message: "Expected " + this.target + " to have " + this.args
        };
        console.log('about to send error');
        next(new error_1.default(message));
    }
    else {
        console.log('not error found');
        next();
    }
}
function toHaveOneOfExpectation(req, res, next) {
    var self = this;
    var target = _.get(req, self.path);
    var args = self.args;
    var values = _.chain(target)
        .at(args)
        .reject(function (val) {
        return _.isUndefined(val);
    })
        .value();
    if (!values.length) {
        var message = {
            target: this.target,
            args: this.args,
            message: "Expected " + this.target + " to have one of " + this.args
        };
        next(new error_1.default(message));
    }
    else {
        next();
    }
}
function toExistExpectation(req, res, next) {
    var exist = _.get(req, this.path);
    if (_typeof(exist) === 'undefined') {
        var message = {
            target: this.target,
            args: this.args,
            message: "Expected " + this.target + " to Exist"
        };
        next(new error_1.default(message));
    }
    else {
        next();
    }
}
function toBeOfTypeExpectation(req, res, next) {
    var value;
    value = _.get(req, this.target);
    var expected = this.args;
    var parsedDate = Date.parse(value);
    if (_typeof(value) === 'string' && expected === 'date' && !!parsedDate) {
        return next();
    }
    if (_typeof(value) !== expected) {
        var message = {
            target: this.target,
            args: this.args,
            message: "Expected " + this.target + " to be of type " + expected
        };
        next(new error_1.default(message));
    }
    else {
        next();
    }
}
module.exports = function (target) {
    var typeOfPath = _typeof(target);
    if (typeOfPath !== 'string' && typeOfPath !== 'array') {
        throw new error_1.default('Expected path to be {(string|string[])}');
    }
    return new Expectation(target);
};
//# sourceMappingURL=index.js.map