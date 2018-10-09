require('dotenv').config();

module.exports = {
  natural_language_understanding: {
    url: `${process.env.NLU_URL}`,
    username: `${process.env.NLU_USERNAME}`,
    password: `${process.env.NLU_PASSWORD}`,
    version: `${process.env.NLU_VERSION}`,
  },
};
