const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const config = require('../config/config');
const errMsg = require('../config/messages');

const { JWT_SECRET } = config;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const error = new UnauthorizedError(errMsg.ERR_MESSAGE_AUTH_REQUIRE);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(error);
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(error);
  }

  req.user = payload;
  next();
};
