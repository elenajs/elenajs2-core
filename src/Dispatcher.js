"use strict";
let RequestContext = require('./RequestContext.js'),
    HttpStatusError = require('./errors/HttpStatusError.js'),
    EventEmitter = require('events').EventEmitter;

class Dispatcher extends EventEmitter {
    get parent() {
        return this._parent;
    }


    constructor() {
        super();
        this._dispatchers = [];
    }

    get dispatchers() {
        return this._dispatchers;
    }

    addDispatchers(dispatchers) {
        [].concat(dispatchers).forEach(function (dispatcher) {
            dispatcher._parent = this;
            this._dispatchers.push(dispatcher);
        }.bind(this));
    }

    toString() {
        let name = 'Dispatcher';
        return `[object ${name}]`;
    }

    isEligible(requestContext) {
        return false;
    }

    _processRequest(requestContext) {
        let dispatchers = this.dispatchers.map(
            function (dispatcher) {
                return Promise.resolve({
                    then: function (resolve) {
                        return resolve(dispatcher.isEligible(requestContext));
                    }
                }).then(function (data) {
                    return data && dispatcher || null;
                });
            }
        );
        return Promise.all(dispatchers).then(function (values) {
            var currDispatcher = values.find(function (dispatcher) {
                    return dispatcher !== null;
                }) || this;
            return currDispatcher._render(requestContext);
        }.bind(this));

    }

    _render(requestContext) {
        let self = this;
        return requestContext.handleResponse().then(function () {
            return Promise.resolve({
                then: function (resolve) {
                    return resolve(self.render(requestContext))
                }
            })
        });
    }

    render(requestContext) {
        throw new HttpStatusError(501);
    }

}
module.exports = Dispatcher;