"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('gulp-polyfill');

var makeDispatcher = require('./Dispatcher').makeDispatcher,
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
module.exports = function (resourcePath, params) {
    var dispatcher = makeDispatcher({
        renderer: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request, response, afterPathname) {
                var fileStream, resourcePath, stats, etag, head;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                fileStream = null;
                                resourcePath = path.resolve(resourcePath, afterPathname.split('/'));
                                _context.next = 4;
                                return dfs.stat(resourcePath);

                            case 4:
                                stats = _context.sent;
                                etag = stats.size.toString(16) + '-' + Date.parse(stats.mtime).toString(16);

                                if (request.headers['if-none-match'] === etag) {
                                    response.writeHead(304, {
                                        'Content-Length': 0
                                    });
                                } else {
                                    fileStream = dfs.createReadStream(resourcePath);
                                    head = {
                                        'Content-Length': stats.size,
                                        'Content-Type': mimeType.lookup(resourcePath) || "application/octet-stream",
                                        'ETag': etag
                                    };

                                    if (this.inline) {
                                        head['Content-Disposition'] = 'inline; filename="' + path.basename(resourcePath) + '"';
                                    }
                                    response.writeHead(200, head);
                                }
                                return _context.abrupt('return', fileStream);

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function renderer(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return renderer;
        }()
    });
};
//# sourceMappingURL=fsResourceDispatcher.js.map