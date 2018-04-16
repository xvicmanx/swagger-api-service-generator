"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helpers = require("../helpers");

var getEndpointText = function getEndpointText(path, endpoint) {
    var operationName = (0, _helpers.getOperationName)(endpoint.operationId);
    var endName = (0, _helpers.getEndpointConstantName)(operationName);
    var pathParams = (path.match(/{(.*)}/g) || []).map(function (m) {
        return m.replace(/({|})/g, "");
    });
    return endName + " : ({" + pathParams.join(", ") + "}) => {\n      return `${BASE}" + path.replace(/{/g, "${") + "`;\n    },";
};

exports.default = function (_ref) {
    var schemes = _ref.schemes,
        host = _ref.host,
        basePath = _ref.basePath,
        paths = _ref.paths;

    var endpointsTexts = [];
    var pathNames = Object.keys(paths);
    pathNames.forEach(function (pathName) {
        var methods = Object.keys(paths[pathName]);
        methods.forEach(function (method) {
            endpointsTexts.push(getEndpointText(pathName, paths[pathName][method]));
        });
    });

    return "\n    const BASE = '" + schemes[0] + "://" + host + basePath + "';\n    const endpoints =  {\n      " + endpointsTexts.join("\n") + "\n    };\n    \n    export default endpoints;\n    ";
};