import React from 'react';
import { render } from 'react-snapshot';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import thunkMiddleware from 'redux-thunk';

import Routes from './routes';

${reducersImportsText}

import './index.css';

/* eslint-disable no-underscore-dangle */
const store = createStore(
  combineReducers({
    ${reducersInjectText}
    routing: routerReducer,
    form: formReducer,
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(
    thunkMiddleware,
    routerMiddleware(browserHistory),
  )
);
/* eslint-enable */

const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Routes history={history} />
  </Provider>,
document.getElementById('root')
);
