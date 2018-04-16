module.exports ={
    endpointFilter: function (data) {
      var endpoint = data.endpoint;
      var method = data.method;
      var allowedMethods = ['post', 'get', 'put', 'delete'];
      var notProto = endpoint.operationId.toLowerCase().indexOf('prototype') < 0;
      var isMethodAllowed = allowedMethods.indexOf(method.toLowerCase()) >= 0;
      return notProto && isMethodAllowed;
    },
    swaggerDefinitionFile: 'http://petstore.swagger.io/v2/swagger.json',
}