const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const block = require('./block');
const bestBlock = require('./bestBlock');

const app = express();
const port = 8000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type');
  res.set({
    'content-type': 'application/json; charset=utf-8', 'Content-Length': '238', Connection: 'close', 'Cache-Control': 'no-cache',
  });

  next();
});

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/block', block);
app.use('/bestBlock', bestBlock);

app.listen(port, () => console.log(`hello world is waiting for us on port ${port}`));

module.exports = app;
