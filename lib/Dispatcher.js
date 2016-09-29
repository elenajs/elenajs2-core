"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('gulp-polyfill');

var path = require('path'),
    url = require('url'),
    HttpStatusError = require('./HttpStatusError.js');

var Dispatcher = function () {
    function Dispatcher() {
        _classCallCheck(this, Dispatcher);

        this._dispatchers = {};
    }

    _createClass(Dispatcher, [{
        key: 'addDispatcher',
        value: function addDispatcher(pathKey, dispatcher) {
            this._dispatchers[pathKey] = dispatcher;
            return this;
        }
    }, {
        key: 'toString',
        value: function toString() {
            var name = 'Dispatcher';
            return '[object ' + name + ']';
        }
    }, {
        key: '_selectDispatcher',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(pathArray, request, responseFilters) {
                var currDispatcher;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!this._requestFilter) {
                                    _context.next = 3;
                                    break;
                                }

                                _context.next = 3;
                                return this._requestFilter(request);

                            case 3:
                                if (this._responseFilter) {
                                    responseFilters.push(this._responseFilter);
                                }
                                currDispatcher = this._dispatchers[pathArray.shift().replace(/\..*$/, '')];
                                _context.t2 = currDispatcher;

                                if (!_context.t2) {
                                    _context.next = 10;
                                    break;
                                }

                                _context.next = 9;
                                return currDispatcher.isEligible(request);

                            case 9:
                                _context.t2 = _context.sent;

                            case 10:
                                _context.t1 = _context.t2;

                                if (!_context.t1) {
                                    _context.next = 13;
                                    break;
                                }

                                _context.t1 = currDispatcher._selectDispatcher(pathArray, request, responseFilters);

                            case 13:
                                _context.t0 = _context.t1;

                                if (_context.t0) {
                                    _context.next = 16;
                                    break;
                                }

                                _context.t0 = this;

                            case 16:
                                return _context.abrupt('return', _context.t0);

                            case 17:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _selectDispatcher(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return _selectDispatcher;
        }()
    }, {
        key: 'dispatch',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(request, response) {
                var responseServed, pathArray, responseFilters, dispatcher, data;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                responseServed = false;

                                response.once('finish', function () {
                                    responseServed = true;
                                });
                                pathArray = url.parse(request.url).pathname.split('/');
                                responseFilters = [], dispatcher = this._selectDispatcher(pathArray.slice(1), request, responseFilters);
                                _context2.next = 6;
                                return dispatcher.render(request, response, pathArray.join('/'));

                            case 6:
                                data = _context2.sent;

                                responseFilters.forEach(function (filter) {
                                    return filter(requst, response);
                                });
                                if (!responseServed) {
                                    if (typeof data === 'string') {
                                        response.end(data);
                                    } else {
                                        data.pipe(response);
                                    }
                                }

                            case 9:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function dispatch(_x4, _x5) {
                return _ref2.apply(this, arguments);
            }

            return dispatch;
        }()
    }, {
        key: 'render',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(request, response, afterPathname) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (this._renderer) {
                                    _context3.next = 4;
                                    break;
                                }

                                throw new HttpStatusError(501);

                            case 4:
                                return _context3.abrupt('return', this._renderer(request, response, afterPathname));

                            case 5:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function render(_x6, _x7, _x8) {
                return _ref3.apply(this, arguments);
            }

            return render;
        }()
    }, {
        key: 'renderer',
        set: function set(cb) {
            this._renderer = cb;
        }
    }, {
        key: 'requestFilter',
        set: function set(cb) {
            this._requestFilter = cb;
        }
    }, {
        key: 'responseFilter',
        set: function set(cb) {
            this._responseFilter = cb;
        }
    }]);

    return Dispatcher;
}();

module.exports = Dispatcher;

/**
 * This function create a dipartcher. A dispatcher is routing object that reads incoming http requests and
 * writes to an http response.
 * @param params. Configuration object whose attributes are:
 *  - renderer::<function(request::http.IncomingMessage, response::http.ServerResponse, afterPathname::string)> Async callback returning a string or a readable stream that will be rendered to an http response.
 *    afterPathName is the url pathname minus the dispatcher routing path
 *  - requestFilter::<function(request::http.IncomingMessage)> Async Callback called every time the dispatcher is traversed.
 *    Request filter is the ideal place to put authorization to protected resources.
 *  - responseFilter::<function(request::http.IncomingMessage,response::http.ServerResponse)> Like params.requestFilter but called after rendering.
 * @returns {Dispatcher}
 */
module.exports.makeDispatcher = function (params) {
    var dispatcher = new Dispatcher();
    dispatcher.renderer = params.remderer;
    dispatcher.requestFilter = params.requestFilter;
    dispatcher.responseFilter = params.responseFilter;
    return dispatcher;
};
//# sourceMappingURL=Dispatcher.js.map