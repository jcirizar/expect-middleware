"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ExtendableError = (function (_super) {
    __extends(ExtendableError, _super);
    function ExtendableError(message) {
        _super.call(this, message);
        this.name = this.constructor.name;
        this.status = 400;
        this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this);
        }
        else {
            this.stack = (new Error(message)).stack;
        }
    }
    return ExtendableError;
}(Error));
// now I can extend
var ExpectError = (function (_super) {
    __extends(ExpectError, _super);
    function ExpectError(m) {
        _super.call(this, m);
    }
    return ExpectError;
}(ExtendableError));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExpectError;
//# sourceMappingURL=error.js.map