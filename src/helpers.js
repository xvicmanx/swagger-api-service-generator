const beautify = require('js-beautify').js_beautify;
const esformatter = require('esformatter');

import fs from 'fs';
import fsExtra from 'fs-extra';

esformatter.register(require('esformatter-jsx'));

export const camelToSnakeCase = text => text.replace(/([a-z])([A-Z])/g, "$1_$2");

export const snakeToCamelCase = text => text.replace(/(_)([a-z])/g, (x, y, z) => z.toUpperCase());

export const paramsIn = (parameters = [], location = '') => {
    return parameters.filter(p => p.in === location).map(p => p.name);
};

export const toTitleCase = (text) => `${text.substring(0, 1).toUpperCase()}${text.substring(1)}`;

export const getEndpointConstantName = name => camelToSnakeCase(name).toUpperCase();

export const getOperationName = (name) => {
    let operationName = name.trim()
        .replace(/(\s+|\-|\.|{|})/g, '_')
        .replace(/_+/, '_')
        .replace(/\W/, '');

    if (operationName.indexOf('_') > -1) {
        operationName = snakeToCamelCase(operationName.toLowerCase());
    }

    return operationName;
};

export const paramsInPath = (path) => {
    return (path.match(/{(.*?)}/g) || [])
        .map(m => m.replace(/({|})/g, ''));
};

const allPassFilter = () => true;
export const endpointsEach = (
    paths,
    callback,
    filter = allPassFilter,
) => {
    const pathNames = Object.keys(paths);
    pathNames.forEach(pathName => {
        Object.keys(paths[pathName])
            .forEach(method => {
                const data = {
                    pathName,
                    method,
                    endpoint: paths[pathName][method],
                };

                if (filter(data)) {
                    callback(data);
                }
            });
    });
};

export const endpointParamNames = ({ parameters }, path) => {
    return {
        bodyParams: paramsIn(
            parameters,
            'body'
        ),
        formsParams: paramsIn(
            parameters,
            'formData'
        ),
        queryParams: paramsIn(
            parameters,
            'query'
        ),
        headerParams: paramsIn(
            parameters,
            'header'
        ),
        pathParams: paramsInPath(path),
    };
};

export const getJSDocText = ({
    summary,
    description,
    operationName,
    parameters,
    responses
}) => {
    const properiesText = parameters.reduce((text, param) => {
        let paramType = param.type ? `{${param.type}}` : '';

        if (param.schema && param.schema['$ref']) {
            paramType = param.schema['$ref'].replace('#/definitions/', '');
            paramType = `{${paramType === 'integer' ? 'number' : paramType}}`;
        }

        const requiredText = param.required ? '[required]' : '[optional]';
        return `${text}\n * @property ${paramType} ${param.name} ${requiredText} ${param.description}`
    }, '');

    return `
    /** ${operationName}
     * Summary: ${(summary || description).replace('/**', '').trim()}
     * Description: ${(description || summary).replace('/**', '').trim()}
     * 
     * @typedef ${toTitleCase(operationName)}Payload
     * ${properiesText}
     * 
     * 
     * @param {${toTitleCase(operationName)}Payload} ${operationName}Payload
     *
     ${getReturnType(responses || {})}
     */`;
};

export const endpointParamTypes = ({ parameters, definitions }, path) => {
    return parameters.reduce((acc, p) => {
        let type = 'string';
        if (p.type) {
            type = p.type;
        } else if (p.schema && p.schema['$ref']) {
            type = getEntityDefinition(
                definitions,
                p.schema['$ref'].replace('#/definitions/', ''),
                true
            );
        }

        return {
            ...acc,
            [p.name]: type
        };
    }, {});
};

const getReturnType = (responses) => {
    let data = '';
    Object.keys(responses).forEach((status) => {
        data += `*  ${status} - ${responses[status].description}\n`;
    });
    data += `*\n`;

    const result =  Object.entries(responses)
        .find(([k, v]) => {
            return k.indexOf('200') >=0;
        });
    
    const okResponse = result && result[1];
    
    if (okResponse && okResponse.schema) {
        const schema = okResponse.schema;
        let dataType = schema.type;

        if (!dataType) {
            dataType = schema['$ref'].replace('#/definitions/', '')
        } else if (
            dataType === 'array' &&
            schema.items &&
            schema.items['$ref']
        ) {
            dataType = `Array<${schema.items['$ref'].replace('#/definitions/', '')}>`
        }

        data += `* @return {Promise<${dataType}>}`;
    } else {
        data += '* @return {Promise}';
    }
    
    return data;
}; 

export const endpointParamMetada = ({ parameters, definitions }, path) => {
    return parameters.reduce((acc, p) => {
        let meta = {};
        if (!p.schema) {
            meta = p;
        } else if (p.schema && p.schema['$ref']) {
            meta = getEntityMetaDefinition(
                definitions,
                p.schema['$ref'].replace('#/definitions/', ''),
                true
            );
        }
        return {
            ...acc,
            [p.name]: meta
        };
    }, {});
};

export const getEntityDefinition = (definitions, objType, recursive = false) => {
    const obj = definitions[objType];

    return Object.keys(obj.properties).reduce((acc, propName) => {
        let type = obj.properties[propName].type;
        const ref = obj.properties[propName]['$ref'];

        if (ref && ref.indexOf('#/definitions/') > -1) {
            type = ref.replace('#/definitions/', '');

            if (recursive) {
                type = getEntityDefinition(definitions, type, recursive);
            }
        }

        return {
            ...acc,
            [propName]: type,
        };
    }, {});
};


export const getEntityMetaDefinition = (definitions, objType, recursive = false) => {
    const obj = definitions[objType];

    return Object.keys(obj.properties).reduce((acc, propName) => {
        let meta = obj.properties[propName];
        const ref = obj.properties[propName]['$ref'];

        if (ref && ref.indexOf('#/definitions/') > -1) {
            meta = ref.replace('#/definitions/', '');

            if (recursive) {
                meta = getEntityMetaDefinition(definitions, meta, recursive);
            }
        }

        return {
            ...acc,
            [propName]: meta,
        };
    }, {});
};



export const isURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
    return pattern.test(str);
};

export const folderName = ({ info }) => {
    const name = info.title
        .toLowerCase()
        .trim()
        .replace(/[^A-Za-z]+/g, '')
        .replace(/\s+/, '-');
    return `${name}-api`;
};



const options = {
    "plugins": [
        "esformatter-jsx"
    ],
    jsx: {
        "formatJSX": true,
        "attrsOnSameLineAsTag": false,
        "maxAttrsOnTag": 3,
        "firstAttributeOnSameLine": true,
        "formatJSXExpressions": true,
        "JSXExpressionsSingleLine": true,
        "alignWithFirstAttribute": false,
        "spaceInJSXExpressionContainers": " ",
        "removeSpaceBeforeClosingJSX": false,
        "closingTagOnNewLine": false,
        "JSXAttributeQuotes": "",
        "htmlOptions": {}
    }
};

export const writeJSFile = (file, content, es6 = false) => {
    let result;

    if (es6) {
        result = esformatter.format(content, options);
    } else {
        result = beautify(
            content,
            { indent_size: 2 }
        );
    }

    fsExtra.ensureFileSync(file);
    fs.writeFileSync(file, result);
};

export default {
    camelToSnakeCase,
    snakeToCamelCase,
    paramsIn,
    getEndpointConstantName,
    getOperationName,
    endpointParamNames,
    toTitleCase,
    getEntityDefinition,
    paramsInPath,
    endpointsEach,
    isURL,
    writeJSFile,
    folderName,
    getJSDocText,
};
