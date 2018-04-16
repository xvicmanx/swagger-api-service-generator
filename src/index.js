require("babel-core/register");
require("babel-polyfill");

import fetch from 'node-fetch';
import fs from 'fs';
import { isURL } from './helpers';
import ProjectGenerator from './utils/project-generator';

const CONFIG_FILE_NAME = 'swagger-service-generator-config.js';
const CWD = process.cwd();

const generateProject = (definition, config) => {
  let filter = () => true;
  
  if (config && config.endpointFilter) {
    filter = config.endpointFilter;
  }

  const generator = new ProjectGenerator(
    CWD,
    definition,
    config,
    filter
  );
  generator.generateProject();
};



(async () => {
  let config = {};
  if (fs.existsSync(`${CWD}/${CONFIG_FILE_NAME}`)) {
    config = require(`${CWD}/${CONFIG_FILE_NAME}`);
  } else {
    console.error(`${CWD}/${CONFIG_FILE_NAME} does not exists`);
    return false;
  }

  if (!config.swaggerDefinitionFile) {
    console.error("swaggerDefinitionFile is not in the config");
    return false;
  }

  if (isURL(config.swaggerDefinitionFile)) {
    const definition = await fetch(
      config.swaggerDefinitionFile
    ).then(response => response.json());


    const operationNamesUsed = {};
    Object.keys(definition.paths).forEach((pathName) => {
      Object.keys(definition.paths[pathName]).forEach((method) => {
        const methodObj = definition.paths[pathName][method];
        const byIdSuffix = pathName.indexOf('{id}') > -1 ? 'ById' : '';
        let proposalOfOperationId = `${method}${methodObj.tags[0]}${byIdSuffix}`;
        if (operationNamesUsed[proposalOfOperationId]) {
          const index = operationNamesUsed[proposalOfOperationId];
          operationNamesUsed[proposalOfOperationId] += 1;
          proposalOfOperationId = `${proposalOfOperationId}${index}`;
        }
        methodObj.operationId = methodObj.operationId || proposalOfOperationId;
        operationNamesUsed[methodObj.operationId] = operationNamesUsed[methodObj.operationId] || 0;
        operationNamesUsed[methodObj.operationId] += 1;
        
        for (let parameter of definition.paths[pathName][method].parameters) {
          if (parameter['$ref'] && parameter['$ref'].indexOf('#/parameters/') > -1 ) {
            const paramDefinitionName = parameter['$ref'].replace('#/parameters/', '');
            const def = definition.parameters[paramDefinitionName];
            Object.keys(def).forEach((prop) => {
              parameter[prop] = def[prop];
            });
          }
        }
      });
    })
    

    generateProject(definition, config);
  } else {
    console.error("swaggerDefinitionFile is not valid");
    return false;
  }
})();
