var _ = require('lodash');
var _typeof = require('type-of');
var ExpectError = require('./lib/error');


module.exports = {
  middleware: middlewareCreator,
  regular: regularCreator
};


function middlewareCreator(target) {
  var typeOfPath = _typeof(target);

  if (typeOfPath !== 'string' && typeOfPath !== 'array') {
    throw new ExpectError('Expected path to be {(string|string[])}', target);
  }

  return new Expectation('middleware', target);
}

function regularCreator(target) {
  return new Expectation('regular', target);
}


function Expectation(type, target) {
  this.target = target;
  if (type === 'middleware') {
    this.middleware = true;
  } else {
    this.regular = true;
  }
}

Expectation.prototype = {
  toHave: toHave,
  toHaveOneOf: toHaveOneOf,
  toExist: toExist,
  toBeOfType: toBeOfType
};

function toHave(args) {
  var argType = _typeof(args);
  if (argType !== 'string' && argType !== 'array') {
    throw new ExpectError('Expected args to be {(string|string[])}', args);
  }

  this.args = args;
  if (this.middleware) return toHaveExpectation.bind(this);
  toHaveExpectation.call(this);
}

function toHaveOneOf(args) {
  if (_typeof(args) !== 'array') {
    throw new ExpectError('Expected args to be {string[]}', args);
  }
  this.args = args;

  return toHaveOneOfExpectation.bind(this);
}

function toExist() {
  return toExistExpectation.bind(this);
}

function toBeOfType(args) {
  if (_typeof(args) !== 'string') {
    throw new ExpectError("Expected args to be a string of value " +
      "['date', 'object', 'null', 'undefined', 'string', 'boolean'," +
      " 'number']",
      args);
  }

  this.args = args;
  return toBeOfTypeExpectation.bind(this);

}

function toHaveExpectation(req, res, next) {
  var self = this;
  var target;
  if (req) {
    target = _.get(req, self.target);
  } else {
    target = self.target;
  }

  var values = _.chain(target)
    .at(self.args)
    .value();

  if (_.includes(values)) {
    throw new ExpectError("Expected " + (self.target || 'target') + " to have '"
      + self.args + "' " + (req ? " at path '" + req.target + "'" : ''), self.target, self.args);
  }

  if (next) {
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
    throw new ExpectError("Expected " + self.path + " to have one or" +
      " more of '"
      + args + "' at path '" + req.path + "'", self.path, args);
  }
  next();
}

function toExistExpectation(req, res, next) {
  var exist = _.get(req, this.path);

  if (_typeof(exist) === 'undefined') {
    throw new ExpectError("Expected " + this.path
      + " to exist at path '" + req.path + "'", this.path);
  }

  next();
}

function toBeOfTypeExpectation(req, res, next) {

  var value = _.get(req, this.path);
  var expected = this.args;
  var parsedDate = Date.parse(value);

  if (_typeof(value) === 'string' && expected === 'date' && !!parsedDate) {
    return next();
  }


  if (_typeof(value) !== expected) {
    throw new ExpectError("Expected " + this.path
      + " to be of type " + this.args + " at path '"
      + req.path + "'", this.path, this.args);
  }

  next();
}

