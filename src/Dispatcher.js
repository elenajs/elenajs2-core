"use strict";
require('gulp-polyfill');

const path = require('path'),
    url = require('url'),
    HttpStatusError = require('./HttpStatusError.js');



class Dispatcher {

    constructor() {
        this._dispatchers = {};
    }

    set renderer(cb) {
        this._renderer = cb;
    }

    set requestFilter(cb) {
        this._requestFilter = cb;
    }

    set responseFilter(cb) {
        this._responseFilter = cb;
    }

    addDispatcher(pathKey, dispatcher) {
        this._dispatchers[pathKey] = dispatcher;
        return this;
    }

    toString() {
        let name = 'Dispatcher';
        return `[object ${name}]`;
    }


    async _selectDispatcher(pathArray, request, responseFilters) {
        if (this._requestFilter) {
            await this._requestFilter(request);
        }
        if (this._responseFilter) {
            responseFilters.push(this._responseFilter);
        }
        let currDispatcher = this._dispatchers[pathArray.shift().replace(/\..*$/,'')];
        return (currDispatcher && await currDispatcher.isEligible(request) && currDispatcher._selectDispatcher(pathArray, request, responseFilters)) || this;
    }

    async dispatch(request, response) {
        let responseServed = false;
        response.once('finish', () => {responseServed=true;});
        let pathArray = url.parse(request.url).pathname.split('/');

        let responseFilters = [],
            dispatcher = this._selectDispatcher(pathArray.slice(1), request, responseFilters);

        let data = await dispatcher.render(request, response, pathArray.join('/'));
        responseFilters.forEach((filter) => filter(requst, response));
        if (!responseServed) {
            if (typeof data === 'string') {
                response.end(data);
            } else {
                data.pipe(response);
            }
        }

    }

    async render(request, response, afterPathname) {
        if (!this._renderer) {
            throw new HttpStatusError(501);
        } else {
            return this._renderer(request, response, afterPathname);
        }
    }

}

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
    let dispatcher = new Dispatcher();
    dispatcher.renderer = params.remderer;
    dispatcher.requestFilter = params.requestFilter;
    dispatcher.responseFilter = params.responseFilter;
    return dispatcher;
};
