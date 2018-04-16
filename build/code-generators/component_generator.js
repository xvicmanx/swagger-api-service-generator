'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helpers = require('../helpers');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var presentationRender = function presentationRender(operationName, name) {
    return '\n        return (\n            <div className="' + (0, _helpers.camelToSnakeCase)(operationName) + '">\n                <pre>\n                    {JSON.stringify(this.props.resultOf' + name + 'Action)}\n                </pre>\n            </div>\n        );\n    ';
};

var editRender = function editRender(operationName, name, endpoint) {
    var fields = endpoint.parameters.map(function (p) {
        return '\n            <Field\n            name="' + p.name + '"\n            component="input"\n            type="text"\n            placeholder="' + p.name + '"\n        />\n        ';
    });
    return '\n        const { handleSubmit, pristine, reset, submitting } = this.props;\n        return (\n            <form onSubmit={handleSubmit(this.props.' + operationName + ')} className="' + (0, _helpers.camelToSnakeCase)(operationName) + '">\n                ' + fields.join('\n') + '\n            </form>\n        );\n    ';
};

exports.default = function (endpoint, path, method) {
    var _ref;

    var operationName = (0, _helpers.getOperationName)(endpoint.operationId);
    var name = (0, _helpers.toTitleCase)(operationName);
    var paramNames = (0, _helpers.endpointParamNames)(endpoint, path);
    var allParams = (_ref = []).concat.apply(_ref, _toConsumableArray(paramNames.pathParams).concat(_toConsumableArray(paramNames.bodyParams), _toConsumableArray(paramNames.queryParams), _toConsumableArray(paramNames.formsParams)));
    var isGet = method.toLowerCase() === 'get';
    var dependencies = isGet ? '' : 'import { Field, reduxForm } from \'redux-form\'';
    var render = isGet ? presentationRender : editRender;

    var exportText = 'export default ' + name + 'Component;';

    if (!isGet) {
        exportText = '\n        export default reduxForm({\n            form: \'' + name + 'Form\'\n          })(' + name + 'Component);\n        ';
    }

    return '\n    import React, { Component } from \'react\';\n    import PropTypes from \'prop-types\';\n    ' + dependencies + '\n\n    class ' + name + 'Component extends Component {\n        \n        componentDidMount() {\n            // this.props.' + operationName + '({ ' + allParams + ' });\n        }\n        \n        render() {\n            ' + render(operationName, name, endpoint) + '\n        }\n    }\n    \n    ' + name + 'Component.propTypes = {\n        ' + operationName + ': PropTypes.func.isRequired,\n        resultOf' + name + 'Action: PropTypes.instanceOf(Object).isRequired,\n    };\n    \n    ' + exportText + '\n   \n    ';
};