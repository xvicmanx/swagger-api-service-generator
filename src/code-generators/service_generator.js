import {
    snakeToCamelCase,
    getEntityDefinition,
} from '../helpers';
import TemplateCompiler from '../utils/template-compiler';
import EndPointInfoExtractor from '../utils/endpoint-info-extractor';

const SERVICE_TEMPLATE = 'service-template.tpl.js';
const SERVICE_METHOD_TEMPLATE = 'service-method-template.tpl.js';

const getHeaderText = (header, params) => `${header}: RequestHeaders.${snakeToCamelCase(header)}({${params}}),`;

const getPropertiesText = (obj) => {
    return Object.keys(obj).reduce((res, prop) => {
        return `${res}* @property {${obj[prop]}} ${prop}\n`
    }, '');
};

const getEntityTypesText = (definitions) => {
    const res = Object.keys(definitions).reduce((acc, entityType) => {
        const def = getEntityDefinition(definitions, entityType);
        return {
            ...acc,
            [entityType]: def,
        };
    }, {});


    const items = Object.keys(res).map((entityType) => {
        return `
/**
* @typedef ${entityType}
*
${getPropertiesText(res[entityType])}*
*/`;
    });
    return items.join('\n');
};

const getMethodText = (extractor) => {
    const paramNames = extractor.getParamNames();
    const allParams = [].concat(
        ...paramNames.pathParams,
        ...paramNames.bodyParams,
        ...paramNames.queryParams,
        ...paramNames.formsParams,
        ...paramNames.headerParams,
    );

    const allButHeaderParams = [].concat(
        ...paramNames.pathParams,
        ...paramNames.bodyParams,
        ...paramNames.queryParams,
        ...paramNames.formsParams,
    );

    const canProduceJSON = extractor.canProduceJSON();

    return TemplateCompiler.compile(
        SERVICE_METHOD_TEMPLATE,
        {
            method: extractor.getActionMethod(),
            requestMethod: extractor.getRequestMethod(),
            jsDocText: extractor.getJSDocText(),
            allParamsText: allParams,
            allButHeaderParamsText: allButHeaderParams,
            endName: extractor.getEndpointConstantName(),
            contentType: extractor.getContentType(),
            bodyParamsText: paramNames.bodyParams.length > 0 ? paramNames.bodyParams.join(', ') : '{}',
            headersText: paramNames.headerParams.map(k => getHeaderText(k, allButHeaderParams)).join('\n'),
            pathParamsText: paramNames.pathParams,
            queryParamsText: paramNames.queryParams,
            formsParamsText: paramNames.formsParams,
            transformMethodText: canProduceJSON ? 'json' : 'text',
            allRequiredKeysParamsText: extractor.getRequiredParamNames()
                .map((k) => `'${k}'`).join(', '),
        }
    );
};



export default (data, filter) => {
    const methodsTexts = [];
    const methodsNames = [];

    EndPointInfoExtractor.forEachOne(
        data,
        (extractor) => {
            methodsTexts.push(getMethodText(extractor));
            methodsNames.push(extractor.getActionMethod());
        },
        filter
    );

    return TemplateCompiler.compile(
        SERVICE_TEMPLATE,
        {
            entityTypesText: getEntityTypesText(data.definitions),
            methodsText: methodsTexts.join('\n'),
            methodsNamesText: methodsNames.join(',\n'),
        }
    );
};
