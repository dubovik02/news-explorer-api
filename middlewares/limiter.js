const rateLimit = require('express-rate-limit');
const errMsg = require('../config/messages');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  max: 100, // 100 запросов за 10 минут
  message: errMsg.ERR_MESSAGE_REQ_LIMIT,
});

module.exports = limiter;
