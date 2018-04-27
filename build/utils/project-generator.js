'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _helpers = require('../helpers');

var _request_headers_generator = require('../code-generators/request_headers_generator');

var _request_headers_generator2 = _interopRequireDefault(_request_headers_generator);

var _request_util_generator = require('../code-generators/request_util_generator');

var _request_util_generator2 = _interopRequireDefault(_request_util_generator);

var _helpers_generator = require('../code-generators/helpers_generator');

var _helpers_generator2 = _interopRequireDefault(_helpers_generator);

var _endpoints_generator = require('../code-generators/endpoints_generator');

var _endpoints_generator2 = _interopRequireDefault(_endpoints_generator);

var _service_generator = require('../code-generators/service_generator');

var _service_generator2 = _interopRequireDefault(_service_generator);

var _constants_generator = require('../code-generators/constants_generator');

var _constants_generator2 = _interopRequireDefault(_constants_generator);

var _endpointInfoExtractor = require('./endpoint-info-extractor');

var _endpointInfoExtractor2 = _interopRequireDefault(_endpointInfoExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FILE_PATHS = {
    requester: function requester(dir) {
        return dir + '/__core__/request.js';
    },
    helpers: function helpers(dir) {
        return dir + '/__core__/helpers.js';
    },
    endpoints: function endpoints(dir, endpointsPath) {
        return dir + '/' + endpointsPath + '.js';
    },
    headers: function headers(dir) {
        return dir + '/__shared__/headers.js';
    },
    constants: function constants(dir) {
        return dir + '/__shared__/constants.js';
    },
    service: function service(dir, servicePath) {
        return dir + '/' + servicePath + '.js';
    },
    core: function core(dir) {
        return dir + '/__core__/';
    },
    shared: function shared(dir) {
        return dir + '/__shared__/';
    }
};

var makeDir = function makeDir(dir) {
    if (!_fs2.default.existsSync(dir)) {
        _fs2.default.mkdirSync(dir);
    }
};

var getTags = function getTags(definition, filter) {
    return _endpointInfoExtractor2.default.getTags(definition, filter);
};

var generateProjectFolders = function generateProjectFolders(dir) {
    makeDir(dir);
    makeDir(FILE_PATHS.core(dir));
    makeDir(FILE_PATHS.shared(dir));
};

var generateHelpers = function generateHelpers(dir) {
    (0, _helpers.writeJSFile)(FILE_PATHS.helpers(dir), (0, _helpers_generator2.default)());
};

var generateRequester = function generateRequester(dir) {
    (0, _helpers.writeJSFile)(FILE_PATHS.requester(dir), (0, _request_util_generator2.default)());
};

var generateHeaders = function generateHeaders(dir, definition, filter) {
    (0, _helpers.writeJSFile)(FILE_PATHS.headers(dir), (0, _request_headers_generator2.default)(definition));
};

var generateService = function generateService(dir, definition, filter) {
    var tags = getTags(definition, filter);
    Object.keys(tags).forEach(function (tag) {
        (0, _helpers.writeJSFile)(FILE_PATHS.service(dir, tags[tag].getServicePath()), (0, _service_generator2.default)(definition, function (data) {
            var extractor = new _endpointInfoExtractor2.default({ endpoint: data.endpoint });
            return filter(data) && extractor.getComponentTag() === tag;
        }));
    });
};

var generateEndpoints = function generateEndpoints(dir, definition, filter) {
    var tags = getTags(definition, filter);
    Object.keys(tags).forEach(function (tag) {
        (0, _helpers.writeJSFile)(FILE_PATHS.endpoints(dir, tags[tag].getEndpointsFilePath()), (0, _endpoints_generator2.default)(definition, function (data) {
            var extractor = new _endpointInfoExtractor2.default({ endpoint: data.endpoint });
            return filter(data) && extractor.getComponentTag() === tag;
        }));
    });
};

var generateConstants = function generateConstants(dir, definition, filter) {
    (0, _helpers.writeJSFile)(FILE_PATHS.constants(dir), (0, _constants_generator2.default)(definition));
};

var ProjectGenerator = function ProjectGenerator(base, definition, filter) {

    this.generateProject = function () {
        var dir = base + '/api';
        generateProjectFolders(dir);

        generateRequester(dir);
        generateHelpers(dir);

        generateEndpoints(dir, definition, filter);
        generateConstants(dir, definition, filter);
        generateHeaders(dir, definition, filter);

        generateService(dir, definition, filter);
    };
};

exports.default = ProjectGenerator;