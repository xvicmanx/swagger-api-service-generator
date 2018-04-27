import fs from 'fs';
import {
    toTitleCase,
    getOperationName,
    endpointsEach,
    writeJSFile,
    folderName,
} from '../helpers';

import requestHeadersGenerator from '../code-generators/request_headers_generator';
import requestUtilGenerator from '../code-generators/request_util_generator';
import helpersGenerator from '../code-generators/helpers_generator';
import endpointsGenerator from '../code-generators/endpoints_generator';
import serviceGenerator from '../code-generators/service_generator';
import constantsGenerator from '../code-generators/constants_generator';

import EndpointInfoExtractor from './endpoint-info-extractor';

const FILE_PATHS = {
    requester: dir => `${dir}/__core__/request.js`,
    helpers: dir => `${dir}/__core__/helpers.js`,
    endpoints: (dir, endpointsPath) => `${dir}/${endpointsPath}.js`,
    headers: dir => `${dir}/__shared__/headers.js`,
    constants: dir => `${dir}/__shared__/constants.js`,
    service: (dir, servicePath) => `${dir}/${servicePath}.js`,
    core: dir => `${dir}/__core__/`,
    shared: dir => `${dir}/__shared__/`,
};

const makeDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

const getTags = (definition, filter) => {
    return EndpointInfoExtractor.getTags(definition, filter);
};

const generateProjectFolders = (dir) => {
    makeDir(dir);
    makeDir(FILE_PATHS.core(dir))
    makeDir(FILE_PATHS.shared(dir))
};


const generateHelpers = (dir) => {
    writeJSFile(
        FILE_PATHS.helpers(dir),
        helpersGenerator()
    );
};

const generateRequester = (dir) => {
    writeJSFile(
        FILE_PATHS.requester(dir),
        requestUtilGenerator()
    );
};

const generateHeaders = (dir, definition, filter) => {
    writeJSFile(
        FILE_PATHS.headers(dir),
        requestHeadersGenerator(definition)
    );
};

const generateService = (dir, definition, filter) => {
    const tags = getTags(definition, filter);
    Object.keys(tags).forEach((tag) => {
        writeJSFile(
            FILE_PATHS.service(
                dir,
                tags[tag].getServicePath(),
            ),
            serviceGenerator(definition, (data) => {
                const extractor = new EndpointInfoExtractor({ endpoint: data.endpoint });
                return filter(data) && extractor.getComponentTag() === tag;
            })
        );
    });
};


const generateEndpoints = (dir, definition, filter) => {
    const tags = getTags(definition, filter);
    Object.keys(tags).forEach((tag) => {
        writeJSFile(
            FILE_PATHS.endpoints(
                dir,
                tags[tag].getEndpointsFilePath(),
            ),
            endpointsGenerator(definition, (data) => {
                const extractor = new EndpointInfoExtractor({ endpoint: data.endpoint });
                return filter(data) && extractor.getComponentTag() === tag;
            })
        );
    });
};

const generateConstants = (dir, definition, filter) => {
    writeJSFile(
        FILE_PATHS.constants(dir),
        constantsGenerator(definition)
    );
};


const ProjectGenerator = function (base, definition, filter) {

    this.generateProject = function () {
        const dir = `${base}/api`;
        generateProjectFolders(dir);

        generateRequester(dir);
        generateHelpers(dir);

        generateEndpoints(dir, definition, filter);
        generateConstants(dir, definition, filter);
        generateHeaders(dir, definition, filter);

        generateService(dir, definition, filter);
    };
};

export default ProjectGenerator;