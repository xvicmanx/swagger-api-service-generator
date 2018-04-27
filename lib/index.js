require("babel-core/register");
require("babel-polyfill");

import ProjectGenerator from './utils/project-generator';

const CWD = process.cwd();

const generateProject = (definition, endpointFilter) => {
  let filter = () => true;
  
  if (endpointFilter) {
    filter = endpointFilter;
  }

  const generator = new ProjectGenerator(
    CWD,
    definition,
    filter
  );

  generator.generateProject();
};


export default {
  generateServices: async (definition, endpointFilter) => {
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
    

    generateProject(definition, endpointFilter);
  },
};
