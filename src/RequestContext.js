"use strict";

let dfs = require('./utils/dfs.js'),
    url = require('url'),
    IncomingForm = require('formidable').IncomingForm,
    File = require('formidable').File;


/**
 * RequestContext
 */
class RequestContext extends IncomingForm {
    toString() {
        let name = 'RequestContext';
        return `[object ${name}]`;
    }

    constructor(request, response) {
        super();
        this._request = request;
        this._response = response;
        this._requestData = {};

        let requestData = this._requestData;

        function addFieldValue(name, value) {
            if (requestData[name] === undefined) {
                requestData[name] = value;
            } else {
                requestData[name] = [].concat(requestData[name], value);
            }
        }

        this.on('field', function (name, value) {
            addFieldValue(name, value);
        });
        this.on('file', function (name, value) {
            addFieldValue(name, value);
        });

        this.on('aborted', function (err) {
            this.reject && this.reject(err);
            this.cleanupFormData();
        });
        this.on('error', function (err) {
            this.reject && this.reject(err);
            this.cleanupFormData();
        });
        this.on('end', function () {
            this.resolve && this.resolve(requestData)
        }.bind(this));
        response.once('finish', function () {
            this.cleanupFormData()
        }.bind(this));
    }

    get request() {
        return this._request;
    }

    get requestData() {
        return this._requestData;
    }

    get response() {
        return this._response;
    }

    get resolve() {
        return this._resolve;
    }

    get reject() {
        return this._reject;
    }

    _deleteTmpFile(path) {
        dfs.unlink(path).chatch(function (err) {
            this.emit('error', err);
        }.bind(this));
    }

    handleResponse() {
        return new Promise(function (resolve, reject) {
            this._resolve = resolve;
            this._reject = reject;
            this.parse(this.request);
        }.bind(this));
    }

    cleanupFormData() {
        let req = this.request;
        if (req.method.search(/^post$|^put$/i) === 0) {
            let File = formidable.File,
                requestData = req.requestData,
                value;

            for (let key in requestData) {
                value = [].concat(requestData[key]);
                value.forEach(function (item) {
                    if (item instanceof File) {
                        this._deleteTmpFile(item.path);
                    }
                }.bind(this));
                delete  requestData[key];
            }

        }
    }
}

module.exports = RequestContext;