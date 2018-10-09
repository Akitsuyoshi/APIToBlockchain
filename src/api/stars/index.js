const express = require('express');

const router = express.Router();

const { getBlockOfAddress, getBlockByHash } = require('../../blockChain/db');

const makeErrObj = msg => ({
  status: 'error',
  msg,
});

router.get('/address:address', async (req, res) => {
  const errMsg = 'blocks is not created yet';
  try {
    const { address } = req.params;

    let blocks = await getBlockOfAddress(address);
    blocks = blocks.map((val) => {
      val.body.star.storyDecoded = Buffer.from(val.body.star.story, 'hex').toString('utf8');
      return val;
    });

    return res.status(200).json(blocks);
  } catch (err) {
    console.log(err);
    return res.status(200).json(makeErrObj(errMsg));
  }
});

router.get('/hash:hash', async (req, res) => {
  const errMsg = 'blocks is not created yet';
  try {
    const { hash } = req.params;

    const block = await getBlockByHash(hash);
    console.log(block);
    if (block.height > 0) {
      block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString('utf8');
    }

    return res.status(200).json(block);
  } catch (err) {
    console.log(err);
    return res.status(200).json(makeErrObj(errMsg));
  }
});

module.exports = router;
