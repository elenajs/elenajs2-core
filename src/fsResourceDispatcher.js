"use strict";
require('gulp-polyfill');

const makeDispatcher = require('./Dispatcher').makeDispatcher,
    dfs = require('./utils/dfs.js'),
    path = require('path'),
    mimeType = require('mimetype');

/**
 * This function create a dipartcher. A dispatcher is routing object that reads incoming http requests and
 * writes to an http response.
 * @param params. Configuration object whose attributes are:
 *  - resourcePath::string Where the resources are stored .
 *    afterPathName is the url pathname minus the dispatcher routing path
 *  - requestFilter::<function(request::http.IncomingMessage)> Async Callback called every time the dispatcher is traversed.
 *    Request filter is the ideal place to put authorization to protected resources.
 *  - responseFilter::<function(request::http.IncomingMessage,response::http.ServerResponse)> Like params.requestFilter but called after rendering.
 * @returns {Dispatcher}
 */
module.exports = function(resourcePath, params) {
    let dispatcher = makeDispatcher({
        renderer: async function(request, response, afterPathname) {
            let fileStream = null,
                resourcePath = path.resolve(resourcePath, afterPathname.split('/')),
                stats = await dfs.stat(resourcePath),
                etag = stats.size.toString(16) + '-' + Date.parse(stats.mtime).toString(16);
            if (request.headers['if-none-match'] === etag) {
                response.writeHead(304, {
                    'Content-Length': 0
                });
            } else {
                fileStream = dfs.createReadStream(resourcePath);
                let head = {
                    'Content-Length': stats.size,
                    'Content-Type': mimeType.lookup(resourcePath) || "application/octet-stream",
                    'ETag': etag
                };
                if (this.inline) {
                    head['Content-Disposition'] = 'inline; filename="' + path.basename(resourcePath) + '"';
                }
                response.writeHead(200, head);
            }
            return fileStream;
        }
    });
};