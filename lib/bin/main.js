#!/usr/bin/env node
import fetch from 'node-fetch';
import fs from 'fs';
import { isURL } from '../helpers';
import main from '../index';

const CONFIG_FILE_NAME = 'swagger-service-generator-config.js';
const CWD = process.cwd();

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
    
    main.generateServices(definition, config.endPointFilter)
  } else {
    console.error("swaggerDefinitionFile is not valid");
    return false;
  }

})();
