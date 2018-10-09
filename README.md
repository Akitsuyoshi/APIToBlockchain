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

`http://localhost:8000/block/0` - the block in the chains with given height(in this case, 0)

`http://localhost:8000/bestBlock` - the best block, most recent added block to chains

`http://localhost:8000/stars/address:[ADDRESS]` - the blocks contains address query in the body

`http://localhost:8000/stars/hash:[HASH]` - the block, correspoind to given hash



### POST


`http://localhost:8000/requestValidation` - request to get message in json format to sign in your wallet with your address.
Payload looks like this, `{address: yourWalletAddress}`


`http://localhost:8000/message-signature/validate` - the endpoint validates your message signature if your signature is made by your wallet(which means, signature is based on your secret key of address). Payload is supposed to have address and signature, `{address: yourWalletAddress, signature: signature}`


`http://localhost:8000/block` - adds a new block at the end of chains, along with star and address data. Payload should looks like this.
```
{
    "address": "yourAddress",
    "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "Found star using https://www.google.com/sky/"
    }
}
```

Note that you need to follow the api call in this order, requestValidation -> message-signature/validate -> block.


Also, when you're between requestValidation and message-signature, validationWindow will reduce its count so you need to finish your registration within that time, 5 minutes.


## Running the tests

### Unit test(TDD)

It should take following steps to make each API endpoint

1. Make stub test in [src/test/test.js](src/test/test.js)
2. Make API corresponding to test you write
3. Make integration test in [src/test/integrationTest.js](src/test/integrationTest.js)
4. Call api from Postman, insomnia, or something you'd prefer.


### end to end tests


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
