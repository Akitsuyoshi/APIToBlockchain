const Blockchain = require('./privateBlockChain');
const Block = require('./block');

const blockchain = new Blockchain();
(function theLoop(i) {
  setTimeout(() => {
    const blockTest = new Block(`Test Block - ${i + 1}`);
    blockchain.addBlock(blockTest).then((result) => {
      console.log(result);
      i += 1;
      if (i < 10) theLoop(i);
    });
  }, 1000);
}(0));

setTimeout(() => {
  blockchain.validateChain();
}, 11150);
