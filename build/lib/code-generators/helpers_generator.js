'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateCompiler = require('../utils/template-compiler');

var _templateCompiler2 = _interopRequireDefault(_templateCompiler);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var HELPERS_TEMPLATE = 'helpers-template.tpl.js';

exports.default = function () {
  return _templateCompiler2.default.compile(HELPERS_TEMPLATE);
};