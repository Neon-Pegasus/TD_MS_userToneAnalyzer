const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./database/index');

// const path = require('path');

const app = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  // db.User();
  res.send('hello');
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
