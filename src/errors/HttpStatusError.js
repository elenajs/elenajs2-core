"use strict";

let HttpStatus = require('../utils/HttpStatus.js');

class HttpStatusError extends Error {
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