'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helpers = require('../helpers');

var getGenericReducerText = function getGenericReducerText() {
    return '\n    const resultOfActionReducer = (defaultValue, identifier) => (state = defaultValue, action) => {\n        switch(action.type) {\n            case \'API_REQUEST_START\':\n                if (action.identifier === identifier) {\n                    return defaultValue;\n                }\n            case \'API_REQUEST_SUCCESS\':\n                if (action.identifier === identifier) {\n                    return action.data;\n                };\n            case \'API_REQUEST_ERROR\':\n                if (action.identifier === identifier) {\n                    return action.error;\n                };\n            default:\n                return state;\n        }\n    };\n    ';
};

var getReducerText = function getReducerText(path, method, endpoint) {
    var operationName = (0, _helpers.getOperationName)(endpoint.operationId);
    var name = (0, _helpers.toTitleCase)(operationName);
    var identifier = (0, _helpers.getEndpointConstantName)(operationName);
    return '\n      export const resultOf' + name + 'Action = resultOfActionReducer(null, \'' + identifier + '\');';
};

exports.default = function (_ref) {
    var paths = _ref.paths;

    var pathNames = Object.keys(paths);
    var reducerTexts = [];
    var reducerNames = [];

    pathNames.forEach(function (pathName) {
        Object.keys(paths[pathName]).forEach(function (method) {
            var endpoint = paths[pathName][method];
            reducerTexts.push(getReducerText(pathName, method, endpoint));
            var operationName = (0, _helpers.getOperationName)(endpoint.operationId);
            var name = (0, _helpers.toTitleCase)(operationName);
            reducerNames.push('resultOf' + name + 'Action');
        });
    });

    return '\n        ' + getGenericReducerText() + '\n        ' + reducerTexts.join('\n') + '\n        \n        export default {\n            ' + reducerNames.join(',\n') + '\n        };\n        \n    ';
};