import TemplateCompiler from '../utils/template-compiler';

const HELPERS_TEMPLATE = 'helpers-template.tpl.js';

export default () => {
  return TemplateCompiler.compile(HELPERS_TEMPLATE);
};
