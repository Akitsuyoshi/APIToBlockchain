# API with private Blockchain

Web API(GET, POST) written in express.js for private Blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You have installed node and yarn in your local machine.

### Installing

Install this repo
```
git clone https://github.com/Akitsuyoshi/APIToBlockchain.git
```

Install the dependencies

```
yarn
```

And then, making the migration to get mock data.

```
yarn makeChains
```

## Running the tests

Please make sure that you already made mock data by `yarn makeChains`

### Break down into end to end tests

If you wanna see stub test

```
yarn test
```

The case you wanna see the integration test, which actually calls api endpoint.

```
yarn httpTest
```

### And coding style tests

Whenever you commit your code, prettier is invoked to fix the coding style, taking airbnb linting style :)




## Built With

* [Express.js](http://expressjs.com/en/api.html) - The  framework used for api call
* [Yarn](https://yarnpkg.com/en/) - Dependency Management
* [LevelDB](https://github.com/Level/level) - Used to generate one private blockchain node, storing the data as key-value pair

## Contributing

Please feel free to contact me anytime at [twitter](https://twitter.com/Akitsuyoshi244), if you found some bugs or request for new features.

Also, I'm always glad to hear feedback from you.

## Authors

* **Tsuyoshi Akiyama** - *Initial work* - [Akitsuyoshi](https://github.com/Akitsuyoshi)
