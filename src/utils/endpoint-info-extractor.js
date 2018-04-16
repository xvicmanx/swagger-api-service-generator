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

    this.getComponentName = function () {
        const operationName = getOperationName(endpoint.operationId);
        const name = toTitleCase(operationName);
        return `${name}Component`;
    };

    this.getComponentTag = function () {
        return endpoint.tags && endpoint.tags.length > 0 ? endpoint.tags[0] : 'core';
    };

    this.getComponentRoute = function () {
        const operationName = getOperationName(endpoint.operationId);
        return camelToSnakeCase(operationName).toLowerCase().replace(/_/g, '-');
    };

    this.getContainerName = function () {
        const operationName = getOperationName(endpoint.operationId);
        const name = toTitleCase(operationName);
        return `${name}Container`;
    };

    this.getComponentPath = function () {
        const tag = this.getComponentTag();
        const name = this.getComponentName();
        return `${tag}/${name}`;
    };

    this.getContainerPath = function () {
        const tag = this.getComponentTag();
        const name = this.getContainerName();
        return `${tag}/${name}`;
    };

    this.getActionsPath = function () {
        const tag = this.getComponentTag();
        return `actions/${toTitleCase(tag)}Actions`;
    };

    this.getReducersPath = function () {
        const tag = this.getComponentTag();
        return `reducers/${toTitleCase(tag)}Reducers`;
    };

    this.getServicePath = function () {
        const tag = this.getComponentTag();
        return `services/${toTitleCase(tag)}Service`;
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
