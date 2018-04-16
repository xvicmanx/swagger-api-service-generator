import { endpointsEach, getEndpointConstantName, getOperationName} from '../helpers';
import TemplateCompiler from '../utils/template-compiler';
import EndpointInfoExtractor from '../utils/endpoint-info-extractor';

const ENDPOINTS_TEMPLATE = 'endpoints-template.tpl.js';

export default (
    {
        schemes,
        host,
        basePath,
        paths,
        definitions
    },
    filter
) => {
    const endpointsTexts = [];

    EndpointInfoExtractor.forEachOne(
        {
            paths,
            definitions
        },
        (extractor) => {
            const endName = extractor.getEndpointConstantName();
            const pathParams = extractor.getPathParams();
            const pathName = extractor.getPathName();

            endpointsTexts.push(
                `${endName} : ({${pathParams.join(", ")}}) => {
                    return \`\${BASE}${pathName.replace(/{/g, "${")}\`;
                },`
            );
        },
        filter
    );

    const scheme = schemes && schemes.length > 0 ? schemes[0] : 'http';

    return TemplateCompiler.compile(
        ENDPOINTS_TEMPLATE,
        {
            endpointsText: endpointsTexts.join("\n"),
            base: `${scheme}://${host}${basePath}`,
        }
    );
};
