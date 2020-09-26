const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  max: 100, // 100 запросов за 10 минут
  message: 'Превышен лимит запросов',
});

module.exports = limiter;
