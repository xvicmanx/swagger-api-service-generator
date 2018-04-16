'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helpers = require('../helpers');

exports.default = function (_ref) {
    var paths = _ref.paths;

    var pathNames = Object.keys(paths);
    var routesComponentsTexts = [];
    var routesImportsTexts = [];
    var linksText = [];
    pathNames.forEach(function (pathName) {
        Object.keys(paths[pathName]).forEach(function (method) {
            var endpoint = paths[pathName][method];
            var operationName = (0, _helpers.getOperationName)(endpoint.operationId);
            var name = (0, _helpers.toTitleCase)(operationName);
            var compPath = (0, _helpers.camelToSnakeCase)(operationName).toLowerCase().replace(/_/g, '-');

            linksText.push('<Link to="/' + compPath + '">' + name + '</Link>');
            routesImportsTexts.push('import ' + name + ' from \'./containers/' + name + 'Container\';');

            routesComponentsTexts.push('\n                <Route path="/' + compPath + '" component={' + name + '} />\n            ');
        });
    });

    return '\n    import React  from \'react\';\n    import PropTypes from \'prop-types\';\n    import { Route, Router, withRouter, Link } from \'react-router\';\n\n    ' + routesImportsTexts.join('\n') + '\n\n    const Routes = ({ history }) => {\n      return (\n        <Router history={history}>\n        ' + routesComponentsTexts.join('\n') + '\n        <Route path="/" component={() => {\n            return (\n                <div>\n                ' + linksText.join('\n') + '\n                </div>\n            );\n        }} />\n        </Router>\n      );\n    };\n    \n    Routes.propTypes = {\n      history: PropTypes.instanceOf(Object).isRequired,\n    };\n    \n    export default Routes;\n    \n    ';
};