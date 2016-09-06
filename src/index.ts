/// <reference path="../expect-middleware.d.ts" />
'use strict';

import * as _ from 'lodash';
import _typeof = require('type-of');
import ExpectError from "./error";

export = function (target: string | string[]) {
    var typeOfTarget = _typeof(target);

    if (typeOfTarget !== 'string' && typeOfTarget !== 'array') {
        throw new ExpectError('Expected path to be {(string|string[])}');
    }

    return new Expectation(target);
}

type AssertionFunc = (target: any)=>boolean;

class Expectation {
    public args: string | string[];
    public func: AssertionFunc;

    constructor(public target: string | string[]) {

    }

    toHave(args: string | string[]) {
        var argType = _typeof(args);
        if (argType !== 'string' && argType !== 'array') {
            throw new ExpectError('Expected args to be {(string|string[])}');
        }
        this.args = args;
        return toHaveExpectation.bind(this);
    }

    toHaveOneOf(args: string[]) {
        if (_typeof(args) !== 'array') {
            throw new ExpectError('Expected args to be {string[]}');
        }
        this.args = args;

        return toHaveOneOfExpectation.bind(this);
    }

    toExist() {
        return toExistExpectation.bind(this);
    }

    toBeOfType(args: string) {
        if (_typeof(args) !== 'string') {
            throw new ExpectError("Expected args to be a string of value " +
                "['date', 'object', 'null', 'undefined', 'string', 'boolean'," +
                " 'number']");
        }

        this.args = args;
        return toBeOfTypeExpectation.bind(this);
    }

    toAssert(func: AssertionFunc) {
        if (_typeof(func) !== 'function') {
            throw new ExpectError("Expected arg to be a function");
        }

        this.func = func;
        return toAssertExpectation.bind(this);
    }
}


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
            message: `Expected '${this.target}' to have ${args}`
        };
        next(new ExpectError(message));

    } else {
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
            message: `Expected '${this.target}' to have one of ${args}`
        };
        next(new ExpectError(message));
    } else {
        next();
    }
}

function toExistExpectation(req, res, next) {
    var target = _.get(req, this.path);

    if (_typeof(target) === 'undefined') {
        var message = {
            target: target,
            message: `Expected '${this.target}' to Exist`
        };
        next(new ExpectError(message));
    } else {
        next();
    }
}

function toBeOfTypeExpectation(req, res, next) {
    var target: any;
    target = _.get(req, this.target);
    var args = this.args;

    let parsedDate = Date.parse(target);

    if (_typeof(target) === 'string' && args === 'date' && !!parsedDate) {
        return next();
    }


    if (_typeof(target) !== args) {
        let message = {
            target: target,
            args: args,
            message: `Expected '${this.target}' to be of type ${args}`
        };
        next(new ExpectError(message));
    } else {
        next();
    }
}

function toAssertExpectation(req, res, next) {
    let target = _.get(req, this.target);
    var func = this.func;

    if (!func(target)) {
        let message = {
            target: target,
            message: `Expected '${this.target}' to be valid`
        };
        next(new ExpectError(message));
    } else {
        next();
    }
}