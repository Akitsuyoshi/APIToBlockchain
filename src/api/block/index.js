const express = require('express');

const router = express.Router();

const Block = require('../../blockChain/block');
const { getBlockHeight, getBlock, putBlockToDB } = require('../../blockChain/db');

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
  const errMsg = 'data should include validated address and star object';
  const errStarMsg = 'star story should be described within 250 words.';
  try {
    const { address, star } = req.body;
    if ((!address || address !== req.session.address) || !star || req.session.registerStar !== 'true') {
      throw errMsg;
    }
    if (star.story.length > 250) throw errStarMsg;
    console.log(star);
    // eslint-disable-next-line
    star.story = Buffer.from(star.story, 'utf8').toString('hex');
    const data = { address, star };

    const newBlock = new Block(data);
    const height = await getBlockHeight();
    if (height === 0) await putBlockToDB(new Block('First block in the chain - Genesis block'), 0);

    const prev = await getBlock(height);
    newBlock.previousBlockHash = prev.hash;
    putBlockToDB(newBlock, height + 1);

    return req.session.destroy(() => res.status(200).json(newBlock));
  } catch (err) {
    console.log(err);
    return res.status(200).json(makeErrObj(errMsg));
  }
});

module.exports = router;
