const express = require('express');

const router = express.Router();

const { getBlockHeight, getBlock } = require('../../blockChain/db');

const makeErrObj = msg => ({
  status: 'error',
  msg,
});

router.get('/', async (req, res) => {
  const errMsg = 'blocks is not created yet';
  try {
    const height = await getBlockHeight();
    const block = await getBlock(height);
    return res.status(200).json(block);
  } catch (err) {
    console.log(err);
    return res.status(200).json(makeErrObj(errMsg));
  }
});

module.exports = router;
