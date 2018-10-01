const express = require('express');

const router = express.Router();

const Block = require('../blockChain/block');
const { getBlockHeight, getBlock, putBlockToDB } = require('../blockChain/db');

router.get('/:blockHeight', async (req, res) => {
  try {
    const { blockHeight } = req.params;
    if (blockHeight < 0 || blockHeight > await getBlockHeight()) {
      res.status(404);
      return res.json({ status: 'error', msg: 'the block of given Id does not exist in the chain' });
    }
    res.status(200);
    const block = await getBlock(blockHeight);
    return res.json(block);
  } catch (err) {
    console.log(err);
    return err;
  }
});

router.post('/', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || typeof data !== 'string') {
      res.status(404);
      return res.json({ status: 'false', body: 'body should include some content in string' });
    }
    const newBlock = new Block(data);
    const newHeight = await getBlockHeight() + 1;
    const prev = await getBlock(newHeight - 1);

    newBlock.previousBlockHash = prev.hash;
    putBlockToDB(newBlock, newHeight);

    return res.json(newBlock);
  } catch (err) {
    console.log(err);
    return err;
  }
});

module.exports = router;
