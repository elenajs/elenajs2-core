"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HttpStatusError = require('./errors/HttpStatusError.js'),
    Dispatcher = require('./Dispatcher.js'),
    dfs = require('./utils/dfs.js'),
    path = require('path'),
    url = require('url'),
    mimeType = require('mimetype');

var FsResourceDispatcher = (function (_Dispatcher) {
    _inherits(FsResourceDispatcher, _Dispatcher);

    _createClass(FsResourceDispatcher, [{
        key: 'toString',
        value: function toString() {
            var name = 'FsResourceDispatcher';
            return '[object ' + name + ']';
        }
    }]);

    function FsResourceDispatcher(rootPath, resourcePath, inline) {
        _classCallCheck(this, FsResourceDispatcher);

        _get(Object.getPrototypeOf(FsResourceDispatcher.prototype), 'constructor', this).call(this);

        this._rootPath = rootPath;
        this._resourcePath = resourcePath;
        this._inline = inline !== undefined ? inline : true;
    }

    _createClass(FsResourceDispatcher, [{
        key: 'isEligible',
        value: function isEligible(requestContext) {
            var request = requestContext.request,
                reqPathname = url.parse(request.url).pathname,
                resourcePath = path.resolve(this.resourcePath, reqPathname.substr(this.rootPath.length));

            return dfs.stat(resourcePath).then(function (stats) {
                if (!stats.isDirectory()) {
                    requestContext.stats = stats;
                    return true;
                }
            })['catch'](function (err) {
                if (err.errno !== -2) {
                    //NOENT
                    throw new HttpStatusError(500);
                }
            });
        }
    }, {
        key: 'render',
        value: function render(requestContext) {
            var request = requestContext.request,
                response = requestContext.response,
                stats = requestContext.stats,
                reqPathname = url.parse(request.url).pathname,
                resourcePath = path.resolve(this.resourcePath, reqPathname.substr(this.rootPath.length));
            var etag = stats.size.toString(16) + '-' + Date.parse(stats.mtime).toString(16);
            if (request.headers['if-none-match'] === etag) {
                response.writeHead(304, {
                    'Content-Length': 0
                });
                response.end();
            } else {
                var fileStream = dfs.createReadStream(resourcePath),
                    head = {
                    'Content-Length': stats.size,
                    'Content-Type': mimeType.lookup(resourcePath) || "application/octet-stream",
                    'ETag': etag
                };
                if (this.inline) {
                    head['Content-Disposition'] = 'inline; filename="' + path.basename(resourcePath) + '"';
                }
                response.writeHead(200, head);
                fileStream.pipe(response);
            }
        }
    }, {
        key: 'rootPath',
        get: function get() {
            return this._rootPath;
        }
    }, {
        key: 'inline',
        get: function get() {
            return this._inline;
        }
    }, {
        key: 'resourcePath',
        get: function get() {
            return this._resourcePath;
        }
    }]);

    return FsResourceDispatcher;
})(Dispatcher);

module.exports = FsResourceDispatcher;
//# sourceMappingURL=FsResourceDispatcher.js.map