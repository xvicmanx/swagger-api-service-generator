'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
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
    var operationName = name.trim().replace(/(\s+|\-|\.)/g, '_').replace(/\W/, '');

    if (operationName.indexOf('_') > -1) {
        operationName = snakeToCamelCase(operationName.toLowerCase());
    }

    return operationName;
};

var endpointParamNames = exports.endpointParamNames = function endpointParamNames(_ref, path) {
    var parameters = _ref.parameters;

    return {
        bodyParams: paramsIn(parameters, 'body'),
        formsParams: paramsIn(parameters, 'formData'),
        queryParams: paramsIn(parameters, 'query'),
        pathParams: (path.match(/{(.*)}/g) || []).map(function (m) {
            return m.replace(/({|})/g, '');
        })
    };
};

exports.default = {
    camelToSnakeCase: camelToSnakeCase,
    snakeToCamelCase: snakeToCamelCase,
    paramsIn: paramsIn,
    getEndpointConstantName: getEndpointConstantName,
    getOperationName: getOperationName,
    endpointParamNames: endpointParamNames,
    toTitleCase: toTitleCase
};