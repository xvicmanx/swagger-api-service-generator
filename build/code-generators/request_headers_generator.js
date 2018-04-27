'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helpers = require('../helpers');

var _templateCompiler = require('../utils/template-compiler');

var _templateCompiler2 = _interopRequireDefault(_templateCompiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REQUEST_HEADERS_TEMPLATE = 'request-headers-template.tpl.js';

// Receives api definition

exports.default = function (_ref) {
    var securityDefinitions = _ref.securityDefinitions;

    var methods = Object.keys(securityDefinitions || []).map(function (definition) {
        return (0, _helpers.snakeToCamelCase)(definition) + ' : (data) => {},';
    });
    return _templateCompiler2.default.compile(REQUEST_HEADERS_TEMPLATE, {
        methodsText: methods.join('') + '\n'
    });
};