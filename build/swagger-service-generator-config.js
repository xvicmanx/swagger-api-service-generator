'use strict';

module.exports = {
  swaggerDefinitionFile: 'http://petstore.swagger.io/v2/swagger.json',
  //  swaggerDefinitionFile: 'http://localhost:3000/api-docs.json',
  endpointFilter: function endpointFilter(data) {
    var method = data.method;
    var allowedMethods = ['post', 'get', 'delete'];
    var isMethodAllowed = allowedMethods.indexOf(method.toLowerCase()) >= 0;
    return isMethodAllowed;
  }
};