"use strict";
require('gulp-polyfill');

const Dispatcher = require('./Dispatcher'),
    makeFsDispatcher = require('./fsResourceDispatcher');

/**
 * This method is used to create a dispatcher chain
 * @param parent the parent dispatcher
 * @param nodeName Used to create a the path where the dispatcher will be attached. The path is created traversing the dispatchers chain
 * @param dispatcher The dispatcher that is to be associated to the given node.
 * @returns {function(request::http.IncomingMessage, response::http.ServerResponse)} Callback that can be used as a callback for http.createServer
 */
module.exports.addDispatcher = function(dispatcher, parent, nodeName) {
    parent && parent.addDispatcher(nodeName, dispatcher);
    return (request, response) => {
        dispatcher.dispatch(request, response);
    }
};

module.exports.makeDispatcher = Dispatcher.makeDispatcher;
module.exports.makeFsDispatcher = makeFsDispatcher;