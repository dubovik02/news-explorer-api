const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV = 'develop' } = process.env;
const JWT_SECRET = (NODE_ENV === 'production' ? process.env.JWT_SECRET : 'develop-key');
// const { JWT_SECRET = 'develop-key' } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const error = new UnauthorizedError('Некорректный ключ для авторизации');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(error);
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
