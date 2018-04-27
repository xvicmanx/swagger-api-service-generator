import { snakeToCamelCase } from '../helpers';
import TemplateCompiler from '../utils/template-compiler';

const REQUEST_HEADERS_TEMPLATE = 'request-headers-template.tpl.js';

// Receives api definition
export default ({ securityDefinitions }) => {
    const methods = Object.keys(securityDefinitions || [])
    .map(definition => {
        return `${snakeToCamelCase(definition)} : (data) => {},`;
    });
  return TemplateCompiler.compile(
      REQUEST_HEADERS_TEMPLATE,
      {
        methodsText: `${methods.join('')}\n`,
      }
    );
};
