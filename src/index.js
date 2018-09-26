const express = require('express');
const logger = require('morgan');
const router = require('./router');

const app = express();
const port = 8000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
  next();
});

app.use(logger('dev'));

app.use('/block', router);

app.listen(port, () => console.log(`hello world is waiting for us on port ${port}`));
