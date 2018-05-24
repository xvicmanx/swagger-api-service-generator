import {
    getEndpointConstantName,
    getOperationName,
    camelToSnakeCase,
    endpointParamNames,
    toTitleCase,
    endpointParamTypes,
    endpointParamMetada,
    paramsInPath,
    getJSDocText,
    endpointsEach
} from '../helpers';

const dataTypes = {
    'application/json': 'json',
    'application/xml': 'xml',
    'application/javascript': 'jsonp',
    'text/html': 'html',
    'text/plain': 'text',
    'multipart/form-data': 'form-data',
    'application/x-www-form-urlencoded': 'url-encoded',
};

const getContentType = (consumes) => {
    if (consumes) {
        const jsonPresent = consumes.indexOf('application/json') >= 0;
        return jsonPresent ? 'json' : dataTypes[consumes[0]];
    }
    return '';
};

const EndpointInfoExtractor = function ({
    endpoint,
    definitions,
    method,
    path
}) {
    this.getActionMethod = function () {
        return getOperationName(endpoint.operationId);
    };

    this.getParamTypes = function () {
        return endpointParamTypes(
            {
                parameters: endpoint.parameters,
                definitions
            },
            path
        );
    };

    this.getParamMetaData = function () {
        return endpointParamMetada(
            {
                parameters: endpoint.parameters,
                definitions
            },
            path
        );
    };

    

    this.getContentType = function() {
        return getContentType(endpoint.consumes) || 'json';
    };

    this.getParamNames = function() {
        return endpointParamNames(endpoint, path);
    };

    this.getRequiredParamNames = function() {
        return this.getParameters()
            .filter((p) => p.required)
            .map(p => p.name);
    };

    this.canProduceJSON = function() {
        return (endpoint.produces || []).indexOf('application/json') > -1;
    };

    this.getSecurityKeys = function() {
        return (endpoint.security || []).reduce(
            (acc, s) => acc.concat(...Object.keys(s)),
            []
        );
    };

    this.getRequestMethod = function () {
        return method.toLowerCase();
    };

    this.getJSDocText = function () {
        return getJSDocText({
            ...endpoint,
            operationName: getOperationName(endpoint.operationId),
        });
    };

    this.getParameters = function () {
        return endpoint.parameters;
    };

    this.getPathName = function () {
        return path;
    };

    this.getEndpointConstantName = function () {
        const operationName = getOperationName(endpoint.operationId);
        return getEndpointConstantName(operationName);
    };

    this.getPathParams = function () {
        return paramsInPath(path);
    };

    this.getComponentTag = function () {
        const tag = endpoint.tags && endpoint.tags.length > 0 ? endpoint.tags[0] : 'core';
        return tag.trim();
    };

    this.getServicePath = function () {
        const tag = this.getComponentTag();
        return `${tag}/service`;
    };

    this.getEndpointsFilePath = function () {
        const tag = this.getComponentTag();
        return `${tag}/endpoints`;
    };

    this.getActionResultData = function () {
        const operationName = getOperationName(endpoint.operationId);
        const name = toTitleCase(operationName);
        return `resultOf${name}Action`;
    };
};

EndpointInfoExtractor.forEachOne = (
    data,
    callback,
    filter
) => {
    
    endpointsEach(
        data.paths,
        ({ pathName, method, endpoint }) => {
            callback(
                new EndpointInfoExtractor({
                    endpoint,
                    method,
                    path: pathName,
                    definitions: data.definitions,
                })
            );
        },
        filter
    );
};

EndpointInfoExtractor.getTags = (definition, filter) => {
    const tags = {};
    EndpointInfoExtractor.forEachOne(
        definition,
        (extractor) => {
            tags[extractor.getComponentTag()] = extractor;
        },
        filter
    );
    return tags;
};

export default EndpointInfoExtractor;
