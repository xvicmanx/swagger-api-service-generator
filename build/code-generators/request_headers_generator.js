'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helpers = require('../helpers');

// Receives api definition
exports.default = function (_ref) {
    var securityDefinitions = _ref.securityDefinitions;

    var methods = Object.keys(securityDefinitions || []).map(function (definition) {
        return (0, _helpers.snakeToCamelCase)(definition) + ' : (data) => {},';
    });

    return '\n    const RequestHeaders = {' + methods.join('') + '\n};\n    \n    export default RequestHeaders;\n    ';
};