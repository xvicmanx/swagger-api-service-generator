'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _helpers = require('../helpers');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getHeaderText = function getHeaderText(header, params) {
    return header + ': RequestHeaders.' + (0, _helpers.snakeToCamelCase)(header) + '({' + params + '}),';
};

var getJSDocText = function getJSDocText(_ref) {
    var summary = _ref.summary,
        description = _ref.description,
        operationName = _ref.operationName,
        parameters = _ref.parameters;

    var paramsText = parameters.reduce(function (text, param) {
        var paramType = param.type ? '{' + param.type + '}' : '';
        var requiredText = param.required ? '[required]' : '[optional]';
        return text + '\n * @param ' + paramType + ' ' + param.name + ' ' + requiredText + ' ' + param.description;
    }, '');

    return '\n    /** ' + operationName + '\n     * Summary: ' + (summary || description) + '\n     * Description: ' + (description || summary) + '\n     * ' + paramsText + '\n     * \n     * @returns.\n     */';
};

var dataTypes = {
    'application/json': 'json',
    'application/xml': 'xml',
    'application/javascript': 'jsonp',
    'text/html': 'html',
    'text/plain': 'text',
    'multipart/form-data': 'form-data',
    'application/x-www-form-urlencoded': 'url-encoded'
};

var getContentType = function getContentType(consumes) {
    if (consumes) {
        var jsonPresent = consumes.indexOf('application/json') >= 0;
        return jsonPresent ? 'json' : dataTypes[consumes[0]];
    }
    return '';
};

var getMethodText = function getMethodText(path, method, endpoint) {
    var _ref2;

    var paramNames = (0, _helpers.endpointParamNames)(endpoint, path);
    var allParams = (_ref2 = []).concat.apply(_ref2, _toConsumableArray(paramNames.pathParams).concat(_toConsumableArray(paramNames.bodyParams), _toConsumableArray(paramNames.queryParams), _toConsumableArray(paramNames.formsParams)));

    var operationName = (0, _helpers.getOperationName)(endpoint.operationId);
    var endName = (0, _helpers.getEndpointConstantName)(operationName);
    var canProduceJSON = (endpoint.produces || []).indexOf('application/json') > -1;
    var headerKeys = (endpoint.security || []).reduce(function (acc, s) {
        return acc.concat.apply(acc, _toConsumableArray(Object.keys(s)));
    }, []);

    var headersText = headerKeys.map(function (k) {
        return getHeaderText(k, allParams);
    }).join('\n');
    var contentType = getContentType(endpoint.consumes) || 'json';
    var jsDocText = getJSDocText(_extends({}, endpoint, {
        operationName: operationName
    }));

    return jsDocText + '\n      export const ' + operationName + ' = ({ ' + allParams + ' }) => {\n        return request.' + method + '(\n          endpoints.' + endName + '({ ' + paramNames.pathParams + ' }),\n          {\n            query: { ' + paramNames.queryParams + ' },\n            body: { ' + paramNames.bodyParams + ' },\n            form: { ' + paramNames.formsParams + ' },\n            headers: {' + headersText + '},\n          },\n          \'' + contentType + '\'\n        ).then(response => response.' + (canProduceJSON ? 'json' : 'text') + '());\n      };\n    ';
};

exports.default = function (_ref3) {
    var paths = _ref3.paths;

    var pathNames = Object.keys(paths);
    var methodsTexts = [];
    var methodsNames = [];

    pathNames.forEach(function (pathName) {
        Object.keys(paths[pathName]).forEach(function (method) {
            var endpoint = paths[pathName][method];
            var methodText = getMethodText(pathName, method, paths[pathName][method]);
            methodsTexts.push(methodText);
            methodsNames.push((0, _helpers.getOperationName)(endpoint.operationId));
        });
    });

    return '\n        import request from \'./request\';\n        import endpoints from \'./endpoints\';\n        import RequestHeaders from \'./headers\';\n\n        ' + methodsTexts.join('\n') + '\n        \n        export default {\n            ' + methodsNames.join(',\n') + '\n        };\n        \n    ';
};