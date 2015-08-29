"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RequestContext = require('./RequestContext.js'),
    HttpStatusError = require('./errors/HttpStatusError.js'),
    EventEmitter = require('events').EventEmitter;

var Dispatcher = (function (_EventEmitter) {
    _inherits(Dispatcher, _EventEmitter);

    _createClass(Dispatcher, [{
        key: 'parent',
        get: function get() {
            return this._parent;
        }
    }]);

    function Dispatcher() {
        _classCallCheck(this, Dispatcher);

        _get(Object.getPrototypeOf(Dispatcher.prototype), 'constructor', this).call(this);
        this._dispatchers = [];
    }

    _createClass(Dispatcher, [{
        key: 'addDispatchers',
        value: function addDispatchers(dispatchers) {
            [].concat(dispatchers).forEach((function (dispatcher) {
                dispatcher._parent = this;
                this._dispatchers.push(dispatcher);
            }).bind(this));
        }
    }, {
        key: 'toString',
        value: function toString() {
            var name = 'Dispatcher';
            return '[object ' + name + ']';
        }
    }, {
        key: 'isEligible',
        value: function isEligible(requestContext) {
            return false;
        }
    }, {
        key: '_processRequest',
        value: function _processRequest(requestContext) {
            var dispatchers = this.dispatchers.map(function (dispatcher) {
                return Promise.resolve({
                    then: function then(resolve) {
                        return resolve(dispatcher.isEligible(requestContext));
                    }
                }).then(function (data) {
                    return data && dispatcher || null;
                });
            });
            return Promise.all(dispatchers).then((function (values) {
                var currDispatcher = values.find(function (dispatcher) {
                    return dispatcher !== null;
                }) || this;
                return currDispatcher._render(requestContext);
            }).bind(this));
        }
    }, {
        key: '_render',
        value: function _render(requestContext) {
            var self = this;
            return requestContext.handleResponse().then(function () {
                return Promise.resolve({
                    then: function then(resolve) {
                        return resolve(self.render(requestContext));
                    }
                });
            });
        }
    }, {
        key: 'render',
        value: function render(requestContext) {
            throw new HttpStatusError(501);
        }
    }, {
        key: 'dispatchers',
        get: function get() {
            return this._dispatchers;
        }
    }]);

    return Dispatcher;
})(EventEmitter);

module.exports = Dispatcher;
//# sourceMappingURL=Dispatcher.js.map