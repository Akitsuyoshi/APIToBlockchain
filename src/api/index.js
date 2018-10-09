const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

const block = require('./block');
const bestBlock = require('./bestBlock');
const requestValidation = require('./requestValidation');
const messageSignature = require('./messageSignature');
const stars = require('./stars');

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

app.use(session({
  secret: 'private expresso api',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxage: 1000 * 1200,
  },
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/block', block);
app.use('/bestBlock', bestBlock);
app.use('/requestValidation', requestValidation);
app.use('/message-signature', messageSignature);
app.use('/stars', stars);


app.listen(port, () => console.log(`hello world is waiting for us on port ${port}`));

module.exports = app;
