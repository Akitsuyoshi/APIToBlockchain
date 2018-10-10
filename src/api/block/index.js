const express = require('express');

const router = express.Router();

const Block = require('../../blockChain/block');
const { getBlockHeight, getBlock, putBlockToDB } = require('../../blockChain/db');

const makeErrObj = msg => ({
  status: 'error',
  msg,
});

const check = (obj, prop) => {
  if (Object.hasOwnProperty.call(obj, prop)) {
    return !!(obj[prop].length);
  }
  if (prop === 'story') {
    return /^[\w]+$/.test(obj.story);
  }
  return false;
};

router.get('/:blockHeight', async (req, res) => {
  const errMsg = 'the block of given Id does not exist in the chain';
  try {
    const { blockHeight } = req.params;

    const block = await getBlock(blockHeight);
    if (blockHeight > 0) {
      const { star } = block.body;
      star.storyDecoded = Buffer.from(star.story, 'hex').toString('utf8');
    }
    return res.status(200).json(block);
  } catch (err) {
    console.log(err);
    return res.status(200).json(makeErrObj(errMsg));
  }
});

router.post('/', async (req, res) => {
  const errMsg = 'data should include validated address and star object';
  const errStarPropMsg = 'star should contain 3 props, dec, ra, and story. story props needs to be in ascii format';
  const errStarMsg = 'star story should be described within 250 words.';
  try {
    const { address, star } = req.body;
    console.log(req.session.address, req.session.registerStar);
    if (address !== req.session.address || req.session.registerStar !== 'true') {
      throw errMsg;
    } else if (Object.keys(star).length !== 3 || !check(star, 'dec') || !check(star, 'ra') || !check(star, 'story')) {
      throw errStarPropMsg;
    } else if (star.story.split(' ').length > 250) {
      throw errStarMsg;
    }

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
    return res.status(200).json(makeErrObj(err));
  }
});

module.exports = router;
