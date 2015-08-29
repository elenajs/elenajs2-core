"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var dfs = require('./utils/dfs.js'),
    url = require('url'),
    IncomingForm = require('formidable').IncomingForm,
    File = require('formidable').File;

/**
 * RequestContext
 */

var RequestContext = (function (_IncomingForm) {
    _inherits(RequestContext, _IncomingForm);

    _createClass(RequestContext, [{
        key: 'toString',
        value: function toString() {
            var name = 'RequestContext';
            return '[object ' + name + ']';
        }
    }]);

    function RequestContext(request, response) {
        _classCallCheck(this, RequestContext);

        _get(Object.getPrototypeOf(RequestContext.prototype), 'constructor', this).call(this);
        this._request = request;
        this._response = response;
        this._requestData = {};

        var requestData = this._requestData;

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
        this.on('end', (function () {
            this.resolve && this.resolve(requestData);
        }).bind(this));
        response.once('finish', (function () {
            this.cleanupFormData();
        }).bind(this));
    }

    _createClass(RequestContext, [{
        key: '_deleteTmpFile',
        value: function _deleteTmpFile(path) {
            dfs.unlink(path).chatch((function (err) {
                this.emit('error', err);
            }).bind(this));
        }
    }, {
        key: 'handleResponse',
        value: function handleResponse() {
            return new Promise((function (resolve, reject) {
                this._resolve = resolve;
                this._reject = reject;
                this.parse(this.request);
            }).bind(this));
        }
    }, {
        key: 'cleanupFormData',
        value: function cleanupFormData() {
            var _this = this;

            var req = this.request;
            if (req.method.search(/^post$|^put$/i) === 0) {
                (function () {
                    var File = formidable.File,
                        requestData = req.requestData,
                        value = undefined;

                    for (var key in requestData) {
                        value = [].concat(requestData[key]);
                        value.forEach((function (item) {
                            if (item instanceof File) {
                                this._deleteTmpFile(item.path);
                            }
                        }).bind(_this));
                        delete requestData[key];
                    }
                })();
            }
        }
    }, {
        key: 'request',
        get: function get() {
            return this._request;
        }
    }, {
        key: 'requestData',
        get: function get() {
            return this._requestData;
        }
    }, {
        key: 'response',
        get: function get() {
            return this._response;
        }
    }, {
        key: 'resolve',
        get: function get() {
            return this._resolve;
        }
    }, {
        key: 'reject',
        get: function get() {
            return this._reject;
        }
    }]);

    return RequestContext;
})(IncomingForm);

module.exports = RequestContext;
//# sourceMappingURL=RequestContext.js.map