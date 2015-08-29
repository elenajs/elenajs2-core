"use strict";

let HttpStatusError = require('./errors/HttpStatusError.js'),
    Dispatcher = require('./Dispatcher.js'),
    dfs = require('./utils/dfs.js'),
    path = require('path'),
    url = require('url'),
    mimeType = require('mimetype');

class FsResourceDispatcher extends Dispatcher {
    toString() {
        let name = 'FsResourceDispatcher';
        return `[object ${name}]`;
    }

    constructor(rootPath, resourcePath, inline) {
        super();

        this._rootPath = rootPath;
        this._resourcePath = resourcePath;
        this._inline = (inline !== undefined) ? inline : true;
    }

    get rootPath() {
        return this._rootPath;
    }

    get inline() {
        return this._inline;
    }

    get resourcePath() {
        return this._resourcePath;
    }

    isEligible(requestContext) {
        let request = requestContext.request,
            reqPathname = url.parse(request.url).pathname,
            resourcePath = path.resolve(this.resourcePath, reqPathname.substr(this.rootPath.length));

        return dfs.stat(resourcePath).then(function (stats) {
            if (!stats.isDirectory()) {
                requestContext.stats = stats;
                return true;
            }
        }).catch(function (err) {
            if (err.errno !== -2) { //NOENT
                throw new HttpStatusError(500);
            }
        });

    }

    render(requestContext) {
        let request = requestContext.request,
            response = requestContext.response,
            stats = requestContext.stats,
            reqPathname = url.parse(request.url).pathname,
            resourcePath = path.resolve(this.resourcePath, reqPathname.substr(this.rootPath.length));
        let etag = stats.size.toString(16) + '-' + Date.parse(stats.mtime).toString(16);
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

}
module.exports = FsResourceDispatcher;