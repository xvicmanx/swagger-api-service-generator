'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _helpers = require('../helpers');

var _templateCompiler = require('../utils/template-compiler');

var _templateCompiler2 = _interopRequireDefault(_templateCompiler);

var _endpointInfoExtractor = require('../utils/endpoint-info-extractor');

var _endpointInfoExtractor2 = _interopRequireDefault(_endpointInfoExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SERVICE_TEMPLATE = 'service-template.tpl.js';
var SERVICE_METHOD_TEMPLATE = 'service-method-template.tpl.js';

var getHeaderText = function getHeaderText(header, params) {
    return header + ': RequestHeaders.' + (0, _helpers.snakeToCamelCase)(header) + '({' + params + '}),';
};

var getPropertiesText = function getPropertiesText(obj) {
    return Object.keys(obj).reduce(function (res, prop) {
        return res + '* @property {' + obj[prop] + '} ' + prop + '\n';
    }, '');
};

var getEntityTypesText = function getEntityTypesText(definitions) {
    var res = Object.keys(definitions).reduce(function (acc, entityType) {
        var def = (0, _helpers.getEntityDefinition)(definitions, entityType);
        return _extends({}, acc, _defineProperty({}, entityType, def));
    }, {});

    var items = Object.keys(res).map(function (entityType) {
        return '\n/**\n* @typedef ' + entityType + '\n*\n' + getPropertiesText(res[entityType]) + '*\n*/';
    });
    return items.join('\n');
};

var getMethodText = function getMethodText(extractor) {
    var _ref, _ref2;

    var paramNames = extractor.getParamNames();
    var allParams = (_ref = []).concat.apply(_ref, _toConsumableArray(paramNames.pathParams).concat(_toConsumableArray(paramNames.bodyParams), _toConsumableArray(paramNames.queryParams), _toConsumableArray(paramNames.formsParams), _toConsumableArray(paramNames.headerParams)));

    var allButHeaderParams = (_ref2 = []).concat.apply(_ref2, _toConsumableArray(paramNames.pathParams).concat(_toConsumableArray(paramNames.bodyParams), _toConsumableArray(paramNames.queryParams), _toConsumableArray(paramNames.formsParams)));

    var canProduceJSON = extractor.canProduceJSON();

    return _templateCompiler2.default.compile(SERVICE_METHOD_TEMPLATE, {
        method: extractor.getActionMethod(),
        requestMethod: extractor.getRequestMethod(),
        jsDocText: extractor.getJSDocText(),
        allParamsText: allParams,
        allButHeaderParamsText: allButHeaderParams,
        endName: extractor.getEndpointConstantName(),
        contentType: extractor.getContentType(),
        bodyParamsText: paramNames.bodyParams.length > 0 ? paramNames.bodyParams.join(', ') : '{}',
        headersText: paramNames.headerParams.map(function (k) {
            return getHeaderText(k, allButHeaderParams);
        }).join('\n'),
        pathParamsText: paramNames.pathParams,
        queryParamsText: paramNames.queryParams,
        formsParamsText: paramNames.formsParams,
        transformMethodText: canProduceJSON ? 'json' : 'text',
        allRequiredKeysParamsText: extractor.getRequiredParamNames().map(function (k) {
            return '\'' + k + '\'';
        }).join(', ')
    });
};

exports.default = function (data, filter) {
    var methodsTexts = [];
    var methodsNames = [];

    _endpointInfoExtractor2.default.forEachOne(data, function (extractor) {
        methodsTexts.push(getMethodText(extractor));
        methodsNames.push(extractor.getActionMethod());
    }, filter);

    return _templateCompiler2.default.compile(SERVICE_TEMPLATE, {
        entityTypesText: getEntityTypesText(data.definitions),
        methodsText: methodsTexts.join('\n'),
        methodsNamesText: methodsNames.join(',\n')
    });
};