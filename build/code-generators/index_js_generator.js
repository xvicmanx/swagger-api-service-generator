"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return "\n    import React from 'react';\n    import { render } from 'react-snapshot';\n    import { createStore, combineReducers, applyMiddleware } from 'redux';\n    import { Provider } from 'react-redux';\n    import { browserHistory } from 'react-router';\n    import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';\n    import { reducer as formReducer } from 'redux-form';\n    import thunkMiddleware from 'redux-thunk';\n    \n    import Routes from './routes';\n    \n    import * as appReducers from './reducers';\n\n    \n    /* eslint-disable no-underscore-dangle */\n    const store = createStore(\n      combineReducers({\n        ...appReducers,\n        routing: routerReducer,\n        form: formReducer,\n      }),\n      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),\n      applyMiddleware(\n        thunkMiddleware,\n        routerMiddleware(browserHistory),\n      )\n    );\n    /* eslint-enable */\n    \n    const history = syncHistoryWithStore(browserHistory, store);\n    \n    render(\n      <Provider store={store}>\n        <Routes history={history} />\n      </Provider>,\n    document.getElementById('root')\n    );\n\n    ";
};