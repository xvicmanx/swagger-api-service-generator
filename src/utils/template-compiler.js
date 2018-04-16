require("babel-core/register");
require("babel-polyfill");

import fs from 'fs';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

const TemplateCompiler = {
    compile: (template, data = {}) => {
        const content = fs.readFileSync(`${__dirname}/../templates/${template}`);
        return Object.keys(data).reduce((acc, key) => {
            return acc.replaceAll(
                '${' + key + '}',
                data[key]
            );
        }, content.toString());
    },
};

export default TemplateCompiler;
