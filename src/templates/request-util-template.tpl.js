// NOTE: Include fetch

// const fetch = require('node-fetch'); // For Backend only

// require('whatwg-fetch'); // For Frontend only

// For Both Front and Backend
// require('es6-promise').polyfill();
// require('isomorphic-fetch');


  const convertToUrlParams = (data) => {
    return Object.keys(data).reduce(
        (result, key) => `${key}=${encodeURIComponent(data[key])}`,
        ''
    );
  };

  // Shorthand data types
  const PredefinedDataTypesMap = {
    'json': 'application/json',
    'jsonp': 'application/javascript',
    'html': 'text/html',
    'xml': 'application/xml',
    'text': 'text/plain',
    'form-data': 'multipart/form-data',
    'url-encoded': 'application/x-www-form-urlencoded; charset=utf-8',
  };

  const makeRequest = (
    url,
    method,
    data,
    contentType
  ) => {
    // if the shorhand  is not in the map it takes the string as it comes
    // (for not predefined content types)
    const headers = {
      'Content-Type': PredefinedDataTypesMap[contentType] ?
      PredefinedDataTypesMap[contentType] : contentType,
      ...data.headers
    };

    const payload = {
      method,
      headers,
    };

    if (Object.keys(data.body).length > 0) {
      payload.body = JSON.stringify(data.body);
    }

    return fetch(
      `${url}?${convertToUrlParams(data.query)}`,
      payload
    );
  };

  const request = {
    get: (endpoint, data, contentType = 'json') => {
      return makeRequest(
        endpoint,
        'GET',
        data,
        contentType
      );
    },
    post: (endpoint, data, contentType = 'json') => {
      return makeRequest(
        endpoint,
        'POST',
        data,
        contentType
      );
    },
    put: (endpoint, data, contentType = 'json') => {
      return makeRequest(
        endpoint,
        'PUT',
        data,
        contentType
      );
    },
    'delete': (endpoint, data, contentType = 'json') => {
      return makeRequest(
        endpoint,
        'DELETE',
        data,
        contentType
      );
    },
  };
  
  export default request;