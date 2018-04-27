'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helpers = require('../helpers');

var _templateCompiler = require('../utils/template-compiler');

var _templateCompiler2 = _interopRequireDefault(_templateCompiler);

var _endpointInfoExtractor = require('../utils/endpoint-info-extractor');

var _endpointInfoExtractor2 = _interopRequireDefault(_endpointInfoExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENDPOINTS_TEMPLATE = 'endpoints-template.tpl.js';

exports.default = function (_ref, filter) {
    var schemes = _ref.schemes,
        host = _ref.host,
        basePath = _ref.basePath,
        paths = _ref.paths,
        definitions = _ref.definitions;

    var endpointsTexts = [];

    _endpointInfoExtractor2.default.forEachOne({
        paths: paths,
        definitions: definitions
    }, function (extractor) {
        var endName = extractor.getEndpointConstantName();
        var pathParams = extractor.getPathParams();
        var pathName = extractor.getPathName();

        endpointsTexts.push(endName + ' : ({' + pathParams.join(", ") + '}) => {\n                    return `${BASE}' + pathName.replace(/{/g, "${") + '`;\n                },');
    }, filter);

    var scheme = schemes && schemes.length > 0 ? schemes[0] : 'http';

    return _templateCompiler2.default.compile(ENDPOINTS_TEMPLATE, {
        endpointsText: endpointsTexts.join("\n"),
        base: scheme + '://' + host + basePath
    });
};