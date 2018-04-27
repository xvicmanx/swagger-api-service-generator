'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }return target;
};

var _helpers = require('../helpers');

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
}

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

var EndpointInfoExtractor = function EndpointInfoExtractor(_ref) {
    var endpoint = _ref.endpoint,
        definitions = _ref.definitions,
        method = _ref.method,
        path = _ref.path;

    this.getActionMethod = function () {
        return (0, _helpers.getOperationName)(endpoint.operationId);
    };

    this.getParamTypes = function () {
        return (0, _helpers.endpointParamTypes)({
            parameters: endpoint.parameters,
            definitions: definitions
        }, path);
    };

    this.getParamMetaData = function () {
        return (0, _helpers.endpointParamMetada)({
            parameters: endpoint.parameters,
            definitions: definitions
        }, path);
    };

    this.getContentType = function () {
        return getContentType(endpoint.consumes) || 'json';
    };

    this.getParamNames = function () {
        return (0, _helpers.endpointParamNames)(endpoint, path);
    };

    this.getRequiredParamNames = function () {
        return this.getParameters().filter(function (p) {
            return p.required;
        }).map(function (p) {
            return p.name;
        });
    };

    this.canProduceJSON = function () {
        return (endpoint.produces || []).indexOf('application/json') > -1;
    };

    this.getSecurityKeys = function () {
        return (endpoint.security || []).reduce(function (acc, s) {
            return acc.concat.apply(acc, _toConsumableArray(Object.keys(s)));
        }, []);
    };

    this.getRequestMethod = function () {
        return method.toLowerCase();
    };

    this.getJSDocText = function () {
        return (0, _helpers.getJSDocText)(_extends({}, endpoint, {
            operationName: (0, _helpers.getOperationName)(endpoint.operationId)
        }));
    };

    this.getParameters = function () {
        return endpoint.parameters;
    };

    this.getPathName = function () {
        return path;
    };

    this.getEndpointConstantName = function () {
        var operationName = (0, _helpers.getOperationName)(endpoint.operationId);
        return (0, _helpers.getEndpointConstantName)(operationName);
    };

    this.getPathParams = function () {
        return (0, _helpers.paramsInPath)(path);
    };

    this.getComponentTag = function () {
        return endpoint.tags && endpoint.tags.length > 0 ? endpoint.tags[0] : 'core';
    };

    this.getServicePath = function () {
        var tag = this.getComponentTag();
        return tag + '/service';
    };

    this.getEndpointsFilePath = function () {
        var tag = this.getComponentTag();
        return tag + '/endpoints';
    };

    this.getActionResultData = function () {
        var operationName = (0, _helpers.getOperationName)(endpoint.operationId);
        var name = (0, _helpers.toTitleCase)(operationName);
        return 'resultOf' + name + 'Action';
    };
};

EndpointInfoExtractor.forEachOne = function (data, callback, filter) {

    (0, _helpers.endpointsEach)(data.paths, function (_ref2) {
        var pathName = _ref2.pathName,
            method = _ref2.method,
            endpoint = _ref2.endpoint;

        callback(new EndpointInfoExtractor({
            endpoint: endpoint,
            method: method,
            path: pathName,
            definitions: data.definitions
        }));
    }, filter);
};

EndpointInfoExtractor.getTags = function (definition, filter) {
    var tags = {};
    EndpointInfoExtractor.forEachOne(definition, function (extractor) {
        tags[extractor.getComponentTag()] = extractor;
    }, filter);
    return tags;
};

exports.default = EndpointInfoExtractor;