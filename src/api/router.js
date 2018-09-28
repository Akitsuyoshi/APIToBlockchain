const express = require('express');

const router = express.Router();


const { getBlockHeight, getBlock } = require('../blockChain/db');


router.get('/:blockHeight', async (req, res) => {
  try {
    const { blockHeight } = req.params;
    if (blockHeight < 0 || blockHeight > await getBlockHeight()) {
      res.status(404);
      res.json({ status: 'error', msg: 'the block of given Id does not exist in the chain' });
    }
    res.status(200);
    const block = await getBlock(blockHeight);
    return res.json(block);
  } catch (err) {
    console.log(err);
    return err;
  }
});

// router.post('/', (req, res) => {

// });

module.exports = router;
