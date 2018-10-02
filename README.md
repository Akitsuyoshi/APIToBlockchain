# API with private Blockchain

Web API(GET, POST) written in express.js for private Blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Have installed node and yarn in your local machine.

### Installing

```
// Install this repo, dependencies
git clone https://github.com/Akitsuyoshi/APIToBlockchain.git

yarn

// Optional: you can make the migration by adding seed data.
yarn makeChains

// start your development server
yarn dev
```

If you'd like to add another 10 blocks to your private chains,
 just run `yarn makeChains` again.

 ## Endpoint

 You can query the API with the following options:

 ### GET

` http://localhost:8000/block/0` - the block in the chains with given height(in this case, 0)

### POST

` http://localhost:8000/block` - adds a new block at the end of chains, along with payload data

Note that payload should be object in this structure, `{data: stringValue}`


## Running the tests

### end to end tests

1. Run the server by `yarn dev` 

2. Check POST endpoint first at  http://localhost:8000/block
 - payload data should look like `{data: 'some string value'}`
 - make sure that your passed data is object and having data property, holding string value
 - the response data from POST is supposed to be the new created Block

3. Validate POST by passing empty data
 - pass payload which is `{data: ''}`
 - the response is gonna be `{ status: 'error', msg: 'data should include some content in string'}`

4. Check GET endpoint at  http://localhost:8000/block/0
 - make sure if genesis block is created, if so, you can get the block as response json object.
 - If you followed the test for post endpoind, you can check that height block you made before.

5. Validate GET endpoint by looking for id that doesn't exist in the chains.
 - hit the link, http://localhost:8000/block/-1
 - it is OK if it returns the response, `{  status: 'error', msg: 'the block of given Id does not exist in the chain'}`


### Stub and Integration test for GET, POST api

One things to note is that integration test is actually going to call the api, so you need to start your server beforehand.

```
// For the stub test
yarn test

// For the Integration test
yarn httpTest
```

### And coding style tests

Whenever you commit your code, prettier is invoked to fix the coding style, taking airbnb linting style :)


## Built With
* [Node.js](https://nodejs.org/en/) - The asynchronous event driven JavaScript runtime, built on Chrome's V8 JavaScript engine
* [Express.js](http://expressjs.com/en/api.html) - The  framework used for api call
* [Yarn](https://yarnpkg.com/en/) - Dependency Management
* [LevelDB](https://github.com/Level/level) - Used to generate one private blockchain node, storing the data as key-value pair

## Contributing

Please feel free to contact me anytime at [twitter](https://twitter.com/Akitsuyoshi244), if you found some bugs or request for new features.

Also, I'm always glad to hear feedback from you.

## Authors

* **Tsuyoshi Akiyama** - *Initial work* - [Akitsuyoshi](https://github.com/Akitsuyoshi)
