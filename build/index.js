"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _helpers = require("./helpers");

var _request_headers_generator = require("./code-generators/request_headers_generator");

var _request_headers_generator2 = _interopRequireDefault(_request_headers_generator);

var _request_util_generator = require("./code-generators/request_util_generator");

var _request_util_generator2 = _interopRequireDefault(_request_util_generator);

var _endpoints_generator = require("./code-generators/endpoints_generator");

var _endpoints_generator2 = _interopRequireDefault(_endpoints_generator);

var _service_generator = require("./code-generators/service_generator");

var _service_generator2 = _interopRequireDefault(_service_generator);

var _actions_generator = require("./code-generators/actions_generator");

var _actions_generator2 = _interopRequireDefault(_actions_generator);

var _component_generator = require("./code-generators/component_generator");

var _component_generator2 = _interopRequireDefault(_component_generator);

var _container_generator = require("./code-generators/container_generator");

var _container_generator2 = _interopRequireDefault(_container_generator);

var _reducers_generator = require("./code-generators/reducers_generator");

var _reducers_generator2 = _interopRequireDefault(_reducers_generator);

var _index_js_generator = require("./code-generators/index_js_generator");

var _index_js_generator2 = _interopRequireDefault(_index_js_generator);

var _package_json_generator = require("./code-generators/package_json_generator");

var _package_json_generator2 = _interopRequireDefault(_package_json_generator);

var _routes_generator = require("./code-generators/routes_generator");

var _routes_generator2 = _interopRequireDefault(_routes_generator);

var _index_html_generator = require("./code-generators/index_html_generator");

var _index_html_generator2 = _interopRequireDefault(_index_html_generator);

var _nodeFetch = require("node-fetch");

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require("babel-core/register");
require("babel-polyfill");

var beautify = require('js-beautify').js_beautify;

var esformatter = require('esformatter');
esformatter.register(require('esformatter-jsx'));

var options = {
  "plugins": ["esformatter-jsx"],
  jsx: {
    "formatJSX": true,
    "attrsOnSameLineAsTag": false,
    "maxAttrsOnTag": 3,
    "firstAttributeOnSameLine": true,
    "formatJSXExpressions": true,
    "JSXExpressionsSingleLine": true,
    "alignWithFirstAttribute": false,
    "spaceInJSXExpressionContainers": " ",
    "removeSpaceBeforeClosingJSX": false,
    "closingTagOnNewLine": false,
    "JSXAttributeQuotes": "",
    "htmlOptions": {}
  }
};

var writeFile = function writeFile(file, content) {
  var es6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var result = void 0;
  if (es6) {
    result = esformatter.format(content, options);
  } else {
    result = beautify(content, { indent_size: 2 });
  }

  _fs2.default.writeFileSync(file, result);
};

var folderName = function folderName(_ref) {
  var info = _ref.info;

  var name = info.title.toLowerCase().trim().replace(/[^A-Za-z]+/g, '').replace(/\s+/, '-');
  return name + "-api";
};

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var definition, dir, pathNames;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _nodeFetch2.default)("http://demo9767193.mockable.io").then(function (response) {
            return response.json();
          });

        case 2:
          definition = _context.sent;
          dir = folderName(definition);


          if (!_fs2.default.existsSync(dir)) {
            _fs2.default.mkdirSync(dir);
          }

          if (!_fs2.default.existsSync(dir + "/src/")) {
            _fs2.default.mkdirSync(dir + "/src/", 744);
          }

          writeFile(dir + "/src/request.js", (0, _request_util_generator2.default)());
          writeFile(dir + "/src/endpoints.js", (0, _endpoints_generator2.default)(definition));
          writeFile(dir + "/src/headers.js", (0, _request_headers_generator2.default)(definition));
          writeFile(dir + "/src/service.js", (0, _service_generator2.default)(definition));
          writeFile(dir + "/src/actions.js", (0, _actions_generator2.default)(definition));
          writeFile(dir + "/src/reducers.js", (0, _reducers_generator2.default)(definition));
          writeFile(dir + "/src/index.js", (0, _index_js_generator2.default)(definition), true);
          writeFile(dir + "/src/routes.js", (0, _routes_generator2.default)(definition), true);
          writeFile(dir + "/package.json", (0, _package_json_generator2.default)(definition));

          pathNames = Object.keys(definition.paths);

          if (!_fs2.default.existsSync(dir + "/src/components/")) {
            _fs2.default.mkdirSync(dir + "/src/components/", 744);
          }

          if (!_fs2.default.existsSync(dir + "/src/containers/")) {
            _fs2.default.mkdirSync(dir + "/src/containers/", 744);
          }

          if (!_fs2.default.existsSync(dir + "/public/")) {
            _fs2.default.mkdirSync(dir + "/public/", 744);
          }

          writeFile(dir + "/public/index.html", (0, _index_html_generator2.default)(definition), true);

          pathNames.forEach(function (pathName) {
            Object.keys(definition.paths[pathName]).forEach(function (method) {
              var endpoint = definition.paths[pathName][method];
              var name = (0, _helpers.toTitleCase)((0, _helpers.getOperationName)(endpoint.operationId));

              writeFile(dir + "/src/components/" + name + "Component.js", (0, _component_generator2.default)(endpoint, pathName, method), true);

              writeFile(dir + "/src/containers/" + name + "Container.js", (0, _container_generator2.default)(endpoint, pathName), true);
            });
          });

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))();