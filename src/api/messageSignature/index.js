const express = require('express');

const router = express.Router();

require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

const makeErrObj = msg => ({
  status: 'error',
  msg,
});

router.post('/validate', (req, res) => {
  const errMsg = 'payload should contain address and signature';
  try {
    const { address, signature } = req.body;
    if (!address || !signature) {
      return res.status(200).json(makeErrObj(errMsg));
    }

    const { requestTimeStamp } = req.session;
    const validationWindow = Math.floor((300 * 1000 + requestTimeStamp - Date.now()) / 1000);
    const r = {
      registerStar: true,
      status: {
        address,
        requestTimeStamp,
        message: `${address}:${requestTimeStamp}:starRegistry`,
        validationWindow,
        messageSignature: 'valid',
      },
    };

    const isValid = bitcoinMessage.verify(r.status.message, address, signature);

    if (r.status.validationWindow <= 0) {
      res.status(200).json(makeErrObj('Please try again because validation time is expired now'));
    } else if (!isValid) {
      r.registerStar = false;
      r.status.messageSignature = 'invalid';
      res.status(200).json(r);
    }
    return res.status(200).json(r);
  } catch (err) {
    console.log(err);
    return res.status(200).json({ msg: err.message });
  }
});

module.exports = router;
