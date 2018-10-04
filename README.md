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

// When you wanna delete your chains data,
yarn delChains
```

Just make sure that levelDB is suited for single process, not sharing by multiple thread.

 ## Endpoint

 You can query the API with the following options:

 ### GET

` http://localhost:8000/block/0` - the block in the chains with given height(in this case, 0)

### POST

` http://localhost:8000/block` - adds a new block at the end of chains, along with payload data

Note that payload should be object in this structure, `{data: stringValue}`


## Running the tests

### Unit test(TDD)

It should take following steps to make each API endpoint

1. Make stub test in [src/test/test.js](src/test/test.js)
2. Make API corresponding to test you write
3. Make integration test in [src/test/integrationTest.js](src/test/integrationTest.js)
4. Call api from Postman, insomnia, or something you'd prefer.


### end to end tests

1. Run the server by `yarn dev` 

2. Check POST endpoint first at  http://localhost:8000/block
 - payload data should look like `{data: 'some string value'}`
 - the response data from POST is supposed to be the new created Block

3. Validate POST by passing empty data
 - pass payload which is `{data: ''}`
 - the response is supposed to be `{ status: 'error', msg: 'data should include some content in string'}`

4. Check GET endpoint at http://localhost:8000/block/0
 - If you followed the test for post endpoind, you can check that height block you made before.

5. Validate GET endpoint by looking for id that doesn't exist in the chains at http://localhost:8000/block/-1
 - the response should be like that, `{  status: 'error', msg: 'the block of given Id does not exist in the chain'}`


### Stub and Integration tests for GET, POST API

```
// For the stub test
yarn test

// For the Integration test
yarn httpTest
```

Note that integration test is actually going to call the api, so you need to start your server beforehand.

### And coding style tests

Whenever you commit your code, prettier is invoked to fix the coding style, taking it to the airbnb style :)


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
