"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var http = require('http'),
    url = require('url'),
    Dispatcher = require('./Dispatcher.js'),
    HttpStatusError = require('./errors/HttpStatusError.js'),
    RequestContext = require('./RequestContext.js');

var ServerDispatcher = (function (_Dispatcher) {
    _inherits(ServerDispatcher, _Dispatcher);

    function ServerDispatcher() {
        _classCallCheck(this, ServerDispatcher);

        _get(Object.getPrototypeOf(ServerDispatcher.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ServerDispatcher, [{
        key: 'toString',
        value: function toString() {
            var name = 'ServerDispatcher';
            return '[object ' + name + ']';
        }
    }, {
        key: '_dispatch',
        value: function _dispatch(request, response) {
            var self = this,
                requestContext = new RequestContext(request, response);

            this._processRequest(requestContext).then(function () {
                self.emit('request', requestContext);
            })['catch'](function (err) {
                self.render(requestContext, err);
            })['catch'](function (err) {
                self.emit('error', err, requestContext);
            });
        }
    }, {
        key: 'isEligible',
        value: function isEligible(requestContext) {
            return true;
        }
    }, {
        key: 'render',
        value: function render(requestContext, err) {
            var response = requestContext.response,
                httpStatusError = undefined;
            if (err) {
                if (err instanceof HttpStatusError) {
                    httpStatusError = err;
                } else {
                    httpStatusError = new HttpStatusError(500);
                }
            } else {
                httpStatusError = new HttpStatusError(404);
            }

            if (httpStatusError.statusCode === 301) {
                response.writeHead(httpStatusError.statusCode, {
                    'Location': httpStatusError.message
                });
                response.end();
            } else {
                this.renderErrorPage(requestContext, httpStatusError);
            }
        }
    }, {
        key: 'renderErrorPage',
        value: function renderErrorPage(requestContext, httpStatusError) {
            var response = requestContext.response,
                errorPage = '<!DOCTYPE html>\n        <html>\n        <head>\n            <meta charset="utf-8">\n            <meta http-equiv="X-UA-Compatible" content="IE=Edge">\n            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />\n            <title>' + httpStatusError.statusCode + ': ' + httpStatusError.statusDescription + '</title>\n        </head>\n        <body>\n            <h1>' + httpStatusError.statusCode + ' ' + httpStatusError.statusDescription + '</h1>\n            <p>' + httpStatusError.message + '</p>\n        </body>\n        </html>';
            response.writeHead(httpStatusError.statusCode.toString(), {
                'Content-Type': 'text/html'
            });
            response.end(errorPage);

            this.emit('error', httpStatusError, requestContext);
        }
    }, {
        key: 'requestListener',
        get: function get() {
            return (function (request, response) {
                this._dispatch(request, response);
            }).bind(this);
        }
    }]);

    return ServerDispatcher;
})(Dispatcher);

module.exports = ServerDispatcher;
//# sourceMappingURL=ServerDispatcher.js.map