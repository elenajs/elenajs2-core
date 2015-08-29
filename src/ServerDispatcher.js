"use strict";
let http = require('http'),
    url = require('url'),
    Dispatcher = require('./Dispatcher.js'),
    HttpStatusError = require('./errors/HttpStatusError.js'),
    RequestContext = require('./RequestContext.js');

class ServerDispatcher extends Dispatcher {
    toString() {
        let name = 'ServerDispatcher';
        return `[object ${name}]`;
    }


    get requestListener() {
        return function (request, response) {
            this._dispatch(request, response);
        }.bind(this);
    }

    _dispatch(request, response) {
        let self = this,
            requestContext = new RequestContext(request, response);

        this._processRequest(requestContext).then(function () {
            self.emit('request', requestContext);
        }).catch(function (err) {
            self.render(requestContext, err);
        }).catch(function (err) {
            self.emit('error', err, requestContext);
        });
    }


    isEligible(requestContext) {
        return true;
    }

    render(requestContext, err) {
        let response = requestContext.response,
            httpStatusError;
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

    renderErrorPage(requestContext, httpStatusError) {
        let response = requestContext.response,
            errorPage = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=Edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <title>${httpStatusError.statusCode}: ${httpStatusError.statusDescription}</title>
        </head>
        <body>
            <h1>${httpStatusError.statusCode} ${httpStatusError.statusDescription}</h1>
            <p>${httpStatusError.message}</p>
        </body>
        </html>`;
        response.writeHead(httpStatusError.statusCode.toString(), {
            'Content-Type': 'text/html'
        });
        response.end(errorPage);

        this.emit('error', httpStatusError, requestContext);
    }
}
module.exports = ServerDispatcher;