const express = require('express');

const router = express.Router();

const makeErrObj = msg => ({
  status: 'error',
  msg,
});

router.post('/', async (req, res) => {
  const errMsg = 'request should contain address, like this format {address: yourWalledAddress}';
  const { address } = req.body;
  if (!address || typeof address !== 'string') return res.status(200).json(makeErrObj(errMsg));

  const r = {
    address,
    requestTimeStamp: Date.now(),
    message: `${address}:${this.requestTimeStamp}:starRegistry`,
    validationWindow: 300,
  };
  if (!req.session.address) {
    req.session.address = address;
    req.session.requestTimeStamp = r.requestTimeStamp;
  } else {
    r.requestTimeStamp = req.session.requestTimeStamp;
    r.validationWindow = Math.floor((300 * 1000 + r.requestTimeStamp - Date.now()) / 1000);
  }
  if (r.validationWindow <= 0) {
    return req.session.destroy(() => res.status(200).json(makeErrObj('Please try again because validation time is expired now')));
  }
  return res.status(200).json(r);
});

module.exports = router;
