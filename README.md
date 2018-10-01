# API with private Blockchain

Web API(GET, POST) written in express.js for private Blockchain.

## Getting Started


These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You have installed node and yarn in your local machine.

### Installing

Install this repo, dependencies, and make the migration for getting database.

```
git clone https://github.com/Akitsuyoshi/APIToBlockchain.git

yarn

yarn makeChains
```

Now that you get privateChains in db folder, including 0-10 blocks, you can get started with the following commad.

```
yarn dev
```

If you'd like to add another 10 blocks to your private chains,
 just run `yarn makeChains` again.

## Running the tests

Please make sure that you already made mock data by `yarn makeChains`

### Break down into end to end tests

1. Run the server by `yarn dev` 

2. Go to the http://localhost:8000/block/0 (you can change block height)

3. Check if  the height 0 is first block of blockchains.

4. Get http://localhost:8000/block/-1, and then return the error with message.

5. Post http://localhost:8000/block with data which is object, and confirm if new block is gonna be created and get it back to respond you.
the data in post should be like that

```
{ data: "some string value in here"}
```

If you can get a new block, it means the post is done correctly.


### Stub and Integration test for GET, POST api

For the stub test, hit the command in your terminal

```
yarn test
```

For the Integration test, calling actual api.

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
