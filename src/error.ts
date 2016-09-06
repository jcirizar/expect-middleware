class ExtendableError extends Error {
    private status;

    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.status = 400;
        this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

// now I can extend

class ExpectError extends ExtendableError {
    constructor(m) {
        super(m);
    }
}

export default ExpectError;