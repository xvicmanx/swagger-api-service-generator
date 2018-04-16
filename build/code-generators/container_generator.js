'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helpers = require('../helpers');

exports.default = function (endpoint, path) {
    var operationName = (0, _helpers.getOperationName)(endpoint.operationId);
    var name = (0, _helpers.toTitleCase)(operationName);

    return '\n    import React, { Component } from \'react\';\n    import { bindActionCreators } from \'redux\';\n    import { connect } from \'react-redux\';\n    import ' + name + 'Component from \'../components/' + name + 'Component\';\n    import { ' + operationName + ' } from \'../actions\';\n    \n    const mapStateToProps = ({ resultOf' + name + 'Action }) => {\n        return { resultOf' + name + 'Action };\n    };\n    \n    const mapDispatchToProps = (dispatch) => {\n        return {\n            ' + operationName + ': bindActionCreators(' + operationName + ', dispatch),\n        };\n    };\n    \n    export default connect(\n        mapStateToProps,\n        mapDispatchToProps\n    )(' + name + 'Component);   \n    ';
};