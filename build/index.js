"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _projectGenerator = require("./utils/project-generator");

var _projectGenerator2 = _interopRequireDefault(_projectGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require("babel-core/register");
require("babel-polyfill");

var CWD = process.cwd();

var generateProject = function generateProject(definition, endpointFilter) {
  var filter = function filter() {
    return true;
  };

  if (endpointFilter) {
    filter = endpointFilter;
  }

  var generator = new _projectGenerator2.default(CWD, definition, filter);

  generator.generateProject();
};

exports.default = {
  generateServices: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(definition, endpointFilter) {
      var operationNamesUsed;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              operationNamesUsed = {};

              Object.keys(definition.paths).forEach(function (pathName) {
                Object.keys(definition.paths[pathName]).forEach(function (method) {
                  var methodObj = definition.paths[pathName][method];
                  var byIdSuffix = pathName.indexOf('{id}') > -1 ? 'ById' : '';
                  var proposalOfOperationId = "" + method + methodObj.tags[0] + byIdSuffix;

                  if (operationNamesUsed[proposalOfOperationId]) {
                    var index = operationNamesUsed[proposalOfOperationId];
                    operationNamesUsed[proposalOfOperationId] += 1;
                    proposalOfOperationId = "" + proposalOfOperationId + index;
                  }

                  methodObj.operationId = methodObj.operationId || proposalOfOperationId;
                  operationNamesUsed[methodObj.operationId] = operationNamesUsed[methodObj.operationId] || 0;
                  operationNamesUsed[methodObj.operationId] += 1;

                  var _iteratorNormalCompletion = true;
                  var _didIteratorError = false;
                  var _iteratorError = undefined;

                  try {
                    var _loop = function _loop() {
                      var parameter = _step.value;

                      if (parameter['$ref'] && parameter['$ref'].indexOf('#/parameters/') > -1) {
                        var paramDefinitionName = parameter['$ref'].replace('#/parameters/', '');
                        var def = definition.parameters[paramDefinitionName];
                        Object.keys(def).forEach(function (prop) {
                          parameter[prop] = def[prop];
                        });
                      }
                    };

                    for (var _iterator = definition.paths[pathName][method].parameters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      _loop();
                    }
                  } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                      }
                    } finally {
                      if (_didIteratorError) {
                        throw _iteratorError;
                      }
                    }
                  }
                });
              });

              generateProject(definition, endpointFilter);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function generateServices(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }()
};