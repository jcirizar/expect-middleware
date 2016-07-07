module.exports = function ExpectError(target, args) {
  this.name = 'ExpectError';
  this.status = 400;
  this.message = 'To Be defined';
  this.target = target;
  this.args = args;
  Error.call(this, this.message, path, args);
  Error.captureStackTrace(this, ExpectError);
};
