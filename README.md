# Swagger API Service Generator

An util to generate service API consumers from a Swagger specification.

## Getting Started

To get started it is only necessary to clone this repository, install all the dependencies, configure the file `swagger-service-generator-config.js` and 
run the generator command.

```bash
  git clone https://github.com/xvicmanx/swagger-api-service-generator
  npm install
  npm run generate-services
```


## Example

Assuming you have install the package, lets take as an example the PetStore API.
Go to the file
`swagger-service-generator-config.js`
and make it look like this.

 

```js
module.exports = {
  swaggerDefinitionFile: 'http://petstore.swagger.io/v2/swagger.json',
  endpointFilter: function (data) {
      var method = data.method;
      var allowedMethods = ['post', 'get'];
      var isMethodAllowed = allowedMethods.indexOf(method.toLowerCase()) >= 0;
      return isMethodAllowed;
    },
};

```

The first property `swaggerDefinitionFile` is the url of your swagger json.

The second property `endpointFilter` is a filter function for the endpoints. In this case we are only allowing `get` and `post` enpoints.

Once the file is modified run

```bash
  npm run generate-services
```
This should generate a folder called `api` with your services and helpers files in it.

As the endpoints in the [Petstore Swagger](http://petstore.swagger.io/v2/swagger.json) belong to three different tags `pet`, `store`, and `user`; this way three services `pet/service.js`, `store/service.js`, and `user/service.js` are generated respectively. Each service contains the methods to the api endpoints that belong to each tag.

```
api
├── __core__
│   └── helpers.js    # Helper functions
│   └── request.js    # API requester
│ 
└── __shared__
│   └── headers.js    # Custom header resolver functions
│   └── constants.js  # General constants (BASE URL of the API, etc)
|
└── pet
│   └── endpoints.js  # Endpoint constant functions
│   └── service.js    # Endpoint service
|
└── store
│   └── endpoints.js  # Endpoint constant functions
│   └── service.js    # Endpoint service
|
└── user
│   └── endpoints.js  # Endpoint constant functions
│   └── service.js    # Endpoint service
|
```




<!-- ## Deployment

Add additional notes about how to deploy this on a live system -->

## Contributing

Feel free to make any suggestion to improve this project.


## Authors

See the list of [contributors](https://github.com/xvicmanx/swagger-api-service-generator/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
