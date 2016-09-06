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
    Expectation.prototype.toAssert = function (func) {
        if (_typeof(func) !== 'function') {
            throw new error_1.default("Expected arg to be a function");
        }
        this.func = func;
        return toAssertExpectation.bind(this);
    };
    return Expectation;
}());
function toHaveExpectation(req, res, next) {
    var target = _.get(req, this.target);
    var args = this.args;
    var values = _.chain(target)
        .at(args)
        .value();
    if (_.includes(values, undefined)) {
        var message = {
            target: target,
            args: args,
            message: "Expected '" + this.target + "' to have " + args
        };
        next(new error_1.default(message));
    }
    else {
        next();
    }
}
function toHaveOneOfExpectation(req, res, next) {
    var target = _.get(req, this.path);
    var args = this.args;
    var values = _.chain(target)
        .at(args)
        .reject(function (val) {
        return _.isUndefined(val);
    })
        .value();
    if (!values.length) {
        var message = {
            target: target,
            args: args,
            message: "Expected '" + this.target + "' to have one of " + args
        };
        next(new error_1.default(message));
    }
    else {
        next();
    }
}
function toExistExpectation(req, res, next) {
    var target = _.get(req, this.path);
    if (_typeof(target) === 'undefined') {
        var message = {
            target: target,
            message: "Expected '" + this.target + "' to Exist"
        };
        next(new error_1.default(message));
    }
    else {
        next();
    }
}
function toBeOfTypeExpectation(req, res, next) {
    var target;
    target = _.get(req, this.target);
    var args = this.args;
    var parsedDate = Date.parse(target);
    if (_typeof(target) === 'string' && args === 'date' && !!parsedDate) {
        return next();
    }
    if (_typeof(target) !== args) {
        var message = {
            target: target,
            args: args,
            message: "Expected '" + this.target + "' to be of type " + args
        };
        next(new error_1.default(message));
    }
    else {
        next();
    }
}
function toAssertExpectation(req, res, next) {
    var target = _.get(req, this.target);
    var func = this.func;
    if (!func(target)) {
        var message = {
            target: target,
            message: "Expected '" + this.target + "' to be valid"
        };
        next(new error_1.default(message));
    }
    else {
        next();
    }
}
module.exports = function (target) {
    var typeOfTarget = _typeof(target);
    if (typeOfTarget !== 'string' && typeOfTarget !== 'array') {
        throw new error_1.default('Expected path to be {(string|string[])}');
    }
    return new Expectation(target);
};
//# sourceMappingURL=index.js.map