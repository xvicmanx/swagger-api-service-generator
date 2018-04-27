'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeJSFile = exports.folderName = exports.isURL = exports.getEntityMetaDefinition = exports.getEntityDefinition = exports.endpointParamMetada = exports.endpointParamTypes = exports.getJSDocText = exports.endpointParamNames = exports.endpointsEach = exports.paramsInPath = exports.getOperationName = exports.getEndpointConstantName = exports.toTitleCase = exports.paramsIn = exports.snakeToCamelCase = exports.camelToSnakeCase = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var beautify = require('js-beautify').js_beautify;
var esformatter = require('esformatter');

esformatter.register(require('esformatter-jsx'));

var camelToSnakeCase = exports.camelToSnakeCase = function camelToSnakeCase(text) {
    return text.replace(/([a-z])([A-Z])/g, "$1_$2");
};

var snakeToCamelCase = exports.snakeToCamelCase = function snakeToCamelCase(text) {
    return text.replace(/(_)([a-z])/g, function (x, y, z) {
        return z.toUpperCase();
    });
};

var paramsIn = exports.paramsIn = function paramsIn() {
    var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return parameters.filter(function (p) {
        return p.in === location;
    }).map(function (p) {
        return p.name;
    });
};

var toTitleCase = exports.toTitleCase = function toTitleCase(text) {
    return '' + text.substring(0, 1).toUpperCase() + text.substring(1);
};

var getEndpointConstantName = exports.getEndpointConstantName = function getEndpointConstantName(name) {
    return camelToSnakeCase(name).toUpperCase();
};

var getOperationName = exports.getOperationName = function getOperationName(name) {
    var operationName = name.trim().replace(/(\s+|\-|\.|{|})/g, '_').replace(/_+/, '_').replace(/\W/, '');

    if (operationName.indexOf('_') > -1) {
        operationName = snakeToCamelCase(operationName.toLowerCase());
    }

    return operationName;
};

var paramsInPath = exports.paramsInPath = function paramsInPath(path) {
    return (path.match(/{(.*?)}/g) || []).map(function (m) {
        return m.replace(/({|})/g, '');
    });
};

var allPassFilter = function allPassFilter() {
    return true;
};
var endpointsEach = exports.endpointsEach = function endpointsEach(paths, callback) {
    var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : allPassFilter;

    var pathNames = Object.keys(paths);
    pathNames.forEach(function (pathName) {
        Object.keys(paths[pathName]).forEach(function (method) {
            var data = {
                pathName: pathName,
                method: method,
                endpoint: paths[pathName][method]
            };

            if (filter(data)) {
                callback(data);
            }
        });
    });
};

var endpointParamNames = exports.endpointParamNames = function endpointParamNames(_ref, path) {
    var parameters = _ref.parameters;

    return {
        bodyParams: paramsIn(parameters, 'body'),
        formsParams: paramsIn(parameters, 'formData'),
        queryParams: paramsIn(parameters, 'query'),
        headerParams: paramsIn(parameters, 'header'),
        pathParams: paramsInPath(path)
    };
};

var getJSDocText = exports.getJSDocText = function getJSDocText(_ref2) {
    var summary = _ref2.summary,
        description = _ref2.description,
        operationName = _ref2.operationName,
        parameters = _ref2.parameters,
        responses = _ref2.responses;

    var properiesText = parameters.reduce(function (text, param) {
        var paramType = param.type ? '{' + param.type + '}' : '';

        if (param.schema && param.schema['$ref']) {
            paramType = param.schema['$ref'].replace('#/definitions/', '');
            paramType = '{' + (paramType === 'integer' ? 'number' : paramType) + '}';
        }

        var requiredText = param.required ? '[required]' : '[optional]';
        return text + '\n * @property ' + paramType + ' ' + param.name + ' ' + requiredText + ' ' + param.description;
    }, '');

    return '\n    /** ' + operationName + '\n     * Summary: ' + (summary || description).replace('/**', '').trim() + '\n     * Description: ' + (description || summary).replace('/**', '').trim() + '\n     * \n     * @typedef ' + toTitleCase(operationName) + 'Payload\n     * ' + properiesText + '\n     * \n     * \n     * @param {' + toTitleCase(operationName) + 'Payload} ' + operationName + 'Payload\n     *\n     ' + getReturnType(responses || {}) + '\n     */';
};

