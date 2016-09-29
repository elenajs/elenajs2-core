"use strict";

require('gulp-polyfill');

const fs = require('fs');

function asDeferred(fn, self, noError) {

    self = self || this;
    return noError ? function () {
        let args = Array.prototype.slice.call(arguments);
        return new Promise(function (resolve) {
            args.push(function () {
                var a = Array.prototype.slice.call(arguments);
                resolve(a.length > 1 ? a : a.length ? a[0] : null);
            });
            fn.apply(self, args);
        });
    } : function () {
        let args = Array.prototype.slice.call(arguments);
        return new Promise(function (resolve, reject) {
            args.push(function () {
                var a = Array.prototype.slice.call(arguments),
                    err = a.shift();
                if (err) {
                    reject(err);
                } else {
                    resolve(a.length > 1 ? a : a.length ? a[0] : null);
                }
            });
            fn.apply(self, args);
        });
    };
}

let dfs = {},
    singleArgFunctions = ['exists'];

for (let functionName  in fs) {
    let functionCode = fs[functionName];
    if (functionName && functionCode) {
        if (typeof functionCode === 'function' && !/(^[_A-Z]|^create|^(un)?watch|Sync$)/.test(functionName)) { // It is something we want to convert
            dfs[functionName] = asDeferred(functionCode, fs, ~singleArgFunctions.indexOf(functionName)); // Create a deferred
        } else {
            dfs[functionName] = functionCode; // Leave alone
        }
    }
}

module.exports = dfs;