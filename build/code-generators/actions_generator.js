'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _helpers = require('../helpers');

var getDispatcherText = function getDispatcherText() {
    return '\n    export const TYPES = {\n        API_REQUEST_START: \'API_REQUEST_START\',\n        API_REQUEST_SUCCESS: \'API_REQUEST_SUCCESS\',\n        API_REQUEST_ERROR: \'API_REQUEST_ERROR\',\n    };\n\n    const createPromiseDispatchAction = (action, identifier) => (...args) => (dispatch) => {\n        dispatch({\n            type: TYPES.API_REQUEST_START,\n            identifier,\n        });\n        \n        action(...args).then((data) => {\n            dispatch({\n            type: TYPES.API_REQUEST_SUCCESS,\n            identifier,\n            data,\n            });\n        }).catch((error) => {\n            dispatch({\n            type: TYPES.API_REQUEST_ERROR,\n            identifier,\n            error,\n            });\n        });\n    };\n    ';
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

var getActionText = function getActionText(path, method, endpoint) {
    var operationName = (0, _helpers.getOperationName)(endpoint.operationId);
    var identifier = (0, _helpers.getEndpointConstantName)(operationName);
    var jsDocText = getJSDocText(_extends({}, endpoint, {
        operationName: operationName
    }));

    return jsDocText + '\n      export const ' + operationName + ' = createPromiseDispatchAction(service.' + operationName + ', \'' + identifier + '\');';
};

exports.default = function (_ref2) {
    var paths = _ref2.paths;

    var pathNames = Object.keys(paths);
    var actionsTexts = [];
    var actionNames = [];

    pathNames.forEach(function (pathName) {
        Object.keys(paths[pathName]).forEach(function (method) {
            var endpoint = paths[pathName][method];
            actionsTexts.push(getActionText(pathName, method, endpoint));
            actionNames.push((0, _helpers.getOperationName)(endpoint.operationId));
        });
    });

    return '\n        import service from \'./service\';\n        ' + getDispatcherText() + '\n        ' + actionsTexts.join('\n') + '\n        \n        export default {\n            ' + actionNames.join(',\n') + '\n        };\n        \n    ';
};