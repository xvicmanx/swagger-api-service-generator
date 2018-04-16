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

import EndpointInfoExtractor from './endpoint-info-extractor';

const FILE_PATHS = {
    requester: dir => `${dir}/request.js`,
    helpers: dir => `${dir}/helpers.js`,
    endpoints: dir => `${dir}/endpoints.js`,
    headers: dir => `${dir}/headers.js`,
    service: (dir, servicePath) => `${dir}/${servicePath}.js`,
    servicesFolder: dir => `${dir}/services/`,
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
    makeDir(FILE_PATHS.servicesFolder(dir));
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

const generateEndpoints = (dir, definition, filter) => {
    writeJSFile(
        FILE_PATHS.endpoints(dir),
        endpointsGenerator(definition, filter)
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



const ProjectGenerator = function (base, definition, config, filter) {

    this.generateProject = function () {
        const dir = `${base}/api`;
        generateProjectFolders(dir);

        generateRequester(dir);
        generateHelpers(dir);

        generateEndpoints(dir, definition, filter);
        generateHeaders(dir, definition, filter);

        generateService(dir, definition, filter);
    };
};

export default ProjectGenerator;