import TemplateCompiler from '../utils/template-compiler';

const REQUEST_UTIL_TEMPLATE = 'request-util-template.tpl.js';

export default () => {
  return TemplateCompiler.compile(REQUEST_UTIL_TEMPLATE);
};
