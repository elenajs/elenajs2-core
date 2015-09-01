"use strict";

let HttpStatus = require('../utils/HttpStatus.js'),
    ExtendableError = require('es6-error');

class HttpStatusError extends ExtendableError {
    constructor(statusCode, message) {
        super(message || statusCode + ' - ' + HttpStatus.getStatusDescription(statusCode));
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