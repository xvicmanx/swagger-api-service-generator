module.exports = {
  swaggerDefinitionFile: 'http://petstore.swagger.io/v2/swagger.json',
//  swaggerDefinitionFile: 'http://localhost:3000/api-docs.json',
 endpointFilter: function (data) {
      var method = data.method;
      var allowedMethods = ['post', 'get'];
      var isMethodAllowed = allowedMethods.indexOf(method.toLowerCase()) >= 0;
      return isMethodAllowed;
    },
};
