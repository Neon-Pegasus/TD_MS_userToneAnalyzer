const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const redis = require('redis');
const db = require('./database/index');

// const path = require('path');

const app = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  db.set('string key', 'string val', redis.print);
  res.send('hello');
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
