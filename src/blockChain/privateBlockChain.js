const SHA256 = require('crypto-js/sha256');
const level = require('level');

const chainDB = '../chaindata';
const db = level(chainDB);
const Block = require('./block');

class Blockchain {
  // Add data to levelDB with key/value
  static addDataToLevelDB(key, value) {
    return new Promise((resolve, reject) => {
      db.put(key, value)
        .then(val => resolve(val))
        .catch(err => reject(console.log(`Block ${key} submission failed`, err)));
    });
  }

  putBlockToDB(newBlock, height) {
    newBlock.height = height;
    newBlock.time = new Date().getTime().toString().slice(0, -3);
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    return this.addDataToLevelDB(height, JSON.stringify(newBlock).toString());
  }

  // Add new block
  async addBlock(newBlock) {
    try {
      const blockHeight = await this.getBlockHeight();
      if (blockHeight === 0) await this.putBlockToDB(new Block('First block in the chain - Genesis block'), 0);

      // previous block hash
      const prev = await this.getBlock(blockHeight);
      newBlock.previousBlockHash = prev.hash;
      await this.putBlockToDB(newBlock, blockHeight + 1);

      return newBlock;
    } catch (err) {
      console.log(`addBlock is failed ${err}`);
      return err;
    }
  }

  // Get block height
  // blockHeight is gonna be TotalBlock number in the chains - 1
  static getBlockHeight() {
    return new Promise((resolve, reject) => {
      let count = 0;
      db.createKeyStream()
        .on('data', () => {
          count += 1;
          return count;
        })
        .on('error', err => reject(console.log('Unable to read data stream!', err)))
        .on('close', () => resolve((count > 0) ? count - 1 : 0));
    });
  }

  // get block
  static getBlock(blockHeight) {
    // return object
    return new Promise((resolve, reject) => {
      db.get(blockHeight)
        .then(value => resolve(JSON.parse(value)))
        .catch(err => reject(console.log('Not found!', err)));
    });
  }

  // validate block
  async validateBlock(blockHeight) {
    try {
      const block = await this.getBlock(blockHeight);
      console.log(`tested Block # ${blockHeight} ${block}`);
      const blockHash = block.hash;
      block.hash = '';
      const validBlockHash = SHA256(JSON.stringify(block)).toString();

      return (blockHash === validBlockHash);
    } catch (err) {
      console.log(`validateBlock is failed ${err}`);
      return err;
    }
  }

  // Validate blockchain
  async validateChain() {
    try {
      // if validation is gonna be failed, it push false into errorLog, otherwise, true.
      const errorLog = [];
      const blockHeight = await this.getBlockHeight();
      for (let i = 0; i <= blockHeight; i += 1) {
        // validate block
        errorLog.push(this.validateBlock(i));
        // compare blocks hash link
        if (i > 0) errorLog.push(this.getBlock(i).hash === this.getBlock(i - 1).previousBlockHash);
      }
      return Promise.all(errorLog).then((result) => {
        // if something wrong happed, result supposed to hold error
        result = result.filter(v => v === false);
        if (result.length > 0) {
          console.log(`Block errors = ${result.length}Blocks: ${result}`);
        } else {
          console.log('No errors detected');
        }
      });
    } catch (err) {
      console.log(`validateChain is failed ${err}`);
      return err;
    }
  }
}

module.exports = Blockchain;
