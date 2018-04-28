# Swagger API Service Generator

An util to generate service API consumers from a Swagger specification.

## Getting Started

To get started it is only necessary to clone this repository, install all the dependencies, configure the file `swagger-service-generator-config.js` and 
run the generator command.

```js
// swagger-service-generator-config.js
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

```bash
  npm install -g swagger-api-service-generator
  swapisgen
```
 
 or

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
  swapisgen
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


Now lets take as an example one endpoint that belongs to the `pet` tag.

```js

"/pet/{petId}": {
  "get": {
    "tags": [
      "pet"
    ],
      "summary": "Find pet by ID",
        "description": "Returns a single pet",
          "operationId": "getPetById",
            "produces": [
              "application/xml",
              "application/json"
            ],
              "parameters": [
                {
                  "name": "petId",
                  "in": "path",
                  "description": "ID of pet to return",
                  "required": true,
                  "type": "integer",
                  "format": "int64"
                }
              ],
                "responses": {
      "200": {
        "description": "successful operation",
          "schema": {
          "$ref": "#/definitions/Pet"
        }
      },
      "400": {
        "description": "Invalid ID supplied"
      },
      "404": {
        "description": "Pet not found"
      }
    },
    "security": [
      {
        "api_key": []
      }
    ]
  },
```

Because this endpoint belong to the tag `pet`, when generated it will be inside the service
located at `api/pet/service.js`:

```js
/** getPetById
 * Summary: Find pet by ID
 * Description: Returns a single pet
 * 
 * @typedef GetPetByIdPayload
 * 
 * @property {integer} petId [required] ID of pet to return
 * 
 * 
 * @param {GetPetByIdPayload} getPetByIdPayload
 *
 *  200 - successful operation
 *  400 - Invalid ID supplied
 *  404 - Pet not found
 *
 * @return {Promise<Pet>}
 */
export const getPetById = (getPetByIdPayload) => {
  throwIfAnyMissing(['petId'], getPetByIdPayload);
  const {
    petId
  } = getPetByIdPayload;
  return request.get(
    endpoints.GET_PET_BY_ID({
      petId
    }), {
      query: notEmptyProps({}),
      body: {},
      form: {},
      headers: {},
    },
    'json'
  ).then(response => response.json());
};
```

The method name, endpoint name, and payload type are obtained from the `operationId` in the swagger definition. The parameters are obtained  from the `parameters` property. The
`description` and `summary` are obtained from the same properties in the definiton.
The response type is obtained from the  `produces` property being `json` the default one.
Finally, as the only required parameter is `petId` is the one that is being checked.

Taking a look at `api/pet/endpoints.js`, it can be seen the functions that build the enpoint urls. Following the same example we have:

```js
{
  ...

  GET_PET_BY_ID: ({
    petId
  }) => {
    return `${BASE}/pet/${petId}`;
  },

  ...
}
```

where  `BASE` is the base url of our API.

### Example of using the service

```js
const petService = require('../api/pet/service');

petService.getPetById({ petId: 1 })
.then(pet => {
  console.log('Pet', pet);
});
``` 

As the API request util uses `fetch` under the hood it is necessary to previously install the following in order to use the generated services:
* `node-fetch` if working in the backend only. [See more](https://github.com/bitinn/node-fetch)

* `whatwg-fetch` if working in the frontend only. [See more](https://github.com/github/fetch)

* `isomorphic-fetch` and `es6-promise` if working on both ends. [See more](https://github.com/matthew-andrews/isomorphic-fetch)

See the file at `api/__core__/request.js` for more details.



<!-- ## Deployment

Add additional notes about how to deploy this on a live system -->

## Contributing

Feel free to make any suggestion to improve this project.


## Authors

See the list of [contributors](https://github.com/xvicmanx/swagger-api-service-generator/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
