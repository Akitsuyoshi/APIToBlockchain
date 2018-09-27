const express = require('express');

const router = express.Router();

router.get('/:blockHeight', (req, res) => {
  const { blockHeight } = req.params;
  res.status(200);
  res.json({ user: 'tobi', number: blockHeight });
});

// router.post('/', (req, res) => {

// });

module.exports = router;
