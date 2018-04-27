import TemplateCompiler from '../utils/template-compiler';
const CONSTANTS_TEMPLATE = 'constants-template.tpl.js';

export default (
    {
      schemes,
      host,
      basePath,
    },
    filter
) => {
    const scheme = schemes && schemes.length > 0 ? schemes[0] : 'http';
    return TemplateCompiler.compile(
        CONSTANTS_TEMPLATE,
        {
          base: `${scheme}://${host}${basePath}`,
        }
    );
};
