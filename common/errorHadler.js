const errMsg = require('../config/messages');

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  res.status(status).json({ err: message || errMsg.ERR_MESSAGE_SERVER_ERR });
  return next();
};

module.exports = errorHandler;
