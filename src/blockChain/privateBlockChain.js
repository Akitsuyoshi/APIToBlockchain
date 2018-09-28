const SHA256 = require('crypto-js/sha256');

const Block = require('./block');

const { putBlockToDB, getBlockHeight, getBlock } = require('./db');

class Blockchain {
  // Add new block
  async addBlock(newBlock) {
    try {
      const blockHeight = await getBlockHeight();
      if (blockHeight === 0) await putBlockToDB(new Block('First block in the chain - Genesis block'), 0);

      // previous block hash
      const prev = await getBlock(blockHeight);
      newBlock.previousBlockHash = prev.hash;
      await putBlockToDB(newBlock, blockHeight + 1);

      return newBlock;
    } catch (err) {
      console.log(`addBlock is failed ${err}`);
      return err;
    }
  }

  // validate block
  async validateBlock(blockHeight) {
    try {
      const block = await getBlock(blockHeight);
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
      const blockHeight = await getBlockHeight();
      for (let i = 0; i <= blockHeight; i += 1) {
        // validate block
        errorLog.push(this.validateBlock(i));
        // compare blocks hash link
        if (i > 0) errorLog.push(getBlock(i).hash === getBlock(i - 1).previousBlockHash);
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
