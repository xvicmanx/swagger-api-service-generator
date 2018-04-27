#!/usr/bin/env node

'use strict';

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _helpers = require('../lib/helpers');

var _lib = require('../lib/');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _asyncToGenerator(fn) {
  return function () {
    var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);var value = info.value;
        } catch (error) {
          reject(error);return;
        }if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }return step("next");
    });
  };
}

var CONFIG_FILE_NAME = 'swagger-service-generator-config.js';
var CWD = process.cwd();

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var config, definition;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          config = {};

          if (!_fs2.default.existsSync(CWD + '/' + CONFIG_FILE_NAME)) {
            _context.next = 5;
            break;
          }

          config = require(CWD + '/' + CONFIG_FILE_NAME);
          _context.next = 7;
          break;

        case 5:
          console.error(CWD + '/' + CONFIG_FILE_NAME + ' does not exists');
          return _context.abrupt('return', false);

        case 7:
          if (config.swaggerDefinitionFile) {
            _context.next = 10;
            break;
          }

          console.error("swaggerDefinitionFile is not in the config");
          return _context.abrupt('return', false);

        case 10:
          if (!(0, _helpers.isURL)(config.swaggerDefinitionFile)) {
            _context.next = 17;
            break;
          }

          _context.next = 13;
          return (0, _nodeFetch2.default)(config.swaggerDefinitionFile).then(function (response) {
            return response.json();
          });

        case 13:
          definition = _context.sent;

          _lib2.default.generateServices(definition, config.endPointFilter);
          _context.next = 19;
          break;

        case 17:
          console.error("swaggerDefinitionFile is not valid");
          return _context.abrupt('return', false);

        case 19:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))();