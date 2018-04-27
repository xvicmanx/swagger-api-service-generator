"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-core/register");
require("babel-polyfill");

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var TemplateCompiler = {
    compile: function compile(template) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var content = _fs2.default.readFileSync(__dirname + "/../templates/" + template);
        return Object.keys(data).reduce(function (acc, key) {
            return acc.replaceAll('${' + key + '}', data[key]);
        }, content.toString());
    }
};

exports.default = TemplateCompiler;