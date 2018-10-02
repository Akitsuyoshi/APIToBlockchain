const express = require('express');

const router = express.Router();

const Block = require('../blockChain/block');
const { getBlockHeight, getBlock, putBlockToDB } = require('../blockChain/db');

const makeErrObj = msg => ({
  status: 'error',
  msg,
});

router.get('/:blockHeight', async (req, res) => {
  const errMsg = 'the block of given Id does not exist in the chain';
  try {
    const { blockHeight } = req.params;

    const block = await getBlock(blockHeight);
    return res.status(200).json(block);
  } catch (err) {
    console.log(err);
    return res.status(200).json(makeErrObj(errMsg));
  }
});

router.post('/', async (req, res) => {
  const errMsg = 'data should include some content in string';
  try {
    const { data } = req.body;
    if (!data || typeof data !== 'string') throw errMsg;

    const newBlock = new Block(data);
    const height = await getBlockHeight();
    if (height === 0) await putBlockToDB(new Block('First block in the chain - Genesis block'), 0);

    const prev = await getBlock(height);
    newBlock.previousBlockHash = prev.hash;
    putBlockToDB(newBlock, height + 1);

    return res.status(200).json(newBlock);
  } catch (err) {
    console.log(err);
    return res.status(200).json(makeErrObj(errMsg));
  }
});

module.exports = router;
