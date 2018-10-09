const level = require('level');

const chainDB = './chaindata';
const db = level(chainDB);

const SHA256 = require('crypto-js/sha256');


// Add data to levelDB with key/value
function addDataToLevelDB(key, value) {
  return new Promise((resolve, reject) => {
    db.put(key, value)
      .then(val => resolve(val))
      .catch(err => reject(console.log(`Block ${key} submission failed`, err)));
  });
}

function putBlockToDB(newBlock, height) {
  newBlock.height = height;
  newBlock.time = new Date().getTime().toString().slice(0, -3);
  newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
  return addDataToLevelDB(height, JSON.stringify(newBlock).toString());
}

// Get block height
// blockHeight is gonna be TotalBlock number in the chains - 1
function getBlockHeight() {
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

function getBlockOfAddress(address) {
  return new Promise((resolve, reject) => {
    const result = [];
    db.createValueStream()
      .on('data', (data) => {
        const block = JSON.parse(data);
        if (block.body.address === address.substring(1)) {
          result.push(block);
        }
        return result;
      })
      .on('error', err => reject(console.log('Unable to read data stream!', err)))
      .on('close', () => resolve(result));
  });
}

function getBlockByHash(hash) {
  const errMsg = 'block of the given hash is not made';
  return new Promise((resolve, reject) => {
    let result;
    return db.createValueStream()
      .on('data', (data) => {
        const block = JSON.parse(data);
        console.log(block.hash, hash.substring(1));
        if (block.hash === hash.substring(1)) {
          result = block;
          return result;
        }
        return result;
      })
      .on('error', () => reject(errMsg))
      .on('close', () => ((result) ? resolve(result) : reject(result)));
  });
}

// get block
function getBlock(blockHeight) {
// return object
  return new Promise((resolve, reject) => {
    db.get(blockHeight)
      .then(value => resolve(JSON.parse(value)))
      .catch((err) => {
        console.log('Not found!', err);
        return reject(err);
      });
  });
}

module.exports = {
  putBlockToDB, getBlockHeight, getBlock, getBlockOfAddress, getBlockByHash,
};
