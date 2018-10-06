const redis = require('redis');
require('dotenv').config();

const client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST,
  { password: process.env.REDIS_PASSWORD },
);

client.on('error', (err) => {
  console.log('error', err);
});

module.exports = client;
