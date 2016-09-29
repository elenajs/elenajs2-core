"use strict";
require('gulp-polyfill');

let httpStatus = require('./utils/HttpStatus.js');

class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

class HttpStatusError extends ExtendableError {
    constructor(statusCode, message) {
        statusCode = statusCode.toString(10);
        super(message || statusCode + ' - ' + httpStatus[statusCode]);
        this._statusCode = statusCode;
    }

    get statusCode () {
        return this._statusCode;
    }
    get statusDescription () {
        return HttpStatus.getStatusDescription(this.statusCode);
    }
}

module.exports = HttpStatusError;