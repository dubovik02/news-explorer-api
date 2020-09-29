require('dotenv').config();

const { CONNECTION_STR = 'mongodb://localhost:27017/newsdb' } = process.env;
const { JWT_SECRET = 'develop-key' } = process.env;

module.exports = {
  CONNECTION_STR,
  JWT_SECRET,
};