var endpointParamTypes = exports.endpointParamTypes = function endpointParamTypes(_ref3, path) {
    var parameters = _ref3.parameters,
        definitions = _ref3.definitions;

    return parameters.reduce(function (acc, p) {
        var type = 'string';
        if (p.type) {
            type = p.type;
        } else if (p.schema && p.schema['$ref']) {
            type = getEntityDefinition(definitions, p.schema['$ref'].replace('#/definitions/', ''), true);
        }

        return _extends({}, acc, _defineProperty({}, p.name, type));
    }, {});
};

var getReturnType = function getReturnType(responses) {
    var data = '';
    Object.keys(responses).forEach(function (status) {
        data += '*  ' + status + ' - ' + responses[status].description + '\n';
    });
    data += '*\n';

    var result = Object.entries(responses).find(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
            k = _ref5[0],
            v = _ref5[1];

        return k.indexOf('200') >= 0;
    });

    var okResponse = result && result[1];

    if (okResponse && okResponse.schema) {
        var schema = okResponse.schema;
        var dataType = schema.type;

        if (!dataType) {
            dataType = schema['$ref'].replace('#/definitions/', '');
        } else if (dataType === 'array' && schema.items && schema.items['$ref']) {
            dataType = 'Array<' + schema.items['$ref'].replace('#/definitions/', '') + '>';
        }

        data += '* @return {Promise<' + dataType + '>}';
    } else {
        data += '* @return {Promise}';
    }

    return data;
};

var endpointParamMetada = exports.endpointParamMetada = function endpointParamMetada(_ref6, path) {
    var parameters = _ref6.parameters,
        definitions = _ref6.definitions;

    return parameters.reduce(function (acc, p) {
        var meta = {};
        if (!p.schema) {
            meta = p;
        } else if (p.schema && p.schema['$ref']) {
            meta = getEntityMetaDefinition(definitions, p.schema['$ref'].replace('#/definitions/', ''), true);
        }
        return _extends({}, acc, _defineProperty({}, p.name, meta));
    }, {});
};

var getEntityDefinition = exports.getEntityDefinition = function getEntityDefinition(definitions, objType) {
    var recursive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var obj = definitions[objType];

    return Object.keys(obj.properties).reduce(function (acc, propName) {
        var type = obj.properties[propName].type;
        var ref = obj.properties[propName]['$ref'];

        if (ref && ref.indexOf('#/definitions/') > -1) {
            type = ref.replace('#/definitions/', '');

            if (recursive) {
                type = getEntityDefinition(definitions, type, recursive);
            }
        }

        return _extends({}, acc, _defineProperty({}, propName, type));
    }, {});
};

var getEntityMetaDefinition = exports.getEntityMetaDefinition = function getEntityMetaDefinition(definitions, objType) {
    var recursive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var obj = definitions[objType];

    return Object.keys(obj.properties).reduce(function (acc, propName) {
        var meta = obj.properties[propName];
        var ref = obj.properties[propName]['$ref'];

        if (ref && ref.indexOf('#/definitions/') > -1) {
            meta = ref.replace('#/definitions/', '');

            if (recursive) {
                meta = getEntityMetaDefinition(definitions, meta, recursive);
            }
        }

        return _extends({}, acc, _defineProperty({}, propName, meta));
    }, {});
};

var isURL = exports.isURL = function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + '((\\d{1,3}\\.){3}\\d{1,3}))' + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + '(\\?[;&a-z\\d%_.~+=-]*)?' + '(\\#[-a-z\\d_]*)?$', 'i');
    return pattern.test(str);
};

var folderName = exports.folderName = function folderName(_ref7) {
    var info = _ref7.info;

    var name = info.title.toLowerCase().trim().replace(/[^A-Za-z]+/g, '').replace(/\s+/, '-');
    return name + '-api';
};

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

var writeJSFile = exports.writeJSFile = function writeJSFile(file, content) {
    var es6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var result = void 0;

    if (es6) {
        result = esformatter.format(content, options);
    } else {
        result = beautify(content, { indent_size: 2 });
    }

    _fsExtra2.default.ensureFileSync(file);
    _fs2.default.writeFileSync(file, result);
};

exports.default = {
    camelToSnakeCase: camelToSnakeCase,
    snakeToCamelCase: snakeToCamelCase,
    paramsIn: paramsIn,
    getEndpointConstantName: getEndpointConstantName,
    getOperationName: getOperationName,
    endpointParamNames: endpointParamNames,
    toTitleCase: toTitleCase,
    getEntityDefinition: getEntityDefinition,
    paramsInPath: paramsInPath,
    endpointsEach: endpointsEach,
    isURL: isURL,
    writeJSFile: writeJSFile,
    folderName: folderName,
    getJSDocText: getJSDocText
};