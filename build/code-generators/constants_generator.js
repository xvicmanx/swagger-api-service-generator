'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _templateCompiler = require('../utils/template-compiler');

var _templateCompiler2 = _interopRequireDefault(_templateCompiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONSTANTS_TEMPLATE = 'constants-template.tpl.js';

exports.default = function (_ref, filter) {
    var schemes = _ref.schemes,
        host = _ref.host,
        basePath = _ref.basePath;

    var scheme = schemes && schemes.length > 0 ? schemes[0] : 'http';
    return _templateCompiler2.default.compile(CONSTANTS_TEMPLATE, {
        base: scheme + '://' + host + basePath
    });
};