import TemplateCompiler from '../utils/template-compiler';
import EndpointInfoExtractor from '../utils/endpoint-info-extractor';
import { getTags, toTitleCase } from '../helpers';

const INDEX_JS_TEMPLATE = 'index-js-template.tpl.js';

export default (definition, filter) => {
  const tags = Object.keys(EndpointInfoExtractor.getTags(definition, filter));
  
  const reducersImportsText = tags.reduce((acc, tag) => {
    return `${acc}import * as ${tag}Reducers from './reducers/${toTitleCase(tag)}Reducers';\n`;
  }, '');

  const reducersInjectText = tags.reduce((acc, tag) => {
    return `${acc}...${tag}Reducers,\n`;
  }, '');
  
  return TemplateCompiler.compile(
    INDEX_JS_TEMPLATE,
    {
      reducersImportsText,
      reducersInjectText,
    }
  );
};
