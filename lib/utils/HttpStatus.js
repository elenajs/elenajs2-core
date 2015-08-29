"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _status = {
    "100": "Continue",
    "101": "Switching Protocols",
    "102": "Processing",
    "200": "OK",
    "201": "Created",
    "202": "Accepted",
    "203": "Non-Authoritative Information",
    "204": "No Content",
    "205": "Reset Content",
    "206": "Partial Content",
    "207": "Multi-Status",
    "299": "Aborted",
    "300": "Multiple Choices",
    "301": "Moved Permanently",
    "302": "Found",
    "303": "See Other",
    "304": "Not Modified",
    "305": "Use Proxy",
    "307": "Temporary Redirect",
    "400": "Bad Request",
    "401": "Unauthorized",
    "402": "Payment Required",
    "403": "Forbidden",
    "404": "Not Found",
    "405": "Method Not Allowed",
    "406": "Not Acceptable",
    "407": "Proxy Authentication Required",
    "408": "Request Timeout",
    "409": "Conflict",
    "410": "Gone",
    "411": "Length Required",
    "412": "Precondition Failed",
    "413": "Payload Too Large",
    "414": "URI Too Long",
    "415": "Unsupported Media Type",
    "416": "Range Not Satisfiable",
    "417": "Expectation Failed",
    "422": "Unprocessable Entity",
    "423": "Locked",
    "424": "Failed Dependency",
    "426": "Upgrade Required",
    "428": "Precondition Required",
    "429": "Too Many Requests",
    "431": "Request Header Fields Too Large",
    "500": "Internal Server Error",
    "501": "Not Implemented",
    "502": "Bad Gateway",
    "503": "Service Unavailable",
    "504": "Gateway Time-out",
    "505": "HTTP Version Not Supported",
    "507": "Insufficient Storage",
    "511": "Network Authentication Required"
};

/**
 * Utils class to to represent http status for ejs2.
 * @class
 */

var HttpStatus = (function () {
    _createClass(HttpStatus, [{
        key: "toString",
        value: function toString() {
            var name = 'utils/HttpStatus';
            return "[object " + name + "]";
        }
    }, {
        key: "code",

        /**
         * Http status code
         * @returns {int}
         */
        get: function get() {
            return this._statusCode;
        }

        /**
         * Status description. if not set in constructor the HTTP error transcodification is used.
         * @returns {String }
         */
    }, {
        key: "reason",
        get: function get() {
            return this._reason;
        }

        /**
         * Class contructor
         * @param {!int} code Required parameter, should be one of the http status codes
         * @param {String} reason Optional pearameter that indicates the description of the status.
         */
    }], [{
        key: "getStatusDescription",
        value: function getStatusDescription(code) {
            return _status[code.toString()];
        }
    }]);

    function HttpStatus(code, reason) {
        _classCallCheck(this, HttpStatus);

        var message = reason || _status[code.toString()] || "Unknown";
        this._statusCode = parseInt(code);
        this._reason = message;
    }

    return HttpStatus;
})();

module.exports = HttpStatus;
//# sourceMappingURL=../utils/HttpStatus.js.map