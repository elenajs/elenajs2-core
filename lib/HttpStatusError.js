"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('gulp-polyfill');

var httpStatus = require('./utils/HttpStatus.js');

var ExtendableError = function (_Error) {
    _inherits(ExtendableError, _Error);

    function ExtendableError(message) {
        _classCallCheck(this, ExtendableError);

        var _this = _possibleConstructorReturn(this, (ExtendableError.__proto__ || Object.getPrototypeOf(ExtendableError)).call(this, message));

        _this.name = _this.constructor.name;
        _this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(_this, _this.constructor);
        } else {
            _this.stack = new Error(message).stack;
        }
        return _this;
    }

    return ExtendableError;
}(Error);

var HttpStatusError = function (_ExtendableError) {
    _inherits(HttpStatusError, _ExtendableError);

    function HttpStatusError(statusCode, message) {
        _classCallCheck(this, HttpStatusError);

        statusCode = statusCode.toString(10);

        var _this2 = _possibleConstructorReturn(this, (HttpStatusError.__proto__ || Object.getPrototypeOf(HttpStatusError)).call(this, message || statusCode + ' - ' + httpStatus[statusCode]));

        _this2._statusCode = statusCode;
        return _this2;
    }

    _createClass(HttpStatusError, [{
        key: 'statusCode',
        get: function get() {
            return this._statusCode;
        }
    }, {
        key: 'statusDescription',
        get: function get() {
            return HttpStatus.getStatusDescription(this.statusCode);
        }
    }]);

    return HttpStatusError;
}(ExtendableError);

module.exports = HttpStatusError;
//# sourceMappingURL=HttpStatusError.js.map